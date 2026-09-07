import { z } from "zod";

export const BinaryMatrixPropsSchema = z.object({
  textColor: z.string().default("#00FF88"),
  backgroundColor: z.string().default("#000000"),
  rainDensity: z.number().default(0.5),
  speed: z.number().default(0.8),
  fontSize: z.number().default(24),
  glowIntensity: z.number().default(0.6),
});

export type BinaryMatrixProps = z.infer<typeof BinaryMatrixPropsSchema>;
