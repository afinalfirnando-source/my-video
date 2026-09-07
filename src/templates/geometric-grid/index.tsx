import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef } from "react";
import type { GeometricGridProps } from "./types";

const TOTAL_FRAMES = 900;

export const GeometricGrid: React.FC<GeometricGridProps> = ({
  gridColor = "#00F0FF",
  backgroundColor = "#000000",
  gridSize = 30,
  rotationSpeed = 1,
  morphSpeed = 1,
  depth = 40,
  lineWidth = 2,
  secondaryColor = "#FF00FF",
  pulseIntensity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const rotation = time * Math.PI * 2 * rotationSpeed;
  const morphProgress = Math.sin(time * Math.PI * 2 * morphSpeed);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const spacing = Math.min(width, height) / gridSize;
    const perspective = 500;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = lineWidth;
    ctx.shadowBlur = 20;
    ctx.shadowColor = gridColor;

    for (let i = -depth; i <= depth; i++) {
      for (let j = -depth; j <= depth; j++) {
        const z = (i * spacing * morphProgress + j * spacing * (1 - morphProgress)) * 0.5;
        const scale = perspective / (perspective + z);

        const x = (cx + j * spacing * 0.8) * scale;
        const y = (cy + i * spacing * 0.8) * scale;

        const size = spacing * scale * 0.6;
        const alpha = scale * 0.7;

        ctx.globalAlpha = Math.max(0.05, alpha);
        ctx.strokeStyle = i % 3 === 0 ? gridColor : secondaryColor;
        ctx.lineWidth = lineWidth * scale;
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);

        if (scale > 0.5) {
          const pulse = 1 + Math.sin(time * Math.PI * 2 + i * 0.1 + j * 0.1) * pulseIntensity;
          ctx.globalAlpha = Math.max(0.05, alpha * 0.5);
          ctx.fillStyle = gridColor;
          ctx.fillRect(x - size / pulse / 2, y - size / pulse / 2, size / pulse, size / pulse);
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;

    for (let i = 0; i <= gridSize; i++) {
      const x = (width / gridSize) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      const y = (height / gridSize) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 30;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 10; i++) {
      const radius = Math.min(width, height) * 0.1 + i * Math.min(width, height) * 0.08;
      const pulse = 0.8 + Math.sin(time * Math.PI * 2 + i) * 0.2;
      ctx.globalAlpha = 0.2 + i * 0.03;
      ctx.strokeStyle = i % 2 === 0 ? gridColor : secondaryColor;
      ctx.lineWidth = 2 * pulse;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
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
