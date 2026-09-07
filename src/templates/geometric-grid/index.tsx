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
  gridSize = 12,
  rotationSpeed = 1,
  morphSpeed = 1,
  depth = 20,
  lineWidth = 2,
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
    ctx.shadowBlur = 15;
    ctx.shadowColor = gridColor;

    for (let i = -depth / 2; i <= depth / 2; i++) {
      for (let j = -depth / 2; j <= depth / 2; j++) {
        const z = i * spacing * morphProgress + j * spacing * (1 - morphProgress);
        const scale = perspective / (perspective + z);

        const x = (cx + j * spacing) * scale;
        const y = (cy + i * spacing) * scale;

        const size = spacing * scale * 0.8;
        const alpha = scale * 0.8;

        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
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
