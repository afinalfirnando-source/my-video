export {
  TEMPLATE_REGISTRY,
  getAllTemplates,
  getTemplate,
  type TemplateRegistryEntry,
  type PropConstraints,
  type JobSpec,
  POND5_CATEGORIES,
} from "../src/data/template-registry";

export { TEMPLATE_CONFIG } from "../src/shared/utils";

import { getAllTemplates, type TemplateRegistryEntry } from "../src/data/template-registry";

export const findTemplate = (idOrName: string): TemplateRegistryEntry | undefined => {
  const lower = idOrName.toLowerCase();
  return getAllTemplates().find(
    (t) => t.id.toLowerCase() === lower || t.name.toLowerCase().includes(lower)
  );
};
