import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { HyperbolicTilingProps } from "./types";

const TOTAL_FRAMES = 900;

type Tile = {
  a: number;
  b: number;
  c: number;
  depth: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const HyperbolicTiling: React.FC<HyperbolicTilingProps> = ({
  primaryColor = "#8A2BE2",
  secondaryColor = "#00F0FF",
  tertiaryColor = "#FF69B4",
  rotationSpeed = 0.3,
  zoomSpeed = 0.2,
  tileDensity = 7,
  glowIntensity = 0.8,
  colorShift = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const tiles = useMemo(() => {
    const tileList: Tile[] = [];
    const gridSize = tileDensity;
    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        const dx = i + j * 0.5;
        const dy = j * Math.sqrt(3) / 2;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r < 0.95) {
          tileList.push({
            a: dx,
            b: dy,
            c: r,
            depth: Math.floor(r * 10),
          });
        }
      }
    }
    return tileList;
  }, [tileDensity, t, rotationSpeed]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width, height) * 0.4;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 1);

    ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 40;
    ctx.shadowColor = primaryColor;

    const cosT = Math.cos(t * rotationSpeed);
    const sinT = Math.sin(t * rotationSpeed);

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];

      let x = tile.a * scale;
      let y = tile.b * scale;

      if (tile.c < 0.1) {
        const depth = tile.c / 0.95 * 10;
        x = (tile.a + (seeded(i * 37) - 0.5) * 0.1) * scale * (0.8 + depth * 0.05);
        y = (tile.b + (seeded(i * 41) - 0.5) * 0.1) * scale * (0.8 + depth * 0.05);
      }

      const rotX = x * cosT - y * sinT;
      const rotY = x * sinT + y * cosT;

      const hue = (tile.depth * 20 + time * 60 * colorShift + i * 5) % 360;
      const size = scale * 0.03 * (1 - tile.c * 0.3);
      const alpha = (1 - tile.c) * 0.7;

      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.shadowColor = hsl(hue, 90, 60);

      if (tile.c < 0.3) {
        ctx.fillStyle = hsl(hue, 90, 60);
        ctx.beginPath();
        ctx.arc(rotX, rotY, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = hsl((hue + 120) % 360, 90, 50);
        ctx.beginPath();
        ctx.arc(rotX, rotY, size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = hsl(hue, 90, 50);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rotX - size, rotY - size);
      ctx.lineTo(rotX + size, rotY + size);
      ctx.moveTo(rotX + size, rotY - size);
      ctx.lineTo(rotX - size, rotY + size);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 50;
    ctx.shadowColor = secondaryColor;
    for (let i = 0; i < 30; i++) {
      const hue = (time * 120 + i * 20) % 360;
      ctx.globalAlpha = 0.2 + i * 0.01;
      ctx.strokeStyle = hsl(hue, 90, 50);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, scale * 0.9, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 30;
    ctx.shadowColor = tertiaryColor;
    const spiralCount = 5;
    for (let i = 0; i < spiralCount; i++) {
      const spiralT = t * 0.1 + i * 2;
      ctx.strokeStyle = hsl((time * 90 + i * 60) % 360, 90, 60);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let seg = 0; seg < 100; seg++) {
        const segT = seg / 100;
        const r = segT * scale * 0.8;
        const angle = segT * 4 * Math.PI + spiralT;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (seg === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < 200; i++) {
      const sparkX = (seeded(i * 43 + time * 50) - 0.5) * scale * 2;
      const sparkY = (seeded(i * 47 + time * 30) - 0.5) * scale * 2;
      const sparkSize = seeded(i * 53) * 2 + 0.5;
      const sparkHue = (time * 180 + seeded(i * 59) * 60) % 360;

      ctx.globalAlpha = seeded(i * 61) * 0.3;
      ctx.fillStyle = hsl(sparkHue, 90, 50);
      ctx.fillRect(sparkX, sparkY, sparkSize, sparkSize);
    }

    ctx.restore();
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
