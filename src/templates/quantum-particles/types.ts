import { z } from "zod";

export const QuantumParticlesPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  particleCount: z.number().default(800),
  particleSize: z.number().default(4),
  glowIntensity: z.number().default(1),
  connectionDistance: z.number().default(200),
  driftSpeed: z.number().default(0.8),
  trailIntensity: z.number().default(0.3),
});

export type QuantumParticlesProps = z.infer<typeof QuantumParticlesPropsSchema>;
