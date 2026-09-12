import { z } from "zod";

export const LiquidChromePropsSchema = z.object({
  primaryColor: z.string().default("#E2E8F0"),
  secondaryColor: z.string().default("#00F0FF"),
  tertiaryColor: z.string().default("#FF2A6D"),
  backgroundColor: z.string().default("#0A0A1A"),
  rippleCount: z.number().int().min(3).max(15).default(6),
  flowSpeed: z.number().min(0.1).max(3).default(1),
  waveAmplitude: z.number().min(0.1).max(2).default(1),
  metallicShine: z.number().min(0).max(1).default(0.8),
  glowIntensity: z.number().min(0).max(1).default(0.8),
});

export type LiquidChromeProps = z.infer<typeof LiquidChromePropsSchema>;
