import { z } from "zod";

export const DigitalAuroraPropsSchema = z.object({
  primaryColor: z.string().default("#00FF00"),
  secondaryColor: z.string().default("#00FFFF"),
  tertiaryColor: z.string().default("#FF00FF"),
  auroraIntensity: z.number().default(0.8),
  curtainCount: z.number().default(15),
  interferenceIntensity: z.number().default(0.6),
  starDensity: z.number().default(200),
  waveSpeed: z.number().default(0.5),
});

export type DigitalAuroraProps = z.infer<typeof DigitalAuroraPropsSchema>;
