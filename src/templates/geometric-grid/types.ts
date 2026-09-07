import { z } from "zod";

export const GeometricGridPropsSchema = z.object({
  gridColor: z.string().default("#00F0FF"),
  backgroundColor: z.string().default("#000000"),
  gridSize: z.number().default(30),
  rotationSpeed: z.number().default(1),
  morphSpeed: z.number().default(1),
  depth: z.number().default(40),
  lineWidth: z.number().default(2),
  secondaryColor: z.string().default("#FF00FF"),
  pulseIntensity: z.number().default(0.5),
});

export type GeometricGridProps = z.infer<typeof GeometricGridPropsSchema>;
