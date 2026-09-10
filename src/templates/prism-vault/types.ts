import { z } from "zod";

export const PrismVaultPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  ringCount: z.number().default(16),
  baseSides: z.number().default(3),
  rotationSpeed: z.number().default(2),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
  breathAmp: z.number().default(0.15),
});

export type PrismVaultProps = z.infer<typeof PrismVaultPropsSchema>;
