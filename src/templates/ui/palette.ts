export const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

export const lerpRgb = (
  a: [number, number, number],
  b: [number, number, number],
  f: number,
): [number, number, number] => [
  Math.round(a[0] + (b[0] - a[0]) * f),
  Math.round(a[1] + (b[1] - a[1]) * f),
  Math.round(a[2] + (b[2] - a[2]) * f),
];

export const colorForHue = (
  angleDeg: number,
  primary: [number, number, number],
  secondary: [number, number, number],
  tertiary: [number, number, number],
  hueShift: number,
): string => {
  const u = (((angleDeg + hueShift) % 360) + 360) % 360;
  const seg = u < 120 ? 0 : u < 240 ? 1 : 2;
  const f = (u - seg * 120) / 120;
  let rgb: [number, number, number];
  if (seg === 0) rgb = lerpRgb(primary, secondary, f);
  else if (seg === 1) rgb = lerpRgb(secondary, tertiary, f);
  else rgb = lerpRgb(tertiary, primary, f);
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
};

export const toCssRgb = (c: [number, number, number]): string =>
  `rgb(${c[0]},${c[1]},${c[2]})`;
