import { z } from "zod";

export const PrismaticRibbonsPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  ribbonCount: z.number().default(6),
  points: z.number().default(72),
  rotationSpeed: z.number().default(2),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
  fov: z.number().default(520),
  depthSpan: z.number().default(720),
});

export type PrismaticRibbonsProps = z.infer<typeof PrismaticRibbonsPropsSchema>;
