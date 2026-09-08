import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { ParticleVortexProps } from "./types";

const TOTAL_FRAMES = 900;

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  hue: number;
  drift: number;
  phase: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const ParticleVortex: React.FC<ParticleVortexProps> = ({
  primaryColor = "#FF8C00",
  secondaryColor = "#FF0080",
  particleCount = 420,
  vortexSpeed = 0.6,
  spiralStrength = 0.8,
  coreGlow = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i): Particle => ({
        angle: seeded(i * 31 + 1) * Math.PI * 2,
        radius: seeded(i * 31 + 2) * Math.min(width, height) * 0.45 + 20,
        speed: seeded(i * 31 + 3) * 0.6 + 0.4,
        size: seeded(i * 31 + 4) * 3 + 0.5,
        hue: seeded(i * 31 + 5) * 60 + 10,
        drift: seeded(i * 31 + 6) * 0.3 + 0.1,
        phase: seeded(i * 31 + 7) * Math.PI * 2,
      })),
    [width, height, particleCount]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#050005";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angleT = t * p.speed * vortexSpeed + p.phase;
      const r = p.radius + Math.sin(angleT * 1.3 + p.phase) * 35 * spiralStrength;
      const px = cx + Math.cos(angleT) * r;
      const py = cy + Math.sin(angleT) * r;

      const hue = (p.hue + time * 45) % 360;
      const pulse = 0.5 + Math.sin(t * 1.2 + p.phase) * 0.5;

      ctx.globalAlpha = pulse * 0.75;
      ctx.fillStyle = hsl(hue, 100, 60);
      ctx.beginPath();
      ctx.arc(px, py, p.size * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = pulse * 0.25;
      ctx.fillStyle = hsl((hue + 35) % 360, 100, 50);
      ctx.beginPath();
      ctx.arc(px, py, p.size * 3 * pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.35;
    ctx.shadowBlur = 25;
    ctx.shadowColor = secondaryColor;
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angleT = t * p.speed * vortexSpeed + p.phase;
      const r = p.radius + Math.sin(angleT * 1.3 + p.phase) * 35 * spiralStrength;
      const px = cx + Math.cos(angleT) * r;
      const py = cy + Math.sin(angleT) * r;
      const angleNext = angleT + 0.18;
      const rNext = p.radius + Math.sin(angleNext * 1.3 + p.phase) * 35 * spiralStrength;
      const nx = cx + Math.cos(angleNext) * rNext;
      const ny = cy + Math.sin(angleNext) * rNext;

      ctx.globalAlpha = 0.08 + seeded(i * 17) * 0.12;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(nx, ny);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 90 * coreGlow;
    ctx.shadowColor = primaryColor;
    const pulseSize = Math.min(width, height) * 0.12 + Math.sin(t * 1.8) * 25;
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize);
    coreGrad.addColorStop(0, hsl(30, 100, 70));
    coreGrad.addColorStop(0.5, hsl(340, 100, 50));
    coreGrad.addColorStop(1, "transparent");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 70 * coreGlow;
    ctx.shadowColor = secondaryColor;
    const midGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.35);
    midGrad.addColorStop(0, hsl((time * 80 + 20) % 360, 90, 45));
    midGrad.addColorStop(1, "transparent");
    ctx.fillStyle = midGrad;
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
