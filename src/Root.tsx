// Original Root.tsx with 5 new professional video concepts
import { Composition } from "remotion";
import { CyberGrid } from "./templates/cyber-grid/index.tsx";
import { DigitalAurora } from "./templates/digital-aurora/index.tsx";
import { NebulaDrift } from "./templates/nebula-drift/index.tsx";
import { OceanicDepths } from "./templates/oceanic-depths/index.tsx";
import { SolarFlare } from "./templates/solar-flare/index.tsx";

import { CyberGridPropsSchema } from "./templates/cyber-grid/types.ts";
import { DigitalAuroraPropsSchema } from "./templates/digital-aurora/types.ts";
import { NebulaDriftPropsSchema } from "./templates/nebula-drift/types.ts";
import { OceanicDepthsPropsSchema } from "./templates/oceanic-depths/types.ts";
import { SolarFlarePropsSchema } from "./templates/solar-flare/types.ts";

// Professional video series with diverse themes
const videoSeries = [
  // Episode 1: Cyberpunk City - Digital urban exploration
  {
    id: "CyberCityLoop-Professional-1",
    component: CyberGrid,
    durationInFrames: 300,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: CyberGridPropsSchema,
    defaultProps: {
      gridColor: "#00F0FF",
      scanLineColor: "#FF00FF",
      backgroundColor: "#0A001A",
      gridSize: 25,
      scanSpeed: 0.5,
      glitchIntensity: 0.7,
      dataStreamDensity: 100,
      fps: 60,
    },
    category: "Cyberpunk",
    description: "Digital urban pulse with neon glitch effects",
  },
  // Episode 2: Aurora Dreams - Nature meets technology
  {
    id: "AuroraDreams-Professional-1",
    component: DigitalAurora,
    durationInFrames: 240,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: DigitalAuroraPropsSchema,
    defaultProps: {
      primaryColor: "#00FF00",
      secondaryColor: "#00FFFF",
      tertiaryColor: "#FF00FF",
      auroraIntensity: 0.8,
      curtainCount: 12,
      interferenceIntensity: 0.6,
      starDensity: 150,
      waveSpeed: 0.4,
    },
    category: "Natural Tech",
    description: "Organic-digital fusion with celestial energy",
  },
  // Episode 3: Cosmic Journey - Space exploration narrative
  {
    id: "CosmicVoyage-Professional-1",
    component: NebulaDrift,
    durationInFrames: 360,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: NebulaDriftPropsSchema,
    defaultProps: {
      primaryColor: "#8A2BE2",
      secondaryColor: "#00F0FF",
      tertiaryColor: "#FF69B4",
      swirlIntensity: 0.8,
      particleDensity: 300,
      glowIntensity: 0.7,
      layerSpeed: 0.6,
    },
    category: "Space Exploration",
    description: "Deep space travel through swirling stellar formations",
  },
  // Episode 4: Oceanic Wonders - Underwater discovery
  {
    id: "OceanRealm-Professional-1",
    component: OceanicDepths,
    durationInFrames: 180,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: OceanicDepthsPropsSchema,
    defaultProps: {
      waterColor: "#1E3A8A",
      lightColor: "#FFFFFF",
      bioluminescentColor: "#00F0FF",
      causticIntensity: 0.8,
      bubbleCount: 200,
      particleDensity: 200,
      currentSpeed: 0.5,
    },
    category: "Marine Life",
    description: "Underwater ecosystem with bioluminescent life",
  },
  // Episode 5: Solar Storm - Nature's power demonstration
  {
    id: "SolarTempest-Professional-1",
    component: SolarFlare,
    durationInFrames: 200,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: SolarFlarePropsSchema,
    defaultProps: {
      solarColor: "#FFA500",
      flareColor: "#FF4500",
      plasmaColor: "#FFD700",
      surfaceIntensity: 0.8,
      flareCount: 10,
      magneticLineCount: 20,
      plasmaStreamDensity: 100,
      rotationSpeed: 0.3,
    },
    category: "Natural Phenomena",
    description: "Solar storm with explosive plasma and magnetic interactions",
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {videoSeries.map((episode) => (
        <Composition
          key={episode.id}
          id={episode.id}
          component={episode.component}
          durationInFrames={episode.durationInFrames}
          fps={episode.fps}
          width={episode.width}
          height={episode.height}
          schema={episode.schema}
          defaultProps={episode.defaultProps as any}
        />
      ))}
    </>
  );
};
