import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef } from "react";
import type { FluidChromaticProps } from "./types";

const TOTAL_FRAMES = 900;

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const FluidChromatic: React.FC<FluidChromaticProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  flowSpeed = 0.8,
  turbulence = 1,
  opacity = 0.6,
  particleCount = 500,
  waveCount = 10,
  noiseDensity = 0.02,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const hue1 = (time * 360 * flowSpeed) % 360;

    const circleTime = time * Math.PI * 2;
    const cx = width / 2;
    const cy = height / 2;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(${hue1}, 90%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${(hue1 + 180) % 360}, 90%, 50%)`);
    gradient.addColorStop(1, `hsl(${(hue1 + 120) % 360}, 90%, 50%)`);

    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 40;
    ctx.shadowColor = primaryColor;

    for (let i = 0; i < waveCount; i++) {
      const waveTime = time * Math.PI * 2 * flowSpeed + i * 1.5;
      const amplitude = height * 0.15 * turbulence;
      const frequency = 0.008 + i * 0.004;

      ctx.strokeStyle = `hsl(${((hue1 + i * 30) % 360)}, 90%, 50%)`;
      ctx.lineWidth = 60 + i * 30;
      ctx.beginPath();

      for (let x = 0; x < width; x += 2) {
        const y = (height / 2) + Math.sin((x * frequency + waveTime)) * amplitude;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 30;
    ctx.shadowColor = secondaryColor;

    for (let i = 0; i < 30; i++) {
      const radius = 30 + i * 40 + Math.sin(circleTime * 0.7 + i * 0.5) * 20;
      const hue = (hue1 + i * 20) % 360;

      ctx.globalAlpha = 0.25 + i * 0.02;
      ctx.strokeStyle = `hsl(${hue}, 90%, 60%)`;
      ctx.lineWidth = 3 + i * 1;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 20;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < particleCount; i++) {
      const px = (seeded(i * 13 + time * 50) * width);
      const py = (seeded(i * 17 + time * 40) * height);
      const size = seeded(i * 19) * 5 + 1;
      const hue = (hue1 + seeded(i * 23) * 360) % 360;
      const alpha = seeded(i * 29) * 0.6 + 0.1;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsl(${hue}, 90%, 50%)`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha * 0.4;
      ctx.beginPath();
      ctx.arc(px, py, size * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#FFFFFF";
    const noiseCount = Math.floor(width * height * noiseDensity / 100);
    for (let i = 0; i < noiseCount; i++) {
      const px = seeded(i * 31 + time * 100) * width;
      const py = seeded(i * 37 + time * 80) * height;
      const ns = seeded(i * 41) * 2 + 0.5;

      ctx.globalAlpha = seeded(i * 43) * 0.2;
      ctx.fillRect(px, py, ns, ns);
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 25;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 100; i++) {
      const sx = seeded(i * 53 + time * 60) * width;
      const sy = seeded(i * 59 + time * 40) * height;
      const ss = seeded(i * 61) * 3 + 1;
      const sh = (seeded(i * 67) * 360) % 360;

      ctx.globalAlpha = seeded(i * 71) * 0.3 + 0.1;
      ctx.fillStyle = `hsl(${sh}, 90%, 60%)`;
      ctx.beginPath();
      ctx.arc(sx, sy, ss, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.filter = "none";
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
