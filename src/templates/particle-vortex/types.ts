import { z } from "zod";

export const ParticleVortexPropsSchema = z.object({
  primaryColor: z.string().default("#FF8C00"),
  secondaryColor: z.string().default("#FF0080"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  particleCount: z.number().int().min(100).max(2000).default(500),
  vortexSpeed: z.number().min(0.1).max(3).default(1),
  spiralStrength: z.number().min(0.5).max(3).default(1.5),
  coreGlow: z.number().min(0).max(1).default(0.9),
  trailLength: z.number().min(0.5).max(3).default(1),
  glowIntensity: z.number().min(0).max(1).default(0.8),
});

export type ParticleVortexProps = z.infer<typeof ParticleVortexPropsSchema>;
