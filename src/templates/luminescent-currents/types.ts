import { z } from "zod";

export const LuminescentCurrentsPropsSchema = z.object({
  flowSpeed: z.number().default(1.0),
  intensity: z.number().default(1.0),
  colorMode: z.enum(["cyan", "magenta", "white"]).default("cyan"),
});

export type LuminescentCurrentsProps = z.infer<typeof LuminescentCurrentsPropsSchema>;
