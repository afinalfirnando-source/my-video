import { z } from "zod";

export const GeometricGridPropsSchema = z.object({
  gridColor: z.string().default("#00F0FF"),
  backgroundColor: z.string().default("#000000"),
  gridSize: z.number().default(12),
  rotationSpeed: z.number().default(0.1),
  morphSpeed: z.number().default(0.3),
  depth: z.number().default(20),
  lineWidth: z.number().default(2),
});

export type GeometricGridProps = z.infer<typeof GeometricGridPropsSchema>;
