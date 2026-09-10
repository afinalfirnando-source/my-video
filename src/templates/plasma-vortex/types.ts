import { z } from "zod";

export const PlasmaVortexPropsSchema = z.object({
  particleCount: z.number().default(1500),
  vortexSpeed: z.number().default(0.6),
  spiralStrength: z.number().default(0.8),
  coreGlow: z.number().default(0.9),
  trailLength: z.number().default(0.6),
  primaryColor: z.string().default("#FF8C00"),
  secondaryColor: z.string().default("#FF0080"),
  backgroundColor: z.string().default("#0A0A1A"),
  glowIntensity: z.number().default(0.9),
});

export type PlasmaVortexProps = z.infer<typeof PlasmaVortexPropsSchema>;
