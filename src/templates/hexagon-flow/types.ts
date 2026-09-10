import { z } from "zod";

export const HexagonFlowPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  hexSize: z.number().default(72),
  waveSpeed: z.number().default(0.6),
  colorShift: z.number().default(0.4),
  flowIntensity: z.number().default(0.8),
  glowIntensity: z.number().default(0.85),
});

export type HexagonFlowProps = z.infer<typeof HexagonFlowPropsSchema>;
