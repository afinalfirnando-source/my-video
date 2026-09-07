import { z } from "zod";

export const HyperbolicTilingPropsSchema = z.object({
  primaryColor: z.string().default("#8A2BE2"),
  secondaryColor: z.string().default("#00F0FF"),
  tertiaryColor: z.string().default("#FF69B4"),
  rotationSpeed: z.number().default(0.3),
  zoomSpeed: z.number().default(0.2),
  tileDensity: z.number().default(7),
  glowIntensity: z.number().default(0.8),
  colorShift: z.number().default(0.5),
});

export type HyperbolicTilingProps = z.infer<typeof HyperbolicTilingPropsSchema>;
