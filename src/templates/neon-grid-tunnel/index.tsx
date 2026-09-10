import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { NeonGridTunnelProps } from "./types";

const TOTAL_FRAMES = 900;

type GridLine = {
  isHorizontal: boolean;
  offset: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const NeonGridTunnel: React.FC<NeonGridTunnelProps> = ({
  gridSize = 30,
  flightSpeed = 0.8,
  scanLineCount = 8,
  pulseIntensity = 0.6,
  primaryColor = "#FF2A6D",
  secondaryColor = "#00F0FF",
  backgroundColor = "#0A0A1A",
  lineWidth = 2,
  glowIntensity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const gridLines = useMemo(() => {
    const lines: GridLine[] = [];
    for (let i = 0; i < gridSize; i++) {
      lines.push({ isHorizontal: true, offset: (i / gridSize) * height });
    }
    for (let i = 0; i < gridSize; i++) {
      lines.push({ isHorizontal: false, offset: (i / gridSize) * width });
    }
    return lines;
  }, [gridSize, height, width]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const perspective = 600;
    const zMax = 2000;
    const zPeriod = zMax;
    const zOffset = ((frame / fps) * flightSpeed * 400) % zPeriod;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.lineWidth = lineWidth;
    ctx.shadowBlur = 15 * glowIntensity;
    ctx.shadowColor = secondaryColor;
    ctx.strokeStyle = secondaryColor;

    for (let i = 0; i < gridLines.length; i++) {
      const line = gridLines[i];
      if (line.isHorizontal) {
        const baseY = (line.offset + zOffset * 0.5) % height;
        const perspectiveY = (baseY - height / 2) * (perspective / (perspective + zOffset % 500));
        const screenY = cy + perspectiveY;
        const alpha = 0.15 + (screenY / height) * 0.85;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(-width, screenY);
        ctx.lineTo(width * 2, screenY);
        ctx.stroke();
      } else {
        const baseX = (line.offset + zOffset * 0.5) % width;
        const perspectiveX = (baseX - width / 2) * (perspective / (perspective + zOffset % 500));
        const screenX = cx + perspectiveX;
        const alpha = 0.15 + (screenX / width) * 0.85;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(screenX, -height);
        ctx.lineTo(screenX, height * 2);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 25 * glowIntensity;
    ctx.shadowColor = primaryColor;

    const scanSpeed = (frame / fps) * 1.5;
    for (let i = 0; i < scanLineCount; i++) {
      const scanY = ((scanSpeed * (i + 1) * 80) % (height + 200)) - 100;
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, primaryColor);
      grad.addColorStop(1, "transparent");

      ctx.globalAlpha = 0.3 + Math.sin(t + i) * 0.2;
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 20, width, 40);
    }

    ctx.globalAlpha = 0.6 + Math.sin(t * 2) * pulseIntensity * 0.3;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.35 + Math.sin(t * 1.5) * 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.2 + Math.cos(t * 1.8) * 15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 120; i++) {
      const angle = seeded(i * 31) * Math.PI * 2;
      const dist = seeded(i * 37) * Math.min(width, height) * 0.6;
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist;
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(sx, sy, seeded(i * 41) * 2 + 0.5, seeded(i * 43) * 2 + 0.5);
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 60 * glowIntensity;
    ctx.shadowColor = primaryColor;
    const radial = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.6);
    radial.addColorStop(0, hsl((time * 40) % 360, 90, 60));
    radial.addColorStop(0.5, "transparent");
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(-width, -height, width * 2, height * 2);

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
