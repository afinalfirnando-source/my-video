import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef } from "react";
import type { BinaryMatrixProps } from "./types";

const TOTAL_FRAMES = 900;
const CHARACTERS = "01";

export const BinaryMatrix: React.FC<BinaryMatrixProps> = ({
  textColor = "#00FF88",
  backgroundColor = "#000000",
  rainDensity = 0.5,
  speed = 0.8,
  fontSize = 24,
  glowIntensity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const columns = Math.floor((width / fontSize) * rainDensity);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.shadowBlur = 15 * glowIntensity;
    ctx.shadowColor = textColor;
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    const columnHeight = Math.floor(height / fontSize) + 2;

    for (let i = 0; i < columns; i++) {
      const colTime = (time * speed + i * 0.1) % 1;

      for (let j = 0; j < columnHeight; j++) {
        const charIndex = (i * 7 + j * 3 + Math.floor(colTime * columnHeight)) % CHARACTERS.length;
        const char = CHARACTERS[Math.abs(charIndex)];
        const x = i * fontSize;
        const y = (((j - colTime) * 1) % (columnHeight + 1)) * fontSize;

        if (y >= -fontSize && y < height + fontSize) {
          const distanceFromCenter = Math.abs(j - columnHeight / 2) / (columnHeight / 2);
          const alpha = Math.max(0.1, 1 - distanceFromCenter) * (0.5 + colTime * 0.5);

          ctx.fillStyle = textColor;
          ctx.globalAlpha = alpha;
          ctx.fillText(char, x, y);
        }
      }
    }

    ctx.globalAlpha = 0.05;
    ctx.fillStyle = textColor;
    const noiseY = (time * speed * height) % height;
    ctx.fillRect(0, noiseY, width, fontSize);

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
