// Shared utilities - 100% seamless loop guarantee
// RULE: All time-based motion must complete an INTEGER number of
// cycles/rotations per loop. Constant phase offsets are safe.

export const TEMPLATE_CONFIG = {
  width: 3840,
  height: 2160,
  fps: 60,
  durationInFrames: 900,
} as const;

export const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const mod = (v: number, m: number): number => {
  return ((v % m) + m) % m;
};

export const intCycles = (cycles: number): number => {
  return Math.max(1, Math.round(cycles));
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const hsl = (h: number, s: number, l: number): string =>
  `hsl(${h}, ${s}%, ${l}%)`;

export const hsla = (h: number, s: number, l: number, a: number): string =>
  `hsla(${h}, ${s}%, ${l}%, ${a})`;

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, l: 0 };
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const getLoopTime = (frame: number, totalFrames: number): number => {
  return mod(frame, totalFrames) / (totalFrames - 1);
};

export const getSeamlessAngle = (frame: number, totalFrames: number, rotations = 1): number => {
  return getLoopTime(frame, totalFrames) * Math.PI * 2 * intCycles(rotations);
};

export const getSeamlessSine = (frame: number, totalFrames: number, cycles = 1): number => {
  return Math.sin(getSeamlessAngle(frame, totalFrames, cycles));
};

export const getSeamlessCosine = (frame: number, totalFrames: number, cycles = 1): number => {
  return Math.cos(getSeamlessAngle(frame, totalFrames, cycles));
};

export const getSeamlessPingPong = (frame: number, totalFrames: number): number => {
  return (1 - Math.cos(getSeamlessAngle(frame, totalFrames, 1))) / 2;
};

export const mixColors = (color1: string, color2: string, t: number): string => {
  const hsl1 = hexToHsl(color1);
  const hsl2 = hexToHsl(color2);
  let h1 = hsl1.h;
  let h2 = hsl2.h;
  if (Math.abs(h2 - h1) > 180) {
    if (h2 > h1) h1 += 360;
    else h2 += 360;
  }
  const h = lerp(h1, h2, t);
  const s = lerp(hsl1.s, hsl2.s, t);
  const l = lerp(hsl1.l, hsl2.l, t);
  return hsl(h, s, l);
};
