import { z } from "zod";

export const QuantumFoamPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  particleDensity: z.number().default(400),
  waveIntensity: z.number().default(0.7),
  entanglementStrength: z.number().default(0.8),
  fieldOpacity: z.number().default(0.6),
  noiseLayers: z.number().default(500),
  sparkles: z.number().default(200),
});

export type QuantumFoamProps = z.infer<typeof QuantumFoamPropsSchema>;
