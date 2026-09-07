import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { CrystalGrowthProps } from "./types";

const TOTAL_FRAMES = 900;

type Crystal = {
  x: number;
  y: number;
  maxPoints: number;
  growthSpeed: number;
  phase: number;
  rotationSpeed: number;
  hue: number;
  baseSize: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const getCrystalPoints = (x: number, y: number, radius: number, points: number, rotation: number): [number, number][] => {
  const result: [number, number][] = [];
  const outerRadius = radius;
  const innerRadius = radius * 0.4;

  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 + rotation;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    result.push([x + Math.cos(angle) * r, y + Math.sin(angle) * r]);
  }
  return result;
};

const drawCrystal = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  points: number,
  rotation: number,
  hue: number,
  alpha: number
) => {
  const vertices = getCrystalPoints(x, y, radius, points, rotation);

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, hsl(hue, 90, 70));
  gradient.addColorStop(0.5, hsl((hue + 30) % 360, 90, 50));
  gradient.addColorStop(1, hsl((hue + 60) % 360, 90, 30));

  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.strokeStyle = hsl(hue, 90, 40);
  ctx.lineWidth = 1;
  ctx.shadowBlur = 30;
  ctx.shadowColor = hsl(hue, 90, 50);

  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i][0], vertices[i][1]);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
};

export const CrystalGrowth: React.FC<CrystalGrowthProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  crystalDensity = 15,
  growthSpeed = 0.5,
  fractureIntensity = 0.6,
  refractionIntensity = 0.8,
  shineIntensity = 0.7,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const crystals = useMemo(
    () =>
      Array.from({ length: crystalDensity }, (_, i): Crystal => ({
        x: seeded(i * 17 + 1) * width,
        y: seeded(i * 17 + 2) * height,
        maxPoints: Math.floor(seeded(i * 17 + 3) * 4) + 5,
        growthSpeed: seeded(i * 17 + 4) * 0.3 + 0.5,
        phase: seeded(i * 17 + 5) * Math.PI * 2,
        rotationSpeed: seeded(i * 17 + 6) * 0.5 + 0.3,
        hue: 180 + seeded(i * 17 + 7) * 80,
        baseSize: seeded(i * 17 + 8) * 80 + 40,
      })),
    [width, height, crystalDensity]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, hsl(250, 50, 10));
    bgGradient.addColorStop(1, hsl(240, 60, 5));
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 50;
    ctx.shadowColor = primaryColor;

    for (let i = 0; i < 100; i++) {
      const sparkX = seeded(i * 31 + time * 20) * width;
      const sparkY = seeded(i * 37 + time * 15) * height;
      const sparkSize = seeded(i * 41) * 2 + 0.5;
      const sparkHue = (180 + seeded(i * 43) * 80 + time * 30) % 360;

      ctx.globalAlpha = seeded(i * 47) * 0.3;
      ctx.fillStyle = hsl(sparkHue, 90, 50);
      ctx.fillRect(sparkX, sparkY, sparkSize, sparkSize);
    }

    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 40;

    for (let i = 0; i < crystals.length; i++) {
      const c = crystals[i];
      const growthT = (time * c.growthSpeed + c.phase / (Math.PI * 2)) % 1;
      const pulse = (0.5 + Math.sin(growthT * Math.PI * 2) * 0.5) * 0.8 + 0.2;

      const currentSize = c.baseSize * pulse;
      const rotation = t * c.rotationSpeed;
      const hue = (c.hue + time * 20) % 360;

      drawCrystal(ctx, c.x, c.y, currentSize, c.maxPoints, rotation, hue, pulse * 0.8);

      ctx.globalAlpha = pulse * 0.3;
      ctx.shadowBlur = 30;
      ctx.shadowColor = secondaryColor;
      for (let ring = 0; ring < 3; ring++) {
        const ringPulse = 1 + Math.sin(t * 2 + c.phase + ring) * 0.3;
        ctx.strokeStyle = hsl((hue + ring * 30) % 360, 90, 50);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c.x, c.y, currentSize * ring * 0.5 * ringPulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (pulse > 0.9 && fractureIntensity > 0) {
        ctx.globalAlpha = 0.4;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = tertiaryColor;
        ctx.lineWidth = 2;

        const shardCount = 6;
        for (let s = 0; s < shardCount; s++) {
          const shardAngle = (s / shardCount) * Math.PI * 2 + t * 0.5;
          const shardLen = currentSize * 0.5;
          const endX = c.x + Math.cos(shardAngle) * shardLen;
          const endY = c.y + Math.sin(shardAngle) * shardLen;

          ctx.globalAlpha = 0.3 + seeded(s * 17) * 0.2;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          ctx.globalAlpha = 0.2;
          ctx.fillStyle = tertiaryColor;
          ctx.beginPath();
          ctx.arc(endX, endY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.globalAlpha = refractionIntensity * 0.3;
    ctx.shadowBlur = 60;
    ctx.shadowColor = secondaryColor;

    for (let i = 0; i < 5; i++) {
      const refractionTime = t * 0.3 + i * 2;
      const waveWidth = width * 0.4;
      const waveHeight = height * 0.3;
      const waveX = (width / 2 - waveWidth / 2) + Math.sin(refractionTime * 0.5) * 100;
      const waveY = (height / 2 - waveHeight / 2) + Math.cos(refractionTime * 0.3) * 50;

      ctx.globalAlpha = refractionIntensity * 0.15;
      ctx.fillStyle = hsl((180 + i * 40 + time * 30) % 360, 90, 50);

      ctx.save();
      ctx.globalAlpha = refractionIntensity * 0.1;
      ctx.shadowBlur = 40;
      ctx.shadowColor = hsl((180 + i * 40) % 360, 90, 50);

      for (let seg = 0; seg < 10; seg++) {
        const segT = seg / 10;
        const amplitude = Math.sin(segT * Math.PI * 2 + refractionTime) * 10;
        const y = waveY + segT * waveHeight + amplitude;
        ctx.fillRect(waveX, y, waveWidth, 20);
      }
      ctx.restore();
    }

    ctx.globalAlpha = shineIntensity * 0.4;
    ctx.shadowBlur = 50;
    ctx.shadowColor = "#FFFFFF";

    for (let i = 0; i < 50; i++) {
      const shineX = seeded(i * 53 + time * 50) * width;
      const shineY = seeded(i * 59 + time * 30) * height;
      const shineSize = seeded(i * 61) * 10 + 5;
      const shineTwinkle = 0.5 + Math.sin(t * seeded(i * 67 + 1) + seeded(i * 67 + 2)) * 0.5;

      ctx.globalAlpha = shineTwinkle * 0.3;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(shineX, shineY, shineSize * shineTwinkle, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
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
