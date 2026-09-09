import { z } from "zod";

export const PlasmaArcFieldPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#02000A"),
  nodeCount: z.number().default(70),
  arcComplexity: z.number().default(4),
  sparkDensity: z.number().default(180),
  pulseSpeed: z.number().default(0.6),
  glowIntensity: z.number().default(0.95),
});

export type PlasmaArcFieldProps = z.infer<typeof PlasmaArcFieldPropsSchema>;
