// Original Root.tsx with 5 new professional video concepts
import { Composition } from "remotion";
import { CyberGrid } from "./templates/cyber-grid";
import { DigitalAurora } from "./templates/digital-aurora";
import { NebulaDrift } from "./templates/nebula-drift";
import { OceanicDepths } from "./templates/oceanic-depths";
import { SolarFlare } from "./templates/solar-flare";

import { CyberGridPropsSchema } from "./templates/cyber-grid/types";
import { DigitalAuroraPropsSchema } from "./templates/digital-aurora/types";
import { NebulaDriftPropsSchema } from "./templates/nebula-drift/types";
import { OceanicDepthsPropsSchema } from "./templates/oceanic-depths/types";
import { SolarFlarePropsSchema } from "./templates/solar-flare/types";
import { NeuralMesh } from "./templates/neural-mesh";
import { NeuralMeshPropsSchema } from "./templates/neural-mesh/types";
import { QuantumFoam } from "./templates/quantum-foam";
import { QuantumFoamPropsSchema } from "./templates/quantum-foam/types";
import { HyperbolicTiling } from "./templates/hyperbolic-tiling";
import { HyperbolicTilingPropsSchema } from "./templates/hyperbolic-tiling/types";
import { VolumetricCloudscape } from "./templates/volumetric-cloudscape";
import { VolumetricCloudscapePropsSchema } from "./templates/volumetric-cloudscape/types";
import { CrystalGrowth } from "./templates/crystal-growth";
import { CrystalGrowthPropsSchema } from "./templates/crystal-growth/types";

// Professional video series with diverse themes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const videoSeries: any[] = [
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
  {
    id: "NeuralMesh",
    component: NeuralMesh,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: NeuralMeshPropsSchema,
    defaultProps: {
      nodeColor: "#00F0FF",
      connectionColor: "#8A2BE2",
      pulseColor: "#FF00FF",
      nodeCount: 80,
      layerCount: 5,
      pulseSpeed: 0.8,
      networkDensity: 0.7,
      glowIntensity: 0.8,
    },
    category: "Technology",
    description: "Neural network visualization with flowing data and synapses",
  },
  {
    id: "QuantumFoam",
    component: QuantumFoam,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: QuantumFoamPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      particleDensity: 400,
      waveIntensity: 0.7,
      entanglementStrength: 0.8,
      interferenceScale: 0.5,
      glowIntensity: 0.7,
      fieldOpacity: 0.6,
    },
    category: "Science",
    description: "Quantum field visualization with entangled particles and interference",
  },
  {
    id: "HyperbolicTiling",
    component: HyperbolicTiling,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: HyperbolicTilingPropsSchema,
    defaultProps: {
      primaryColor: "#8A2BE2",
      secondaryColor: "#00F0FF",
      tertiaryColor: "#FF69B4",
      rotationSpeed: 0.3,
      zoomSpeed: 0.2,
      tileDensity: 7,
      glowIntensity: 0.8,
      colorShift: 0.5,
    },
    category: "Mathematics",
    description: "Non-Euclidean geometry with rotating hyperbolic tilings",
  },
  {
    id: "VolumetricCloudscape",
    component: VolumetricCloudscape,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: VolumetricCloudscapePropsSchema,
    defaultProps: {
      skyTopColor: "#001133",
      skyBottomColor: "#002266",
      cloudColor: "#FFFFFF",
      sunColor: "#FFD700",
      cloudDensity: 0.7,
      sunIntensity: 0.8,
      rayCount: 12,
      windSpeed: 0.3,
      layerCount: 3,
    },
    category: "Nature",
    description: "3D volumetric clouds with sun rays and atmospheric lighting",
  },
  {
    id: "CrystalGrowth",
    component: CrystalGrowth,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: CrystalGrowthPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      crystalDensity: 15,
      growthSpeed: 0.5,
      fractureIntensity: 0.6,
      refractionIntensity: 0.8,
      shineIntensity: 0.7,
    },
    category: "Abstract",
    description: "Growing crystal formations with light refraction and energy bursts",
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
          defaultProps={episode.defaultProps}
        />
      ))}
    </>
  );
};
