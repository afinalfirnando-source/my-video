// Background seamless loop batch renderer for professional animation assets
import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("out/background-loops");
mkdirSync(OUTPUT_DIR, { recursive: true });

// Professional seamless loop variations for background footage
const variations = [
  // 1. Luminescent Currents - Energy flow abstraction
  {
    id: "LuminescentCurrents-Energy-Professional",
    compId: "LuminescentCurrents-Professional-1",
    props: {
      flowSpeed: 0.8,
      intensity: 0.9,
      colorMode: "cyan",
    },
    style: "energy-cyan",
  },
  // 2. Neural Pulse - Consciousness visualization
  {
    id: "NeuralPulse-Consciousness-Professional",
    compId: "NeuralPulse-Professional-1",
    props: {
      pulseIntensity: 1.0,
      nodeDensity: 1.2,
      connectionStrength: 0.6,
    },
    style: "neural-blue",
  },
  // 3. Molecular Cascade - Particle physics
  {
    id: "MolecularCascade-Physics-Professional",
    compId: "MolecularCascade-Professional-1",
    props: {
      moleculeSpeed: 1.2,
      emissionRate: 0.8,
      energyLevel: 1.0,
    },
    style: "molecular-green",
  },
  // 4. Solar Resonance - Celestial harmonics
  {
    id: "SolarResonance-Celestial-Professional",
    compId: "SolarResonance-Professional-1",
    props: {
      orbitSpeed: 1.0,
      resonanceFrequency: 1.2,
      lightIntensity: 0.9,
    },
    style: "celestial-purple",
  },
  // 5. Urban Flow - Digital network
  {
    id: "UrbanFlow-Network-Professional",
    compId: "UrbanFlow-Professional-1",
    props: {
      flowVelocity: 1.1,
      gridDensity: 0.9,
      neonIntensity: 1.0,
    },
    style: "urban-cyber",
  },
];

console.log("Rendering professional 4K background seamless loops (3840×2160 @ 60fps)...\n");

let completed = 0;
for (const v of variations) {
  const outPath = path.join(OUTPUT_DIR, `${v.id}.mov`);

  const inputProps = JSON.stringify(v.props);

  try {
    execSync(
      `npx remotion render ${v.compId} "${outPath}" --codec=prores --width=3840 --height=2160 --fps=60 --props='${inputProps.replace(/'/g, "'\\''")}'`,
      {
        stdio: "inherit",
        cwd: process.cwd(),
      }
    );
    completed++;
    console.log(`\n✓ ${v.id} -> ${path.basename(outPath)} (${completed}/${variations.length})`);
  } catch (err) {
    console.error(`\n✗ Failed: ${v.id}`, err);
  }
}

console.log(`\nAll ${completed}/${variations.length} professional background seamless loops rendered to ${OUTPUT_DIR}\n`);
console.log("Background footage ready for all media platforms!\n");
console.log("Each loop perfect for: presentations, meetings, creative workflows, etc.\n");
console.log("Background themes: Energy Flow, Neural, Molecular, Celestial, Urban\n");
