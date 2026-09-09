import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { LuminousVeilProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const LuminousVeil: React.FC<LuminousVeilProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  curtainCount = 5,
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

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 18 * glowIntensity;
    ctx.shadowColor = toCssRgb(secondary);

    const steps = 96;
    for (let i = 0; i < curtainCount; i++) {
      const yBase = height * 0.12 + (i / curtainCount) * height * 0.72;
      const speed = 0.36 * (1 + (i % 3) * 0.45);
      const amp = 18 + i * 8;
      const freq = 1 + (i % 3);
      const hue = hueShift + (i / curtainCount) * 360;

      const path = new Path2D();
      path.moveTo(0, yBase);
      for (let s = 0; s <= steps; s++) {
        const x = (s / steps) * width;
        const u = s / steps;
        const yy = yBase + Math.sin(u * freq * PI2 + phase * speed) * amp;
        if (s === 0) path.moveTo(x, yy);
        else path.lineTo(x, yy);
      }
      path.lineTo(width, height);
      path.lineTo(0, height);
      path.closePath();

      const grad = ctx.createLinearGradient(
        0,
        yBase - amp,
        0,
        yBase + amp + height * 0.18,
      );
      grad.addColorStop(0, colorForHue(hue, primary, secondary, tertiary, 0));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.58 + Math.sin(i * 1.7 + phase) * 0.08;
      ctx.fill(path);
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
