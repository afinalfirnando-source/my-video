import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, renameSync } from "fs";
import path from "path";
import { createHash } from "crypto";
import { getAllTemplates, getTemplate, type TemplateRegistryEntry, type JobSpec } from "./template-registry";
import { generateMetadata } from "./generate-metadata";
import { verifySeamless } from "./verify-seamless";

const OLLAMA_HOST = "localhost:11434";
const OLLAMA_MODEL = "qwen2.5:3b";
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

const callOllama = async (system: string, user: string): Promise<ConceptResponse> => {
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
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json() as { message: { content: string } };
  const raw = data.message.content.trim();
  return JSON.parse(raw.replace(/```(json)?\n?/g, "").replace(/```/g, "").trim()) as ConceptResponse;
};

const buildPrompt = (template: TemplateRegistryEntry, index: number): { system: string; user: string } => {
  const propLines: string[] = [];
  for (const n of template.propConstraints.numeric) {
    propLines.push(`    "${n.name}": ${n.type} [${n.min}, ${n.max}]${n.step ? ` step ${n.step}` : ""}`);
  }
  for (const colorName of template.propConstraints.colors) {
    propLines.push(`    "${colorName}": hex color string`);
  }

  const system =
    "Kamu adalah generator konsep video stock untuk Pond5. Output hanya JSON valid. Jangan tambahkan teks lain.";

  const user = `
Generate a unique stock video concept #${index + 1} for template "${template.name}".
Template: ${template.name}
Description: ${template.description}
Composition ID: ${template.id}

Props:
${propLines.join("\n")}

Output ONLY JSON:
{
  "concept_title": "unique creative title",
  "theme": "concept theme",
  "description": "detailed video description",
  "props": { all props with valid values },
  "pond5_keywords": ["30+ keywords"]
}
`.trim();

  return { system, user };
};

const checkActiveRuns = (): number => {
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
  execSync(
    `gh workflow run render-remotion.yml -f composition_id="${compositionId}" -f props_json='${propsJson}' -f job_id="${jobId}"`,
    { stdio: "pipe" }
  );
  return execSync(
    `gh run list --workflow render-remotion.yml --status in_progress,queued --limit 1 --json databaseId -q '.[0].databaseId'`,
    { encoding: "utf-8", stdio: "pipe" }
  ).trim();
};

const waitForRun = (runId: string): string => {
  try {
    execSync(`gh run watch ${runId} --exit-status --timeout ${EXPECTED_RUNTIME_MINUTES * 60}`, {
      stdio: "pipe",
    });
    return "success";
  } catch {
    return execSync(`gh run view ${runId} --json conclusion -q '.conclusion'`, {
      encoding: "utf-8", stdio: "pipe"
    }).trim() || "failure";
  }
};

const downloadArtifact = (jobId: string, downloadDir: string): string => {
  mkdirSync(downloadDir, { recursive: true });
  execSync(`gh run download --name render_${jobId} --dir "${downloadDir}"`, { stdio: "pipe" });
  const files = readdirSync(downloadDir).filter((f) => f.endsWith(".mp4"));
  if (files.length === 0) throw new Error("No MP4 artifact downloaded");
  return path.join(downloadDir, files[0]);
};

const generateJobId = (templateName: string, counter: number): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const baseName = templateName.toLowerCase().replace(/[^a-z]/g, "_");
  return `${baseName}_${dateStr}_${String(counter).padStart(3, "0")}`;
};

const loadRegistry = () => {
  const regPath = path.join(JOBS_DIR, "registry.json");
  if (!existsSync(regPath)) return { versions: [], stats: { totalGenerated: 0, totalFailed: 0, byTemplate: {} }, templates: {}, totalGenerated: 0 };
  return JSON.parse(readFileSync(regPath, "utf-8"));
};

const saveRegistry = (registry: any): void => {
  mkdirSync(JOBS_DIR, { recursive: true });
  writeFileSync(path.join(JOBS_DIR, "registry.json"), JSON.stringify(registry, null, 2));
};

interface BatchJob {
  jobId: string;
  templateId: string;
  compositionId: string;
  props: Record<string, unknown>;
  propsHash: string;
  conceptTitle: string;
  theme: string;
  runId: string;
  status: "pending" | "running" | "rendering" | "downloaded" | "verified" | "failed";
}

