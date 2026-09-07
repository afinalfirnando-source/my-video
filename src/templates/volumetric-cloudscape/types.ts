import { z } from "zod";

export const VolumetricCloudscapePropsSchema = z.object({
  skyTopColor: z.string().default("#001133"),
  skyBottomColor: z.string().default("#002266"),
  cloudColor: z.string().default("#FFFFFF"),
  sunColor: z.string().default("#FFD700"),
  cloudDensity: z.number().default(0.7),
  sunIntensity: z.number().default(0.8),
  rayCount: z.number().default(12),
  windSpeed: z.number().default(0.3),
  layerCount: z.number().default(3),
});

export type VolumetricCloudscapeProps = z.infer<typeof VolumetricCloudscapePropsSchema>;
