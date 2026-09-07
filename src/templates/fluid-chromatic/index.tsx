import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef, useEffect } from "react";
import type { FluidChromaticProps } from "./types";

const TOTAL_FRAMES = 900;

export const FluidChromatic: React.FC<FluidChromaticProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  flowSpeed = 0.5,
  turbulence = 0.8,
  opacity = 0.4,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const hue1 = (time * 360 * flowSpeed) % 360;
    const hue2 = ((time * 360 * flowSpeed + 180) % 360);

    gradient.addColorStop(0, `hsl(${hue1}, 90%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${(hue2 + 60) % 360}, 90%, 50%)`);
    gradient.addColorStop(1, `hsl(${(hue1 + 120) % 360}, 90%, 50%)`);

    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 30;
    ctx.shadowColor = primaryColor;

    const waveCount = 3;
    for (let i = 0; i < waveCount; i++) {
      const waveTime = time * Math.PI * 2 * flowSpeed + i * 2;
      const amplitude = height * 0.15 * turbulence;
      const frequency = 0.003 + i * 0.002;

      ctx.strokeStyle = `hsl(${hue1 + i * 40}, 90%, 50%)`;
      ctx.lineWidth = 80 + i * 40;
      ctx.beginPath();

      for (let x = 0; x < width; x += 5) {
        const y = (height / 2) + Math.sin((x * frequency + waveTime)) * amplitude;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    const circleTime = time * Math.PI * 2;
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < 5; i++) {
      const radius = 100 + i * 80 + Math.sin(circleTime + i) * 20;
      const hue = (hue1 + i * 60) % 360;

      ctx.globalAlpha = 0.2 + i * 0.05;
      ctx.strokeStyle = `hsl(${hue}, 90%, 60%)`;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
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
