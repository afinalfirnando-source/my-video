// Root.tsx - Composition registry
import { Composition } from "remotion";
import React from "react";

// Import all templates
import { FluidGradientWaves } from "./templates/fluid-gradient-waves";
import { FluidGradientWavesPropsSchema } from "./templates/fluid-gradient-waves/types";
import { NeonGridTunnel } from "./templates/neon-grid-tunnel";
import { NeonGridTunnelPropsSchema } from "./templates/neon-grid-tunnel/types";
import { AuroraBorealis } from "./templates/aurora-borealis";
import { AuroraBorealisPropsSchema } from "./templates/aurora-borealis/types";
import { ParticleVortex } from "./templates/particle-vortex";
import { ParticleVortexPropsSchema } from "./templates/particle-vortex/types";
import { LiquidChrome } from "./templates/liquid-chrome";
import { LiquidChromePropsSchema } from "./templates/liquid-chrome/types";

// Template configuration
const CONFIG = {
  width: 3840,
  height: 2160,
  fps: 60,
  durationInFrames: 900, // 15 seconds
} as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Fluid Gradient Waves */}
      <Composition
        id="FluidGradientWaves-001"
        component={FluidGradientWaves}
        durationInFrames={CONFIG.durationInFrames}
        fps={CONFIG.fps}
        width={CONFIG.width}
        height={CONFIG.height}
        schema={FluidGradientWavesPropsSchema}
        defaultProps={{
          primaryColor: "#FF6B6B",
          secondaryColor: "#A855F7",
          tertiaryColor: "#14B8A6",
          backgroundColor: "#0F172A",
          waveCount: 5,
          flowSpeed: 1,
          amplitude: 1,
          glowIntensity: 0.8,
        }}
      />

      {/* Neon Grid Tunnel */}
      <Composition
        id="NeonGridTunnel-001"
        component={NeonGridTunnel}
        durationInFrames={CONFIG.durationInFrames}
        fps={CONFIG.fps}
        width={CONFIG.width}
        height={CONFIG.height}
        schema={NeonGridTunnelPropsSchema}
        defaultProps={{
          primaryColor: "#FF2A6D",
          secondaryColor: "#00F0FF",
          tertiaryColor: "#7B2FFF",
          backgroundColor: "#0A0A1A",
          gridSize: 25,
          flightSpeed: 1,
          scanLineCount: 3,
          pulseIntensity: 0.8,
          glowIntensity: 0.8,
        }}
      />

      {/* Aurora Borealis */}
      <Composition
        id="AuroraBorealis-001"
        component={AuroraBorealis}
        durationInFrames={CONFIG.durationInFrames}
        fps={CONFIG.fps}
        width={CONFIG.width}
        height={CONFIG.height}
        schema={AuroraBorealisPropsSchema}
        defaultProps={{
          primaryColor: "#00FF87",
          secondaryColor: "#60A5FA",
          backgroundColor: "#0F172A",
          curtainCount: 8,
          waveSpeed: 1,
          starDensity: 200,
          glowIntensity: 0.8,
        }}
      />

      {/* Particle Vortex */}
      <Composition
        id="ParticleVortex-001"
        component={ParticleVortex}
        durationInFrames={CONFIG.durationInFrames}
        fps={CONFIG.fps}
        width={CONFIG.width}
        height={CONFIG.height}
        schema={ParticleVortexPropsSchema}
        defaultProps={{
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
        }}
      />

      {/* Liquid Chrome */}
      <Composition
        id="LiquidChrome-001"
        component={LiquidChrome}
        durationInFrames={CONFIG.durationInFrames}
        fps={CONFIG.fps}
        width={CONFIG.width}
        height={CONFIG.height}
        schema={LiquidChromePropsSchema}
        defaultProps={{
          primaryColor: "#E2E8F0",
          secondaryColor: "#00F0FF",
          tertiaryColor: "#FF2A6D",
          backgroundColor: "#0A0A1A",
          rippleCount: 6,
          flowSpeed: 1,
          waveAmplitude: 1,
          metallicShine: 0.8,
          glowIntensity: 0.8,
        }}
      />
    </>
  );
};
