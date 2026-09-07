import { z } from "zod";

export const CrystalGrowthPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  crystalDensity: z.number().default(15),
  growthSpeed: z.number().default(0.5),
  fractureIntensity: z.number().default(0.6),
  refractionIntensity: z.number().default(0.8),
  shineIntensity: z.number().default(0.7),
});

export type CrystalGrowthProps = z.infer<typeof CrystalGrowthPropsSchema>;
