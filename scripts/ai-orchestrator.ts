import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, readdirSync } from "fs";
import { createHash } from "crypto";
import path from "path";
import { getAllTemplates, getTemplate, type TemplateRegistryEntry, type JobSpec } from "./template-registry";
import { generateMetadata } from "./generate-metadata";
import { verifySeamless } from "./verify-seamless";

const OLLAMA_HOST = "localhost:11434";
const OLLAMA_MODEL = "qwen2.5:3b";
const OLLAMA_TIMEOUT = 60000;
const MAX_OLLAMA_RETRIES = 3;
const MAX_CONCURRENT_RUNS = 5;
const EXPECTED_RUNTIME_MINUTES = 30;
const JOBS_DIR = path.resolve("jobs");

interface ConceptResponse {
  concept_title: string;
  theme: string;
  description: string;
  props: Record<string, unknown>;
  pond5_keywords?: string[];
}

interface RegistryEntry {
  jobId: string;
  templateId: string;
  propsHash: string;
  props: Record<string, unknown>;
  conceptTitle: string;
  theme: string;
  timestamp: string;
  outputPath: string;
  mse: number;
  status: "ready" | "failed" | "queued" | "rendering";
}

interface Registry {
  versions: RegistryEntry[];
  stats: {
    totalGenerated: number;
    totalFailed: number;
    byTemplate: Record<string, number>;
  };
  templates: Record<string, string[]>;
  totalGenerated: number;
}

const stableStringify = (obj: unknown): string => {
  if (obj === null) return "null";
  if (typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return "[" + obj.map((v) => stableStringify(v)).join(",") + "]";
  }
  const record = obj as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return "{" + keys.map((k) => `"${k}":${stableStringify(record[k])}`).join(",") + "}";
};

const hashProps = (props: Record<string, unknown>): string => {
  return createHash("sha256").update(stableStringify(props)).digest("hex");
};

const generateJobId = (templateName: string): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const baseName = templateName.toLowerCase().replace(/[^a-z]/g, "_");
  const queueDir = path.join(JOBS_DIR, "queue");
  mkdirSync(queueDir, { recursive: true });
  let counter = 1;
  while (existsSync(path.join(queueDir, `${baseName}_${dateStr}_${String(counter).padStart(3, "0")}.json`))) {
    counter++;
  }
  return `${baseName}_${dateStr}_${String(counter).padStart(3, "0")}`;
};

const loadRegistry = (): Registry => {
  const regPath = path.join(JOBS_DIR, "registry.json");
  if (!existsSync(regPath)) {
    const empty: Registry = {
      versions: [],
      stats: { totalGenerated: 0, totalFailed: 0, byTemplate: {} },
      templates: {},
      totalGenerated: 0,
    };
    getAllTemplates().forEach((t) => {
      empty.templates[t.id] = [];
      empty.stats.byTemplate[t.id] = 0;
    });
    return empty;
  }
  return JSON.parse(readFileSync(regPath, "utf-8")) as Registry;
};

const saveRegistry = (registry: Registry): void => {
  mkdirSync(JOBS_DIR, { recursive: true });
  writeFileSync(path.join(JOBS_DIR, "registry.json"), JSON.stringify(registry, null, 2));
};

