import { z } from "zod";

export const PlasmaFluxPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  bandCount: z.number().default(6),
  speed: z.number().default(0.55),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.75),
});

export type PlasmaFluxProps = z.infer<typeof PlasmaFluxPropsSchema>;
