import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { KineticGearsProps } from "./types";

const TOTAL_FRAMES = 900;
const TWO_PI = Math.PI * 2;

type Gear = {
  cx: number;
  cy: number;
  R: number;
  Ri: number;
  teeth: number;
  turns: number;
  dir: number;
  color: string;
};

const baseGears: { R: number; Ri: number; teeth: number; turns: number; dir: number }[] =
  [
    { R: 178, Ri: 108, teeth: 18, turns: 2, dir: 1 },
    { R: 132, Ri: 82, teeth: 16, turns: -3, dir: -1 },
    { R: 162, Ri: 98, teeth: 20, turns: 2, dir: 1 },
    { R: 96, Ri: 58, teeth: 14, turns: -2, dir: -1 },
  ];

export const KineticGears: React.FC<KineticGearsProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  gearCount = 4,
  teethSharpness = 8,
  rotationSpeed = 2,
  trailLength = 34,
  glowIntensity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * TWO_PI;

  const gears = useMemo(() => {
    const G = Math.max(1, Math.round(rotationSpeed));
    const scale = Math.min(width, height) * 0.92;
    const centers = [
      { cx: 0.26 * width, cy: 0.36 * height },
      { cx: 0.74 * width, cy: 0.36 * height },
      { cx: 0.5 * width, cy: 0.68 * height },
      { cx: 0.42 * width, cy: 0.52 * height },
    ];
    const colors = [primaryColor, secondaryColor, tertiaryColor];
    const count = Math.min(gearCount, baseGears.length);
    return Array.from({ length: count }, (_, i) => ({
      cx: centers[i % centers.length].cx,
      cy: centers[i % centers.length].cy,
      R: baseGears[i].R * (scale / 820),
      Ri: baseGears[i].Ri * (scale / 820),
      teeth: Math.max(6, Math.round(baseGears[i].teeth * (teethSharpness / 4))),
      turns: baseGears[i].turns * G,
      dir: baseGears[i].dir,
      color: colors[i % colors.length],
    }));
  }, [
    width,
    height,
    gearCount,
    teethSharpness,
    rotationSpeed,
    primaryColor,
    secondaryColor,
    tertiaryColor,
  ]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = "round";

    const drawCog = (g: Gear, grot: number) => {
      ctx.shadowBlur = 16 * glowIntensity;
      ctx.shadowColor = g.color;
      ctx.fillStyle = g.color;
      ctx.beginPath();
      const N = 2 * g.teeth;
      for (let k = 0; k <= N; k++) {
        const ang = grot + (k * Math.PI) / g.teeth;
        const rr = k % 2 === 0 ? g.R : g.Ri * 0.93;
        ctx.lineTo(g.cx + Math.cos(ang) * rr, g.cy + Math.sin(ang) * rr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = g.color;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.shadowBlur = 26 * glowIntensity;
      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.arc(g.cx, g.cy, g.Ri * 0.32, 0, TWO_PI);
      ctx.fill();
    };

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    for (const g of gears) {
      const grot = t * g.turns * g.dir;
      drawCog(g, grot);

      for (let k = 0; k < trailLength; k++) {
        const ang = grot - (k / trailLength) * TWO_PI * Math.abs(g.turns);
        const r = g.R + g.Ri * 0.2;
        const px = g.cx + Math.cos(ang) * r;
        const py = g.cy + Math.sin(ang) * r;
        const a = 0.6 - k * (0.55 / trailLength);
        ctx.globalAlpha = Math.max(0, a);
        ctx.shadowBlur = 10 * glowIntensity;
        ctx.shadowColor = g.color;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, TWO_PI);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 0.55;
    ctx.shadowBlur = 18 * glowIntensity;
    const arms = Math.min(gears.length, 4);
    for (let i = 0; i < arms; i++) {
      const a = gears[i];
      const b = gears[(i + 1) % arms];
      if (Math.sin(t * 1.5 + i) < 0.3) continue;
      ctx.setLineDash([9, 6]);
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = tertiaryColor;
      ctx.beginPath();
      ctx.moveTo(a.cx, a.cy);
      ctx.lineTo(b.cx, b.cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    drawNoiseOverlay(ctx, width, height, t, 0.06);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
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
