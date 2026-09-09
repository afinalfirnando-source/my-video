import { z } from "zod";

export const LuminousVeilPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  curtainCount: z.number().default(5),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
});

export type LuminousVeilProps = z.infer<typeof LuminousVeilPropsSchema>;
