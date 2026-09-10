import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb } from "../ui/palette";
import type { ChromaRingsProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const ChromaRings: React.FC<ChromaRingsProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  ringCount = 22,
  hueCycles = 1,
  glowIntensity = 0.8,
  breathAmp = 0.12,
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
    ctx.shadowBlur = 0;
    ctx.lineCap = "round";
    ctx.lineWidth = 2.0;

    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.46;
    const dr = maxR / ringCount;

    for (let k = 0; k < ringCount; k++) {
      const breath = 1 + Math.sin(phase + (k / ringCount) * PI2) * breathAmp;
      const radius = (k + 0.5) * dr * breath;
      ctx.strokeStyle = colorForHue(
        hueShift + (k / ringCount) * 360,
        primary,
        secondary,
        tertiary,
        0,
      );
      ctx.globalAlpha = 0.65 + 0.35 * glowIntensity;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, PI2);
      ctx.stroke();
    }

    ctx.fillStyle = colorForHue(hueShift + 180, primary, secondary, tertiary, 0);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * 0.06, 0, PI2);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
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
