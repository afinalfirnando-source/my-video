import { z } from "zod";

export const KineticGearsPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  gearCount: z.number().default(4),
  teethSharpness: z.number().default(8),
  rotationSpeed: z.number().default(2),
  trailLength: z.number().default(34),
  glowIntensity: z.number().default(0.9),
});

export type KineticGearsProps = z.infer<typeof KineticGearsPropsSchema>;
