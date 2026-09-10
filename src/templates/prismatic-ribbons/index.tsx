import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { PrismaticRibbonsProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const PrismaticRibbons: React.FC<PrismaticRibbonsProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  ribbonCount = 6,
  points = 72,
  rotationSpeed = 2,
  hueCycles = 1,
  glowIntensity = 0.8,
  fov = 520,
  depthSpan = 720,
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

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 14 * glowIntensity;
    ctx.shadowColor = toCssRgb(secondary);
    ctx.lineCap = "round";
    ctx.lineWidth = 2.4;

    const rot = (phase * rotationSpeed) % PI2;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.transform(cosR, sinR, -sinR, cosR, 0, 0);
    ctx.translate(-cx, -cy);

    for (let r = 0; r < ribbonCount; r++) {
      const z = -depthSpan / 2 + (r / (ribbonCount - 1)) * depthSpan;
      const hue = hueShift + (r / ribbonCount) * 360;
      ctx.strokeStyle = colorForHue(hue, primary, secondary, tertiary, 0);
      ctx.globalAlpha = 0.75;

      const path = new Path2D();
      const spanX = width * 0.6;
      const spanY = height * 0.08;
      const amp = spanY * (0.6 + 0.4 * (r / ribbonCount));
      for (let k = 0; k <= points; k++) {
        const s = k / points;
        const x = -spanX / 2 + s * spanX;
        const y = Math.sin(s * PI2 * 1.5 + phase * (1 + (r % 3)) + (r / ribbonCount) * PI2) * amp;
        const f = fov / (fov + z);
        const sx = cx + x * f;
        const sy = cy + y * f;
        if (k === 0) path.moveTo(sx, sy);
        else path.lineTo(sx, sy);
      }
      ctx.stroke(path);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
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
