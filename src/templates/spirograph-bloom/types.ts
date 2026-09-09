import { z } from "zod";

export const SpirographBloomPropsSchema = z.object({
  primaryColor: z.string().default("#FF00FF"),
  secondaryColor: z.string().default("#00F0FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  lobeCount: z.number().default(5),
  ratioSpread: z.number().default(4),
  swirlSpeed: z.number().default(1),
  glowIntensity: z.number().default(0.85),
});

export type SpirographBloomProps = z.infer<typeof SpirographBloomPropsSchema>;
