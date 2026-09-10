import { z } from "zod";

export const MirrorChromePropsSchema = z.object({
  rippleCount: z.number().default(24),
  flowSpeed: z.number().default(0.4),
  waveAmplitude: z.number().default(0.6),
  metallicShine: z.number().default(0.8),
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF2A6D"),
  backgroundColor: z.string().default("#0A0A1A"),
  glowIntensity: z.number().default(0.8),
});

export type MirrorChromeProps = z.infer<typeof MirrorChromePropsSchema>;
