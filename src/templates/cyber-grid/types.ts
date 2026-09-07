import { z } from "zod";

export const CyberGridPropsSchema = z.object({
  gridColor: z.string().default("#00F0FF"),
  scanLineColor: z.string().default("#FF00FF"),
  backgroundColor: z.string().default("#000000"),
  gridSize: z.number().default(25),
  scanSpeed: z.number().default(0.5),
  glitchIntensity: z.number().default(0.7),
  dataStreamDensity: z.number().default(100),
  fps: z.number().default(60),
});

export type CyberGridProps = z.infer<typeof CyberGridPropsSchema>;
