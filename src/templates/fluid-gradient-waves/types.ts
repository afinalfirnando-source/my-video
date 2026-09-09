import { z } from "zod";

export const FluidGradientWavesPropsSchema = z.object({
  waveCount: z.number().default(12),
  flowSpeed: z.number().default(0.4),
  colorShift: z.number().default(0.3),
  amplitude: z.number().default(0.7),
  primaryColor: z.string().default("#FF6B6B"),
  secondaryColor: z.string().default("#A855F7"),
  tertiaryColor: z.string().default("#14B8A6"),
  backgroundColor: z.string().default("#0F172A"),
  glowIntensity: z.number().default(0.8),
});

export type FluidGradientWavesProps = z.infer<typeof FluidGradientWavesPropsSchema>;
