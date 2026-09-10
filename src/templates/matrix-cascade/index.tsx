import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb } from "../ui/palette";
import type { MatrixCascadeProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const MatrixCascade: React.FC<MatrixCascadeProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#050014",
  cols = 56,
  rows = 64,
  trail = 0.45,
  baseSpeed = 2,
  hueCycles = 1,
  glowIntensity = 0.85,
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
    const out: { x: number; y: number; w: number; h: number; speed: number }[] =
      [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        out.push({
          x: i * sx,
          y: j * sy,
          w: sx,
          h: sy,
          speed: baseSpeed * (1 + (i % 3)),
        });
      }
    }
    return out;
  }, [width, height, cols, rows, baseSpeed]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.9;

    const sx = width / cols;
    const sy = height / rows;

    let col = -1;
    for (const g of grid) {
      const ci = Math.floor(g.x / sx);
      if (ci !== col) {
        col = ci;
        const hue = (ci / cols) * 360 + hueShift;
        ctx.fillStyle = colorForHue(hue, primary, secondary, tertiary, 0);
      }
      const head = (time * g.speed) % 1;
      const d = ((g.y / sy - head + rows) % rows) / rows;
      if (d < trail) {
        ctx.globalAlpha = (1 - d / trail) * (0.55 + 0.35 * glowIntensity);
        ctx.fillRect(g.x, g.y, sx, sy);
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
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
