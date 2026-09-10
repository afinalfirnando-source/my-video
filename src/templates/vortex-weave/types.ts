import { z } from "zod";

export const VortexWeavePropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  armCount: z.number().default(11),
  turns: z.number().default(4),
  pointCount: z.number().default(120),
  rotationSpeed: z.number().default(2),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
});

export type VortexWeaveProps = z.infer<typeof VortexWeavePropsSchema>;
