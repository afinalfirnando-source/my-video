import { z } from "zod";

export const UrbanFlowPropsSchema = z.object({
  flowVelocity: z.number().default(1.0),
  gridDensity: z.number().default(1.0),
  neonIntensity: z.number().default(1.0),
});

export type UrbanFlowProps = z.infer<typeof UrbanFlowPropsSchema>;
