// Professional seamless loop batch renderer for stock footage
import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("out/stock-loop");
mkdirSync(OUTPUT_DIR, { recursive: true });

// Professional seamless loop variations for stock footage
const variations = [
  // Tech/Financial Professional Loops
  {
    id: "DigitalAurora-Tech-1",
    compId: "DigitalAurora-Professional-1",
    props: {
      primaryColor: "#00FF00",
      secondaryColor: "#00FFFF",
      tertiaryColor: "#FF00FF",
      auroraIntensity: 0.7,
      curtainCount: 12,
      interferenceIntensity: 0.5,
      starDensity: 150,
      waveSpeed: 0.4,
    },
    style: "tech-cyan",
  },
  {
    id: "VortexWeb-Tech-1",
    compId: "VortexWeb-Professional-1",
    props: {
      primaryColor: "#00F0FF",
      rotationSpeed: 0.8,
      forwardSpeed: 0.8,
      vortexIntensity: 0.8,
      webDensity: 0.9,
      particleCount: 300,
      ringCount: 15,
    },
    style: "tech-digital",
  },
  // Corporate/Financial Loops
  {
    id: "DigitalAurora-Finance-1",
    compId: "DigitalAurora-Professional-2",
    props: {
      primaryColor: "#3B82F6",
      secondaryColor: "#8B5CF6",
      tertiaryColor: "#EC4899",
      auroraIntensity: 0.6,
      curtainCount: 10,
      interferenceIntensity: 0.4,
      starDensity: 100,
      waveSpeed: 0.3,
    },
    style: "finance-blue",
  },
  {
    id: "QuantumParticles-Finance-1",
    compId: "QuantumParticles-Professional-1",
    props: {
      primaryColor: "#6366F1",
      secondaryColor: "#10B981",
      particleCount: 800,
      particleSize: 3,
      glowIntensity: 0.8,
      connectionDistance: 200,
      driftSpeed: 0.7,
      trailIntensity: 0.2,
    },
    style: "finance-data",
  },
  // Premium Corporate Loops
  {
    id: "GeometricGrid-Corporate-1",
    compId: "GeometricGrid-Professional-1",
    props: {
      gridColor: "#3B82F6",
      backgroundColor: "#0F172A",
      gridSize: 25,
      rotationSpeed: 1.2,
      morphSpeed: 1.0,
      depth: 35,
      lineWidth: 2,
      secondaryColor: "#8B5CF6",
      pulseIntensity: 0.4,
    },
    style: "corporate-minimal",
  },
];

console.log("Rendering professional seamless loops for stock footage...\n");

let completed = 0;
for (const v of variations) {
  const outPath = path.join(OUTPUT_DIR, `${v.id}.mov`);

  const inputProps = JSON.stringify(v.props);

  try {
    // Use ProRes for broadcast quality
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

console.log(`\nAll ${completed}/${variations.length} professional seamless loops rendered to ${OUTPUT_DIR}\n`);
console.log("Stock footage ready for Adobe Stock, Pond5, etc.\n");
console.log("Each loop is 15 seconds (60fps × 300 frames) - perfect for stock requirements.\n");
