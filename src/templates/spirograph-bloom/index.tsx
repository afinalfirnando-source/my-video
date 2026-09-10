import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { SpirographBloomProps } from "./types";

const TOTAL_FRAMES = 900;
const TWO_PI = Math.PI * 2;

const rgb = (r: number, g: number, b: number, a = 1): string => {
  return `rgba(${r},${g},${b},${a})`;
};

export const SpirographBloom: React.FC<SpirographBloomProps> = ({
  primaryColor = "#FF00FF",
  secondaryColor = "#00F0FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  lobeCount = 5,
  ratioSpread = 4,
  swirlSpeed = 1,
  glowIntensity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * TWO_PI;

  const cx = width / 2;
  const cy = height / 2;
  const R = useMemo(
    () => Math.min(width, height) * 0.38,
    [width, height],
  );
  const colors = [primaryColor, secondaryColor, tertiaryColor];

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.45);
    cg.addColorStop(0, rgb(255, 255, 255, 0.22));
    cg.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 90 * glowIntensity;
    ctx.fillStyle = cg;
    ctx.fillRect(cx - R * 0.45, cy - R * 0.45, R * 0.9, R * 0.9);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    const wf = Math.max(1, Math.round(swirlSpeed));

    for (let i = 0; i < lobeCount; i++) {
      const k = 2 + (i % Math.max(1, Math.floor(ratioSpread)));
      const r = R / (k + 1);
      const rr = R - r;
      const d = 30 + i * 9 + Math.sin(t * wf - i * 0.6) * 7;
      const phase = (i * TWO_PI) / lobeCount;
      const color = colors[i % colors.length];
      const steps = 150;

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 22 * glowIntensity;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const th = (s / steps) * TWO_PI;
        const kax = k * th + phase;
        const x = cx + rr * Math.cos(th) + d * Math.cos(kax);
        const y = cy + rr * Math.sin(th) - d * Math.sin(kax);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      const th = t % TWO_PI;
      const kax = k * th + phase;
      const nx = cx + rr * Math.cos(th) + d * Math.cos(kax);
      const ny = cy + rr * Math.sin(th) - d * Math.sin(kax);
      ctx.globalAlpha = 0.95;
      ctx.shadowBlur = 28 * glowIntensity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(nx, ny, 4.5, 0, TWO_PI);
      ctx.fill();
    }

    drawNoiseOverlay(ctx, width, height, t, 0.065);

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
