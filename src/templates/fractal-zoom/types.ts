import { z } from "zod";

export const FractalZoomPropsSchema = z.object({
  colorScheme: z.string().default("fire"),
  zoomSpeed: z.number().default(1.0),
  maxIterations: z.number().default(100),
  intensity: z.number().default(0.8),
  fractalType: z.enum(["mandelbrot", "julia"]).default("mandelbrot"),
  backgroundColor: z.string().default("#000000"),
});

export type FractalZoomProps = z.infer<typeof FractalZoomPropsSchema>;
