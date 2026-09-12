import { z } from "zod";

export const FluidGradientWavesPropsSchema = z.object({
  primaryColor: z.string().default("#FF6B6B"),
  secondaryColor: z.string().default("#A855F7"),
  tertiaryColor: z.string().default("#14B8A6"),
  backgroundColor: z.string().default("#0F172A"),
  waveCount: z.number().int().min(2).max(10).default(5),
  flowSpeed: z.number().min(0.1).max(3).default(1),
  amplitude: z.number().min(0.1).max(2).default(1),
  glowIntensity: z.number().min(0).max(1).default(0.8),
});

export type FluidGradientWavesProps = z.infer<typeof FluidGradientWavesPropsSchema>;
