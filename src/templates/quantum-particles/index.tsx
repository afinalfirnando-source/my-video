import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { QuantumParticlesProps } from "./types";

type Star = {
  x: number;
  y: number;
  blinkFreq: number;
  blinkPhase: number;
  baseSize: number;
  color: number;
};

type NoiseDot = {
  x: number;
  y: number;
  pulseFreq: number;
  pulsePhase: number;
  color: number;
};

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

const STAR_COUNT = 300;
const NOISE_DOT_COUNT = 500;

export const QuantumParticles: React.FC<QuantumParticlesProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  particleCount = 1000,
  particleSize = 4,
  glowIntensity = 1,
  connectionDistance = 250,
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
        orbitRadius: (seeded(i * 7 + 3) - 0.5) * 100 + 50,
        orbitSpeed: seeded(i * 7 + 4) * 0.5 + 0.3,
        orbitPhase: seeded(i * 7 + 5) * Math.PI * 2,
        driftAmp: seeded(i * 7 + 6) * 300 + 100,
        driftFreq: seeded(i * 7 + 8) * 0.3 + 0.5,
        size: seeded(i * 7 + 9) * particleSize + 2,
        basePhase: seeded(i * 7 + 10) * Math.PI * 2,
      })),
    [width, height, particleCount, particleSize]
  );

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i): Star => ({
        x: seeded(i * 13 + 100) * width,
        y: seeded(i * 13 + 200) * height,
        blinkFreq: seeded(i * 13 + 300) * 2 + 1,
        blinkPhase: seeded(i * 13 + 400) * Math.PI * 2,
        baseSize: seeded(i * 13 + 500) * 2 + 0.5,
        color: i % 3,
      })),
    [width, height]
  );

  const noiseDots = useMemo(
    () =>
      Array.from({ length: NOISE_DOT_COUNT }, (_, i): NoiseDot => ({
        x: seeded(i * 31 + 1000) * width,
        y: seeded(i * 31 + 2000) * height,
        pulseFreq: seeded(i * 31 + 3000) * 5 + 3,
        pulsePhase: seeded(i * 31 + 4000) * Math.PI * 2,
        color: i % 3,
      })),
    [width, height]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.shadowBlur = 25;
    ctx.shadowColor = primaryColor;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const blink = 0.5 + Math.sin(t * s.blinkFreq + s.blinkPhase) * 0.5;

      ctx.globalAlpha = blink * 0.6;
      ctx.fillStyle = s.color === 0 ? primaryColor : secondaryColor;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.baseSize * blink, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 35;
    ctx.shadowColor = secondaryColor;

    for (let i = 0; i < noiseDots.length; i++) {
      const n = noiseDots[i];
      const pulse = 0.3 + Math.sin(t * n.pulseFreq + n.pulsePhase) * 0.2;
      const hue = (time * 360 + n.color * 120) % 360;

      ctx.globalAlpha = pulse;
      ctx.fillStyle = `hsl(${hue}, 90%, 60%)`;
      const ns = seeded(i * 37) * 3 + 1;
      ctx.fillRect(n.x, n.y, ns, ns);
    }

    ctx.shadowBlur = 40 * glowIntensity;
    ctx.shadowColor = primaryColor;

    const positions: { x: number; y: number }[] = [];

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const orbitT = t * p.orbitSpeed + p.orbitPhase;
      const driftT = t * p.driftFreq + p.basePhase;

      const px = p.baseX + Math.cos(orbitT) * p.orbitRadius + Math.sin(driftT) * p.driftAmp * driftSpeed;
      const py = p.baseY + Math.sin(orbitT) * p.orbitRadius + Math.cos(driftT) * p.driftAmp * driftSpeed;

      positions.push({ x: px, y: py });

      const pulse = 0.7 + Math.sin(t + p.basePhase) * 0.3;

      for (let trailIdx = 0; trailIdx < 3; trailIdx++) {
        const trailOffset = 10 * (trailIdx + 1);
        const trailX = px - Math.cos(orbitT + p.basePhase) * p.size * trailOffset;
        const trailY = py - Math.sin(orbitT + p.basePhase) * p.size * trailOffset;
        ctx.globalAlpha = trailIntensity * 0.3 * (1 - trailIdx * 0.3);
        ctx.fillStyle = trailIdx % 2 === 0 ? secondaryColor : primaryColor;
        ctx.beginPath();
        ctx.arc(trailX, trailY, p.size * pulse * (0.5 - trailIdx * 0.15), 0, Math.PI * 2);
        ctx.fill();
      }

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
      ctx.arc(px, py, p.size * 5 * ringPulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = pulse * 0.15;
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 8 * ringPulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const alpha = 1 - dist / 100;
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath();
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);
          ctx.stroke();
        }

        if (dist < connectionDistance) {
          const alpha = 1 - dist / connectionDistance;
          ctx.globalAlpha = alpha * 0.2;
          ctx.beginPath();
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 50;
    ctx.shadowColor = secondaryColor;
    const beamCount = 12;
    for (let i = 0; i < beamCount; i++) {
      const angle = (t + (i / beamCount) * Math.PI * 2);
      const len = 300 + Math.sin(t * 2 + i) * 100;
      const beamPulse = 0.5 + Math.sin(t * 3 + i * 0.5) * 0.5;

      ctx.globalAlpha = beamPulse * 0.2;
      ctx.strokeStyle = `hsl(${(time * 360 + i * 30) % 360}, 90%, 50%)`;
      ctx.lineWidth = beamPulse * 3;
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(
        width / 2 + Math.cos(angle) * len,
        height / 2 + Math.sin(angle) * len
      );
      ctx.stroke();
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
