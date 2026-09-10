let cache: {
  pattern: CanvasPattern;
  w: number;
  h: number;
} | null = null;

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const getNoisePattern = (): {
  pattern: CanvasPattern;
  w: number;
  h: number;
} | null => {
  if (cache) return cache;
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 144;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(256, 144);
  const d = img.data;
  let s = 0;
  for (let i = 0; i < d.length; i += 4) {
    const v = seeded(s * 17.3 + i * 0.013) * 255;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
    s++;
  }
  ctx.putImageData(img, 0, 0);
  const pattern = ctx.createPattern(c, "repeat");
  if (!pattern) return null;
  cache = { pattern, w: 256, h: 144 };
  return cache;
};

export const drawNoiseOverlay = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  opacity: number,
): void => {
  const np = getNoisePattern();
  if (!np) return;
  const ox = (t * 0.73) % np.w;
  const oy = (t * 0.31) % np.h;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.filter = "none";
  ctx.translate(ox, oy);
  ctx.fillStyle = np.pattern;
  ctx.fillRect(-ox, -oy, width, height);
  ctx.restore();
};
