import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { OceanicDepthsProps } from "./types";

const TOTAL_FRAMES = 900;

type Bubble = {
  x: number;
  size: number;
  riseSpeed: number;
  drift: number;
  phase: number;
  wobble: number;
};

type Particle = {
  x: number;
  baseY: number;
  size: number;
  flickerPhase: number;
  flickerSpeed: number;
  hue: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const OceanicDepths: React.FC<OceanicDepthsProps> = ({
  waterColor = "#1E3A8A",
  lightColor = "#FFFFFF",
  bioluminescentColor = "#00F0FF",
  causticIntensity = 0.8,
  bubbleCount = 200,
  particleDensity = 200,
  currentSpeed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const bubbles = useMemo(
    () =>
      Array.from({ length: bubbleCount }, (_, i): Bubble => ({
        x: seeded(i * 13 + 1) * width,
        size: seeded(i * 13 + 2) * 20 + 5,
        riseSpeed: seeded(i * 13 + 3) * 0.5 + 0.5,
        drift: seeded(i * 13 + 4) * 0.3,
        phase: seeded(i * 13 + 5) * Math.PI * 2,
        wobble: seeded(i * 13 + 6) * 0.5,
      })),
    [width, height, bubbleCount]
  );

  const particles = useMemo(
    () =>
      Array.from({ length: particleDensity }, (_, i): Particle => ({
        x: seeded(i * 31 + 1) * width,
        baseY: seeded(i * 31 + 2) * height,
        size: seeded(i * 31 + 3) * 2 + 0.5,
        flickerPhase: seeded(i * 31 + 4) * Math.PI * 2,
        flickerSpeed: seeded(i * 31 + 5) * 2 + 1,
        hue: seeded(i * 31 + 6) * 60,
      })),
    [width, height, particleDensity]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    const waterGradient = ctx.createLinearGradient(0, 0, 0, height);
    waterGradient.addColorStop(0, hsl(210, 70, 25));
    waterGradient.addColorStop(0.5, hsl(210, 80, 15));
    waterGradient.addColorStop(1, hsl(210, 90, 5));
    ctx.fillStyle = waterGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 40;
    ctx.shadowColor = lightColor;
    const lightX = width / 2 + Math.sin(t * 0.1) * width * 0.4;
    const lightGradient = ctx.createRadialGradient(lightX, 100, 0, lightX, 100, 600);
    lightGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
    lightGradient.addColorStop(1, "rgba(0, 30, 80, 0)");
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = lightColor;

    for (let i = 0; i < 50; i++) {
      const waveT = t * currentSpeed * (0.5 + i * 0.1) + i * 0.5;
      const amplitude = height * 0.02 * causticIntensity;
      const frequency = 0.01 + i * 0.002;

      ctx.globalAlpha = (0.3 + i * 0.02) * causticIntensity;
      ctx.strokeStyle = hsl(190, 90, 60 + i * 2);
      ctx.lineWidth = 80 + i * 30;
      ctx.beginPath();

      for (let x = 0; x < width; x += 5) {
        const y = 200 + (i * 40) + Math.sin(x * frequency + waveT) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 20;
    ctx.shadowColor = bioluminescentColor;

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      const riseProgress = (time * b.riseSpeed + b.phase / (Math.PI * 2)) % 1;
      const py = height - (riseProgress * (height + b.size * 2)) - b.size;
      const driftX = Math.sin(riseProgress * Math.PI * 2 * b.wobble + b.phase) * b.drift * 50;
      const px = b.x + driftX;

      const wobbleX = Math.sin(t * 0.5 + b.phase) * 2;
      const finalX = px + wobbleX;

      const bubbleAlpha = Math.max(0, Math.min(1, py / height));
      ctx.globalAlpha = bubbleAlpha * 0.4;

      const bubbleGradient = ctx.createRadialGradient(
        finalX - b.size / 4, py - b.size / 4, 0,
        finalX, py, b.size
      );
      bubbleGradient.addColorStop(0, hsl(200, 50, 80));
      bubbleGradient.addColorStop(1, "rgba(100, 200, 255, 0)");

      ctx.fillStyle = bubbleGradient;
      ctx.beginPath();
      ctx.arc(finalX, py, b.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = hsl(200, 60, 70);
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.globalAlpha = 0.7;
    ctx.shadowBlur = 15;
    ctx.shadowColor = bioluminescentColor;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const flicker = 0.3 + Math.sin(t * p.flickerSpeed + p.flickerPhase) * 0.2;

      ctx.globalAlpha = flicker;
      ctx.fillStyle = hsl(p.hue + time * 30, 90, 50);
      ctx.beginPath();
      ctx.arc(p.x, p.baseY, p.size * flicker, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = flicker * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.baseY, p.size * 5 * flicker, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.2;
    ctx.shadowBlur = 30;
    ctx.shadowColor = lightColor;
    const currentX = (time * width * 0.3) % width;
    ctx.fillStyle = lightColor;
    ctx.fillRect(currentX, 0, 100, height);

    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 100; i++) {
      const sparkX = seeded(i * 43 + time * 50) * width;
      const sparkY = seeded(i * 47 + time * 30) * height;
      const sparkSize = seeded(i * 53) * 1.5 + 0.5;
      const sparkAlpha = seeded(i * 59) * 0.3 + 0.1;

      ctx.globalAlpha = sparkAlpha;
      ctx.fillStyle = hsl((seeded(i * 61) * 60 + 190) % 360, 90, 50);
      ctx.fillRect(sparkX, sparkY, sparkSize, sparkSize);
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.restore();
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
