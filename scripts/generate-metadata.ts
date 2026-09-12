import type { TemplateRegistryEntry } from "../src/data/template-registry";

export interface Pond5Metadata {
  title: string;
  description: string;
  keywords: string[];
  category: string;
  brand: string;
  collection: string;
}

const THEME_KEYWORDS: Record<string, string[]> = {
  "Fluid Gradient Waves": [
    "abstract", "background", "loop", "4k", "hd", "video", "stock",
    "gradient", "fluid", "liquid", "motion", "animation", "seamless",
    "color", "colorful", "organic", "smooth", "flow", "wave", "waves",
    "gradient", "background", "abstract", "digital", "modern", "color",
    "vibrant", "transition", "screen", "screensaver", "ambient", "visual",
  ],
  "Neon Grid Tunnel": [
    "abstract", "background", "loop", "4k", "hd", "video", "stock",
    "neon", "grid", "tunnel", "perspective", "motion", "animation", "seamless",
    "cyberpunk", "futuristic", "tech", "glow", "light", "scan", "line",
    "digital", "modern", "vibrant", "dark", "space", "depth", "visual",
    "abstract", "background", "tech", "cyber", "grid", "infinite",
  ],
  "Aurora Borealis": [
    "abstract", "background", "loop", "4k", "hd", "video", "stock",
    "aurora", "borealis", "northern", "lights", "night", "sky", "star",
    "magic", "ethereal", "nature", "natural", "dance", "motion", "animation",
    "seamless", "colorful", "green", "blue", "glow", "ambient", "dark",
    "sky", "atmosphere", "cosmic", "dreamy", "visual", "abstract", "background",
  ],
  "Particle Vortex": [
    "abstract", "background", "loop", "4k", "hd", "video", "stock",
    "vortex", "spiral", "particle", "particles", "core", "swirl", "motion",
    "animation", "seamless", "energy", "power", "dynamic", "dark", "glow",
    "light", "trail", "cosmic", "space", "void", "digital", "modern",
    "abstract", "background", "energy", "force", "whirl", "visual",
  ],
  "Liquid Chrome": [
    "abstract", "background", "loop", "4k", "hd", "video", "stock",
    "chrome", "liquid", "metallic", "reflective", "ripple", "surface",
    "motion", "animation", "seamless", "shiny", "glossy", "reflection",
    "modern", "digital", "tech", "smooth", "flow", "water", "wave",
    "abstract", "background", "metal", "silver", "gold", "luxury", "visual",
  ],
};

const pickCategory = (template: TemplateRegistryEntry): string => template.category;

export const generateMetadata = (
  template: TemplateRegistryEntry,
  conceptTitle: string,
  theme: string,
  description: string,
  customKeywords?: string[]
): Pond5Metadata => {
  const base = THEME_KEYWORDS[template.name] ?? THEME_KEYWORDS["Fluid Gradient Waves"];

  const themeText = `${conceptTitle} ${theme} ${description}`.toLowerCase();
  const colorKeywords: string[] = [];
  if (themeText.includes("blue")) colorKeywords.push("blue");
  if (themeText.includes("red")) colorKeywords.push("red");
  if (themeText.includes("green")) colorKeywords.push("green");
  if (themeText.includes("purple") || themeText.includes("violet")) colorKeywords.push("purple");
  if (themeText.includes("pink")) colorKeywords.push("pink");
  if (themeText.includes("orange")) colorKeywords.push("orange");
  if (themeText.includes("cyan")) colorKeywords.push("cyan");
  if (themeText.includes("gold")) colorKeywords.push("gold");
  if (themeText.includes("silver")) colorKeywords.push("silver");
  if (themeText.includes("dark")) colorKeywords.push("dark");
  if (themeText.includes("black")) colorKeywords.push("black");

  let keywords = Array.from(new Set([...base, ...colorKeywords, ...(customKeywords ?? [])]));
  while (keywords.length < 30) {
    keywords.push("abstract", "background", "4k", "loop", "video", "seamless", "motion", "animation");
    keywords = Array.from(new Set(keywords));
    break;
  }

  const title = `${template.name} — ${conceptTitle}`.substring(0, 80);
  const shortDesc = description.length > 400
    ? description.substring(0, 397) + "..."
    : description;

  return {
    title,
    description: `${template.description}. ${shortDesc}`,
    keywords: Array.from(new Set(keywords)),
    category: pickCategory(template),
    brand: "AI-Director Pipeline",
    collection: `Remotion Stock ${template.name}`,
  };
};
