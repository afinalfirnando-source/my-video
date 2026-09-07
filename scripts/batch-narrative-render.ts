// Narrative-driven batch renderer for storytelling video series
import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("out/story-series");
mkdirSync(OUTPUT_DIR, { recursive: true });

// Episode variations for narrative storytelling
const episodes = [
  {
    id: "OpeningNarrative",
    compId: "OpeningNarrative",
    props: {
      title: "The Future Is Here",
      subtitle: "Transforming Tomorrow",
      brandColor: "#2563EB",
      backgroundColor: "#0F172A",
      style: "corporate",
    },
    episode: 1,
  },
  {
    id: "TechVision",
    compId: "TechVision",
    props: {
      primaryColor: "#00F0FF",
      rotationSpeed: 1.2,
      forwardSpeed: 0.8,
      vortexIntensity: 0.7,
      webDensity: 0.7,
      particleCount: 250,
      ringCount: 12,
    },
    episode: 2,
  },
  {
    id: "Innovation",
    compId: "Innovation",
    props: {
      primaryColor: "#6366F1",
      secondaryColor: "#10B981",
      particleCount: 600,
      particleSize: 3,
      glowIntensity: 0.8,
      connectionDistance: 200,
      driftSpeed: 0.7,
      trailIntensity: 0.3,
    },
    episode: 3,
  },
  {
    id: "DataAnalysis",
    compId: "DataAnalysis",
    props: {
      gridColor: "#3B82F6",
      backgroundColor: "#1E293B",
      gridSize: 20,
      rotationSpeed: 1.0,
      morphSpeed: 0.8,
      depth: 30,
      lineWidth: 2,
      secondaryColor: "#8B5CF6",
      pulseIntensity: 0.3,
    },
    episode: 4,
  },
  {
    id: "Conclusion",
    compId: "Conclusion",
    props: {
      primaryColor: "#EC4899",
      rotationSpeed: 0.6,
      forwardSpeed: 0.5,
      vortexIntensity: 0.9,
      webDensity: 0.8,
      particleCount: 350,
      ringCount: 15,
    },
    episode: 5,
  },
];

console.log("Rendering narrative storytelling series...\n");

let completed = 0;
for (const ep of episodes) {
  const outPath = path.join(OUTPUT_DIR, `${ep.id}.mov`);

  const inputProps = JSON.stringify(ep.props);

  try {
    execSync(
      `npx remotion render ${ep.compId} "${outPath}" --codec=prores --width=1920 --height=1080 --fps=${ep.episode === 2 || ep.episode === 3 || ep.episode === 5 ? 30 : 24} --props='${inputProps.replace(/'/g, "'\\''")}'`,
      {
        stdio: "inherit",
        cwd: process.cwd(),
      }
    );
    completed++;
    console.log(`\n✓ Episode ${ep.episode}: ${ep.id} -> ${path.basename(outPath)} (${completed}/${episodes.length})`);
  } catch (err) {
    console.error(`\n✗ Failed: ${ep.id}`, err);
  }
}

console.log(`\nAll ${completed}/${episodes.length} narrative episodes rendered to ${OUTPUT_DIR}\n`);
console.log("Storytelling series ready for platforms!\n");
console.log("Episode 1: Opening (24fps, 7.5s) - Corporate narrative");
console.log("Episode 2: Tech Vision (30fps, 8s) - Technology demo");
console.log("Episode 3: Innovation (30fps, 8s) - Particle animation");
console.log("Episode 4: Data Analysis (24fps, 7.5s) - Grid visualization");
console.log("Episode 5: Conclusion (30fps, 4s) - Dynamic finale");
