import { z } from "zod";

export const NeuralPulsePropsSchema = z.object({
  pulseIntensity: z.number().default(1.0),
  nodeDensity: z.number().default(1.0),
  connectionStrength: z.number().default(0.5),
});

export type NeuralPulseProps = z.infer<typeof NeuralPulsePropsSchema>;
