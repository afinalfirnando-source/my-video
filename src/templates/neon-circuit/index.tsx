import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { NeonCircuitProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const NeonCircuit: React.FC<NeonCircuitProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#050014",
  cols = 22,
  rows = 16,
  hueCycles = 1,
  glowIntensity = 0.8,
  pulseSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const phase = time * PI2;
  const hueShift = phase * hueCycles;

  const primary = hexToRgb(primaryColor);
  const secondary = hexToRgb(secondaryColor);
  const tertiary = hexToRgb(tertiaryColor);

  const grid = useMemo(() => {
    const sx = width / cols;
    const sy = height / rows;
    const nodes: { x: number; y: number }[] = [];
    for (let j = 0; j <= rows; j++) {
      for (let i = 0; i <= cols; i++) {
        nodes.push({ x: i * sx, y: j * sy });
      }
    }
    const snake: { x: number; y: number }[] = [];
    for (let j = 0; j <= rows; j++) {
      const s = j % 2 === 0 ? 1 : -1;
      const a = s === 1 ? 0 : cols;
      for (let i = a; i >= 0 && i <= cols; i += s) {
        snake.push({ x: i * sx, y: j * sy });
      }
    }
    const edges: [number, number, number, number][] = [];
    for (let j = 0; j <= rows; j++) {
      for (let i = 0; i <= cols; i++) {
        if (i < cols) edges.push([i * sx, j * sy, (i + 1) * sx, j * sy]);
        if (j < rows) edges.push([i * sx, j * sy, i * sx, (j + 1) * sy]);
      }
    }
    return { sx, sy, nodes, snake, edges };
  }, [width, height, cols, rows]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 12 * glowIntensity;
    ctx.shadowColor = toCssRgb(secondary);
    ctx.lineCap = "round";
    ctx.lineWidth = 1.2;

    ctx.strokeStyle = colorForHue(hueShift, primary, secondary, tertiary, 0);
    const edgePath = new Path2D();
    for (const e of grid.edges) {
      edgePath.moveTo(e[0], e[1]);
      edgePath.lineTo(e[2], e[3]);
    }
    ctx.globalAlpha = 0.35;
    ctx.stroke(edgePath);

    const head = (time * pulseSpeed) % 1;
    const n = grid.snake.length;
    const trailCount = Math.min(14, n - 1);
    ctx.shadowBlur = 18 * glowIntensity;
    ctx.lineWidth = 2.6;
    ctx.globalAlpha = 1;
    for (let k = 0; k < trailCount; k++) {
      const idx = Math.floor(((head * n - k + n) % n));
      if (idx < 0) continue;
      const p = grid.snake[idx];
      const t = k / trailCount;
      ctx.globalAlpha = (1 - t) * (0.55 + 0.4 * glowIntensity);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5 + (1 - t) * 4, 0, PI2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
    drawNoiseOverlay(ctx, width, height, phase, 0.05);
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
