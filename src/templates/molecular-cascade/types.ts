import { z } from "zod";

export const MolecularCascadePropsSchema = z.object({
  moleculeSpeed: z.number().default(1.0),
  emissionRate: z.number().default(1.0),
  energyLevel: z.number().default(1.0),
});

export type MolecularCascadeProps = z.infer<typeof MolecularCascadePropsSchema>;
