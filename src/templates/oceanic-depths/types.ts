import { z } from "zod";

export const OceanicDepthsPropsSchema = z.object({
  waterColor: z.string().default("#1E3A8A"),
  lightColor: z.string().default("#FFFFFF"),
  bioluminescentColor: z.string().default("#00F0FF"),
  causticIntensity: z.number().default(0.8),
  bubbleCount: z.number().default(200),
  particleDensity: z.number().default(200),
  currentSpeed: z.number().default(0.5),
});

export type OceanicDepthsProps = z.infer<typeof OceanicDepthsPropsSchema>;
