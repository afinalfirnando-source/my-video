import { z } from "zod";

export const LatticeTunnelPropsSchema = z.object({
  primaryColor: z.string().default("#00F0FF"),
  secondaryColor: z.string().default("#FF00FF"),
  tertiaryColor: z.string().default("#FFD700"),
  backgroundColor: z.string().default("#0A0A1A"),
  gridSize: z.number().default(18),
  depth: z.number().default(22),
  scrollSpeed: z.number().default(1),
  hueCycles: z.number().default(1),
  glowIntensity: z.number().default(0.8),
});

export type LatticeTunnelProps = z.infer<typeof LatticeTunnelPropsSchema>;
