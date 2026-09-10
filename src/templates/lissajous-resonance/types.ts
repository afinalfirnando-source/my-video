import { z } from "zod";

export const LissajousResonancePropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  gridCols: z.number().default(11),
  gridRows: z.number().default(7),
  linkRadius: z.number().default(48),
  freqSpread: z.number().default(3),
  glowIntensity: z.number().default(0.85),
});

export type LissajousResonanceProps = z.infer<
  typeof LissajousResonancePropsSchema
>;
