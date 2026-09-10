import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { HypercubeSuiteProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

type V4 = { x: number; y: number; z: number; w: number };
type Edge = [number, number];

const TESSERACT_VERTICES: V4[] = (() => {
  const v: V4[] = [];
  for (let i = 0; i < 16; i++) {
    v.push({
      x: i & 1 ? 1 : -1,
      y: i & 2 ? 1 : -1,
      z: i & 4 ? 1 : -1,
      w: i & 8 ? 1 : -1,
    });
  }
  return v;
})();

const TESSERACT_EDGES: Edge[] = (() => {
  const e: Edge[] = [];
  for (let i = 0; i < 16; i++) {
    for (let bit = 0; bit < 4; bit++) {
      const j = i ^ (1 << bit);
      if (j > i) e.push([i, j]);
    }
  }
  return e;
})();

const identity4 = (): number[][] => [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

const mul4 = (a: number[][], b: number[][]): number[][] => {
  const r: number[][] = [];
  for (let i = 0; i < 4; i++) {
    r[i] = [];
    for (let j = 0; j < 4; j++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[i][k] * b[k][j];
      r[i][j] = s;
    }
  }
  return r;
};

const apply4 = (m: number[][], v: V4): V4 => ({
  x: m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3] * v.w,
  y: m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3] * v.w,
  z: m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3] * v.w,
  w: m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3] * v.w,
});

const rotatePlane = (plane: "xy" | "xz" | "xw" | "yz" | "yw" | "zw", angle: number): number[][] => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m = identity4();
  const map: Record<"xy" | "xz" | "xw" | "yz" | "yw" | "zw", [number, number, number, number]> = {
    xy: [0, 1, 0, 1],
    xz: [0, 2, 0, 2],
    xw: [0, 3, 0, 3],
    yz: [1, 2, 1, 2],
    yw: [1, 3, 1, 3],
    zw: [2, 3, 2, 3],
  };
  const [a, b] = map[plane];
  m[a][a] = c;
  m[a][b] = s;
  m[b][a] = -s;
  m[b][b] = c;
  return m;
};

const PLANES: ("xy" | "xz" | "xw" | "yz" | "yw" | "zw")[] = ["xy", "xz", "xw", "yz", "yw", "zw"];



export const HypercubeSuite: React.FC<HypercubeSuiteProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  layerCount = 5,
  rotationSpeed = 1,
  glowIntensity = 0.85,
  perspectiveDepth = 2.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * PI2;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [tr, tg, tb] = hexToRgb(tertiaryColor);

  const cx = width / 2;
  const cy = height / 2;
  const camZ = width * 0.6;

  const layers = useMemo(() => {
    return Array.from({ length: layerCount }, (_, i) => ({
      scale: 1 / (1 + i * 0.5),
      phase: (i / layerCount) * PI2,
    }));
  }, [layerCount]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.shadowColor = toCssRgb([sr, sg, sb]);
    ctx.shadowBlur = 16 * glowIntensity;

    const freqs = [3, 5, 2, 7, 4, 6];

    for (let li = 0; li < layers.length; li++) {
      const layer = layers[li];
      const layerT = t + layer.phase;
      const scale = layer.scale * perspectiveDepth;

      let m = identity4();
      for (let pi = 0; pi < 6; pi++) {
        const plane = PLANES[pi];
        const angle = layerT * freqs[pi] * rotationSpeed;
        m = mul4(rotatePlane(plane, angle), m);
      }

      const hue = (li / layers.length) * 360 + (t * 180) / PI2;
      const color = colorForHue(hue, [pr, pg, pb], [sr, sg, sb], [tr, tg, tb], 0);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.65 + (1 - li / layers.length) * 0.25;
      ctx.lineWidth = 2 - (li / layers.length) * 1.2;

      const projected: { x: number; y: number; fade: number }[] = [];
      for (const v of TESSERACT_VERTICES) {
        const r4 = apply4(m, v);
        const wView = r4.w + scale;
        const persp = camZ / (camZ - wView * 0.3);
        const depth = persp + r4.z * scale / camZ;
        const sx = cx + (r4.x * scale * persp) / depth;
        const sy = cy + (r4.y * scale * persp) / depth;
        const fade = 1 - Math.abs(r4.z * scale) / (width * 0.8);
        projected.push({ x: sx, y: sy, fade: Math.max(0, fade) });
      }

      for (const [i, j] of TESSERACT_EDGES) {
        const a = projected[i];
        const b = projected[j];
        const fade = Math.min(a.fade, b.fade);
        if (fade < 0.1) continue;
        ctx.globalAlpha = (0.65 + (1 - li / layers.length) * 0.25) * fade;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    drawNoiseOverlay(ctx, width, height, t, 0.2);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: backgroundColor }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
