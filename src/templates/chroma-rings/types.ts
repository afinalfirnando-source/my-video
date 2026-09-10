import { z } from "zod";

export const ChromaRingsPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  ringCount: z.number().default(22),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
  breathAmp: z.number().default(0.12),
});

export type ChromaRingsProps = z.infer<typeof ChromaRingsPropsSchema>;
