import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { LiquidChromeProps } from "./types";

const TOTAL_FRAMES = 900;

type Ripple = {
  x: number;
  y: number;
  phase: number;
  speed: number;
  radius: number;
  hue: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const LiquidChrome: React.FC<LiquidChromeProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  rippleCount = 24,
  flowSpeed = 0.4,
  waveAmplitude = 0.6,
  metallicShine = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const ripples = useMemo(
    () =>
      Array.from({ length: rippleCount }, (_, i): Ripple => ({
        x: seeded(i * 17 + 1) * width,
        y: seeded(i * 17 + 2) * height,
        phase: seeded(i * 17 + 3) * Math.PI * 2,
        speed: seeded(i * 17 + 4) * 0.5 + 0.5,
        radius: seeded(i * 17 + 5) * 200 + 120,
        hue: seeded(i * 17 + 6) * 80 + 180,
      })),
    [width, height, rippleCount]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#00050A";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      const driftX = Math.sin(t * r.speed * flowSpeed + r.phase) * width * waveAmplitude * 0.25;
      const driftY = Math.cos(t * r.speed * flowSpeed * 0.7 + r.phase) * height * waveAmplitude * 0.25;
      const rx = r.x + driftX;
      const ry = r.y + driftY;
      const hue = (r.hue + time * 40) % 360;

      const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, r.radius);
      grad.addColorStop(0, hsl(hue, 70, 55));
      grad.addColorStop(0.5, hsl((hue + 40) % 360, 60, 30));
      grad.addColorStop(1, "transparent");

      ctx.globalAlpha = 0.35 * metallicShine;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(rx, ry, r.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 50;
    ctx.shadowColor = primaryColor;
    ctx.strokeStyle = hsl((time * 80 + 180) % 360, 90, 60);
    ctx.lineWidth = 2;

    for (let i = 0; i < 12; i++) {
      const baseY = height * 0.25 + i * (height * 0.5 / 12);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 10) {
        const y =
          baseY +
          Math.sin(x * 0.008 + t * flowSpeed + i * 0.5) * 40 * waveAmplitude +
          Math.cos(x * 0.015 - t * flowSpeed * 0.6) * 25 * waveAmplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.globalAlpha = 0.15 + i * 0.02;
      ctx.stroke();
    }

    ctx.shadowBlur = 30 * metallicShine;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 180; i++) {
      const sx = seeded(i * 41 + time * 40) * width;
      const sy = seeded(i * 43 + time * 30) * height;
      const ss = seeded(i * 47) * 1.5 + 0.5;
      ctx.globalAlpha = seeded(i * 53) * 0.35;
      ctx.fillStyle = hsl((time * 120 + seeded(i * 59) * 60) % 360, 90, 65);
      ctx.fillRect(sx, sy, ss, ss);
    }

    ctx.globalAlpha = 0.35;
    ctx.shadowBlur = 60;
    ctx.shadowColor = primaryColor;
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.45);
    centerGrad.addColorStop(0, hsl((time * 60 + 200) % 360, 80, 50));
    centerGrad.addColorStop(0.6, hsl((time * 60 + 260) % 360, 70, 25));
    centerGrad.addColorStop(1, "transparent");
    ctx.fillStyle = centerGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
