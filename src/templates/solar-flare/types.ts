import { z } from "zod";

export const SolarFlarePropsSchema = z.object({
  solarColor: z.string().default("#FFA500"),
  flareColor: z.string().default("#FF4500"),
  plasmaColor: z.string().default("#FFD700"),
  surfaceIntensity: z.number().default(0.8),
  flareCount: z.number().default(10),
  magneticLineCount: z.number().default(20),
  plasmaStreamDensity: z.number().default(100),
  rotationSpeed: z.number().default(0.3),
});

export type SolarFlareProps = z.infer<typeof SolarFlarePropsSchema>;
