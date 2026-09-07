// Professional video series batch renderer for diverse content types
import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("out/video-series");
mkdirSync(OUTPUT_DIR, { recursive: true });

// Professional video series variations for diverse markets
const episodes = [
  // Cyberpunk/Sci-Fi Series
  {
    id: "CyberCityLoop-Entertainment-Professional",
    compId: "CyberCityLoop-Professional-1",
    props: {
      gridColor: "#00F0FF",
      scanLineColor: "#FF00FF",
      backgroundColor: "#0A001A",
      gridSize: 25,
      scanSpeed: 0.5,
      glitchIntensity: 0.7,
      dataStreamDensity: 100,
      fps: 60,
    },
    category: "Entertainment",
    genre: "cyberpunk",
    target: "YouTube creative content, gaming trailers",
  },
  // Nature Tech Series
  {
    id: "AuroraDreams-Inspirational-Professional",
    compId: "AuroraDreams-Professional-1",
    props: {
      primaryColor: "#00FF00",
      secondaryColor: "#00FFFF",
      tertiaryColor: "#FF00FF",
      auroraIntensity: 0.8,
      curtainCount: 12,
      interferenceIntensity: 0.6,
      starDensity: 150,
      waveSpeed: 0.4,
    },
    category: "Inspirational",
    genre: "nature tech",
    target: "Motivational content, tech presentations",
  },
  // Space Exploration Series
  {
    id: "CosmicVoyage-Educational-Professional",
    compId: "CosmicVoyage-Professional-1",
    props: {
      primaryColor: "#8A2BE2",
      secondaryColor: "#00F0FF",
      tertiaryColor: "#FF69B4",
      swirlIntensity: 0.8,
      particleDensity: 300,
      glowIntensity: 0.7,
      layerSpeed: 0.6,
    },
    category: "Educational",
    genre: "space exploration",
    target: "Documentaries, science content",
  },
  // Marine Life Series
  {
    id: "OceanRealm-Documentary-Professional",
    compId: "OceanRealm-Professional-1",
    props: {
      waterColor: "#1E3A8A",
      lightColor: "#FFFFFF",
      bioluminescentColor: "#00F0FF",
      causticIntensity: 0.8,
      bubbleCount: 200,
      particleDensity: 200,
      currentSpeed: 0.5,
    },
    category: "Documentary",
    genre: "marine biology",
    target: "Nature documentaries, environmental content",
  },
  // Natural Phenomena Series
  {
    id: "SolarTempest-Narrative-Professional",
    compId: "SolarTempest-Professional-1",
    props: {
      solarColor: "#FFA500",
      flareColor: "#FF4500",
      plasmaColor: "#FFD700",
      surfaceIntensity: 0.8,
      flareCount: 10,
      magneticLineCount: 20,
      plasmaStreamDensity: 100,
      rotationSpeed: 0.3,
    },
    category: "Narrative",
    genre: "natural phenomena",
    target: "Narrative films, dramatic content",
  },
];

console.log("Rendering professional video series for diverse markets...\n");

let completed = 0;
for (const ep of episodes) {
  const outPath = path.join(OUTPUT_DIR, `${ep.id}.mov`);

  const inputProps = JSON.stringify(ep.props);

  try {
    execSync(
      `npx remotion render ${ep.compId} "${outPath}" --codec=prores --width=3840 --height=2160 --fps=60 --props='${inputProps.replace(/'/g, "'\\''")}'`,
      {
        stdio: "inherit",
        cwd: process.cwd(),
      }
    );
    completed++;
    console.log(`\n✓ ${ep.id} -> ${path.basename(outPath)} (${completed}/${episodes.length})`);
    console.log(`  Genre: ${ep.genre} | Target: ${ep.target}`);
  } catch (err) {
    console.error(`\n✗ Failed: ${ep.id}`, err);
  }
}

console.log(`\nAll ${completed}/${episodes.length} professional video series rendered to ${OUTPUT_DIR}\n`);
console.log("Professional video series ready for all content platforms!\n");
console.log("Genre diversity: Cyberpunk, Natural Tech, Space, Marine, Nature\n");
console.log("Each series optimized for specific market requirements and target audiences.\n");
