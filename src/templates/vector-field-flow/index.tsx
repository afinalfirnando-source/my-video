import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { VectorFieldFlowProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

type Node = { x: number; y: number; fx: number; fy: number; len: number };

export const VectorFieldFlow: React.FC<VectorFieldFlowProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  cols = 72,
  rows = 32,
  fieldFreq = 1,
  hueCycles = 1,
  glowIntensity = 0.7,
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

  const nodes = useMemo(() => {
    const sx = width / cols;
    const sy = height / rows;
    const out: Node[] = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        out.push({
          x: i * sx + sx * 0.5,
          y: j * sy + sy * 0.5,
          fx: (i + 2) % 3 + 1,
          fy: (j + 3) % 4 + 1,
          len: 4 + ((i * 7 + j * 13) % 6),
        });
      }
    }
    return out;
  }, [width, height, cols, rows]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const sx = width / cols;
    const sy = height / rows;
    const cell = Math.min(sx, sy) * 0.5;
    const advX = (time * cols) % 1;
    const advY = (time * rows) % 1;

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 10 * glowIntensity;
    ctx.shadowColor = toCssRgb(secondary);
    ctx.lineCap = "round";
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colorForHue(hueShift, primary, secondary, tertiary, 0);

    const path = new Path2D();
    for (const n of nodes) {
      const gx = ((n.x / sx - 0.5 - advX + cols) % cols) * sx;
      const gy = ((n.y / sy - 0.5 - advY + rows) % rows) * sy;
      const bx = fieldFreq * (n.x / sx) * PI2;
      const by = fieldFreq * (n.y / sy) * PI2;
      const ang = Math.sin(n.fx * phase + bx) + Math.cos(n.fy * phase + by);
      const len = cell * 0.18 + n.len * 0.12;
      path.moveTo(gx, gy);
      path.lineTo(gx + Math.cos(ang) * len, gy + Math.sin(ang) * len);
    }
    ctx.stroke(path);

    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
    drawNoiseOverlay(ctx, width, height, phase, 0.04);
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