async function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0] || "3", 10);
  const specifiedTemplate = args.find((a) => a.startsWith("--template="))?.split("=")[1];

  const queueDir = path.join(JOBS_DIR, "queue");
  const failedDir = path.join(JOBS_DIR, "failed");
  const logsDir = path.join(JOBS_DIR, "logs");
  mkdirSync(queueDir, { recursive: true });
  mkdirSync(failedDir, { recursive: true });
  mkdirSync(logsDir, { recursive: true });

  const registry = loadRegistry();

  console.log(`🚀 Starting batch generation of ${count} video concepts...\n`);

  const jobs: BatchJob[] = [];
  let jobCounter = registry.totalGenerated + 1;

  for (let i = 0; i < count; i++) {
    const template = specifiedTemplate
      ? (getTemplate(specifiedTemplate) ??
         getAllTemplates().find((t) =>
           t.name.toLowerCase().includes(specifiedTemplate.toLowerCase()))
        ?? getAllTemplates()[Math.floor(Math.random() * getAllTemplates().length)])
      : getAllTemplates()[Math.floor(Math.random() * getAllTemplates().length)];

    if (!template) {
      console.error(`Template not found: ${specifiedTemplate}`);
      process.exit(1);
    }

    console.log(`[${i + 1}/${count}] Generating concept for ${template.name}...`);

    let concept: ConceptResponse;
    try {
      const prompt = buildPrompt(template, i);
      concept = await callOllama(prompt.system, prompt.user);
    } catch (error) {
      console.error(`  ✗ Ollama failed: ${(error as Error).message}`);
      i--;
      continue;
    }

    const defaultProps = template.schema.parse({}) as Record<string, unknown>;
    const props: Record<string, unknown> = { ...defaultProps, ...concept.props };

    try {
      template.schema.parse(props);
    } catch (error: any) {
      console.error(`  ✗ Zod validation failed: ${error.errors?.map((e: any) => e.message).join(", ")}`);
      i--;
      continue;
    }

    const propsHash = hashProps(props);

    if (registry.versions.some((v: any) => v.propsHash === propsHash)) {
      console.log(`  ⚠ Duplicate hash, regenerating...`);
      i--;
      continue;
    }

    const jobId = generateJobId(template.name, jobCounter++);

    const jobSpec: JobSpec = {
      jobId,
      compositionId: template.id,
      templateId: template.id,
      variantNumber: jobCounter,
      props,
      conceptTitle: concept.concept_title,
      conceptTheme: concept.theme,
      pond5Keywords: concept.pond5_keywords ?? [],
      pond5Description: concept.description,
      timestamp: new Date().toISOString(),
    };

    writeFileSync(path.join(queueDir, `${jobId}.json`), JSON.stringify(jobSpec, null, 2));

    const job: BatchJob = {
      jobId,
      templateId: template.id,
      compositionId: template.id,
      props,
      propsHash,
      conceptTitle: concept.concept_title,
      theme: concept.theme,
      runId: "",
      status: "pending",
    };

    jobs.push(job);
    console.log(`  ✓ Concept: ${concept.concept_title} (job: ${jobId})`);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Triggering ${jobs.length} workflows...`);

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const active = checkActiveRuns();
    if (active >= MAX_CONCURRENT_RUNS) {
      console.log(`  Waiting for concurrent runs to drop below ${MAX_CONCURRENT_RUNS}...`);
      await new Promise((r) => setTimeout(r, 60000));
      i--;
      continue;
    }

    console.log(`  Triggering ${job.compositionId} → ${job.jobId}...`);
    job.runId = triggerWorkflow(job.compositionId, JSON.stringify(job.props), job.jobId);
    job.status = "running";
    console.log(`    Run ID: ${job.runId}`);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Polling ${jobs.length} workflow runs for completion...`);

  for (const job of jobs) {
    console.log(`  Waiting for ${job.jobId} (run ${job.runId})...`);
    job.status = "rendering";
    const conclusion = waitForRun(job.runId);
    console.log(`  → Conclusion: ${conclusion}`);

    if (conclusion !== "success") {
      job.status = "failed";
      renameSync(path.join(queueDir, `${job.jobId}.json`), path.join(failedDir, `${job.jobId}.json`));
      continue;
    }

    console.log(`  Downloading artifact for ${job.jobId}...`);
    const downloadDir = path.join(JOBS_DIR, "downloading", job.jobId);
    let videoPath: string;
    try {
      videoPath = downloadArtifact(job.jobId, downloadDir);
    } catch (error) {
      console.error(`  ✗ Download failed: ${(error as Error).message}`);
      job.status = "failed";
      continue;
    }

    console.log(`  Verifying seamless loop...`);
    const gateResult = verifySeamless(videoPath);

    if (!gateResult.pass) {
      console.error(`  ✗ Quality gate failed (MSE: ${gateResult.mse.toFixed(6)})`);
      job.status = "failed";
      continue;
    }

    job.status = "verified";
    console.log(`  ✅ MSE: ${gateResult.mse.toFixed(6)}`);

    const outputDir = path.resolve("pond5-ready");
    mkdirSync(outputDir, { recursive: true });
    const finalPath = path.join(outputDir, `render_${job.jobId}.mp4`);
    renameSync(videoPath, finalPath);

    const template = getTemplate(job.templateId)!;
    const jobRecord = JSON.parse(readFileSync(path.join(queueDir, `${job.jobId}.json`), "utf-8"));
    const metadata = generateMetadata(
      template,
      job.conceptTitle,
      job.theme,
      jobRecord.pond5Description,
      jobRecord.pond5Keywords
    );

    writeFileSync(
      path.join(outputDir, `render_${job.jobId}.meta.json`),
      JSON.stringify({ ...metadata, jobId: job.jobId, propsHash: job.propsHash, props: job.props, mse: gateResult.mse, quality: "approved" }, null, 2)
    );

    registry.versions.push({
      jobId: job.jobId,
      templateId: job.templateId,
      propsHash: job.propsHash,
      props: job.props,
      conceptTitle: job.conceptTitle,
      theme: job.theme,
      timestamp: new Date().toISOString(),
      outputPath: finalPath,
      mse: gateResult.mse,
      status: "ready",
    });
    registry.stats.byTemplate[job.templateId] = (registry.stats.byTemplate[job.templateId] ?? 0) + 1;
    registry.totalGenerated = registry.versions.filter((v: any) => v.status === "ready").length;
    console.log(`  ✅ Archived: ${finalPath}`);
  }

  saveRegistry(registry);

  const ready = jobs.filter((j) => j.status === "verified").length;
  const failed = jobs.filter((j) => j.status === "failed").length;
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Batch complete! ✅ ${ready} ready, ❌ ${failed} failed`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
