import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb } from "../ui/palette";
import type { PlasmaFluxProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const PlasmaFlux: React.FC<PlasmaFluxProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  bandCount = 6,
  speed = 0.55,
  hueCycles = 1,
  glowIntensity = 0.75,
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

  const bands = useMemo(() => {
    const out: { angle: number; speedMul: number; freq: number }[] = [];
    for (let i = 0; i < bandCount; i++) {
      out.push({
        angle: (i / bandCount) * PI2,
        speedMul: 1 + (i % 3) * 0.33,
        freq: 1 + Math.floor(i * 1.5),
      });
    }
    return out;
  }, [bandCount]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const halfDiag = Math.hypot(cx, cy);

    for (let i = 0; i < bands.length; i++) {
      const { angle, speedMul, freq } = bands[i];
      const dx = Math.cos(angle) * halfDiag;
      const dy = Math.sin(angle) * halfDiag;
      const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
      const tPhase = phase * speed * speedMul;
      const stopCount = 18;
      for (let k = 0; k <= stopCount; k++) {
        const frac = k / stopCount;
        const val =
          Math.sin(frac * freq * PI2 + tPhase) * 0.5 + 0.5;
        const hue = val * 360;
        grad.addColorStop(
          frac,
          colorForHue(hue, primary, secondary, tertiary, hueShift),
        );
      }
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.3 + 0.35 * glowIntensity;
      ctx.shadowBlur = 0;
      ctx.fillRect(0, 0, width, height);
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
