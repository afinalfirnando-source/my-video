import { z } from "zod";

export const QuantumFoamPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  particleDensity: z.number().default(400),
  waveIntensity: z.number().default(0.7),
  entanglementStrength: z.number().default(0.8),
  interferenceScale: z.number().default(0.5),
  glowIntensity: z.number().default(0.7),
  fieldOpacity: z.number().default(0.6),
});

export type QuantumFoamProps = z.infer<typeof QuantumFoamPropsSchema>;
