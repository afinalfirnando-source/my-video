import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { GeometricPulseProps } from "./types";

const TOTAL_FRAMES = 900;

type Shape = {
  x: number;
  y: number;
  size: number;
  sides: number;
  speed: number;
  phase: number;
  hue: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const GeometricPulse: React.FC<GeometricPulseProps> = ({
  primaryColor = "#FF4D8D",
  secondaryColor = "#FFD166",
  shapeCount = 120,
  pulseSpeed = 0.5,
  rotationSpeed = 0.4,
  glowIntensity = 0.75,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const shapes = useMemo(
    () =>
      Array.from({ length: shapeCount }, (_, i): Shape => ({
        x: seeded(i * 17 + 1) * width,
        y: seeded(i * 17 + 2) * height,
        size: seeded(i * 17 + 3) * 160 + 40,
        sides: Math.floor(seeded(i * 17 + 4) * 5) + 3,
        speed: seeded(i * 17 + 5) * 0.5 + 0.5,
        phase: seeded(i * 17 + 6) * Math.PI * 2,
        hue: seeded(i * 17 + 7) * 100 + 180,
      })),
    [width, height, shapeCount]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#05020A";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < shapes.length; i++) {
      const s = shapes[i];
      const pulse = 0.6 + Math.sin(t * s.speed * pulseSpeed + s.phase) * 0.4;
      const rotation = t * rotationSpeed * s.speed + s.phase;
      const size = s.size * pulse;
      const hue = (s.hue + time * 35) % 360;

      ctx.globalAlpha = pulse * 0.35;
      ctx.shadowBlur = 18 * glowIntensity;
      ctx.shadowColor = hsl(hue, 90, 55);
      ctx.strokeStyle = hsl(hue, 90, 55);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let j = 0; j <= s.sides; j++) {
        const angle = (j / s.sides) * Math.PI * 2 + rotation;
        const px = s.x + Math.cos(angle) * size;
        const py = s.y + Math.sin(angle) * size;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.globalAlpha = pulse * 0.12;
      ctx.fillStyle = hsl((hue + 45) % 360, 90, 50);
      ctx.fill();
    }

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 25;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 160; i++) {
      const sx = seeded(i * 41 + time * 35) * width;
      const sy = seeded(i * 43 + time * 25) * height;
      const ss = seeded(i * 47) * 2 + 0.5;
      ctx.globalAlpha = seeded(i * 53) * 0.4;
      ctx.fillStyle = hsl((time * 120 + seeded(i * 59) * 60) % 360, 100, 65);
      ctx.fillRect(sx, sy, ss, ss);
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 70 * glowIntensity;
    ctx.shadowColor = primaryColor;
    const pulseSize = Math.min(width, height) * 0.28 + Math.sin(t * 0.7) * 35;
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize);
    centerGrad.addColorStop(0, hsl((time * 50 + 280) % 360, 85, 50));
    centerGrad.addColorStop(0.7, hsl((time * 50 + 320) % 360, 75, 20));
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
