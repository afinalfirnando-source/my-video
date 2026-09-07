import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { NebulaDriftProps } from "./types";

const TOTAL_FRAMES = 900;

type GasCloud = {
  cx: number;
  cy: number;
  baseRadius: number;
  swirlSpeed: number;
  swirlPhase: number;
  hueOffset: number;
};

type StarParticle = {
  x: number;
  y: number;
  size: number;
  twinklePhase: number;
  twinkleSpeed: number;
  driftAmp: number;
  driftFreq: number;
  hue: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const NebulaDrift: React.FC<NebulaDriftProps> = ({
  primaryColor = "#8A2BE2",
  secondaryColor = "#00F0FF",
  tertiaryColor = "#FF69B4",
  swirlIntensity = 0.8,
  particleDensity = 300,
  glowIntensity = 0.7,
  layerSpeed = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const clouds = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i): GasCloud => ({
        cx: seeded(i * 13 + 1) * width,
        cy: seeded(i * 13 + 2) * height,
        baseRadius: seeded(i * 13 + 3) * 300 + 200,
        swirlSpeed: seeded(i * 13 + 4) * 0.3 + 0.2,
        swirlPhase: seeded(i * 13 + 5) * Math.PI * 2,
        hueOffset: seeded(i * 13 + 6) * 120,
      })),
    [width, height]
  );

  const particles = useMemo(
    () =>
      Array.from({ length: particleDensity }, (_, i): StarParticle => ({
        x: seeded(i * 31 + 1) * width,
        y: seeded(i * 31 + 2) * height,
        size: seeded(i * 31 + 3) * 3 + 0.5,
        twinklePhase: seeded(i * 31 + 4) * Math.PI * 2,
        twinkleSpeed: seeded(i * 31 + 5) * 0.5 + 0.3,
        driftAmp: seeded(i * 31 + 6) * 100 + 20,
        driftFreq: seeded(i * 31 + 7) * 0.3 + 0.3,
        hue: seeded(i * 31 + 8) * 120,
      })),
    [width, height, particleDensity]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    for (let layer = 0; layer < 3; layer++) {
      const layerTime = t * layerSpeed * (0.7 + layer * 0.3);
      const layerScale = 0.8 + layer * 0.2;

      ctx.globalAlpha = 0.4 - layer * 0.1;
      ctx.shadowBlur = 80 * glowIntensity;
      ctx.shadowColor = layer === 0 ? primaryColor : layer === 1 ? secondaryColor : tertiaryColor;

      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        const swirlT = layerTime * c.swirlSpeed + c.swirlPhase + layer * 1.5;

        const swirlX = Math.cos(swirlT) * c.baseRadius * swirlIntensity * 0.3;
        const swirlY = Math.sin(swirlT) * c.baseRadius * swirlIntensity * 0.3;

        const hue = (c.hueOffset + (layer * 80) + time * 20) % 360;
        const gradient = ctx.createRadialGradient(
          c.cx + swirlX, c.cy + swirlY, 0,
          c.cx + swirlX, c.cy + swirlY, c.baseRadius * layerScale
        );

        gradient.addColorStop(0, hsl(hue, 80, 60));
        gradient.addColorStop(0.5, hsl((hue + 60) % 360, 70, 40));
        gradient.addColorStop(1, hsl((hue + 120) % 360, 60, 10));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(c.cx + swirlX, c.cy + swirlY, c.baseRadius * layerScale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 20;
    ctx.shadowColor = primaryColor;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const driftT = t * p.driftFreq + p.twinklePhase;
      const px = p.x + Math.sin(driftT) * p.driftAmp;
      const py = p.y + Math.cos(driftT) * p.driftAmp;

      const twinkle = 0.5 + Math.sin(t * p.twinkleSpeed + p.twinklePhase) * 0.5;

      ctx.globalAlpha = twinkle * 0.8;
      ctx.fillStyle = hsl(p.hue + time * 30, 90, 60);
      ctx.beginPath();
      ctx.arc(px, py, p.size * twinkle, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = twinkle * 0.3;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 3 * twinkle, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 60;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 200; i++) {
      const sparkT = t * 0.3 + seeded(i * 73);
      const sx = seeded(i * 73 + 1) * width;
      const sy = seeded(i * 73 + 2) * height;
      const sparkle = 0.3 + Math.sin(sparkT * 10) * 0.2;
      const ssh = (time * 100 + seeded(i * 73 + 3) * 60) % 360;

      ctx.globalAlpha = sparkle;
      ctx.fillStyle = hsl(ssh, 100, 70);
      const ss = seeded(i * 73 + 4) * 1.5 + 0.5;
      ctx.fillRect(sx, sy, ss, ss);
    }

    ctx.shadowBlur = 40;
    ctx.shadowColor = tertiaryColor;
    ctx.globalAlpha = 0.4;
    const pulseSize = Math.min(width, height) * 0.4 + Math.sin(t * 0.5) * 50;
    const hueCenter = (time * 120) % 360;
    const centerGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, pulseSize);
    centerGradient.addColorStop(0, hsl(hueCenter, 80, 50));
    centerGradient.addColorStop(0.5, hsl((hueCenter + 60) % 360, 70, 40));
    centerGradient.addColorStop(1, "transparent");
    ctx.fillStyle = centerGradient;
    ctx.fillRect(0, 0, width, height);

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
