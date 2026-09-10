import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb, toCssRgb } from "../ui/palette";
import type { VortexWeaveProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const VortexWeave: React.FC<VortexWeaveProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  armCount = 11,
  turns = 4,
  pointCount = 120,
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
  const R = Math.min(width, height) * 0.44;

  const arms = useMemo(() => {
    const out: Path2D[] = [];
    const wedge = PI2 / armCount;
    for (let i = 0; i < armCount; i++) {
      const path = new Path2D();
      for (let k = 0; k <= pointCount; k++) {
        const s = k / pointCount;
        const theta = s * turns * PI2 + i * wedge;
        const r = R * (0.18 + 0.82 * s);
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;
        if (k === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
      out.push(path);
    }
    return out;
  }, [armCount, turns, pointCount, R, cx, cy]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 14 * glowIntensity;
    ctx.shadowColor = toCssRgb(secondary);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";

    const rot = (phase * rotationSpeed) % PI2;
    const wedge = PI2 / armCount;

    for (let i = 0; i < arms.length; i++) {
      ctx.strokeStyle = colorForHue(
        hueShift + (i / armCount) * 360,
        primary,
        secondary,
        tertiary,
        0,
      );
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot + i * wedge);
      ctx.translate(-cx, -cy);
      ctx.stroke(arms[i]);
      ctx.restore();
    }

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
