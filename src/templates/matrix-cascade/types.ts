import { z } from "zod";

export const MatrixCascadePropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#050014"),
  cols: z.number().default(56),
  rows: z.number().default(64),
  trail: z.number().default(0.45),
  baseSpeed: z.number().default(2),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.85),
});

export type MatrixCascadeProps = z.infer<typeof MatrixCascadePropsSchema>;
