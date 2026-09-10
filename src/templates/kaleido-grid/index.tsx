import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { KaleidoGridProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const KaleidoGrid: React.FC<KaleidoGridProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  symmetry = 12,
  ringCount = 14,
  rotationSpeed = 2,
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
  const R = Math.min(width, height) * 0.46;

  const sector = useMemo(() => {
    const path = new Path2D();
    const wedge = PI2 / symmetry;
    const step = R / ringCount;
    for (let k = 1; k <= ringCount; k++) {
      const radius = k * step;
      path.arc(cx, cy, radius, 0, wedge);
    }
    path.moveTo(cx, cy);
    path.lineTo(cx + R * 0.2, cy);
    path.arc(cx, cy, R * 0.2, 0, wedge);
    path.lineTo(cx, cy);
    return path;
  }, [symmetry, ringCount, R, cx, cy]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 14 * glowIntensity;
    ctx.shadowColor = toCssRgb(secondary);
    ctx.lineCap = "round";
    ctx.lineWidth = 1.7;

    const rot = (phase * rotationSpeed) % PI2;
    const wedge = PI2 / symmetry;

    for (let i = 0; i < symmetry; i++) {
      const hue = hueShift + (i / symmetry) * 360;
      ctx.strokeStyle = colorForHue(hue, primary, secondary, tertiary, 0);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot + i * wedge);
      ctx.translate(-cx, -cy);
      ctx.stroke(sector);
      ctx.restore();
    }

    ctx.fillStyle = colorForHue(hueShift + 180, primary, secondary, tertiary, 0);
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.06, 0, PI2);
    ctx.fill();

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
