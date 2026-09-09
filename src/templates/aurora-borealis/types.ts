import { z } from "zod";

export const AuroraBorealisPropsSchema = z.object({
  curtainCount: z.number().default(15),
  waveSpeed: z.number().default(0.4),
  starDensity: z.number().default(200),
  colorShift: z.number().default(0.3),
  primaryColor: z.string().default("#00FF87"),
  secondaryColor: z.string().default("#60A5FA"),
  tertiaryColor: z.string().default("#A855F7"),
  backgroundColor: z.string().default("#0F172A"),
  glowIntensity: z.number().default(0.8),
});

export type AuroraBorealisProps = z.infer<typeof AuroraBorealisPropsSchema>;
