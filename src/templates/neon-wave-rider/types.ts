import { z } from "zod";

export const NeonWaveRiderPropsSchema = z.object({
  primaryColor: z.string().default("#FF2A6D"),
  secondaryColor: z.string().default("#05FFA1"),
  waveCount: z.number().default(10),
  waveSpeed: z.number().default(0.5),
  waveAmplitude: z.number().default(0.7),
  glowIntensity: z.number().default(0.8),
  trailLength: z.number().default(0.6),
});

export type NeonWaveRiderProps = z.infer<typeof NeonWaveRiderPropsSchema>;
