import { z } from "zod";

export const GradientAuroraPropsSchema = z.object({
  primaryColor: z.string().default("#00FF87"),
  secondaryColor: z.string().default("#60A5FA"),
  bandCount: z.number().default(9),
  flowSpeed: z.number().default(0.35),
  waveAmplitude: z.number().default(0.7),
  glowIntensity: z.number().default(0.75),
});

export type GradientAuroraProps = z.infer<typeof GradientAuroraPropsSchema>;