const buildOllamaPrompt = (template: TemplateRegistryEntry): { system: string; user: string } => {
  const propLines: string[] = [];
  for (const [name, min, max, type, step] of template.propConstraints.numeric.map((n) => [
    n.name, n.min, n.max, n.type, n.step ?? null,
  ] as const).map((n) => n as [string, number, number, string, number | null])) {
    const range = step !== null ? ` (${type}, range: ${min}–${max}, step ${step})` : ` (${type}, range: ${min}–${max})`;
    propLines.push(`    "${name}": ${range}`);
  }

  for (const colorName of template.propConstraints.colors) {
    propLines.push(`    "${colorName}": hex color string (e.g. "#FF6B6B")`);
  }

  const defaults = template.defaultProps;

  const system =
    "Kamu adalah generator konsep video stock untuk Pond5. Output hanya JSON valid. Jangan tambahkan teks lain. " +
    "Buat konsep yang unik dan kreatif untuk template video berikut. " +
    "Pastikan semua nilai prop sesuai dengan rentang yang diberikan. " +
    "Jangan pernah output teks di luar JSON.";

  const user = `
Template: ${template.name}
Description: ${template.description}
Composition ID: ${template.id}

Buat konsep video 4K 60fps 15 detik (900 frame) yang seamless loop untuk Pond5.
Output HANYA JSON dengan struktur berikut:

{
  "concept_title": "judul kreatif (maks 60 karakter)",
  "theme": "tema konsep (maks 40 karakter)",
  "description": "deskripsi detail video 4-5 kalimat (maks 500 karakter)",
  "props": {
${propLines.join("\n")}
  },
  "pond5_keywords": ["keyword1", "keyword2", ...] // 30+ keywords
}

Nilai default (bisa diubah tapi tetap dalam rentang):
${JSON.stringify(defaults, null, 2)}

Prop constraints:
${template.propConstraints.numeric.map((n) => `- ${n.name}: ${n.type} [${n.min}, ${n.max}]`).join("\n")}
${template.propConstraints.colors.map((c) => `- ${c}: hex color string`).join("\n")}

Pastikan props JSON dapat divalidasi oleh Zod schema. Output hanya JSON, tidak ada markdown, tidak ada teks tambahan.
`.trim();

  return { system, user };
};

