import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { PrismVaultProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const PrismVault: React.FC<PrismVaultProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  ringCount = 16,
  baseSides = 3,
  rotationSpeed = 2,
  hueCycles = 1,
  glowIntensity = 0.8,
  breathAmp = 0.15,
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
  const maxR = Math.min(width, height) * 0.46;

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 16 * glowIntensity;
    ctx.shadowColor = toCssRgb(secondary);
    ctx.lineCap = "round";
    ctx.lineWidth = 1.6;

    for (let k = 0; k < ringCount; k++) {
      const sides = baseSides + k;
      const radius = (k / ringCount) * maxR * (1 + Math.sin(phase + (k * PI2) / ringCount) * breathAmp);
      const rot = (phase * (rotationSpeed * (k + 1))) % PI2;
      const hue = hueShift + (k / ringCount) * 360;
      ctx.strokeStyle = colorForHue(hue, primary, secondary, tertiary, 0);

      ctx.beginPath();
      for (let s = 0; s <= sides; s++) {
        const a = (s / sides) * PI2 + rot;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.fillStyle = colorForHue(hueShift + 180, primary, secondary, tertiary, 0);
    ctx.shadowBlur = 10 * glowIntensity;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * 0.05, 0, PI2);
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
