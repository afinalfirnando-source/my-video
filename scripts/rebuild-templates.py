#!/usr/bin/env python3
"""Write all 5 templates with bulletproof seamless loop logic."""
import os

BASE = r"C:\Users\ADVAN\my-video\src\templates"

# Fluid Gradient Waves
FLUID = r'''import { AbsoluteFill } from "remotion";
import React, { useMemo } from "react";
import type { FluidGradientWavesProps } from "./types";
import {
  useCanvas,
  applyVignette,
  getSeamlessSine,
  getSeamlessCosine,
  hexToHsl,
  TEMPLATE_CONFIG,
} from "../../shared";

/**
 * FluidGradientWaves - organic gradients flowing like liquid silk
 * SEAMLESS RULE: every time term is getSeamlessSine/Cosine with FIXED cycles/loop.
 * Spatial variations are separate and combine via multiplication/addition.
 * Frame 0 == Frame 900 -> zero flicker.
 */
export const FluidGradientWaves: React.FC<FluidGradientWavesProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  backgroundColor,
  waveCount,
  flowSpeed,
  amplitude,
  glowIntensity,
}) => {
  const draw = useMemo(() => {
    const hslPrimary = hexToHsl(primaryColor);
    const hslSecondary = hexToHsl(secondaryColor);
    const hslTertiary = hexToHsl(tertiaryColor);

    return (ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
      const { durationInFrames } = TEMPLATE_CONFIG;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      for (let w = 0; w < waveCount; w++) {
        const wavePhase = (w / waveCount) * Math.PI * 2;
        const baseCycles = flowSpeed + w * 0.3;
        const timeWave1 = getSeamlessSine(frame, durationInFrames, baseCycles);
        const timeWave2 = getSeamlessCosine(frame, durationInFrames, baseCycles * 1.5);
        const timeWave3 = getSeamlessSine(frame, durationInFrames, baseCycles * 0.7);

        const hueShift = getSeamlessSine(frame, durationInFrames, Math.max(1, w + 1)) * 30;
        const h1 = hslPrimary.h + hueShift + w * 20;
        const h2 = hslSecondary.h + hueShift + w * 25;
        const h3 = hslTertiary.h + hueShift + w * 30;

        const gradient = ctx.createLinearGradient(
          0,
          height * 0.3 + timeWave1 * amplitude * 100,
          width,
          height * 0.7 + timeWave2 * amplitude * 80
        );

        gradient.addColorStop(0, `hsl(${h1}, ${hslPrimary.s}%, ${hslPrimary.l}%)`);
        gradient.addColorStop(0.5, `hsl(${h2}, ${hslSecondary.s}%, ${hslSecondary.l}%)`);
        gradient.addColorStop(1, `hsl(${h3}, ${hslTertiary.s}%, ${hslTertiary.l}%)`);

        ctx.save();
        ctx.globalAlpha = 0.6 / waveCount + 0.2;
        ctx.fillStyle = gradient;

        ctx.beginPath();
        const segments = 100;
        for (let x = 0; x <= segments; x++) {
          const px = (x / segments) * width;
          const xRatio = x / segments;
          const baseY = height * 0.5 + (w - waveCount / 2) * 100;

          const spatial1 = Math.sin(xRatio * Math.PI * 4 + wavePhase) * 0.8;
          const spatial2 = Math.sin(xRatio * Math.PI * 2 + wavePhase * 0.7) * 0.6;
          const spatial3 = Math.cos(xRatio * Math.PI * 3 + wavePhase * 1.2) * 0.4;

          const waveOffset =
            spatial1 * timeWave1 * amplitude * 100 +
            spatial2 * timeWave2 * amplitude * 80 +
            spatial3 * timeWave3 * amplitude * 60;

          const py = baseY + waveOffset;
          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        if (glowIntensity > 0) {
          ctx.globalAlpha = glowIntensity * 0.3;
          ctx.shadowBlur = 60 * glowIntensity;
          ctx.shadowColor = `hsl(${h1}, ${hslPrimary.s}%, ${Math.min(95, hslPrimary.l + 20)}%)`;
          ctx.fill();
        }

        ctx.restore();
      }

      applyVignette(ctx, width, height, 0.3);
    };
  }, [primaryColor, secondaryColor, tertiaryColor, backgroundColor, waveCount, flowSpeed, amplitude, glowIntensity]);

  const canvasRef = useCanvas(draw);

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <canvas
        ref={canvasRef}
        width={TEMPLATE_CONFIG.width}
        height={TEMPLATE_CONFIG.height}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
'''

with open(os.path.join(BASE, "fluid-gradient-waves", "index.tsx"), "w", encoding="utf-8") as f:
    f.write(FLUID)
print("fluid-gradient-waves/index.tsx written")