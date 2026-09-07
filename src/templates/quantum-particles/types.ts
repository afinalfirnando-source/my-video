import { z } from "zod";

export const QuantumParticlesPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  particleCount: z.number().default(150),
  particleSize: z.number().default(3),
  glowIntensity: z.number().default(0.8),
  connectionDistance: z.number().default(120),
  driftSpeed: z.number().default(0.5),
});

export type QuantumParticlesProps = z.infer<typeof QuantumParticlesPropsSchema>;
