import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { GradientAuroraProps } from "./types";

const TOTAL_FRAMES = 900;

type AuroraBand = {
  yOffset: number;
  amplitude: number;
  frequency: number;
  speed: number;
  hue: number;
  thickness: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const GradientAurora: React.FC<GradientAuroraProps> = ({
  primaryColor = "#00FF87",
  secondaryColor = "#60A5FA",
  bandCount = 9,
  flowSpeed = 0.35,
  waveAmplitude = 0.7,
  glowIntensity = 0.75,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const bands = useMemo(
    () =>
      Array.from({ length: bandCount }, (_, i): AuroraBand => ({
        yOffset: seeded(i * 17 + 1) * height,
        amplitude: seeded(i * 17 + 2) * 90 + 30,
        frequency: seeded(i * 17 + 3) * 0.015 + 0.004,
        speed: seeded(i * 17 + 4) * 0.4 + 0.3,
        hue: i * 28 + 120,
        thickness: seeded(i * 17 + 5) * 180 + 140,
      })),
    [height, bandCount]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#020812";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];
      const bandT = t * band.speed * flowSpeed;
      const hue = (band.hue + time * 25) % 360;

      ctx.globalAlpha = 0.18 + (i / bands.length) * 0.35;
      ctx.shadowBlur = 45 * glowIntensity;
      ctx.shadowColor = hsl(hue, 80, 55);
      ctx.fillStyle = hsl(hue, 80, 55);

      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const y =
          band.yOffset +
          Math.sin(x * band.frequency + bandT) * band.amplitude * waveAmplitude +
          Math.cos(x * band.frequency * 0.6 - bandT * 0.8) * band.amplitude * waveAmplitude * 0.6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
    }

    ctx.globalAlpha = 0.55;
    ctx.shadowBlur = 35;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 140; i++) {
      const sx = seeded(i * 41 + time * 30) * width;
      const sy = seeded(i * 43 + time * 25) * height;
      const ss = seeded(i * 47) * 1.5 + 0.5;
      ctx.globalAlpha = seeded(i * 53) * 0.4;
      ctx.fillStyle = hsl((time * 90 + seeded(i * 59) * 50) % 360, 90, 70);
      ctx.fillRect(sx, sy, ss, ss);
    }

    ctx.globalAlpha = 0.35;
    ctx.shadowBlur = 60;
    ctx.shadowColor = primaryColor;
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, hsl((time * 30 + 160) % 360, 80, 40));
    grad.addColorStop(0.5, hsl((time * 30 + 220) % 360, 70, 25));
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
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
