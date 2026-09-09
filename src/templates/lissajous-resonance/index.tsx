import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { LissajousResonanceProps } from "./types";

const TOTAL_FRAMES = 900;

type Point = {
  x0: number;
  y0: number;
  fa: number;
  fb: number;
  pha: number;
  phb: number;
  amp: number;
  baseHue: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

export const LissajousResonance: React.FC<LissajousResonanceProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  gridCols = 11,
  gridRows = 7,
  linkRadius = 48,
  freqSpread = 3,
  glowIntensity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [tr, tg, tb] = hexToRgb(tertiaryColor);

  const points = useMemo(() => {
    const out: Point[] = [];
    const sx = width / (gridCols + 1);
    const sy = height / (gridRows + 1);
    for (let gy = 0; gy < gridRows; gy++) {
      for (let gx = 0; gx < gridCols; gx++) {
        const seed = gy * 73 + gx * 9 + 1;
        out.push({
          x0: (gx + 1) * sx,
          y0: (gy + 1) * sy,
          fa: Math.floor(seeded(seed * 1 + 1) * freqSpread + 1),
          fb: Math.floor(seeded(seed * 1 + 2) * freqSpread + 1),
          pha: seeded(seed * 1 + 3) * Math.PI * 2,
          phb: seeded(seed * 1 + 4) * Math.PI * 2,
          amp: seeded(seed * 1 + 5) * 26 + 18,
          baseHue: seeded(seed * 1 + 6) * 60 + 200,
        });
      }
    }
    return out;
  }, [width, height, gridCols, gridRows, freqSpread]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const rot = t * 3;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const pts: { x: number; y: number }[] = [];
    for (const p of points) {
      const lx = p.x0 - cx + Math.cos(p.fa * t + p.pha) * p.amp;
      const ly = p.y0 - cy + Math.sin(p.fb * t + p.phb) * p.amp;
      const px = cx + lx * cosR - ly * sinR;
      const py = cy + lx * sinR + ly * cosR;
      pts.push({ x: px, y: py });
    }

    ctx.lineCap = "round";

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        if (dx * dx + dy * dy > linkRadius * linkRadius) continue;
        const midHue = (points[i].baseHue + points[j].baseHue) / 2;
        const pulse = Math.sin(t + midHue * 0.05) * 0.5 + 0.5;
        const lc = 0.45 + pulse * 0.4;
        const rr = Math.round(pr * lc + sr * (1 - lc));
        const gg = Math.round(pg * lc + sg * (1 - lc));
        const bb = Math.round(pb * lc + sb * (1 - lc));
        ctx.globalAlpha = Math.max(0, 0.65 - (dx * dx + dy * dy) * 0.0003);
        ctx.shadowBlur = 14 * glowIntensity;
        ctx.strokeStyle = `rgb(${rr},${gg},${bb})`;
        ctx.lineWidth = 1 + pulse;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }

    for (let i = 0; i < pts.length; i++) {
      const p = points[i];
      const pulse = Math.sin(t + p.baseHue * 0.1) * 0.5 + 0.5;
      const rr = Math.round(pr * pulse + tr * (1 - pulse));
      const gg = Math.round(pg * pulse + tg * (1 - pulse));
      const bb = Math.round(pb * pulse + tb * (1 - pulse));
      ctx.globalAlpha = 0.95;
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.shadowColor = tertiaryColor;
      ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, 2.2 + pulse * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    drawNoiseOverlay(ctx, width, height, t, 0.06);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
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
