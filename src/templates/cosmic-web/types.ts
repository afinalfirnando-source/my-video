import { z } from "zod";

export const CosmicWebGLPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  nodeCount: z.number().default(90),
  edgeDensity: z.number().default(2.2),
  flowSpeed: z.number().default(0.5),
  rotationSpeed: z.number().default(0.25),
  glowIntensity: z.number().default(0.85),
});

export type CosmicWebGLProps = z.infer<typeof CosmicWebGLPropsSchema>;
