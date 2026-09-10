import { z } from "zod";

export const NeonGridTunnelPropsSchema = z.object({
  gridSize: z.number().default(30),
  flightSpeed: z.number().default(0.8),
  scanLineCount: z.number().default(8),
  pulseIntensity: z.number().default(0.6),
  primaryColor: z.string().default("#FF2A6D"),
  secondaryColor: z.string().default("#00F0FF"),
  backgroundColor: z.string().default("#0A0A1A"),
  lineWidth: z.number().default(2),
  glowIntensity: z.number().default(0.9),
});

export type NeonGridTunnelProps = z.infer<typeof NeonGridTunnelPropsSchema>;
