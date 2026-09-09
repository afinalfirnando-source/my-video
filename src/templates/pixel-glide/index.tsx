import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb } from "../ui/palette";
import type { PixelGlideProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

type Cell = { x: number; y: number; w: number; h: number; phase: number };

export const PixelGlide: React.FC<PixelGlideProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  cols = 44,
  rows = 24,
  amplitude = 30,
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

  const cells = useMemo(() => {
    const out: Cell[] = [];
    const sx = width / cols;
    const sy = height / rows;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        out.push({
          x: i * sx,
          y: j * sy,
          w: sx,
          h: sy,
          phase: ((i * 37 + j * 93) % 997) / 997,
        });
      }
    }
    return out;
  }, [width, height, cols, rows]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.55 + 0.35 * glowIntensity;

    for (const c of cells) {
      const mv = Math.sin(c.phase * PI2 + phase) * amplitude;
      const pulse = Math.sin(c.phase * PI2 * 0.6 + phase * 0.8) * 0.5 + 0.5;
      const hue = c.phase * 360 + hueShift;
      const scale = 0.56 + 0.44 * pulse;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = colorForHue(hue, primary, secondary, tertiary, 0);
      ctx.fillRect(
        c.x + mv + (c.w * (1 - scale)) / 2,
        c.y - mv + (c.h * (1 - scale)) / 2,
        c.w * scale,
        c.h * scale,
      );
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
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
