import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("out/new-loops");
mkdirSync(OUTPUT_DIR, { recursive: true });

const compositions = [
  { id: "FluidGradientWaves-Professional-1", name: "fluid-gradient-waves" },
  { id: "NeonGridTunnel-Professional-1", name: "neon-grid-tunnel" },
  { id: "AuroraBorealis-Professional-1", name: "aurora-borealis" },
  { id: "PlasmaVortex-Professional-1", name: "plasma-vortex" },
  { id: "MirrorChrome-Professional-1", name: "mirror-chrome" },
];

console.log("Rendering 5 new seamless loop videos (4K 60fps 15s)...\n");

let completed = 0;
for (const comp of compositions) {
  const outPath = path.join(OUTPUT_DIR, `${comp.name}.mp4`);

  try {
    execSync(
      `npx remotion render ${comp.id} "${outPath}" --codec=h264 --width=3840 --height=2160 --fps=60 --bitrate=100M`,
      {
        stdio: "inherit",
        cwd: process.cwd(),
      }
    );
    completed++;
    console.log(`\n✓ ${comp.name} -> ${path.basename(outPath)} (${completed}/${compositions.length})`);
  } catch (err) {
    console.error(`\n✗ Failed: ${comp.name}`, err);
  }
}

console.log(`\nAll ${completed}/${compositions.length} videos rendered to ${OUTPUT_DIR}`);
console.log("Target: ~100-250MB per video at 4K 60fps 15s with H.264 100Mbps");
