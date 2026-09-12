import { z } from "zod";

export const AuroraBorealisPropsSchema = z.object({
  primaryColor: z.string().default("#00FF87"),
  secondaryColor: z.string().default("#60A5FA"),
  backgroundColor: z.string().default("#0F172A"),
  curtainCount: z.number().int().min(3).max(15).default(8),
  waveSpeed: z.number().min(0.1).max(3).default(1),
  starDensity: z.number().int().min(50).max(500).default(200),
  glowIntensity: z.number().min(0).max(1).default(0.8),
});

export type AuroraBorealisProps = z.infer<typeof AuroraBorealisPropsSchema>;
