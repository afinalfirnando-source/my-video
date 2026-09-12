import { FluidGradientWavesPropsSchema } from "../templates/fluid-gradient-waves/types";
import { NeonGridTunnelPropsSchema } from "../templates/neon-grid-tunnel/types";
import { AuroraBorealisPropsSchema } from "../templates/aurora-borealis/types";
import { ParticleVortexPropsSchema } from "../templates/particle-vortex/types";
import { LiquidChromePropsSchema } from "../templates/liquid-chrome/types";
import type { ZodSchema } from "zod";

export interface TemplateRegistryEntry {
  id: string;
  compositionId: string;
  name: string;
  description: string;
  category: string;
  schema: ZodSchema<unknown>;
  defaultProps: Record<string, unknown>;
  propConstraints: PropConstraints;
}

export interface PropConstraints {
  colors: string[];
  numeric: Array<{
    name: string;
    min: number;
    max: number;
    step?: number;
    type: "int" | "float";
  }>;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  "FluidGradientWaves-001": {
    id: "FluidGradientWaves-001",
    compositionId: "FluidGradientWaves-001",
    name: "Fluid Gradient Waves",
    description: "Smooth organic color gradients flowing like liquid silk",
    category: "Abstract / Nature",
    schema: FluidGradientWavesPropsSchema,
    defaultProps: {
      primaryColor: "#FF6B6B",
      secondaryColor: "#A855F7",
      tertiaryColor: "#14B8A6",
      backgroundColor: "#0F172A",
      waveCount: 5,
      flowSpeed: 1,
      amplitude: 1,
      glowIntensity: 0.8,
    },
    propConstraints: {
      colors: ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor"],
      numeric: [
        { name: "waveCount", min: 2, max: 10, type: "int" },
        { name: "flowSpeed", min: 0.1, max: 3.0, step: 0.1, type: "float" },
        { name: "amplitude", min: 0.1, max: 2.0, step: 0.1, type: "float" },
        { name: "glowIntensity", min: 0, max: 1.0, step: 0.05, type: "float" },
      ],
    },
  },
  "NeonGridTunnel-001": {
    id: "NeonGridTunnel-001",
    compositionId: "NeonGridTunnel-001",
    name: "Neon Grid Tunnel",
    description: "Endless perspective grid flying toward viewer with neon scan lines",
    category: "Tech / Cyberpunk",
    schema: NeonGridTunnelPropsSchema,
    defaultProps: {
      primaryColor: "#FF2A6D",
      secondaryColor: "#00F0FF",
      tertiaryColor: "#7B2FFF",
      backgroundColor: "#0A0A1A",
      gridSize: 25,
      flightSpeed: 1,
      scanLineCount: 3,
      pulseIntensity: 0.8,
      glowIntensity: 0.8,
    },
    propConstraints: {
      colors: ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor"],
      numeric: [
        { name: "gridSize", min: 10, max: 50, type: "int" },
        { name: "flightSpeed", min: 0.1, max: 3.0, step: 0.1, type: "float" },
        { name: "scanLineCount", min: 1, max: 10, type: "int" },
        { name: "pulseIntensity", min: 0, max: 1.0, step: 0.05, type: "float" },
        { name: "glowIntensity", min: 0, max: 1.0, step: 0.05, type: "float" },
      ],
    },
  },
  "AuroraBorealis-001": {
    id: "AuroraBorealis-001",
    compositionId: "AuroraBorealis-001",
    name: "Aurora Borealis",
    description: "Curtains of northern lights dancing across starry night sky",
    category: "Nature / Space",
    schema: AuroraBorealisPropsSchema,
    defaultProps: {
      primaryColor: "#00FF87",
      secondaryColor: "#60A5FA",
      backgroundColor: "#0F172A",
      curtainCount: 8,
      waveSpeed: 1,
      starDensity: 200,
      glowIntensity: 0.8,
    },
    propConstraints: {
      colors: ["primaryColor", "secondaryColor", "backgroundColor"],
      numeric: [
        { name: "curtainCount", min: 3, max: 15, type: "int" },
        { name: "waveSpeed", min: 0.1, max: 3.0, step: 0.1, type: "float" },
        { name: "starDensity", min: 50, max: 500, type: "int" },
        { name: "glowIntensity", min: 0, max: 1.0, step: 0.05, type: "float" },
      ],
    },
  },
  "ParticleVortex-001": {
    id: "ParticleVortex-001",
    compositionId: "ParticleVortex-001",
    name: "Particle Vortex",
    description: "Thousands of particles spiraling into a glowing core with light trails",
    category: "Energy / Sci-Fi",
    schema: ParticleVortexPropsSchema,
    defaultProps: {
      primaryColor: "#FF8C00",
      secondaryColor: "#FF0080",
      tertiaryColor: "#FFD700",
      backgroundColor: "#0A0A1A",
      particleCount: 500,
      vortexSpeed: 1,
      spiralStrength: 1.5,
      coreGlow: 0.9,
      trailLength: 1,
      glowIntensity: 0.8,
    },
    propConstraints: {
      colors: ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor"],
      numeric: [
        { name: "particleCount", min: 100, max: 2000, step: 50, type: "int" },
        { name: "vortexSpeed", min: 0.1, max: 3.0, step: 0.1, type: "float" },
        { name: "spiralStrength", min: 0.5, max: 3.0, step: 0.1, type: "float" },
        { name: "coreGlow", min: 0, max: 1.0, step: 0.05, type: "float" },
        { name: "trailLength", min: 0.5, max: 3.0, step: 0.1, type: "float" },
        { name: "glowIntensity", min: 0, max: 1.0, step: 0.05, type: "float" },
      ],
    },
  },
  "LiquidChrome-001": {
    id: "LiquidChrome-001",
    compositionId: "LiquidChrome-001",
    name: "Liquid Chrome",
    description: "Flowing metallic liquid surface with neon reflections and ripples",
    category: "Abstract / Premium",
    schema: LiquidChromePropsSchema,
    defaultProps: {
      primaryColor: "#E2E8F0",
      secondaryColor: "#00F0FF",
      tertiaryColor: "#FF2A6D",
      backgroundColor: "#0A0A1A",
      rippleCount: 6,
      flowSpeed: 1,
      waveAmplitude: 1,
      metallicShine: 0.8,
      glowIntensity: 0.8,
    },
    propConstraints: {
      colors: ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor"],
      numeric: [
        { name: "rippleCount", min: 3, max: 15, type: "int" },
        { name: "flowSpeed", min: 0.1, max: 3.0, step: 0.1, type: "float" },
        { name: "waveAmplitude", min: 0.1, max: 2.0, step: 0.1, type: "float" },
        { name: "metallicShine", min: 0, max: 1.0, step: 0.05, type: "float" },
        { name: "glowIntensity", min: 0, max: 1.0, step: 0.05, type: "float" },
      ],
    },
  },
};

export const getAllTemplates = (): TemplateRegistryEntry[] =>
  Object.values(TEMPLATE_REGISTRY);

export const getTemplate = (id: string): TemplateRegistryEntry | undefined =>
  TEMPLATE_REGISTRY[id];

export interface JobSpec {
  jobId: string;
  compositionId: string;
  templateId: string;
  variantNumber: number;
  props: Record<string, unknown>;
  conceptTitle: string;
  conceptTheme: string;
  pond5Keywords: string[];
  pond5Description: string;
  timestamp: string;
}

export const POND5_CATEGORIES = [
  "Abstract",
  "Backgrounds",
  "Digital",
  "Data",
  "Science",
  "Nature",
  "Technology",
  "Business",
  "Entertainment",
  "Graphics",
] as const;
