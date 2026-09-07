import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef, useEffect } from "react";
import type { BinaryMatrixProps } from "./types";

const TOTAL_FRAMES = 900;
const CHARACTERS = "01アカサタナハマヤラワガザダバパ";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.shadowBlur = 15 * glowIntensity;
    ctx.shadowColor = textColor;
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    const columnHeight = height / fontSize;

    for (let i = 0; i < columns; i++) {
      const colTime = time * speed * 2 + i * 0.3;

      for (let j = 0; j < columnHeight + 2; j++) {
        const charIndex = Math.floor(Math.sin(j + colTime * 0.3) * CHARACTERS.length + colTime) % CHARACTERS.length;
        const char = CHARACTERS[Math.abs(charIndex)];
        const x = i * fontSize;
        const y = ((j - colTime) * fontSize) % (height + fontSize);

        if (y >= 0 && y < height) {
          const distanceFromCenter = Math.abs(j - (columnHeight / 2));
          const alpha = 1 - (distanceFromCenter / (columnHeight / 2));
          const brightness = 0.5 + Math.sin(colTime + j * 0.1) * 0.5;

          ctx.fillStyle = textColor;
          ctx.globalAlpha = Math.max(0.1, alpha * brightness);
          ctx.fillText(char, x, y);
        }
      }
    }

    ctx.globalAlpha = 0.1;
    ctx.fillStyle = textColor;
    const noiseY = (time * speed * height) % height;
    ctx.fillRect(0, noiseY, width, fontSize);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  });

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
