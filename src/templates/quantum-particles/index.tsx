import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { QuantumParticlesProps } from "./types";

const TOTAL_FRAMES = 900;

type Particle = {
  baseX: number;
  baseY: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  driftAmp: number;
  driftFreq: number;
  size: number;
  basePhase: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const QuantumParticles: React.FC<QuantumParticlesProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  particleCount = 1000,
  particleSize = 4,
  glowIntensity = 1,
  connectionDistance = 200,
  driftSpeed = 0.8,
  trailIntensity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i): Particle => ({
        baseX: seeded(i * 7 + 1) * width,
        baseY: seeded(i * 7 + 2) * height,
        orbitRadius: (seeded(i * 7 + 3) - 0.5) * 80 + 40,
        orbitSpeed: seeded(i * 7 + 4) * 0.5 + 0.3,
        orbitPhase: seeded(i * 7 + 5) * Math.PI * 2,
        driftAmp: seeded(i * 7 + 6) * 200 + 50,
        driftFreq: seeded(i * 7 + 8) * 0.3 + 0.5,
        size: seeded(i * 7 + 9) * particleSize + 1.5,
        basePhase: seeded(i * 7 + 10) * Math.PI * 2,
      })),
    [width, height, particleCount, particleSize]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, width, height);

    const positions: { x: number; y: number }[] = [];

    ctx.save();
    ctx.shadowBlur = 30 * glowIntensity;
    ctx.shadowColor = primaryColor;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const orbitT = t * p.orbitSpeed + p.orbitPhase;
      const driftT = t * p.driftFreq + p.basePhase;

      const px = p.baseX + Math.cos(orbitT) * p.orbitRadius + Math.sin(driftT) * p.driftAmp * driftSpeed;
      const py = p.baseY + Math.sin(orbitT) * p.orbitRadius + Math.cos(driftT) * p.driftAmp * driftSpeed;

      positions.push({ x: px, y: py });

      const pulse = 0.7 + Math.sin(t + p.basePhase) * 0.3;

      const trailX = px + Math.cos(orbitT + p.basePhase) * p.size * 4;
      const trailY = py + Math.sin(orbitT + p.basePhase) * p.size * 4;
      ctx.globalAlpha = trailIntensity * 0.4;
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.arc(trailX, trailY, p.size * pulse * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = pulse * 0.9;
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.arc(px, py, p.size * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = pulse * 0.5;
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 0.6 * pulse, 0, Math.PI * 2);
      ctx.fill();

      const ringPulse = 1 + Math.sin(t + p.basePhase) * 0.3;
      ctx.globalAlpha = pulse * 0.25;
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 4 * ringPulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = 1 - dist / connectionDistance;
          ctx.globalAlpha = alpha * 0.4;
          ctx.beginPath();
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);
          ctx.stroke();
        }
      }
    }

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