const callOllama = async (system: string, user: string): Promise<ConceptResponse> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_OLLAMA_RETRIES; attempt++) {
    try {
      const body = JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      });

      const response = await fetch(`http://${OLLAMA_HOST}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(OLLAMA_TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`Ollama API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as { message: { content: string } };
      const rawContent = data.message.content.trim();

      let parsed: ConceptResponse;
      try {
        parsed = JSON.parse(rawContent) as ConceptResponse;
      } catch {
        const cleaned = rawContent.replace(/```(json)?\n?/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned) as ConceptResponse;
      }

      if (!parsed.concept_title || !parsed.props) {
        throw new Error("Missing required fields in response");
      }

      return parsed;
    } catch (error) {
      lastError = error as Error;
      console.warn(`  ⚠ Ollama attempt ${attempt}/${MAX_OLLAMA_RETRIES} failed: ${lastError.message}`);
      if (attempt < MAX_OLLAMA_RETRIES) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }

  throw lastError ?? new Error("Ollama call failed after all retries");
};

const validateProps = (template: TemplateRegistryEntry, props: Record<string, unknown>): boolean => {
  try {
    template.schema.parse(props);
    return true;
  } catch (error: any) {
    console.error(`  ✗ Zod validation failed: ${error.errors?.map((e: any) => e.message).join(", ")}`);
    return false;
  }
};

const checkConcurrentRuns = (): number => {
  try {
    const result = execSync(
      "gh run list --workflow render-remotion.yml --status in_progress,queued --json databaseId -q '. | length'",
      { encoding: "utf-8", stdio: "pipe" }
    ).trim();
    return parseInt(result, 10) || 0;
  } catch {
    return 0;
  }
};

const triggerWorkflow = (compositionId: string, propsJson: string, jobId: string): string => {
  console.log(`  • Triggering workflow: ${compositionId} / job ${jobId}`);
  execSync(
    `gh workflow run render-remotion.yml -f composition_id="${compositionId}" -f props_json='${propsJson}' -f job_id="${jobId}"`,
    { stdio: "pipe" }
  );

  const runList = execSync(
    `gh run list --workflow render-remotion.yml --status in_progress,queued --limit 1 --json databaseId -q '.[0].databaseId'`,
    { encoding: "utf-8", stdio: "pipe" }
  ).trim();

  return runList;
};

const waitForRun = (runId: string): { conclusion: string; status: string } => {
  console.log(`  • Watching run ${runId}...`);
  try {
    execSync(`gh run watch ${runId} --exit-status --timeout ${EXPECTED_RUNTIME_MINUTES * 60}`, {
      stdio: "pipe",
    });
    return { conclusion: "success", status: "completed" };
  } catch {
    const viewResult = execSync(
      `gh run view ${runId} --json conclusion -q '.conclusion'`,
      { encoding: "utf-8", stdio: "pipe" }
    ).trim();
    return { conclusion: viewResult || "failure", status: "completed" };
  }
};

const downloadArtifact = (jobId: string, downloadDir: string): string => {
  mkdirSync(downloadDir, { recursive: true });
  execSync(`gh run download --name render_${jobId} --dir "${downloadDir}"`, {
    stdio: "pipe",
  });

  const files = readdirSync(downloadDir).filter((f) => f.endsWith(".mp4"));
  if (files.length === 0) {
    throw new Error("No MP4 artifact downloaded");
  }
  return path.join(downloadDir, files[0]);
};

const runOrchestration = async (specifiedTemplate?: string): Promise<void> => {
  const queueDir = path.join(JOBS_DIR, "queue");
  const failedDir = path.join(JOBS_DIR, "failed");
  const logsDir = path.join(JOBS_DIR, "logs");
  mkdirSync(queueDir, { recursive: true });
  mkdirSync(failedDir, { recursive: true });
  mkdirSync(logsDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logFile = path.join(logsDir, `orchestrator-${timestamp}.log`);
  const log = (msg: string) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    writeFileSync(logFile, line + "\n", { flag: "a" });
  };

  log("=== AI Orchestrator Started ===");

  const template = specifiedTemplate
    ? (getTemplate(specifiedTemplate) ??
       getAllTemplates().find((t) =>
         t.name.toLowerCase().includes(specifiedTemplate.toLowerCase()))
      ?? getAllTemplates()[Math.floor(Math.random() * getAllTemplates().length)])
    : getAllTemplates()[Math.floor(Math.random() * getAllTemplates().length)];

  if (!template) {
    log(`ERROR: Template not found: ${specifiedTemplate}`);
    process.exit(1);
  }

  log(`Selected template: ${template.name} (${template.id})`);

  let concept: ConceptResponse;
  try {
    log("Generating concept via Ollama...");
    const prompt = buildOllamaPrompt(template);
    concept = await callOllama(prompt.system, prompt.user);
    log(`Concept: ${concept.concept_title}`);
  } catch (error) {
    log(`ERROR: Failed to generate concept: ${(error as Error).message}`);
    process.exit(1);
  }

  const defaultPropsResult = template.schema.parse({}) as Record<string, unknown>;
  const props: Record<string, unknown> = { ...defaultPropsResult, ...concept.props };

  if (!validateProps(template, props)) {
    log("ERROR: Generated props failed Zod validation");
    process.exit(1);
  }

  const propsHash = hashProps(props);
  const registry = loadRegistry();

  if (registry.versions.some((v) => v.propsHash === propsHash)) {
    log(`SKIP: Duplicate concept detected (hash: ${propsHash.slice(0, 12)}...)`);
    return;
  }

  const jobId = generateJobId(template.name);
  log(`Job ID: ${jobId}`);

  const jobSpec: JobSpec = {
    jobId,
    compositionId: template.id,
    templateId: template.id,
    variantNumber: registry.totalGenerated + 1,
    props,
    conceptTitle: concept.concept_title,
    conceptTheme: concept.theme,
    pond5Keywords: concept.pond5_keywords ?? [],
    pond5Description: concept.description,
    timestamp: new Date().toISOString(),
  };

  writeFileSync(
    path.join(queueDir, `${jobId}.json`),
    JSON.stringify(jobSpec, null, 2)
  );
  log(`Job queued: ${path.join(queueDir, `${jobId}.json`)}`);

  const concurrent = checkConcurrentRuns();
  if (concurrent >= MAX_CONCURRENT_RUNS) {
    log(`WARNING: ${concurrent} concurrent runs active (max ${MAX_CONCURRENT_RUNS}). Waiting...`);
    await new Promise((r) => setTimeout(r, 120000));
  }

  const runId = triggerWorkflow(template.id, JSON.stringify(props), jobId);
  log(`Workflow triggered. Run ID: ${runId}`);

  registry.versions.push({
    jobId,
    templateId: template.id,
    propsHash,
    props,
    conceptTitle: concept.concept_title,
    theme: concept.theme,
    timestamp: new Date().toISOString(),
    outputPath: "",
    mse: 0,
    status: "rendering",
  });
  registry.stats.totalGenerated++;
  registry.totalGenerated = registry.versions.filter((v) => v.status === "ready").length;
  saveRegistry(registry);

  const result = waitForRun(runId);
  log(`Run completed. Conclusion: ${result.conclusion}`);

  if (result.conclusion !== "success") {
    log("ERROR: Workflow run failed");
    const entry = registry.versions.find((v) => v.jobId === jobId);
    if (entry) entry.status = "failed";
    registry.stats.totalFailed++;
    saveRegistry(registry);
    renameSync(
      path.join(queueDir, `${jobId}.json`),
      path.join(failedDir, `${jobId}.json`)
    );
    process.exit(1);
  }

  log("Downloading artifact...");
  const downloadDir = path.join(JOBS_DIR, "downloading", jobId);
  let videoPath: string;
  try {
    videoPath = downloadArtifact(jobId, downloadDir);
  } catch (error) {
    log(`ERROR: Failed to download artifact: ${(error as Error).message}`);
    const entry = registry.versions.find((v) => v.jobId === jobId);
    if (entry) entry.status = "failed";
    registry.stats.totalFailed++;
    saveRegistry(registry);
    process.exit(1);
  }
  log(`Downloaded: ${videoPath}`);

  log("Running quality gate (seamless verification)...");
  const gateResult = verifySeamless(videoPath);

  if (!gateResult.pass) {
    log(`FAIL: Quality gate failed (MSE: ${gateResult.mse.toFixed(6)})`);
    log(`Errors: ${gateResult.errors.join("; ")}`);
    const entry = registry.versions.find((v) => v.jobId === jobId);
    if (entry) entry.status = "failed";
    registry.stats.totalFailed++;
    saveRegistry(registry);
    renameSync(path.join(queueDir, `${jobId}.json`), path.join(failedDir, `${jobId}.json`));
    process.exit(1);
  }

  log(`PASS: Quality gate passed (MSE: ${gateResult.mse.toFixed(6)})`);

  const outputDir = path.resolve("pond5-ready");
  mkdirSync(outputDir, { recursive: true });
  const finalVideoPath = path.join(outputDir, `render_${jobId}.mp4`);
  renameSync(videoPath, finalVideoPath);
  log(`Video archived: ${finalVideoPath}`);

  const metadata = generateMetadata(
    template,
    concept.concept_title,
    concept.theme,
    concept.description,
    concept.pond5_keywords
  );

  writeFileSync(
    path.join(outputDir, `render_${jobId}.meta.json`),
    JSON.stringify(
      {
        ...metadata,
        jobId,
        templateId: template.id,
        propsHash,
        props,
        mse: gateResult.mse,
        quality: "approved",
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );
  log(`Metadata written: ${path.join(outputDir, `render_${jobId}.meta.json`)}`);

  const entry = registry.versions.find((v) => v.jobId === jobId);
  if (entry) {
    entry.status = "ready";
    entry.outputPath = finalVideoPath;
    entry.mse = gateResult.mse;
  }
  registry.stats.byTemplate[template.id] = (registry.stats.byTemplate[template.id] ?? 0) + 1;
  saveRegistry(registry);
  log(`Registry updated. Total generated: ${registry.totalGenerated}`);

  log("=== Orchestrator Cycle Complete ===");
};

const args = process.argv.slice(2);
const specifiedTemplate = args.find((a) => a.startsWith("--template="))?.split("=")[1];
runOrchestration(specifiedTemplate);
