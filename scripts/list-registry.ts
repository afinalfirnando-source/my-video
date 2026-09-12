import { readFileSync, existsSync } from "fs";
import path from "path";
import { getTemplate, POND5_CATEGORIES } from "../src/data/template-registry";

const REGISTRY_FILE = path.resolve("jobs/registry.json");

interface RegistryEntry {
  jobId: string;
  templateId: string;
  propsHash: string;
  conceptTitle: string;
  theme: string;
  timestamp: string;
  outputPath: string;
  mse: number;
  status: "approved" | "failed" | "queued" | "rendering";
}

interface Registry {
  versions: RegistryEntry[];
  templates: Record<string, string[]>;
  totalGenerated: number;
}

const main = () => {
  if (!existsSync(REGISTRY_FILE)) {
    console.log("Registry does not exist yet. No videos generated.");
    return;
  }

  const registry = JSON.parse(readFileSync(REGISTRY_FILE, "utf-8")) as Registry;

  console.log("\n📊 Video Registry Summary");
  console.log("=".repeat(50));
  console.log(`Total Generated: ${registry.totalGenerated || 0}`);
  console.log(`Total Versions:  ${registry.versions?.length || 0}`);

  if (registry.templates) {
    console.log("\n📈 Per Template:");
    for (const [templateId, hashes] of Object.entries(registry.templates)) {
      const count = (hashes as string[]).length;
      const template = getTemplate(templateId);
      const name = template ? template.name : templateId;
      console.log(`   ${name}: ${count} variations`);
    }
  }

  const ready = registry.versions?.filter((v) => v.status === "approved") || [];
  const failed = registry.versions?.filter((v) => v.status === "failed") || [];

  if (ready.length > 0) {
    console.log(`\n✅ Ready for Pond5: ${ready.length} videos`);
    console.log("   Location: pond5-ready/");
    ready.slice(0, 5).forEach((v) => {
      console.log(`   • ${v.jobId}: ${v.conceptTitle} (MSE: ${v.mse.toFixed(4)})`);
    });
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length} videos`);
    console.log("   Location: jobs/failed/");
  }

  console.log(`\n📂 Pond5 categories: ${POND5_CATEGORIES.join(", ")}`);
  console.log("\n" + "=".repeat(50));
};

main();
