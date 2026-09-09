import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { AuroraBorealisProps } from "./types";

const TOTAL_FRAMES = 900;

type Curtain = {
  startX: number;
  width: number;
  waveAmplitude: number;
  waveFrequency: number;
  waveSpeed: number;
  hueShift: number;
  phase: number;
};

type Star = {
  x: number;
  y: number;
  size: number;
  twinklePhase: number;
  twinkleSpeed: number;
  brightness: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const AuroraBorealis: React.FC<AuroraBorealisProps> = ({
  curtainCount = 15,
  waveSpeed = 0.4,
  starDensity = 200,
  colorShift = 0.3,
  primaryColor = "#00FF87",
  secondaryColor = "#60A5FA",
  tertiaryColor = "#A855F7",
  backgroundColor = "#0F172A",
  glowIntensity = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const parseHex = (hex: string): [number, number, number] => {
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  };

  const [p1r, p1g, p1b] = parseHex(primaryColor);
  const [p2r, p2g, p2b] = parseHex(secondaryColor);
  const [p3r, p3g, p3b] = parseHex(tertiaryColor);

  const curtains = useMemo(
    () =>
      Array.from({ length: curtainCount }, (_, i): Curtain => ({
        startX: seeded(i * 13 + 1) * width,
        width: seeded(i * 13 + 2) * 350 + 200,
        waveAmplitude: seeded(i * 13 + 3) * 100 + 50,
        waveFrequency: seeded(i * 13 + 4) * 0.008 + 0.004,
        waveSpeed: seeded(i * 13 + 5) * 0.6 + 0.3,
        hueShift: seeded(i * 13 + 6) * 40 - 20,
        phase: seeded(i * 13 + 7) * Math.PI * 2,
      })),
    [width, curtainCount]
  );

  const stars = useMemo(
    () =>
      Array.from({ length: starDensity }, (_, i): Star => ({
        x: seeded(i * 31 + 1) * width,
        y: seeded(i * 31 + 2) * height * 0.7,
        size: seeded(i * 31 + 3) * 2 + 0.3,
        twinklePhase: seeded(i * 31 + 4) * Math.PI * 2,
        twinkleSpeed: seeded(i * 31 + 5) * 0.6 + 0.3,
        brightness: seeded(i * 31 + 6) * 0.5 + 0.5,
      })),
    [width, height, starDensity]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = s.brightness * (0.5 + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.5);

      ctx.globalAlpha = twinkle * 0.8;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * twinkle, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < curtains.length; i++) {
      const c = curtains[i];
      const waveT = t * c.waveSpeed * waveSpeed + c.phase;
      const colorMix = i % 3;
      const baseColor = colorMix === 0 ? [p1r, p1g, p1b] : colorMix === 1 ? [p2r, p2g, p2b] : [p3r, p3g, p3b];
      const shiftedR = Math.min(255, Math.max(0, baseColor[0] + Math.sin(time * colorShift * 10 + i) * 30));
      const shiftedG = Math.min(255, Math.max(0, baseColor[1] + Math.sin(time * colorShift * 10 + i + 2) * 30));
      const shiftedB = Math.min(255, Math.max(0, baseColor[2] + Math.sin(time * colorShift * 10 + i + 4) * 30));

      ctx.globalAlpha = glowIntensity * 0.4;
      ctx.shadowBlur = 30;
      ctx.shadowColor = `rgb(${shiftedR},${shiftedG},${shiftedB})`;
      ctx.fillStyle = `rgba(${shiftedR},${shiftedG},${shiftedB},0.5)`;

      const topY = height * 0.15;
      const bottomY = height * 0.85;

      ctx.beginPath();
      for (let y = topY; y <= bottomY; y += 3) {
        const waveOffset = Math.sin((y - topY) * c.waveFrequency + waveT) * c.waveAmplitude;
        const x = c.startX + waveOffset;
        if (y === topY) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineTo(c.startX, bottomY);
      ctx.lineTo(c.startX + c.width, bottomY);

      const waveOffset2 = Math.sin((bottomY - topY) * c.waveFrequency + waveT) * c.waveAmplitude;
      ctx.lineTo(c.startX + c.width + waveOffset2, topY);
      ctx.closePath();
      ctx.fill();
    }

    ctx.globalAlpha = 0.2 * glowIntensity;
    ctx.shadowBlur = 40;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 8; i++) {
      const interT = t * 0.4 + i * 0.8;
      const amp = height * 0.06;
      const freq = 0.004 + i * 0.002;
      ctx.strokeStyle = `rgba(${p2r},${p2g},${p2b},0.4)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let x = 0; x <= width; x += 4) {
        const y1 = height * 0.35 + Math.sin(x * freq + interT) * amp;
        if (x === 0) ctx.moveTo(x, y1);
        else ctx.lineTo(x, y1);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 35;
    ctx.shadowColor = tertiaryColor;
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < 8; i++) {
      const radius = i * 70 + 40 + Math.sin(t * 0.4 + i * 0.8) * 20;
      const pulse = 0.6 + Math.sin(t * 0.6 + i * 0.7) * 0.4;
      ctx.globalAlpha = pulse * 0.25;
      ctx.strokeStyle = `rgba(${p3r},${p3g},${p3b},0.6)`;
      ctx.lineWidth = pulse * 2.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < 150; i++) {
      const sparkX = seeded(i * 43 + time * 60) * width;
      const sparkY = seeded(i * 47 + time * 40) * height * 0.8;
      const sparkSize = seeded(i * 53) * 1.8 + 0.3;
      const sparkAlpha = 0.15 + seeded(i * 59) * 0.25;
      ctx.globalAlpha = sparkAlpha;
      ctx.fillStyle = `rgba(${p1r},${p1g},${p1b},0.8)`;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.25;
    ctx.shadowBlur = 50;
    ctx.shadowColor = secondaryColor;
    const horizonY = height * 0.82 + Math.sin(t * 0.25) * 20;
    const horizonGrad = ctx.createLinearGradient(0, horizonY - 60, 0, horizonY + 40);
    horizonGrad.addColorStop(0, `rgba(${p2r},${p2g},${p2b},0.3)`);
    horizonGrad.addColorStop(1, "transparent");
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, horizonY - 60, width, 100);

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
