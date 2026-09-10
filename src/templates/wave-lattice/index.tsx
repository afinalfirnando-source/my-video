import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import { colorForHue, hexToRgb } from "../ui/palette";
import type { WaveLatticeProps } from "./types";

const TOTAL_FRAMES = 900;
const PI2 = Math.PI * 2;

export const WaveLattice: React.FC<WaveLatticeProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  focusCount = 6,
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

  const foci = useMemo(() => {
    const out: { phase: number; rx: number; ry: number; freq: number }[] = [];
    for (let i = 0; i < focusCount; i++) {
      const a = (i / focusCount) * PI2;
      out.push({
        phase: a,
        rx: Math.cos(a),
        ry: Math.sin(a),
        freq: 1 + Math.floor(i % 3),
      });
    }
    return out;
  }, [focusCount]);

  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const R = Math.hypot(width, height) * 0.55;
    const minSize = Math.min(width, height);

    for (const f of foci) {
      const movX = Math.sin(phase * 0.6 + f.phase) * (minSize * 0.18);
      const movY = Math.cos(phase * 0.45 + f.phase * 1.3) * (minSize * 0.14);
      const fx = cx + f.rx * movX;
      const fy = cy + f.ry * movY;

      const grad = ctx.createRadialGradient(
        fx,
        fy,
        0,
        fx,
        fy,
        R,
      );
      const stops = 22;
      for (let k = 0; k <= stops; k++) {
        const frac = k / stops;
        const val =
          Math.sin(frac * f.freq * PI2 - phase * (0.38 + f.freq * 0.1)) *
            0.5 +
          0.5;
        grad.addColorStop(
          frac,
          colorForHue(
            val * 360,
            primary,
            secondary,
            tertiary,
            hueShift,
          ),
        );
      }
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.35 + 0.4 * glowIntensity;
      ctx.shadowBlur = 0;
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
