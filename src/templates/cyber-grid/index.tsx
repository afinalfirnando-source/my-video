import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { CyberGridProps } from "./types";

const TOTAL_FRAMES = 900;

type DataStream = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  speed: number;
  size: number;
  hue: number;
  phase: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const CyberGrid: React.FC<CyberGridProps> = ({
  gridColor = "#00F0FF",
  scanLineColor = "#FF00FF",
  backgroundColor = "#000000",
  gridSize = 25,
  scanSpeed = 0.5,
  glitchIntensity = 0.7,
  dataStreamDensity = 100,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const dataStreams = useMemo(
    () =>
      Array.from({ length: dataStreamDensity }, (_, i): DataStream => ({
        startX: seeded(i * 31 + 1) * width,
        startY: seeded(i * 31 + 2) * height,
        endX: seeded(i * 31 + 3) * width,
        endY: seeded(i * 31 + 4) * height,
        speed: seeded(i * 31 + 5) * 0.5 + 0.5,
        size: seeded(i * 31 + 6) * 3 + 1,
        hue: seeded(i * 31 + 7) * 60 + 280,
        phase: seeded(i * 31 + 8) * Math.PI * 2,
      })),
    [width, height, dataStreamDensity]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const perspective = 800;
    const gridDepth = 30;
    const spacing = Math.min(width, height) / gridSize;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.3);
    ctx.translate(-cx, -cy);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = gridColor;

    for (let i = -gridDepth; i <= gridDepth; i++) {
      for (let j = -gridDepth; j <= gridDepth; j++) {
        const z = (i * spacing + j * spacing) * 0.3;
        const scale = perspective / (perspective + z * 2);

        const x = (cx + j * spacing) * scale;
        const y = (cy + i * spacing * 0.5) * scale;

        const size = spacing * scale * 0.6;
        const alpha = Math.max(0.05, scale * 0.8);

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = hsl((i * 10 + j * 5 + time * 60) % 360, 90, 60);
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);

        if (scale > 0.5) {
          ctx.globalAlpha = alpha * 0.3;
          ctx.fillStyle = gridColor;
          ctx.fillRect(x - size / 4, y - size / 4, size / 2, size / 2);
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    const scanSpeedVal = (frame / fps) * scanSpeed;
    const scanY = (scanSpeedVal % (height / 200)) * 200;
    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 30;
    ctx.shadowColor = scanLineColor;
    ctx.strokeStyle = scanLineColor;
    ctx.lineWidth = 3;
    ctx.setLineDash([50, 30]);
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(width, scanY);
    ctx.stroke();

    const scanLine2 = ((scanSpeedVal * 0.3) % (width / 200)) * 200;
    ctx.beginPath();
    ctx.moveTo(scanLine2, 0);
    ctx.lineTo(scanLine2, height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FFFFFF";

    for (let i = 0; i < dataStreams.length; i++) {
      const ds = dataStreams[i];
      const streamProgress = ((time * ds.speed) + ds.phase / (Math.PI * 2)) % 1;

      const px = ds.startX + (ds.endX - ds.startX) * streamProgress;
      const py = ds.startY + (ds.endY - ds.startY) * streamProgress;

      const hue = (ds.hue + time * 30) % 360;
      ctx.globalAlpha = streamProgress * 0.5 + 0.2;
      ctx.fillStyle = hsl(hue, 90, 50);
      ctx.beginPath();
      ctx.arc(px, py, ds.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = streamProgress * 0.3;
      ctx.strokeStyle = hsl(hue, 90, 50);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ds.startX, ds.startY);
      ctx.lineTo(px, py);
      ctx.stroke();
    }

    if (glitchIntensity > 0) {
      const glitchFrames = Math.floor(time * 10);
      if (seeded(glitchFrames * 7 + frame) > 0.7) {
        const glitchAmount = seeded(glitchFrames * 13) * 20 * glitchIntensity;
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = scanLineColor;
        ctx.fillStyle = hsl((time * 360) % 360, 90, 50);
        ctx.fillRect(seeded(glitchFrames * 17) * width, seeded(glitchFrames * 19) * height, width * 0.3 + glitchAmount, 50);
        ctx.restore();
      }

      for (let i = 0; i < 5; i++) {
        if (seeded(frame * 31 + i * 17) > 0.5) {
          const glitchY = seeded(frame * 13 + i * 19) * height;
          const glitchH = seeded(frame * 7 + i * 23) * 30 + 10;
          ctx.save();
          ctx.globalAlpha = seeded(i * 37) * 0.4;
          ctx.shadowBlur = 20;
          ctx.shadowColor = i % 2 === 0 ? scanLineColor : gridColor;
          ctx.fillStyle = hsl((time * 180 + i * 60) % 360, 90, 50);
          ctx.fillRect(0, glitchY, width, glitchH);
          ctx.restore();
        }
      }
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 30;
    ctx.shadowColor = gridColor;
    for (let i = 0; i < 50; i++) {
      const sparkX = seeded(i * 41 + time * 50) * width;
      const sparkY = seeded(i * 43 + time * 30) * height;
      const sparkSize = seeded(i * 47) * 2 + 0.5;
      const sparkAlpha = 0.3 + seeded(i * 53) * 0.4;

      ctx.globalAlpha = sparkAlpha;
      ctx.fillStyle = hsl((seeded(i * 59) * 60 + 280) % 360, 90, 50);
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
      ctx.fill();
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
