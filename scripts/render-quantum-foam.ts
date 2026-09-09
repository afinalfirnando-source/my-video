import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("out");
mkdirSync(OUTPUT_DIR, { recursive: true });

const outFile = path.join(OUTPUT_DIR, "quantum-foam.mp4");

const cmd = [
  "npx remotion render QuantumFoam",
  `"${outFile}"`,
  "--codec=h264",
  "--crf=18",
  "--preset=medium",
  "--width=3840",
  "--height=2160",
  "--fps=60",
].join(" ");

console.log(`Rendering QuantumFoam -> ${outFile}`);
console.log(`Cmd: ${cmd}`);
execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
console.log("Render complete.");
