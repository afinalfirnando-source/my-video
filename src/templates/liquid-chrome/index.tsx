import { AbsoluteFill } from "remotion";
import React, { useMemo } from "react";
import type { LiquidChromeProps } from "./types";
import {
  useCanvas,
  applyVignette,
  getLoopTime,
  getSeamlessAngle,
  getSeamlessSine,
  seeded,
  TEMPLATE_CONFIG,
} from "../../shared";

/**
 * LiquidChrome - Flowing metallic liquid surface with neon reflections
 * Seamless loop: All animations use integer cycle counts via getSeamlessAngle
 * Frame 0 = Frame 900 (identical, no flickering)
 */
export const LiquidChrome: React.FC<LiquidChromeProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  backgroundColor,
  rippleCount,
  flowSpeed,
  waveAmplitude,
  metallicShine,
  glowIntensity,
}) => {
  const ripples = useMemo(() => {
    return Array.from({ length: rippleCount }, (_, i) => ({
      x: seeded(i * 17 + 1),
      y: seeded(i * 17 + 2),
      radius: seeded(i * 17 + 3) * 300 + 100,
      speed: seeded(i * 17 + 4) * 0.5 + 0.5,
      phase: seeded(i * 17 + 5) * Math.PI * 2,
    }));
  }, [rippleCount]);

  const draw = useMemo(() => {
    const noiseScale = 0.005;
    const getNoise = (x: number, y: number, tX: number, tY: number, tXY: number): number => {
      return (
        Math.sin(x * noiseScale + tX) *
        Math.cos(y * noiseScale + tY) *
        Math.sin((x + y) * noiseScale * 0.5 + tXY)
      );
    };

    return (ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
      const { durationInFrames } = TEMPLATE_CONFIG;
          ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // FIX: flowSpeed must be rounded to nearest integer cycles for seamless loop
      const flowCycles = intCycles(flowSpeed);
      
      // Draw flowing metallic surface
      const stepSize = 20;
      for (let x = 0; x < width; x += stepSize) {
        for (let y = 0; y < height; y += stepSize) {
          const noise = getNoise(x, y, getSeamlessAngle(frame, durationInFrames, flowCycles));
          
          let rippleDistortion = 0;
          for (const ripple of ripples) {
            const dx = x / width - ripple.x;
            const dy = y / height - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // FIX: ripple.speed may be fractional — force integer cycles
            const rippleCycles = intCycles(ripple.speed);
            const rippleAngle = getSeamlessAngle(frame, durationInFrames, rippleCycles);
            const rippleWave = Math.sin(dist * 10 - rippleAngle + ripple.phase);
            rippleDistortion += rippleWave * waveAmplitude * 0.2;
          }

          const combinedNoise = noise + rippleDistortion;
          const brightness = 30 + (combinedNoise + 1) * 30 * metallicShine;
          const hueShift = combinedNoise * 60;

          let color: string;
          if (combinedNoise > 0.5) {
            color = `hsl(${(180 + hueShift) % 360}, 70%, ${brightness + 20}%)`;
          } else if (combinedNoise > 0) {
            color = `hsl(${(320 + hueShift) % 360}, 60%, ${brightness + 10}%)`;
          } else {
            color = `hsl(${(200 + hueShift) % 360}, 50%, ${brightness}%)`;
          }

          ctx.fillStyle = color;
          ctx.fillRect(x, y, stepSize, stepSize);
        }
      }

      // Draw flowing highlights
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // FIX: all cycle counts must be integers — compute once outside loop
      const highlightCycleBase = intCycles(flowSpeed);
      
      for (let i = 0; i < 5; i++) {
        // Highlight position: integer cycles (flowCycles + i) is integer + integer = integer
        const hxAngle = getSeamlessAngle(frame, durationInFrames, highlightCycleBase + i);
        const highlightX = ((seeded(i * 23) + Math.sin(hxAngle) * 0.5) % 1) * width;
        // FIX: (flowSpeed*0.6 + i*0.5) forced to integer cycles — may differ visually but guarantees seam
        const hyCycle = intCycles(Math.round(flowSpeed * 0.6 + i * 0.5));
        const hyAngle = getSeamlessAngle(frame, durationInFrames, hyCycle);
        const highlightY = ((seeded(i * 29 + 100) + Math.sin(hyAngle) * 0.5) % 1) * height;
        const highlightSize = 100 + Math.sin(hxAngle) * 50;

        const highlight = ctx.createRadialGradient(
          highlightX, highlightY, 0,
          highlightX, highlightY, highlightSize
        );

        // Hue shift using integer cycles — i*72 ensures spacing, wave via getSeamlessSine
        const hue = (Math.sin(getSeamlessAngle(frame, durationInFrames, intCycles(0.5 + i * 0.1))) * 180 + i * 72) % 360;
        highlight.addColorStop(0, `hsla(${hue}, 100%, 80%, 0.6)`);
        highlight.addColorStop(0.5, `hsla(${hue}, 100%, 60%, 0.2)`);
        highlight.addColorStop(1, "transparent");

        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw metallic shine lines
      ctx.save();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.shadowColor = secondaryColor;
      ctx.globalAlpha = 0.3 * metallicShine;

      // FIX: precompute integer cycle counts for shine lines
      const shineCycles = intCycles(flowSpeed);
      
      for (let i = 0; i < 8; i++) {
        // Line Y: use integer cycle count (shineCycles + i) = integer
        const lineY = (i / 8) * height + Math.sin(getSeamlessAngle(frame, durationInFrames, shineCycles + i)) * 50;
        // Line offset: use integer cycle count (shineCycles * 0.5 + i) rounded to integer
        const offsetCycle = intCycles(Math.round(shineCycles * 0.5 + i));
        const lineOffset = Math.sin(getSeamlessAngle(frame, durationInFrames, offsetCycle)) * 100;

        ctx.beginPath();
        ctx.moveTo(0, lineY);

        for (let x = 0; x < width; x += 50) {
          // Spatial wave: Math.sin(x * 0.01) — purely spatial, safe
          const spatialWave = Math.sin(x * 0.01) * 30 * waveAmplitude;
          // Time wave: uses same integer cycle as lineY
          const timeWave = Math.sin(getSeamlessAngle(frame, durationInFrames, shineCycles + i)) * 30 * waveAmplitude;
          ctx.lineTo(x, lineY + spatialWave + timeWave + lineOffset);
        }

        ctx.stroke();
      }

      ctx.restore();

      // Draw neon edge glow
      ctx.save();
      ctx.shadowBlur = 30 * glowIntensity;
      ctx.shadowColor = tertiaryColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;

      const topGlow = ctx.createLinearGradient(0, 0, 0, 100);
      topGlow.addColorStop(0, tertiaryColor);
      topGlow.addColorStop(1, "transparent");
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, width, 100);

      const bottomGlow = ctx.createLinearGradient(0, height - 100, 0, height);
      bottomGlow.addColorStop(0, "transparent");
      bottomGlow.addColorStop(1, secondaryColor);
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, height - 100, width, 100);

      ctx.restore();

      // Vignette
      applyVignette(ctx, width, height, 0.5);
    };
  }, [primaryColor, secondaryColor, tertiaryColor, backgroundColor, flowSpeed, waveAmplitude, metallicShine, glowIntensity, ripples]);

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
