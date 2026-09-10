import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { PlasmaVortexProps } from "./types";

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

export const PlasmaVortex: React.FC<PlasmaVortexProps> = ({
  particleCount = 1500,
  vortexSpeed = 0.6,
  spiralStrength = 0.8,
  coreGlow = 0.9,
  trailLength = 0.6,
  primaryColor = "#FF8C00",
  secondaryColor = "#FF0080",
  backgroundColor = "#0A0A1A",
  glowIntensity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const [pr, pg, pb] = [parseInt(primaryColor.slice(1, 3), 16), parseInt(primaryColor.slice(3, 5), 16), parseInt(primaryColor.slice(5, 7), 16)];
  const [sr, sg, sb] = [parseInt(secondaryColor.slice(1, 3), 16), parseInt(secondaryColor.slice(3, 5), 16), parseInt(secondaryColor.slice(5, 7), 16)];

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i): Particle => ({
        angle: seeded(i * 31 + 1) * Math.PI * 2,
        radius: seeded(i * 31 + 2) * Math.min(width, height) * 0.48 + 15,
        speed: seeded(i * 31 + 3) * 0.7 + 0.3,
        size: seeded(i * 31 + 4) * 2.8 + 0.4,
        hue: seeded(i * 31 + 5) * 50 + 10,
        drift: seeded(i * 31 + 6) * 0.35 + 0.1,
        phase: seeded(i * 31 + 7) * Math.PI * 2,
      })),
    [width, height, particleCount]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angleT = ((t * p.speed * vortexSpeed + p.phase) % (Math.PI * 2));
      const r = p.radius + Math.sin(angleT * 1.4 + p.phase) * 40 * spiralStrength;
      const px = cx + Math.cos(angleT) * r;
      const py = cy + Math.sin(angleT) * r;

      const hue = (p.hue + time * 50) % 360;
      const pulse = 0.45 + Math.sin(t * 1.3 + p.phase) * 0.55;

      ctx.globalAlpha = pulse * 0.7;
      ctx.fillStyle = hsl(hue, 100, 60);
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.01, p.size * pulse), 0, Math.PI * 2);
      ctx.fill();

      if (trailLength > 0) {
        const trailAngle = angleT - 0.22;
        const trailR = p.radius + Math.sin(trailAngle * 1.4 + p.phase) * 40 * spiralStrength;
        const tx = cx + Math.cos(trailAngle) * trailR;
        const ty = cy + Math.sin(trailAngle) * trailR;

        ctx.globalAlpha = pulse * 0.18 * trailLength;
        ctx.strokeStyle = hsl((hue + 25) % 360, 100, 55);
        ctx.lineWidth = p.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = `rgba(${sr},${sg},${sb},0.15)`;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angleT = ((t * p.speed * vortexSpeed + p.phase) % (Math.PI * 2));
      const r = p.radius + Math.sin(angleT * 1.4 + p.phase) * 40 * spiralStrength;
      const px = cx + Math.cos(angleT) * r;
      const py = cy + Math.sin(angleT) * r;
      const angleNext = angleT + 0.16;
      const rNext = p.radius + Math.sin(angleNext * 1.4 + p.phase) * 40 * spiralStrength;
      const nx = cx + Math.cos(angleNext) * rNext;
      const ny = cy + Math.sin(angleNext) * rNext;

      ctx.globalAlpha = 0.06 + seeded(i * 17) * 0.08;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(nx, ny);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.55;
    ctx.shadowBlur = 100 * coreGlow;
    ctx.shadowColor = primaryColor;
    const pulseSize = Math.min(width, height) * 0.11 + Math.sin(t * 1.9) * 30;
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize);
    coreGrad.addColorStop(0, `rgb(${pr},${pg},${pb})`);
    coreGrad.addColorStop(0.4, `rgb(${sr},${sg},${sb})`);
    coreGrad.addColorStop(1, "transparent");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.35 * glowIntensity;
    ctx.shadowBlur = 80 * coreGlow;
    ctx.shadowColor = secondaryColor;
    const midGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.4);
    midGrad.addColorStop(0, `rgba(${pr},${pg},${pb},0.35)`);
    midGrad.addColorStop(0.6, `rgba(${sr},${sg},${sb},0.1)`);
    midGrad.addColorStop(1, "transparent");
    ctx.fillStyle = midGrad;
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
