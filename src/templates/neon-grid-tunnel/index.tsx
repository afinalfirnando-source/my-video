import { AbsoluteFill } from "remotion";
import React, { useMemo } from "react";
import type { NeonGridTunnelProps } from "./types";
import {
  useCanvas,
  applyVignette,
  getLoopTime,
  getSeamlessAngle,
  intCycles,
  getSeamlessSine,
  mod,
  TEMPLATE_CONFIG,
} from "../../shared";

/**
 * NeonGridTunnel - Endless perspective grid flying toward viewer
 * Seamless loop: All animations use periodic functions based on loopTime
 * Frame 0 = Frame 900 (identical, no flickering)
 */
export const NeonGridTunnel: React.FC<NeonGridTunnelProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  backgroundColor,
  gridSize,
  flightSpeed,
  scanLineCount,
  pulseIntensity,
  glowIntensity,
}) => {
  const draw = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
      const { durationInFrames } = TEMPLATE_CONFIG;
      
      // SEAMLESS: getLoopTime returns 0 at frame 0, 1 at frame 899, 0 at frame 900
      const loopTime = getLoopTime(frame, durationInFrames);

      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Perspective tunnel parameters
      const fov = 800;
      const gridDepth = 40;
      const spacing = Math.min(width, height) / gridSize;

      ctx.save();
      ctx.translate(cx, cy);

      // Seamless rotation ??? use getSeamlessAngle with integer cycles
      // FIX: use intCycles for integer rotation count (seamless)
      const baseRotation = getSeamlessAngle(frame, durationInFrames, intCycles(flightSpeed));
      
      // FIX: scroll distance must be integer multiples of grid spacing range
      const scrollDist = gridDepth * 2 * spacing * intCycles(flightSpeed);
      const totalRange = gridDepth * spacing * 2;
      
      // Draw perspective grid lines
      for (let i = -gridDepth; i <= gridDepth; i++) {
        // Z position - seamless scrolling with integer scroll distance
        const zRaw = mod(i * spacing + loopTime * scrollDist, totalRange);
        const z = zRaw - gridDepth * spacing;
        
        const scale = fov / (fov + Math.abs(z));
        const alpha = Math.max(0.05, scale * 0.8);

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = i % 2 === 0 ? primaryColor : secondaryColor;
        ctx.lineWidth = Math.max(1, scale * 3);
        ctx.shadowBlur = 15 * glowIntensity * scale;
        ctx.shadowColor = ctx.strokeStyle;

        // Vertical lines
        for (let j = -gridDepth; j <= gridDepth; j++) {
          const x = j * spacing * scale;
          const y1 = -gridDepth * spacing * scale;
          const y2 = gridDepth * spacing * scale;

          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();
        }

        // Horizontal lines
        for (let j = -gridDepth; j <= gridDepth; j++) {
          const y = j * spacing * scale;
          const x1 = -gridDepth * spacing * scale;
          const x2 = gridDepth * spacing * scale;

          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        }
      }

      // Draw scan lines with seamless pulsing
      ctx.shadowBlur = 0;
      for (let s = 0; s < scanLineCount; s++) {
        // Seamless scan line position using intCycles for integer scroll
        const scanScroll = (loopTime * intCycles(flightSpeed) + s / scanLineCount) % 1;
        const scanY = (scanScroll - 0.5) * height * 2;
        const scanAlpha = getSeamlessSine(frame, durationInFrames, intCycles(flightSpeed) + s + 1) * pulseIntensity * 0.5;

        ctx.globalAlpha = scanAlpha;
        ctx.fillStyle = tertiaryColor;
        ctx.fillRect(-width, scanY - 2, width * 2, 4);
      }

      // Draw center glow (pulsing with seamless loop)
      const pulseSize = 50 + getSeamlessSine(frame, durationInFrames, 2) * 20 * pulseIntensity;
      const centerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, pulseSize * 3);
      centerGlow.addColorStop(0, primaryColor);
      centerGlow.addColorStop(0.3, secondaryColor);
      centerGlow.addColorStop(1, "transparent");

      ctx.globalAlpha = 0.6 * pulseIntensity;
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, pulseSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw outer ring with seamless rotation
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 30 * glowIntensity;
      ctx.shadowColor = primaryColor;

      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.4, height * 0.4, baseRotation, 0, Math.PI * 2);
      ctx.stroke();

      // Inner ring rotating opposite direction (use integer multiple of baseRotation)
      const innerRotK = intCycles(1.5); // = 2
      ctx.strokeStyle = secondaryColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.25, height * 0.25, -baseRotation * innerRotK, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // Apply vignette
      applyVignette(ctx, width, height, 0.4);
    };
  }, [primaryColor, secondaryColor, tertiaryColor, backgroundColor, gridSize, flightSpeed, scanLineCount, pulseIntensity, glowIntensity]);

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




