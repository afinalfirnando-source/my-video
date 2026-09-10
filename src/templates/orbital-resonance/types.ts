import { z } from "zod";

export const OrbitalResonancePropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  bodyCount: z.number().default(6),
  resonance: z.number().default(2),
  trailLength: z.number().default(24),
  orbitTilt: z.number().default(0.6),
  glowIntensity: z.number().default(0.9),
});

export type OrbitalResonanceProps = z.infer<typeof OrbitalResonancePropsSchema>;
