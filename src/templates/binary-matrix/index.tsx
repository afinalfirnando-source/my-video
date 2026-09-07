import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef } from "react";
import type { BinaryMatrixProps } from "./types";

const TOTAL_FRAMES = 900;
const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const BinaryMatrix: React.FC<BinaryMatrixProps> = ({
  textColor = "#00FF88",
  backgroundColor = "#000000",
  rainDensity = 1,
  speed = 1,
  fontSize = 20,
  glowIntensity = 1,
  characterSet = "0123456789ABCDEF",
  secondaryColor = "#00F0FF",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const columns = Math.floor((width / fontSize) * rainDensity);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.shadowBlur = 15 * glowIntensity;
    ctx.shadowColor = textColor;
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    const columnHeight = Math.floor(height / fontSize) + 2;

    for (let i = 0; i < columns; i++) {
      const colTime = (time * speed + i * 0.05) % 1;

      for (let j = 0; j < columnHeight; j++) {
        const charIndex = (i * 7 + j * 3 + Math.floor(colTime * columnHeight)) % characterSet.length;
        const char = characterSet[charIndex];
        const x = i * fontSize;
        const y = (((j - colTime) * 1) % (columnHeight + 1)) * fontSize;

        if (y >= -fontSize && y < height + fontSize) {
          const distanceFromCenter = Math.abs(j - columnHeight / 2) / (columnHeight / 2);
          const alpha = Math.max(0.1, 1 - distanceFromCenter) * (0.5 + colTime * 0.5);
          const hue = (seeded(i * 31) * 360) % 360;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
          ctx.fillText(char, x, y);

          ctx.globalAlpha = alpha * 0.6;
          ctx.fillStyle = secondaryColor;
          ctx.fillText(char, x + 1, y + 1);
        }
      }
    }

    ctx.globalAlpha = 0.1;
    ctx.fillStyle = textColor;
    const noiseY = (time * speed * height) % height;
    ctx.fillRect(0, noiseY, width, fontSize * 2);

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 30;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 50; i++) {
      const sparkX = seeded(i * 37 + time * 50) * width;
      const sparkY = seeded(i * 41 + time * 30) * height;
      const sparkSize = seeded(i * 43) * 3 + 1;

      ctx.globalAlpha = seeded(i * 47) * 0.5;
      ctx.fillStyle = `hsl(${(seeded(i * 53) * 360) % 360}, 80%, 50%)`;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
      ctx.fill();
    }

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
