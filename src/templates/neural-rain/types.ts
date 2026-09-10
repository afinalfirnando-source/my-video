import { z } from "zod";

export const NeuralRainPropsSchema = z.object({
  primaryColor: z.string().default("#00FF80"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#00F0FF"),
  backgroundColor: z.string().default("#050014"),
  columnCount: z.number().default(110),
  maxDepth: z.number().default(5),
  fallSpeed: z.number().default(0.85),
  glyphCount: z.number().default(92),
  glowIntensity: z.number().default(0.9),
});

export type NeuralRainProps = z.infer<typeof NeuralRainPropsSchema>;
