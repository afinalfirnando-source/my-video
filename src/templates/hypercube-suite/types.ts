import { z } from "zod";

export const HypercubeSuitePropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  layerCount: z.number().default(5),
  rotationSpeed: z.number().default(1),
  glowIntensity: z.number().default(0.85),
  perspectiveDepth: z.number().default(2.5),
});

export type HypercubeSuiteProps = z.infer<typeof HypercubeSuitePropsSchema>;
