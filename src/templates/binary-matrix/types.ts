import { z } from "zod";

export const BinaryMatrixPropsSchema = z.object({
  textColor: z.string().default("#00FF88"),
  backgroundColor: z.string().default("#000000"),
  rainDensity: z.number().default(1),
  speed: z.number().default(1),
  fontSize: z.number().default(20),
  glowIntensity: z.number().default(1),
  characterSet: z.string().default("0123456789ABCDEF"),
  secondaryColor: z.string().default("#00F0FF"),
});

export type BinaryMatrixProps = z.infer<typeof BinaryMatrixPropsSchema>;
