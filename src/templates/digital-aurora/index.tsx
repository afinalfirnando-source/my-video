import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { DigitalAuroraProps } from "./types";

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
  hue: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const DigitalAurora: React.FC<DigitalAuroraProps> = ({
  primaryColor = "#00FF00",
  secondaryColor = "#00FFFF",
  tertiaryColor = "#FF00FF",
  auroraIntensity = 0.8,
  curtainCount = 15,
  interferenceIntensity = 0.6,
  starDensity = 200,
  waveSpeed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const curtains = useMemo(
    () =>
      Array.from({ length: curtainCount }, (_, i): Curtain => ({
        startX: seeded(i * 13 + 1) * width,
        width: seeded(i * 13 + 2) * 300 + 150,
        waveAmplitude: seeded(i * 13 + 3) * 80 + 40,
        waveFrequency: seeded(i * 13 + 4) * 0.01 + 0.005,
        waveSpeed: seeded(i * 13 + 5) * 0.5 + 0.3,
        hueShift: seeded(i * 13 + 6) * 60,
        phase: seeded(i * 13 + 7) * Math.PI * 2,
      })),
    [width, height, curtainCount]
  );

  const stars = useMemo(
    () =>
      Array.from({ length: starDensity }, (_, i): Star => ({
        x: seeded(i * 31 + 1) * width,
        y: seeded(i * 31 + 2) * height,
        size: seeded(i * 31 + 3) * 2 + 0.5,
        twinklePhase: seeded(i * 31 + 4) * Math.PI * 2,
        twinkleSpeed: seeded(i * 31 + 5) * 0.5 + 0.3,
        hue: seeded(i * 31 + 6) * 60,
      })),
    [width, height, starDensity]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FFFFFF";

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = 0.5 + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.5;

      ctx.globalAlpha = twinkle * 0.6;
      ctx.fillStyle = hsl(s.hue + time * 20, 90, 50);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * twinkle, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 30;
    ctx.shadowColor = primaryColor;

    for (let i = 0; i < curtains.length; i++) {
      const c = curtains[i];
      const waveT = t * c.waveSpeed * waveSpeed + c.phase;
      const hue = (c.hueShift + time * 30) % 360;

      ctx.globalAlpha = auroraIntensity * 0.5;
      ctx.shadowBlur = 30;
      ctx.shadowColor = hsl(hue, 90, 50);

      ctx.fillStyle = hsl(hue, 90, 50);
      ctx.strokeStyle = hsl(hue, 90, 30);
      ctx.lineWidth = 2;
      ctx.beginPath();

      const topY = height * 0.2;
      const bottomY = height * 0.8;

      for (let y = topY; y < bottomY; y += 2) {
        const waveOffset = Math.sin((y - topY) * c.waveFrequency + waveT) * c.waveAmplitude;
        const x = c.startX + waveOffset;

        if (y === topY) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(c.startX, bottomY);
      ctx.lineTo(c.startX + c.width, bottomY);

      const waveOffset2 = Math.sin((bottomY - topY) * c.waveFrequency + waveT) * c.waveAmplitude;
      ctx.lineTo(c.startX + c.width + waveOffset2, topY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.globalAlpha = interferenceIntensity * 0.4;
    ctx.shadowBlur = 40;
    ctx.shadowColor = secondaryColor;

    for (let i = 0; i < 10; i++) {
      const interferenceT = t * 0.5 + i * 1.5;
      const amplitude = height * 0.05;
      const frequency = 0.005 + i * 0.003;
      const hue = (time * 60 + i * 40) % 360;

      ctx.strokeStyle = hsl(hue, 90, 60);
      ctx.lineWidth = 1 + i * 0.5;
      ctx.beginPath();

      for (let x = 0; x < width; x += 3) {
        const y1 = height * 0.3 + Math.sin(x * frequency + interferenceT) * amplitude;
        const y2 = height * 0.7 + Math.cos(x * frequency * 1.3 + interferenceT) * amplitude * 0.7;

        ctx.globalAlpha = interferenceIntensity * 0.2;
        ctx.lineTo(x, y1);

        if (x === 0) ctx.moveTo(x, y1);
        else ctx.lineTo(x, y1);

        ctx.globalAlpha = interferenceIntensity * 0.15;
        if (x === 0) ctx.moveTo(x, y2);
        else ctx.lineTo(x, y2);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 35;
    ctx.shadowColor = tertiaryColor;

    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < 8; i++) {
      const radius = i * 80 + 50 + Math.sin(t * 0.3 + i) * 20;
      const hue = (time * 80 + i * 45) % 360;
      const pulse = 0.7 + Math.sin(t * 0.5 + i * 0.7) * 0.3;

      ctx.globalAlpha = pulse * 0.3;
      ctx.strokeStyle = hsl(hue, 90, 60);
      ctx.lineWidth = pulse * 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < 200; i++) {
      const sparkX = seeded(i * 43 + time * 80) * width;
      const sparkY = seeded(i * 47 + time * 60) * height;
      const sparkSize = seeded(i * 53) * 2 + 0.5;
      const sparkHue = (time * 100 + seeded(i * 59) * 60) % 360;

      ctx.globalAlpha = seeded(i * 61) * 0.3 + 0.1;
      ctx.fillStyle = hsl(sparkHue, 90, 50);
      ctx.fillRect(sparkX, sparkY, sparkSize, sparkSize);
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 50;
    ctx.shadowColor = secondaryColor;
    const horizonY = height * 0.8 + Math.sin(t * 0.2) * 30;
    const horizonGradient = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY);
    horizonGradient.addColorStop(0, hsl((time * 30) % 360, 90, 50));
    horizonGradient.addColorStop(1, "transparent");
    ctx.fillRect(0, horizonY - 50, width, 100);

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
