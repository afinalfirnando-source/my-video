import { z } from "zod";

export const GlitchTerrainPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  bandCount: z.number().default(48),
  glitchAmp: z.number().default(96),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
});

export type GlitchTerrainProps = z.infer<typeof GlitchTerrainPropsSchema>;
