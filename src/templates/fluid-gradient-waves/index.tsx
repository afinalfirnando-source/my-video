import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { FluidGradientWavesProps } from "./types";

const TOTAL_FRAMES = 900;

type WaveBand = {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  yOffset: number;
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

const rgb = (r: number, g: number, b: number, a = 1): string => {
  return `rgba(${r},${g},${b},${a})`;
};

export const FluidGradientWaves: React.FC<FluidGradientWavesProps> = ({
  waveCount = 12,
  flowSpeed = 0.4,
  colorShift = 0.3,
  amplitude = 0.7,
  primaryColor = "#FF6B6B",
  secondaryColor = "#A855F7",
  tertiaryColor = "#14B8A6",
  backgroundColor = "#0F172A",
  glowIntensity = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [tr, tg, tb] = hexToRgb(tertiaryColor);

  const waves = useMemo(() => {
    return Array.from({ length: waveCount }, (_, i): WaveBand => {
      return {
        amplitude: seeded(i * 17 + 1) * 120 + 60,
        frequency: seeded(i * 17 + 2) * 0.006 + 0.002,
        speed: seeded(i * 17 + 3) * 0.5 + 0.3,
        phase: seeded(i * 17 + 4) * Math.PI * 2,
        yOffset: seeded(i * 17 + 5) * height,
      };
    });
  }, [height, waveCount]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    for (let w = 0; w < waves.length; w++) {
      const wave = waves[w];
      const waveT = t * wave.speed * flowSpeed + wave.phase;

      const grad = ctx.createLinearGradient(0, wave.yOffset - wave.amplitude * amplitude, 0, wave.yOffset + wave.amplitude * amplitude);
      const mix1 = rgb(
        Math.round(pr * 0.5 + sr * 0.5),
        Math.round(pg * 0.5 + sg * 0.5),
        Math.round(pb * 0.5 + sb * 0.5),
        0
      );
      const mix2 = rgb(
        Math.round(sr * 0.5 + tr * 0.5),
        Math.round(sg * 0.5 + tg * 0.5),
        Math.round(sb * 0.5 + tb * 0.5),
        0
      );
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.3, mix1);
      grad.addColorStop(0.6, mix2);
      grad.addColorStop(1, "transparent");

      ctx.globalAlpha = 0.25 * glowIntensity;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 8) {
        const y =
          wave.yOffset +
          Math.sin(x * wave.frequency + waveT) * wave.amplitude * amplitude +
          Math.cos(x * wave.frequency * 2.3 - waveT * 0.7) * wave.amplitude * amplitude * 0.4;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }

    for (let i = 0; i < 60; i++) {
      const sx = seeded(i * 41 + time * 40) * width;
      const sy = seeded(i * 43 + time * 30) * height;
      const ss = seeded(i * 47) * 1.5 + 0.5;
      const sparkHue = (time * 80 + seeded(i * 59) * 60 + colorShift * 40) % 360;
      ctx.globalAlpha = seeded(i * 53) * 0.2 + 0.05;
      ctx.fillStyle = `hsl(${sparkHue}, 90%, 60%)`;
      ctx.beginPath();
      ctx.arc(sx, sy, ss, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.15;
    ctx.shadowBlur = 80;
    ctx.shadowColor = primaryColor;
    const centerGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) * 0.5);
    centerGrad.addColorStop(0, rgb(pr, pg, pb, 0.3));
    centerGrad.addColorStop(0.5, rgb(sr, sg, sb, 0.1));
    centerGrad.addColorStop(1, "transparent");
    ctx.fillStyle = centerGrad;
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

// trigger: 2026-09-09 12.51.07
