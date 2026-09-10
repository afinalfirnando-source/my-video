import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb } from "../ui/palette";
import type { ChromaSwirlProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const ChromaSwirl: React.FC<ChromaSwirlProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  armCount = 8,
  swirlTurns = 3,
  pointCount = 180,
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

  const paths = useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const R = Math.hypot(cx, cy) * 0.92;
    const out: Path2D[] = [];
    for (let i = 0; i < armCount; i++) {
      const path = new Path2D();
      path.moveTo(cx, cy);
      for (let k = 0; k <= pointCount; k++) {
        const s = k / pointCount;
        const r = s * R;
        const ang = s * swirlTurns * PI2 + (i / armCount) * PI2;
        path.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
      }
      out.push(path);
    }
    return out;
  }, [width, height, armCount, swirlTurns, pointCount]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const rot = phase * rotationSpeed;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);
    const cx = width / 2;
    const cy = height / 2;

    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 2.0;
    ctx.lineCap = "round";
    ctx.shadowBlur = 0;

    for (let i = 0; i < paths.length; i++) {
      const armPhase = (i / armCount) * PI2;
      const hue = (i / armCount) * 360 + phase * 45;
      ctx.strokeStyle = colorForHue(hue, primary, secondary, tertiary, hueShift);
      ctx.globalAlpha = 0.55 + 0.35 * glowIntensity + Math.sin(armPhase + phase) * 0.1;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.transform(cosR, sinR, -sinR, cosR, 0, 0);
      ctx.translate(-cx, -cy);
      ctx.stroke(paths[i]);
      ctx.restore();
    }

    ctx.globalCompositeOperation = "source-over";
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
