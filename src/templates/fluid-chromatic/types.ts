import { z } from "zod";

export const FluidChromaticPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  flowSpeed: z.number().default(0.5),
  turbulence: z.number().default(0.8),
  opacity: z.number().default(0.4),
});

export type FluidChromaticProps = z.infer<typeof FluidChromaticPropsSchema>;
