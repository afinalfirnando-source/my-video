import { z } from "zod";

export const LiquidChromePropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  rippleCount: z.number().default(24),
  flowSpeed: z.number().default(0.4),
  waveAmplitude: z.number().default(0.6),
  metallicShine: z.number().default(0.8),
});

export type LiquidChromeProps = z.infer<typeof LiquidChromePropsSchema>;
