import { z } from "zod";

export const FluidChromaticPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  flowSpeed: z.number().default(0.8),
  turbulence: z.number().default(1),
  opacity: z.number().default(0.6),
  particleCount: z.number().default(100),
  waveCount: z.number().default(6),
});

export type FluidChromaticProps = z.infer<typeof FluidChromaticPropsSchema>;
