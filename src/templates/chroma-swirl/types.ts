import { z } from "zod";

export const ChromaSwirlPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  armCount: z.number().default(8),
  swirlTurns: z.number().default(3),
  pointCount: z.number().default(260),
  rotationSpeed: z.number().default(2),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
});

export type ChromaSwirlProps = z.infer<typeof ChromaSwirlPropsSchema>;
