import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { MirrorChromeProps } from "./types";

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

export const MirrorChrome: React.FC<MirrorChromeProps> = ({
  rippleCount = 24,
  flowSpeed = 0.4,
  waveAmplitude = 0.6,
  metallicShine = 0.8,
  primaryColor = "#00F0FF",
  secondaryColor = "#FF2A6D",
  backgroundColor = "#0A0A1A",
  glowIntensity = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const [pr, pg, pb] = [parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16)];
  const [sr, sg, sb] = [parseInt(secondaryColor.slice(1, 3), 16), parseInt(secondaryColor.slice(3, 5), 16), parseInt(secondaryColor.slice(5, 7), 16)];

  const ripples = useMemo(
    () =>
      Array.from({ length: rippleCount }, (_, i): Ripple => ({
        x: seeded(i * 17 + 1) * width,
        y: seeded(i * 17 + 2) * height,
        phase: seeded(i * 17 + 3) * Math.PI * 2,
        speed: seeded(i * 17 + 4) * 0.5 + 0.5,
        radius: seeded(i * 17 + 5) * 220 + 120,
        hue: seeded(i * 17 + 6) * 70 + 180,
      })),
    [width, height, rippleCount]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      const driftX = Math.sin(t * r.speed * flowSpeed + r.phase) * width * waveAmplitude * 0.22;
      const driftY = Math.cos(t * r.speed * flowSpeed * 0.7 + r.phase) * height * waveAmplitude * 0.22;
      const rx = r.x + driftX;
      const ry = r.y + driftY;
      const hue = (r.hue + time * 50) % 360;

      const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, r.radius);
      grad.addColorStop(0, hsl(hue, 70, 55));
      grad.addColorStop(0.5, hsl((hue + 35) % 360, 60, 30));
      grad.addColorStop(1, "transparent");

      ctx.globalAlpha = 0.3 * metallicShine;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(rx, ry, r.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.12;
    ctx.shadowBlur = 20 * metallicShine;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < 14; i++) {
      const baseY = height * 0.2 + i * (height * 0.6 / 14);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const y =
          baseY +
          Math.sin(x * 0.007 + t * flowSpeed + i * 0.6) * 45 * waveAmplitude +
          Math.cos(x * 0.013 - t * flowSpeed * 0.6) * 28 * waveAmplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${pr},${pg},${pb},0.25)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.globalAlpha = 0.2;
    ctx.shadowBlur = 25 * metallicShine;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 12; i++) {
      const baseY = height * 0.25 + i * (height * 0.5 / 12);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const y =
          baseY +
          Math.sin(x * 0.009 + t * flowSpeed * 0.8 + i * 0.4) * 35 * waveAmplitude +
          Math.cos(x * 0.017 - t * flowSpeed * 0.5) * 20 * waveAmplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${sr},${sg},${sb},0.2)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    ctx.globalAlpha = 0.18;
    ctx.shadowBlur = 15 * metallicShine;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < 140; i++) {
      const sx = seeded(i * 41 + time * 35) * width;
      const sy = seeded(i * 43 + time * 25) * height;
      const ss = seeded(i * 47) * 1.3 + 0.4;
      ctx.globalAlpha = seeded(i * 53) * 0.25;
      ctx.fillStyle = hsl((time * 110 + seeded(i * 59) * 60) % 360, 90, 60);
      ctx.fillRect(sx, sy, ss, ss);
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 55 * glowIntensity;
    ctx.shadowColor = primaryColor;
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.5);
    centerGrad.addColorStop(0, hsl((time * 70 + 200) % 360, 80, 50));
    centerGrad.addColorStop(0.5, hsl((time * 70 + 260) % 360, 70, 25));
    centerGrad.addColorStop(1, "transparent");
    ctx.fillStyle = centerGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.25;
    ctx.shadowBlur = 45 * glowIntensity;
    ctx.shadowColor = secondaryColor;
    const cornerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.7);
    cornerGrad.addColorStop(0, hsl((time * 90 + 320) % 360, 90, 55));
    cornerGrad.addColorStop(1, "transparent");
    ctx.fillStyle = cornerGrad;
    ctx.fillRect(0, 0, width, height);

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
