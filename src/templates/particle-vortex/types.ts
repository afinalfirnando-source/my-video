import { z } from "zod";

export const ParticleVortexPropsSchema = z.object({
  primaryColor: z.string().default("#FF8C00"),
  secondaryColor: z.string().default("#FF0080"),
  particleCount: z.number().default(900),
  vortexSpeed: z.number().default(0.6),
  spiralStrength: z.number().default(0.8),
  coreGlow: z.number().default(0.9),
});

export type ParticleVortexProps = z.infer<typeof ParticleVortexPropsSchema>;
