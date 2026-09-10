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
import { LiquidChrome } from "./templates/liquid-chrome";
import { LiquidChromePropsSchema } from "./templates/liquid-chrome/types";
import { NeonWaveRider } from "./templates/neon-wave-rider";
import { NeonWaveRiderPropsSchema } from "./templates/neon-wave-rider/types";
import { ParticleVortex } from "./templates/particle-vortex";
import { ParticleVortexPropsSchema } from "./templates/particle-vortex/types";
import { GradientAurora } from "./templates/gradient-aurora";
import { GradientAuroraPropsSchema } from "./templates/gradient-aurora/types";
import { GeometricPulse } from "./templates/geometric-pulse";
import { GeometricPulsePropsSchema } from "./templates/geometric-pulse/types";
import { FluidGradientWaves } from "./templates/fluid-gradient-waves";
import { FluidGradientWavesPropsSchema } from "./templates/fluid-gradient-waves/types";
import { NeonGridTunnel } from "./templates/neon-grid-tunnel";
import { NeonGridTunnelPropsSchema } from "./templates/neon-grid-tunnel/types";
import { AuroraBorealis } from "./templates/aurora-borealis";
import { AuroraBorealisPropsSchema } from "./templates/aurora-borealis/types";
import { PlasmaVortex } from "./templates/plasma-vortex";
import { PlasmaVortexPropsSchema } from "./templates/plasma-vortex/types";
import { MirrorChrome } from "./templates/mirror-chrome";
import { MirrorChromePropsSchema } from "./templates/mirror-chrome/types";
import { HyperspaceRush } from "./templates/hyperspace-rush";
import { HyperspaceRushPropsSchema } from "./templates/hyperspace-rush/types";
import { PrismaticShatter } from "./templates/prismatic-shatter";
import { PrismaticShatterPropsSchema } from "./templates/prismatic-shatter/types";
import { CosmicWeb } from "./templates/cosmic-web";
import { CosmicWebGLPropsSchema } from "./templates/cosmic-web/types";
import { NeuralRain } from "./templates/neural-rain";
import { NeuralRainPropsSchema } from "./templates/neural-rain/types";
import { PlasmaArcField } from "./templates/plasma-arc-field";
import { PlasmaArcFieldPropsSchema } from "./templates/plasma-arc-field/types";
import { LissajousResonance } from "./templates/lissajous-resonance";
import { LissajousResonancePropsSchema } from "./templates/lissajous-resonance/types";
import { KineticGears } from "./templates/kinetic-gears";
import { KineticGearsPropsSchema } from "./templates/kinetic-gears/types";
import { SpirographBloom } from "./templates/spirograph-bloom";
import { SpirographBloomPropsSchema } from "./templates/spirograph-bloom/types";
import { HexagonFlow } from "./templates/hexagon-flow";
import { HexagonFlowPropsSchema } from "./templates/hexagon-flow/types";
import { OrbitalResonance } from "./templates/orbital-resonance";
import { OrbitalResonancePropsSchema } from "./templates/orbital-resonance/types";
import { PlasmaFlux } from "./templates/plasma-flux";
import { PlasmaFluxPropsSchema } from "./templates/plasma-flux/types";
import { WaveLattice } from "./templates/wave-lattice";
import { WaveLatticePropsSchema } from "./templates/wave-lattice/types";
import { ChromaSwirl } from "./templates/chroma-swirl";
import { ChromaSwirlPropsSchema } from "./templates/chroma-swirl/types";
import { PixelGlide } from "./templates/pixel-glide";
import { PixelGlidePropsSchema } from "./templates/pixel-glide/types";
import { LuminousVeil } from "./templates/luminous-veil";
import { LuminousVeilPropsSchema } from "./templates/luminous-veil/types";
import { VectorFieldFlow } from "./templates/vector-field-flow";
import { VectorFieldFlowPropsSchema } from "./templates/vector-field-flow/types";
import { KaleidoGrid } from "./templates/kaleido-grid";
import { KaleidoGridPropsSchema } from "./templates/kaleido-grid/types";
import { MatrixCascade } from "./templates/matrix-cascade";
import { MatrixCascadePropsSchema } from "./templates/matrix-cascade/types";
import { PrismVault } from "./templates/prism-vault";
import { PrismVaultPropsSchema } from "./templates/prism-vault/types";
import { LatticeTunnel } from "./templates/lattice-tunnel";
import { LatticeTunnelPropsSchema } from "./templates/lattice-tunnel/types";
import { VortexWeave } from "./templates/vortex-weave";
import { VortexWeavePropsSchema } from "./templates/vortex-weave/types";
import { GlitchTerrain } from "./templates/glitch-terrain";
import { GlitchTerrainPropsSchema } from "./templates/glitch-terrain/types";
import { NeonCircuit } from "./templates/neon-circuit";
import { NeonCircuitPropsSchema } from "./templates/neon-circuit/types";
import { ChromaRings } from "./templates/chroma-rings";
import { ChromaRingsPropsSchema } from "./templates/chroma-rings/types";
import { PrismaticRibbons } from "./templates/prismatic-ribbons";
import { PrismaticRibbonsPropsSchema } from "./templates/prismatic-ribbons/types";

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
  {
    id: "LiquidChrome",
    component: LiquidChrome,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: LiquidChromePropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      rippleCount: 24,
      flowSpeed: 0.4,
      waveAmplitude: 0.6,
      metallicShine: 0.8,
    },
    category: "Abstract",
    description: "Flowing liquid chrome ripples with metallic reflections and soft neon light",
  },
  {
    id: "NeonWaveRider",
    component: NeonWaveRider,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: NeonWaveRiderPropsSchema,
    defaultProps: {
      primaryColor: "#FF2A6D",
      secondaryColor: "#05FFA1",
      waveCount: 10,
      waveSpeed: 0.5,
      waveAmplitude: 0.7,
      glowIntensity: 0.8,
      trailLength: 0.6,
    },
    category: "Motion",
    description: "Stacked neon sine-wave ribbons with glowing trails and energy pulses",
  },
  {
    id: "ParticleVortex",
    component: ParticleVortex,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: ParticleVortexPropsSchema,
    defaultProps: {
      primaryColor: "#FF8C00",
      secondaryColor: "#FF0080",
      particleCount: 1500,
      vortexSpeed: 0.6,
      spiralStrength: 0.8,
      coreGlow: 0.9,
    },
    category: "Energy",
    description: "Swirling particle vortex with bright core glow and orbiting energy trails",
  },
  {
    id: "GradientAurora",
    component: GradientAurora,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: GradientAuroraPropsSchema,
    defaultProps: {
      primaryColor: "#00FF87",
      secondaryColor: "#60A5FA",
      bandCount: 9,
      flowSpeed: 0.35,
      waveAmplitude: 0.7,
      glowIntensity: 0.75,
    },
    category: "Nature",
    description: "Soft flowing aurora bands with gentle gradients and atmospheric depth",
  },
  {
    id: "GeometricPulse",
    component: GeometricPulse,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: GeometricPulsePropsSchema,
    defaultProps: {
      primaryColor: "#FF4D8D",
      secondaryColor: "#FFD166",
      shapeCount: 200,
      pulseSpeed: 0.5,
      rotationSpeed: 0.4,
      glowIntensity: 0.75,
    },
    category: "Abstract",
    description: "Pulsing geometric shapes with rotation, glow halos, and star particles",
  },
  {
    id: "FluidGradientWaves-Professional-1",
    component: FluidGradientWaves,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: FluidGradientWavesPropsSchema,
    defaultProps: {
      waveCount: 12,
      flowSpeed: 0.4,
      colorShift: 0.3,
      amplitude: 0.7,
      primaryColor: "#FF6B6B",
      secondaryColor: "#A855F7",
      tertiaryColor: "#14B8A6",
      backgroundColor: "#0F172A",
      glowIntensity: 0.8,
    },
    category: "Abstract",
    description: "Smooth organic color gradients flowing like liquid silk",
  },
  {
    id: "NeonGridTunnel-Professional-1",
    component: NeonGridTunnel,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: NeonGridTunnelPropsSchema,
    defaultProps: {
      gridSize: 30,
      flightSpeed: 0.8,
      scanLineCount: 8,
      pulseIntensity: 0.6,
      primaryColor: "#FF2A6D",
      secondaryColor: "#00F0FF",
      backgroundColor: "#0A0A1A",
      lineWidth: 2,
      glowIntensity: 0.9,
    },
    category: "Synthwave",
    description: "Endless perspective grid flying toward viewer with neon scan lines",
  },
  {
    id: "AuroraBorealis-Professional-1",
    component: AuroraBorealis,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: AuroraBorealisPropsSchema,
    defaultProps: {
      curtainCount: 15,
      waveSpeed: 0.4,
      starDensity: 200,
      colorShift: 0.3,
      primaryColor: "#00FF87",
      secondaryColor: "#60A5FA",
      tertiaryColor: "#A855F7",
      backgroundColor: "#0F172A",
      glowIntensity: 0.8,
    },
    category: "Nature",
    description: "Northern lights curtains dancing across starry night sky",
  },
  {
    id: "PlasmaVortex-Professional-1",
    component: PlasmaVortex,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: PlasmaVortexPropsSchema,
    defaultProps: {
      particleCount: 1500,
      vortexSpeed: 0.6,
      spiralStrength: 0.8,
      coreGlow: 0.9,
      trailLength: 0.6,
      primaryColor: "#FF8C00",
      secondaryColor: "#FF0080",
      backgroundColor: "#0A0A1A",
      glowIntensity: 0.9,
    },
    category: "Energy",
    description: "Hypnotic particle vortex with glowing core and trailing streaks",
  },
  {
    id: "MirrorChrome-Professional-1",
    component: MirrorChrome,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: MirrorChromePropsSchema,
    defaultProps: {
      rippleCount: 24,
      flowSpeed: 0.4,
      waveAmplitude: 0.6,
      metallicShine: 0.8,
      primaryColor: "#00F0FF",
      secondaryColor: "#FF2A6D",
      backgroundColor: "#0A0A1A",
      glowIntensity: 0.8,
    },
    category: "Abstract",
    description: "Flowing metallic liquid surface with neon reflections and ripples",
  },
  {
    id: "HyperspaceRush-Professional-1",
    component: HyperspaceRush,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: HyperspaceRushPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      streakCount: 420,
      starDensity: 320,
      pulseSpeed: 0.7,
      glowIntensity: 0.9,
    },
    category: "Sci-Fi",
    description: "First-person hyperspace jump through radiant warp streaks and energy rings",
  },
  {
    id: "PrismaticShatter-Professional-1",
    component: PrismaticShatter,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: PrismaticShatterPropsSchema,
    defaultProps: {
      primaryColor: "#FF00FF",
      secondaryColor: "#00F0FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      shardCount: 160,
      spinSpeed: 0.4,
      dispersion: 0.8,
      glowIntensity: 0.85,
      fractureDensity: 3,
    },
    category: "Abstract",
    description: "Geometric shards bursting with prismatic dispersion and chromatic flares",
  },
  {
    id: "CosmicWeb-Professional-1",
    component: CosmicWeb,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: CosmicWebGLPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      nodeCount: 80,
      edgeDensity: 2.2,
      flowSpeed: 0.5,
      rotationSpeed: 0.25,
      glowIntensity: 0.85,
    },
    category: "Space",
    description: "Rotating 3D cosmic filament web with flowing luminous nodes",
  },
  {
    id: "NeuralRain-Professional-1",
    component: NeuralRain,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: NeuralRainPropsSchema,
    defaultProps: {
      primaryColor: "#00FF80",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#00F0FF",
      backgroundColor: "#050014",
      columnCount: 80,
      maxDepth: 5,
      fallSpeed: 0.85,
      glyphCount: 92,
      glowIntensity: 0.9,
    },
    category: "Cyberpunk",
    description: "3D parallax neon rain with depth layers and ground reflection",
  },
  {
    id: "PlasmaArcField-Professional-1",
    component: PlasmaArcField,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: PlasmaArcFieldPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#02000A",
      nodeCount: 70,
      sparkDensity: 180,
      pulseSpeed: 0.6,
      glowIntensity: 0.95,
    },
    category: "Energy",
    description: "Crackling plasma arcs and electric field lines between charged nodes",
  },
  {
    id: "LissajousResonance-Professional-1",
    component: LissajousResonance,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: LissajousResonancePropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      gridCols: 11,
      gridRows: 7,
      linkRadius: 48,
      freqSpread: 3,
      glowIntensity: 0.85,
    },
    category: "Geometry",
    description: "Resonating lattice of points on integer-frequency Lissajous orbits",
  },
  {
    id: "KineticGears-Professional-1",
    component: KineticGears,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: KineticGearsPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      gearCount: 4,
      teethSharpness: 8,
      rotationSpeed: 2,
      trailLength: 34,
      glowIntensity: 0.9,
    },
    category: "Mechanical",
    description: "Interlocking rotating gears with light trails and connecting beams",
  },
  {
    id: "SpirographBloom-Professional-1",
    component: SpirographBloom,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: SpirographBloomPropsSchema,
    defaultProps: {
      primaryColor: "#FF00FF",
      secondaryColor: "#00F0FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      lobeCount: 5,
      ratioSpread: 4,
      swirlSpeed: 1,
      glowIntensity: 0.85,
    },
    category: "Abstract",
    description: "Nested integer-ratio rosettes blooming with traveling nodes",
  },
  {
    id: "HexagonFlow-Professional-1",
    component: HexagonFlow,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: HexagonFlowPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      hexSize: 72,
      waveSpeed: 0.6,
      colorShift: 0.4,
      flowIntensity: 0.8,
      glowIntensity: 0.85,
    },
    category: "Geometry",
    description: "Tessellated hex grid flowing with traveling waves and hue shifts",
  },
  {
    id: "OrbitalResonance-Professional-1",
    component: OrbitalResonance,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: OrbitalResonancePropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      bodyCount: 6,
      resonance: 2,
      trailLength: 24,
      orbitTilt: 0.6,
      glowIntensity: 0.9,
    },
    category: "Space",
    description: "Coupled integer-frequency orbital bodies with trails and resonance slingshots",
  },
  // Episode 11: Fluid plasma - layered color gratings
  {
    id: "PlasmaFlux-Professional-2",
    component: PlasmaFlux,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: PlasmaFluxPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      bandCount: 6,
      speed: 0.55,
      hueCycles: 1,
      glowIntensity: 0.75,
    },
    category: "Plasma",
    description: "Additive color grating plasma with shifting hue bands",
  },
  // Episode 12: Interference - radial wave lattice
  {
    id: "WaveLattice-Professional-2",
    component: WaveLattice,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: WaveLatticePropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      focusCount: 6,
      hueCycles: 1,
      glowIntensity: 0.8,
    },
    category: "Interference",
    description: "Concentric ring waves from moving foci with chromatic overlap",
  },
  // Episode 13: Swirl - rotating spiral arms
  {
    id: "ChromaSwirl-Professional-2",
    component: ChromaSwirl,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: ChromaSwirlPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      armCount: 8,
      swirlTurns: 3,
      pointCount: 180,
      rotationSpeed: 2,
      hueCycles: 1,
      glowIntensity: 0.8,
    },
    category: "Motion",
    description: "Spinning spiral arms with periodic full rotations and hue drift",
  },
  // Episode 14: Grid glide - sliding cells
  {
    id: "PixelGlide-Professional-2",
    component: PixelGlide,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: PixelGlidePropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      cols: 44,
      rows: 24,
      amplitude: 30,
      hueCycles: 1,
      glowIntensity: 0.8,
    },
    category: "Geometry",
    description: "Phase-shifted grid cells pulsing and sliding in sync over the cycle",
  },
  // Episode 15: Curtains - layered sine waves
  {
    id: "LuminousVeil-Professional-2",
    component: LuminousVeil,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: LuminousVeilPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      curtainCount: 5,
      hueCycles: 1,
      glowIntensity: 0.8,
    },
    category: "Flow",
    description: "Stack of sine wave curtains sweeping with shifting color bands",
  },
  // Episode 16: Vector field flow
  {
    id: "VectorFieldFlow-Professional-3",
    component: VectorFieldFlow,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: VectorFieldFlowPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      cols: 72,
      rows: 32,
      fieldFreq: 1,
      hueCycles: 1,
      glowIntensity: 0.7,
    },
    category: "Vector Field",
    description: "2D curl advection field of oriented segments streaming with hue drift",
  },
  // Episode 17: Kaleidoscopic grid
  {
    id: "KaleidoGrid-Professional-3",
    component: KaleidoGrid,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: KaleidoGridPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      symmetry: 12,
      ringCount: 14,
      rotationSpeed: 2,
      hueCycles: 1,
      glowIntensity: 0.8,
    },
    category: "Geometry",
    description: "Rotating mirrored sector replicated by symmetry into a living mandala",
  },
  // Episode 18: Matrix cascade
  {
    id: "MatrixCascade-Professional-3",
    component: MatrixCascade,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: MatrixCascadePropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#050014",
      cols: 56,
      rows: 64,
      trail: 0.45,
      baseSpeed: 2,
      hueCycles: 1,
      glowIntensity: 0.85,
    },
    category: "Data",
    description: "Phase-shifted columns streaming downward in a periodic cascade river",
  },
  // Episode 19: Prism vault
  {
    id: "PrismVault-Professional-3",
    component: PrismVault,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: PrismVaultPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      ringCount: 16,
      baseSides: 3,
      rotationSpeed: 2,
      hueCycles: 1,
      glowIntensity: 0.8,
      breathAmp: 0.15,
    },
    category: "Geometry",
    description: "Nested integer-sided polygons breathing and rotating in harmonic layers",
  },
  // Episode 20: Lattice tunnel
  {
    id: "LatticeTunnel-Professional-3",
    component: LatticeTunnel,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: LatticeTunnelPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      gridSize: 18,
      depth: 22,
      scrollSpeed: 1,
      hueCycles: 1,
      glowIntensity: 0.8,
    },
    category: "Motion",
    description: "Perspective 3D lattice grid scrolling forward with depth-tinted hue",
  },
  // Episode 21: Vortex weave
  {
    id: "VortexWeave-Professional-4",
    component: VortexWeave,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: VortexWeavePropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      armCount: 11,
      turns: 4,
      pointCount: 120,
      rotationSpeed: 2,
      hueCycles: 1,
      glowIntensity: 0.8,
    },
    category: "Motion",
    description: "Layered logarithmic spirals rotating in harmonic integer phase",
  },
  // Episode 22: Glitch terrain
  {
    id: "GlitchTerrain-Professional-4",
    component: GlitchTerrain,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: GlitchTerrainPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      bandCount: 48,
      glitchAmp: 96,
      hueCycles: 1,
      glowIntensity: 0.8,
    },
    category: "Data",
    description: "Sinusoidally shifting color bands forming a seamless glitch water surface",
  },
  // Episode 23: Neon circuit
  {
    id: "NeonCircuit-Professional-4",
    component: NeonCircuit,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: NeonCircuitPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#050014",
      cols: 22,
      rows: 16,
      hueCycles: 1,
      glowIntensity: 0.8,
      pulseSpeed: 1,
    },
    category: "Geometry",
    description: "Node grid with a traveling pulse light along a serpentine circuit path",
  },
  // Episode 24: Chroma rings
  {
    id: "ChromaRings-Professional-4",
    component: ChromaRings,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: ChromaRingsPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      ringCount: 22,
      hueCycles: 1,
      glowIntensity: 0.8,
      breathAmp: 0.12,
    },
    category: "Geometry",
    description: "Concentric rings breathing and sweeping hue in layered bands",
  },
  // Episode 25: Prismatic ribbons
  {
    id: "PrismaticRibbons-Professional-4",
    component: PrismaticRibbons,
    durationInFrames: 900,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: PrismaticRibbonsPropsSchema,
    defaultProps: {
      primaryColor: "#00F0FF",
      secondaryColor: "#FF00FF",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      ribbonCount: 9,
      points: 90,
      rotationSpeed: 2,
      hueCycles: 1,
      glowIntensity: 0.8,
      fov: 520,
      depthSpan: 720,
    },
    category: "Motion",
    description: "Perspective 3D sine ribbons rotating in layered depth",
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
