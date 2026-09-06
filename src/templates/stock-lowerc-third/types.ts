import { z } from "zod";

export const LowerThirdPropsSchema = z.object({
  title: z.string().default("BREAKING NEWS"),
  subtitle: z.string().default("Corporate News Update"),
  brandColor: z.string().default("#3B82F6"),
  logoUrl: z.string().optional(),
  style: z.enum(["corporate", "modern", "minimal"]).default("corporate"),
  backgroundColor: z.string().default("#0F172A"),
});

export type LowerThirdProps = z.infer<typeof LowerThirdPropsSchema>;
