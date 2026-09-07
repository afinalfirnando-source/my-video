// Original Root.tsx with 5 background seamless loops
import { Composition } from "remotion";
import { LuminescentCurrents } from "./templates/luminescent-currents/index.tsx";
import { NeuralPulse } from "./templates/neural-pulse/index.tsx";
import { MolecularCascade } from "./templates/molecular-cascade/index.tsx";
import { SolarResonance } from "./templates/solar-resonance/index.tsx";
import { UrbanFlow } from "./templates/urban-flow/index.tsx";

import { LuminescentCurrentsPropsSchema } from "./templates/luminescent-currents/types.ts";
import { NeuralPulsePropsSchema } from "./templates/neural-pulse/types.ts";
import { MolecularCascadePropsSchema } from "./templates/molecular-cascade/types.ts";
import { SolarResonancePropsSchema } from "./templates/solar-resonance/types.ts";
import { UrbanFlowPropsSchema } from "./templates/urban-flow/types.ts";

// Background seamless loop configurations
const backgroundLoops = [
  // 1. Luminescent Currents - Energy flow abstraction
  {
    id: "LuminescentCurrents-Professional-1",
    component: LuminescentCurrents,
    durationInFrames: 240,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: LuminescentCurrentsPropsSchema,
    defaultProps: {
      flowSpeed: 0.8,
      intensity: 0.9,
      colorMode: "cyan" as const,
    },
    category: "Energy Flow",
  },
  // 2. Neural Pulse - Consciousness visualization
  {
    id: "NeuralPulse-Professional-1",
    component: NeuralPulse,
    durationInFrames: 180,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: NeuralPulsePropsSchema,
    defaultProps: {
      pulseIntensity: 1.0,
      nodeDensity: 1.2,
      connectionStrength: 0.6,
    },
    category: "Neural",
  },
  // 3. Molecular Cascade - Particle physics
  {
    id: "MolecularCascade-Professional-1",
    component: MolecularCascade,
    durationInFrames: 300,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: MolecularCascadePropsSchema,
    defaultProps: {
      moleculeSpeed: 1.2,
      emissionRate: 0.8,
      energyLevel: 1.0,
    },
    category: "Molecular",
  },
  // 4. Solar Resonance - Celestial harmonics
  {
    id: "SolarResonance-Professional-1",
    component: SolarResonance,
    durationInFrames: 240,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: SolarResonancePropsSchema,
    defaultProps: {
      orbitSpeed: 1.0,
      resonanceFrequency: 1.2,
      lightIntensity: 0.9,
    },
    category: "Celestial",
  },
  // 5. Urban Flow - Digital network
  {
    id: "UrbanFlow-Professional-1",
    component: UrbanFlow,
    durationInFrames: 216,
    fps: 60,
    width: 3840,
    height: 2160,
    schema: UrbanFlowPropsSchema,
    defaultProps: {
      flowVelocity: 1.1,
      gridDensity: 0.9,
      neonIntensity: 1.0,
    },
    category: "Urban",
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {backgroundLoops.map((loop) => (
        <Composition
          key={loop.id}
          id={loop.id}
          component={loop.component}
          durationInFrames={loop.durationInFrames}
          fps={loop.fps}
          width={loop.width}
          height={loop.height}
          schema={loop.schema}
          defaultProps={loop.defaultProps as any}
        />
      ))}
    </>
  );
};
