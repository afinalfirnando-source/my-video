import { z } from "zod";

export const GeometricPulsePropsSchema = z.object({
  primaryColor: z.string().default("#FF4D8D"),
  secondaryColor: z.string().default("#FFD166"),
  shapeCount: z.number().default(28),
  pulseSpeed: z.number().default(0.5),
  rotationSpeed: z.number().default(0.4),
  glowIntensity: z.number().default(0.75),
});

export type GeometricPulseProps = z.infer<typeof GeometricPulsePropsSchema>;
