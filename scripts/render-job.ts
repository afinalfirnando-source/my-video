import { execSync } from "child_process";
import { existsSync, readFileSync, mkdirSync } from "fs";
import path from "path";
import { getTemplate, getAllTemplates } from "../src/data/template-registry";

const main = () => {
  const args = process.argv.slice(2);
  const jobFile = args[0];

  if (!jobFile) {
    console.error("Usage: tsx scripts/render-job.ts <job-file.json>");
    console.error("Example: tsx scripts/render-job.ts jobs/queue/fgw_20260912_001.json");
    process.exit(1);
  }

  if (!existsSync(jobFile)) {
    console.error(`Job file not found: ${jobFile}`);
    process.exit(1);
  }

  const job = JSON.parse(readFileSync(jobFile, "utf-8"));
  console.log(`📋 Job: ${job.jobId}`);
  console.log(`   Template: ${job.templateId}`);
  console.log(`   Concept: ${job.conceptTitle}`);

  const template = getTemplate(job.templateId);
  if (!template) {
    console.error(`Unknown template: ${job.templateId}`);
    console.error("\nAvailable templates:");
    getAllTemplates().forEach((t) => console.log(`  - ${t.id}: ${t.name}`));
    process.exit(1);
  }

  const validationResult = template.schema.safeParse(job.props);
  if (!validationResult.success) {
    console.error("❌ Props validation failed:");
    console.error(JSON.stringify(validationResult.error.errors?.[0], null, 2));
    process.exit(1);
  }

  console.log("✅ Props validated successfully");

  const outputDir = path.resolve("out");
  mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, `${job.jobId}.mp4`);

  const propsJson = JSON.stringify(job.props);
  const cmd = [
    "npx remotion render",
    `"${template.id}"`,
    `"${outputFile}"`,
    `--props='${propsJson}'`,
    "--codec=h264",
    "--width=3840",
    "--height=2160",
    "--fps=60",
    "--bitrate=100M",
  ].join(" ");

  console.log(`\n🎬 Rendering: ${template.name}`);
  console.log(`   Output: ${outputFile}`);
  console.log(`   Props: ${propsJson}\n`);

  try {
    execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
    console.log(`\n✅ Render complete: ${outputFile}`);

    console.log("\n🔍 Verifying seamless loop...");
    try {
      execSync(`npx tsx scripts/verify-seamless.ts "${outputFile}"`, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
    } catch (verifyError) {
      console.error("❌ Seamless verification failed");
    }

    console.log("\n📦 Siap untuk CI: Commit ke repo, trigger workflow render-remotion.yml");
  } catch (error: any) {
    console.error("\n❌ Render failed:", error.message);
    process.exit(1);
  }
};

main();
