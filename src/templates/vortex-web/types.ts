import { z } from "zod";

export const VortexWebPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  rotationSpeed: z.number().default(0.3),
  forwardSpeed: z.number().default(0.5),
  vortexIntensity: z.number().default(0.7),
  webDensity: z.number().default(0.8),
  particleCount: z.number().default(400),
  ringCount: z.number().default(20),
});

export type VortexWebProps = z.infer<typeof VortexWebPropsSchema>;

