import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

// Template configuration
const TEMPLATES = [
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
] as const;

const OUTPUT_DIR = path.resolve("out");

const renderTemplate = (template: typeof TEMPLATES[number], outputDir: string): boolean => {
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
  const templateName = args[0];
  
  if (!templateName) {
    console.error("Please provide a template name or ID");
    console.log("\nUsage: npx tsx scripts/render-single.ts <template-name-or-id>");
    console.log("\nAvailable templates:");
    TEMPLATES.forEach((t) => console.log(`  - ${t.id}: ${t.name}`));
    process.exit(1);
  }

  const template = TEMPLATES.find(
    (t) => t.id.toLowerCase() === templateName.toLowerCase() ||
           t.name.toLowerCase().includes(templateName.toLowerCase())
  );

  if (!template) {
    console.error(`Template not found: ${templateName}`);
    console.log("\nAvailable templates:");
    TEMPLATES.forEach((t) => console.log(`  - ${t.id}: ${t.name}`));
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\nStarting render of ${template.name}...`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const success = renderTemplate(template, OUTPUT_DIR);
  
  if (success) {
    console.log(`\n✓ Render complete!`);
  } else {
    console.log(`\n✗ Render failed!`);
    process.exit(1);
  }
};

main();
