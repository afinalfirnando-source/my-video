import { z } from "zod";

export const VectorFieldFlowPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  cols: z.number().default(72),
  rows: z.number().default(32),
  fieldFreq: z.number().default(1),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.7),
});

export type VectorFieldFlowProps = z.infer<
  typeof VectorFieldFlowPropsSchema
>;
