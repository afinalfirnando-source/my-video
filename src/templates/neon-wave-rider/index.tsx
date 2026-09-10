import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { NeonWaveRiderProps } from "./types";

const TOTAL_FRAMES = 900;

type Wave = {
  amplitude: number;
  frequency: number;
  speed: number;
  yOffset: number;
  thickness: number;
  hue: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const NeonWaveRider: React.FC<NeonWaveRiderProps> = ({
  primaryColor = "#FF2A6D",
  secondaryColor = "#05FFA1",
  waveCount = 10,
  waveSpeed = 0.5,
  waveAmplitude = 0.7,
  glowIntensity = 0.8,
  trailLength = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const waves = useMemo(
    () =>
      Array.from({ length: waveCount }, (_, i): Wave => ({
        amplitude: seeded(i * 13 + 1) * 80 + 40,
        frequency: seeded(i * 13 + 2) * 0.02 + 0.005,
        speed: seeded(i * 13 + 3) * 0.5 + 0.5,
        yOffset: seeded(i * 13 + 4) * height,
        thickness: seeded(i * 13 + 5) * 4 + 2,
        hue: i * 35,
      })),
    [height, waveCount]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#020010";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < waves.length; i++) {
      const w = waves[i];
      const waveT = t * w.speed * waveSpeed;
      const hue = (w.hue + time * 50) % 360;
      ctx.globalAlpha = 0.25 + (i / waves.length) * 0.4;
      ctx.shadowBlur = 25 * glowIntensity;
      ctx.shadowColor = hsl(hue, 100, 55);
      ctx.strokeStyle = hsl(hue, 100, 55);
      ctx.lineWidth = w.thickness;
      ctx.beginPath();

      for (let x = 0; x <= width; x += 8) {
        const y =
          w.yOffset +
          Math.sin(x * w.frequency + waveT) * w.amplitude * waveAmplitude +
          Math.cos(x * w.frequency * 0.5 - waveT * 0.7) * w.amplitude * waveAmplitude * 0.5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.globalAlpha = 0.08 + trailLength * 0.15;
      ctx.lineWidth = w.thickness * 3;
      ctx.strokeStyle = hsl((hue + 40) % 360, 100, 45);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const y =
          w.yOffset +
          Math.sin(x * w.frequency + waveT + 0.3) * w.amplitude * waveAmplitude * 0.9;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 35;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 220; i++) {
      const sx = seeded(i * 41 + time * 45) * width;
      const sy = seeded(i * 43 + time * 35) * height;
      const ss = seeded(i * 47) * 2 + 0.5;
      ctx.globalAlpha = seeded(i * 53) * 0.4;
      ctx.fillStyle = hsl((time * 150 + seeded(i * 59) * 60) % 360, 100, 65);
      ctx.fillRect(sx, sy, ss, ss);
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 70;
    ctx.shadowColor = primaryColor;
    const centerY = height / 2 + Math.sin(t * 0.4) * height * 0.08;
    const centerGrad = ctx.createRadialGradient(width / 2, centerY, 0, width / 2, centerY, Math.min(width, height) * 0.5);
    centerGrad.addColorStop(0, hsl((time * 70 + 300) % 360, 90, 45));
    centerGrad.addColorStop(0.7, hsl((time * 70 + 340) % 360, 80, 15));
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
