import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { HyperspaceRushProps } from "./types";

const TOTAL_FRAMES = 900;

type Star = {
  x: number;
  y: number;
  size: number;
  seed: number;
};

type Streak = {
  angle: number;
  baseZ: number;
  length: number;
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

export const HyperspaceRush: React.FC<HyperspaceRushProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  streakCount = 420,
  starDensity = 320,
  pulseSpeed = 0.7,
  glowIntensity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);

  const { stars, streaks } = useMemo(() => {
    const s: Star[] = [];
    for (let i = 0; i < starDensity; i++) {
      s.push({
        x: seeded(i * 31 + 1) * width,
        y: seeded(i * 31 + 2) * height,
        size: seeded(i * 31 + 3) * 1.3 + 0.3,
        seed: seeded(i * 31 + 4),
      });
    }
    const st: Streak[] = [];
    for (let i = 0; i < streakCount; i++) {
      st.push({
        angle: seeded(i * 23 + 1) * Math.PI * 2,
        baseZ: seeded(i * 23 + 2),
        length: seeded(i * 23 + 3) * 0.55 + 0.45,
      });
    }
    return { stars: s, streaks: st };
  }, [width, height, streakCount, starDensity]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    for (const star of stars) {
      const alpha =
        0.25 +
        star.seed * 0.45 +
        Math.sin(t * 0.9 + star.seed * 11) * 0.15;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.48;

    ctx.lineCap = "round";
    for (const streak of streaks) {
      const z = (streak.baseZ + time) % 1;
      const zPrev = (streak.baseZ + time - 1 / TOTAL_FRAMES + 1) % 1;
      const r = Math.pow(z, 1.6) * maxR * streak.length;
      const rPrev = Math.pow(zPrev, 1.6) * maxR * streak.length;
      if (r < 1.5) continue;
      const x = cx + Math.cos(streak.angle) * r;
      const y = cy + Math.sin(streak.angle) * r;
      const xPrev = cx + Math.cos(streak.angle) * rPrev;
      const yPrev = cy + Math.sin(streak.angle) * rPrev;

      const age = z;
      const fade = age * (1 - age) * 4;
      const rr = Math.round(pr * (1 - age) + sr * age);
      const gg = Math.round(pg * (1 - age) + sg * age);
      const bb = Math.round(pb * (1 - age) + sb * age);

      ctx.globalAlpha = fade * 0.85;
      ctx.shadowBlur = 16 * age * glowIntensity;
      ctx.shadowColor = primaryColor;
      ctx.strokeStyle = `rgb(${rr},${gg},${bb})`;
      ctx.lineWidth = 1.5 + age * 3;
      ctx.beginPath();
      ctx.moveTo(xPrev, yPrev);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    const ringR = maxR * 0.35;
    const burst = Math.sin(t * 1.3) * 0.5 + 0.5;
    const corePulse = 0.7 + Math.sin(t * 1.8 * pulseSpeed) * 0.3;

    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 70 * glowIntensity;
    ctx.shadowColor = tertiaryColor;
    const ringGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, ringR);
    ringGrad.addColorStop(0, "rgba(0,0,0,0)");
    ringGrad.addColorStop(0.65, tertiaryColor);
    ringGrad.addColorStop(1, "transparent");
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR * (0.9 + burst * 0.2), 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.55 * corePulse;
    ctx.shadowBlur = 110 * glowIntensity;
    ctx.shadowColor = primaryColor;
    ctx.fillStyle = primaryColor;
    const coreR = maxR * 0.1;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR + Math.sin(t * 2.3) * 14, 0, Math.PI * 2);
    ctx.fill();

    drawNoiseOverlay(ctx, width, height, t, 0.07);

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
