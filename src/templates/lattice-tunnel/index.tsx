import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { LatticeTunnelProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const LatticeTunnel: React.FC<LatticeTunnelProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  gridSize = 18,
  depth = 22,
  scrollSpeed = 1,
  hueCycles = 1,
  glowIntensity = 0.8,
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

  const cx = width / 2;
  const cy = height / 2;

  const proj = useMemo(() => {
    const fov = 420;
    const step = 92;
    const pts: { x: number; y: number; z: number; sx: number; sy: number }[] = [];
    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        const x = i * step;
        const z = j * step;
        const f = fov / (fov + z);
        pts.push({
          x,
          y: 0,
          z,
          sx: cx + x * f,
          sy: cy - 0 * f,
        });
      }
    }
    return { fov, step, pts, cols: gridSize * 2 + 1 };
  }, [gridSize, cx, cy]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const advZ = (time * scrollSpeed * proj.step * depth) % (proj.step * depth);
    const fov = proj.fov;
    const cols = proj.cols;
    const rowSpan = proj.cols * proj.step;
    const baseHue = (z: number) => hueShift + ((z + rowSpan) / (2 * rowSpan)) * 360;
    const hueFor = (z: number) => baseHue(z);

    const project = (x: number, z: number) => {
      const f = fov / (fov + z);
      return { sx: cx + x * f, sy: cy };
    };

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 14 * glowIntensity;
    ctx.shadowColor = toCssRgb(secondary);
    ctx.lineCap = "round";
    ctx.lineWidth = 1.3;

    ctx.strokeStyle = colorForHue(hueShift, primary, secondary, tertiary, 0);

    const path = new Path2D();
    for (let j = 0; j < cols; j++) {
      const z = (j * proj.step - depth * proj.step * 0.5 + advZ) % (proj.step * depth);
      const hueZ = hueFor(z);
      ctx.strokeStyle = colorForHue(hueZ, primary, secondary, tertiary, 0);
      for (let i = -gridSize; i < gridSize; i++) {
        const a = project(i * proj.step, z);
        const b = project((i + 1) * proj.step, z);
        path.moveTo(a.sx, a.sy);
        path.lineTo(b.sx, b.sy);
      }
    }
    for (let i = -gridSize; i <= gridSize; i++) {
      const hueZ = hueFor(i * proj.step);
      ctx.strokeStyle = colorForHue(hueZ, primary, secondary, tertiary, 0);
      for (let j = 0; j < cols; j++) {
        const z = (j * proj.step - depth * proj.step * 0.5 + advZ) % (proj.step * depth);
        const a = project(i * proj.step, z);
        const b = project(i * proj.step, z + proj.step);
        path.moveTo(a.sx, a.sy);
        path.lineTo(b.sx, b.sy);
      }
    }
    ctx.stroke(path);

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
