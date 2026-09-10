import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { QuantumFoamProps } from "./types";

const TOTAL_FRAMES = 900;

type Particle = {
  x: number;
  y: number;
  size: number;
  orbitR: number;
  orbitPhase: number;
  orbitSpeed: number;
  hue: number;
  entangledWith: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const QuantumFoam: React.FC<QuantumFoamProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  particleDensity = 400,
  waveIntensity = 0.7,
  entanglementStrength = 0.8,
  fieldOpacity = 0.6,
  noiseLayers = 500,
  sparkles = 200,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const particles = useMemo(
    () =>
      Array.from({ length: particleDensity }, (_, i): Particle => ({
        x: seeded(i * 13 + 1) * width,
        y: seeded(i * 13 + 2) * height,
        size: seeded(i * 13 + 3) * 3 + 1,
        orbitR: seeded(i * 13 + 4) * 100 + 50,
        orbitPhase: seeded(i * 13 + 5) * Math.PI * 2,
        orbitSpeed: seeded(i * 13 + 6) * 0.3 + 0.5,
        hue: seeded(i * 13 + 7) * 60 + 180,
        entangledWith: Math.min(particleDensity - 1, Math.floor(seeded(i * 13 + 8) * particleDensity)),
      })),
    [width, height, particleDensity]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#00000A";
    ctx.fillRect(0, 0, width, height);

    const gridSize = 15;

    ctx.globalAlpha = fieldOpacity;
    ctx.shadowBlur = 40;
    ctx.shadowColor = primaryColor;

    for (let y = 0; y < height; y += gridSize) {
      for (let x = 0; x < width; x += gridSize) {
        const wave = Math.sin(x * 0.02 + t * 0.5) * waveIntensity * 20 +
                     Math.cos(y * 0.015 + t * 0.3) * waveIntensity * 15;

        const hueShift = (time * 90 + wave * 5) % 360;
        ctx.globalAlpha = fieldOpacity * 0.5;
        ctx.fillStyle = hsl(hueShift, 85, 40 + wave * 0.2);
        ctx.fillRect(x, y, gridSize, gridSize);
      }
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 0;
    for (let i = 0; i < 10; i++) {
      const freq = 0.003 + i * 0.002;
      const amp = waveIntensity * 40;

      ctx.strokeStyle = hsl((180 + i * 25) % 360, 90, 50);
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      for (let x = 0; x < width; x += 8) {
        const y = height / 2 + Math.sin(x * freq + t * (0.5 + i * 0.1)) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.7;
    ctx.shadowBlur = 35;
    ctx.shadowColor = secondaryColor;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const orbitT = t * p.orbitSpeed + p.orbitPhase;

      const px = p.x + Math.cos(orbitT) * p.orbitR * 0.4;
      const py = p.y + Math.sin(orbitT) * p.orbitR * 0.4;

      const waveEffect = Math.sin(px * 0.01 + t) * waveIntensity * 15 + Math.cos(py * 0.008 + t * 0.7) * waveIntensity * 10;
      const pulse = 0.5 + Math.sin(t * 0.7 + p.orbitPhase) * 0.3;
      const wobble = Math.sin(t * 1.5 + p.orbitPhase) * waveEffect * 0.2;

      ctx.globalAlpha = pulse * 0.8;
      ctx.fillStyle = hsl(p.hue, 90, 50);
      ctx.beginPath();
      ctx.arc(px + wobble, py, p.size * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = pulse * 0.4;
      ctx.fillStyle = hsl((p.hue + 60) % 360, 90, 50);
      ctx.beginPath();
      ctx.arc(px + wobble, py, p.size * 3 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = pulse * 0.2;
      ctx.strokeStyle = hsl(p.hue, 90, 50);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px + wobble, py, p.size * 6 * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = entanglementStrength * 0.3;
    ctx.shadowBlur = 25;
    ctx.shadowColor = primaryColor;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const partnerIdx = p.entangledWith;
      if (i === partnerIdx) continue;

      const partner = particles[partnerIdx];
      if (!partner) continue;

      const dist = Math.sqrt(Math.pow(p.x - partner.x, 2) + Math.pow(p.y - partner.y, 2));
      if (dist < 150) {
        const alpha = (1 - dist / 150) * entanglementStrength;
        if (alpha > 0.05) {
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(partner.x, partner.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < sparkles; i++) {
      const sparkX = seeded(i * 41 + time * 80) * width;
      const sparkY = seeded(i * 43 + time * 60) * height;
      const sparkSize = seeded(i * 47) * 2 + 0.5;
      const sparkHue = (time * 180 + seeded(i * 53) * 60) % 360;

      ctx.globalAlpha = seeded(i * 59) * 0.3;
      ctx.fillStyle = hsl(sparkHue, 90, 50);
      ctx.fillRect(sparkX, sparkY, sparkSize, sparkSize);
    }

    ctx.globalAlpha = 0.2;
    ctx.shadowBlur = 40;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < noiseLayers; i++) {
      const noiseX = seeded(i * 61 + frame) * width;
      const noiseY = seeded(i * 67 + frame) * height;
      const noiseSize = seeded(i * 71) * 1.5 + 0.5;

      ctx.globalAlpha = seeded(i * 73) * 0.3;
      ctx.fillStyle = hsl((time * 60 + seeded(i * 79) * 30) % 360, 90, 50);
      ctx.fillRect(noiseX, noiseY, noiseSize, noiseSize);
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 40;
    ctx.shadowColor = primaryColor;
    const centerX = width / 2 + Math.sin(t * 0.3) * width * 0.1;
    const centerY = height / 2 + Math.cos(t * 0.2) * height * 0.1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 400, 0, Math.PI * 2);
    ctx.fill();

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
