import { z } from "zod";

export const NeonGridTunnelPropsSchema = z.object({
  primaryColor: z.string().default("#FF2A6D"),
  secondaryColor: z.string().default("#00F0FF"),
  tertiaryColor: z.string().default("#7B2FFF"),
  backgroundColor: z.string().default("#0A0A1A"),
  gridSize: z.number().int().min(10).max(50).default(25),
  flightSpeed: z.number().min(0.1).max(3).default(1),
  scanLineCount: z.number().int().min(1).max(10).default(3),
  pulseIntensity: z.number().min(0).max(1).default(0.8),
  glowIntensity: z.number().min(0).max(1).default(0.8),
});

export type NeonGridTunnelProps = z.infer<typeof NeonGridTunnelPropsSchema>;
