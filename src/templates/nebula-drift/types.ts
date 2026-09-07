import { z } from "zod";

export const NebulaDriftPropsSchema = z.object({
  primaryColor: z.string().default("#8A2BE2"),
  secondaryColor: z.string().default("#00F0FF"),
  tertiaryColor: z.string().default("#FF69B4"),
  swirlIntensity: z.number().default(0.8),
  particleDensity: z.number().default(300),
  glowIntensity: z.number().default(0.7),
  layerSpeed: z.number().default(0.6),
});

export type NebulaDriftProps = z.infer<typeof NebulaDriftPropsSchema>;
