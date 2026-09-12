import { execSync } from "child_process";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const TEMPLATES: { id: string; name: string; description: string }[] = [
  {
    id: "FluidGradientWaves-001",
    name: "Fluid Gradient Waves",
    description: "Smooth organic color gradients flowing like liquid silk",
  },
  {
    id: "NeonGridTunnel-001",
    name: "Neon Grid Tunnel",
    description: "Endless perspective grid flying toward viewer with neon scan lines",
  },
  {
    id: "AuroraBorealis-001",
    name: "Aurora Borealis",
    description: "Curtains of northern lights dancing across starry night sky",
  },
  {
    id: "ParticleVortex-001",
    name: "Particle Vortex",
    description: "Thousands of particles spiraling into a glowing core with light trails",
  },
  {
    id: "LiquidChrome-001",
    name: "Liquid Chrome",
    description: "Flowing metallic liquid surface with neon reflections and ripples",
  },
];

const OUTPUT_DIR = path.resolve("out");
const PROGRESS_FILE = path.resolve(OUTPUT_DIR, ".progress.json");

interface Progress {
  completed: string[];
  failed: string[];
}

const loadProgress = (): Progress => {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, "utf-8"));
  }
  return { completed: [], failed: [] };
};

const saveProgress = (progress: Progress) => {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
};

const renderTemplate = (template: any, outputDir: string): boolean => {
  const outPath = path.join(outputDir, `${template.name.replace(/\s+/g, "-").toLowerCase()}.mp4`);
  
  const cmd = [
    "npx remotion render",
    template.id,
    `"${outPath}"`,
    "--codec=h264",
    "--width=3840",
    "--height=2160",
    "--fps=60",
    "--bitrate=100M",
  ].join(" ");

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Rendering: ${template.name}`);
  console.log(`ID: ${template.id}`);
  console.log(`Output: ${outPath}`);
  console.log(`${"=".repeat(60)}\n`);

  try {
    execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
    console.log(`\n✓ ${template.name} rendered successfully!`);
    return true;
  } catch (error) {
    console.error(`\n✗ Failed to render ${template.name}`);
    return false;
  }
};

const main = () => {
  const args = process.argv.slice(2);
  const specificTemplate = args[0];
  
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const progress = loadProgress();

  let templatesToRender = TEMPLATES;
  if (specificTemplate) {
    templatesToRender = TEMPLATES.filter(
      (t) => t.id.toLowerCase().includes(specificTemplate.toLowerCase()) ||
             t.name.toLowerCase().includes(specificTemplate.toLowerCase())
    );
    if (templatesToRender.length === 0) {
      console.error(`Template not found: ${specificTemplate}`);
      console.log("\nAvailable templates:");
      TEMPLATES.forEach((t) => console.log(`  - ${t.id}: ${t.name}`));
      process.exit(1);
    }
  }

  // Filter out already completed templates
  const pendingTemplates = templatesToRender.filter(
    (t) => !progress.completed.includes(t.id)
  );

  if (pendingTemplates.length === 0) {
    console.log("All templates already rendered!");
    console.log(`\nCompleted: ${progress.completed.join(", ")}`);
    return;
  }

  console.log(`\nStarting render of ${pendingTemplates.length} template(s)...`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const template of pendingTemplates) {
    const success = renderTemplate(template, OUTPUT_DIR);
    
    if (success) {
      progress.completed.push(template.id);
      successCount++;
    } else {
      progress.failed.push(template.id);
      failCount++;
    }
    saveProgress(progress);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Render Complete!`);
  console.log(`${"=".repeat(60)}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${pendingTemplates.length}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  
  if (progress.failed.length > 0) {
    console.log(`\nFailed templates: ${progress.failed.join(", ")}`);
  }
};

main();
