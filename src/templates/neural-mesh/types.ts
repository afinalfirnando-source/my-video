import { z } from "zod";

export const NeuralMeshPropsSchema = z.object({
  nodeColor: z.string().default("#00F0FF"),
  connectionColor: z.string().default("#8A2BE2"),
  pulseColor: z.string().default("#FF00FF"),
  nodeCount: z.number().default(80),
  layerCount: z.number().default(5),
  pulseSpeed: z.number().default(0.8),
  networkDensity: z.number().default(0.7),
  glowIntensity: z.number().default(0.8),
});

export type NeuralMeshProps = z.infer<typeof NeuralMeshPropsSchema>;
