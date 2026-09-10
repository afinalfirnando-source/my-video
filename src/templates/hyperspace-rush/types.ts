import { z } from "zod";

export const HyperspaceRushPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  streakCount: z.number().default(420),
  starDensity: z.number().default(320),
  pulseSpeed: z.number().default(0.7),
  glowIntensity: z.number().default(0.9),
});

export type HyperspaceRushProps = z.infer<typeof HyperspaceRushPropsSchema>;
