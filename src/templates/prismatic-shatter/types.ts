import { z } from "zod";

export const PrismaticShatterPropsSchema = z.object({
  primaryColor: z.string().default("#FF00FF"),
  secondaryColor: z.string().default("#00F0FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  shardCount: z.number().default(160),
  spinSpeed: z.number().default(0.4),
  dispersion: z.number().default(0.8),
  glowIntensity: z.number().default(0.85),
  fractureDensity: z.number().default(3),
});

export type PrismaticShatterProps = z.infer<typeof PrismaticShatterPropsSchema>;
