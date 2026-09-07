import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef, useEffect } from "react";
import type { QuantumParticlesProps } from "./types";

const TOTAL_FRAMES = 900;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const QuantumParticles: React.FC<QuantumParticlesProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  particleCount = 150,
  particleSize = 3,
  glowIntensity = 0.8,
  connectionDistance = 120,
  driftSpeed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i): Particle => ({
        x: seeded(i * 7 + 1) * width,
        y: seeded(i * 7 + 2) * height,
        vx: (seeded(i * 7 + 3) - 0.5) * 0.3,
        vy: (seeded(i * 7 + 4) - 0.5) * 0.3,
        size: seeded(i * 7 + 5) * particleSize + 1,
        phase: seeded(i * 7 + 6) * Math.PI * 2,
      })),
    [width, height, particleCount, particleSize]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const driftX = Math.sin(time * Math.PI * 2 + 0.3) * 30 * driftSpeed;
    const driftY = Math.cos(time * Math.PI * 2 + 0.7) * 20 * driftSpeed;

    ctx.save();
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.shadowColor = primaryColor;
    ctx.globalAlpha = 0.9;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * driftSpeed + driftX * 0.01;
      p.y += p.vy * driftSpeed + driftY * 0.01;

      if (p.x < -50) p.x = width + 50;
      if (p.x > width + 50) p.x = -50;
      if (p.y < -50) p.y = height + 50;
      if (p.y > height + 50) p.y = -50;

      const pulse = 0.7 + Math.sin(time * Math.PI * 2 + p.phase) * 0.3;

      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = pulse * 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = pulse * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 15 * glowIntensity;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = 1 - dist / connectionDistance;
          ctx.globalAlpha = alpha * 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  });

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
