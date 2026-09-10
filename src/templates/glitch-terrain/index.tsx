import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb } from "../ui/palette";
import type { GlitchTerrainProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const GlitchTerrain: React.FC<GlitchTerrainProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  bandCount = 48,
  glitchAmp = 96,
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
    ctx.globalAlpha = 0.72 + 0.24 * glowIntensity;

    const bandH = height / bandCount;

    for (let i = 0; i < bandCount; i++) {
      const offset =
        Math.sin(phase * 0.6 + (i / bandCount) * PI2) * glitchAmp +
        Math.cos(phase * 0.4 + (i / bandCount) * PI2 * 1.3) * glitchAmp * 0.4;
      ctx.save();
      ctx.translate(offset, i * bandH);
      const hue = hueShift + (i / bandCount) * 360;
      const grad = ctx.createLinearGradient(0, 0, width, bandH);
      for (let k = 0; k <= 6; k++) {
        const frac = k / 6;
        grad.addColorStop(
          frac,
          colorForHue(
            hue + Math.sin(frac * PI2) * 30,
            primary,
            secondary,
            tertiary,
            0,
          ),
        );
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, bandH);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
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
