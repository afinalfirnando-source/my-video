import { z } from "zod";

export const NeonCircuitPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#050014"),
  cols: z.number().default(22),
  rows: z.number().default(16),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
  pulseSpeed: z.number().default(1),
});

export type NeonCircuitProps = z.infer<typeof NeonCircuitPropsSchema>;
