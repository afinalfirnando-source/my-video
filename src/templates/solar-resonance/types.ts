import { z } from "zod";

export const SolarResonancePropsSchema = z.object({
  orbitSpeed: z.number().default(1.0),
  resonanceFrequency: z.number().default(1.0),
  lightIntensity: z.number().default(1.0),
});

export type SolarResonanceProps = z.infer<typeof SolarResonancePropsSchema>;
