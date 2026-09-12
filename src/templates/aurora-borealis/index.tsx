import { AbsoluteFill } from "remotion";
import React, { useMemo } from "react";
import type { AuroraBorealisProps } from "./types";
import {
  useCanvas,
  applyVignette,
  getSeamlessAngle,
  getSeamlessSine,
  intCycles,
  seeded,
  TEMPLATE_CONFIG,
} from "../../shared";

type Star = { x: number; y: number; size: number; phase: number };

/**
 * AuroraBorealis - Curtains of northern lights dancing across starry sky
 * Seamless loop: All animations use integer cycle counts via getSeamlessAngle
 * Frame 0 = Frame 900 (identical, no flickering)
 */
export const AuroraBorealis: React.FC<AuroraBorealisProps> = ({
  primaryColor,
  secondaryColor,
  backgroundColor,
  curtainCount,
  waveSpeed,
  starDensity,
  glowIntensity,
}) => {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: starDensity }, (_, i) => ({
      x: seeded(i * 7 + 1),
      y: seeded(i * 7 + 2) * 0.7,
      size: seeded(i * 7 + 3) * 2 + 0.5,
      phase: seeded(i * 7 + 4) * Math.PI * 2,
    }));
  }, [starDensity]);

  const draw = useMemo(() => {
    // FIX: Use intCycles to ensure integer wave cycles for seamless loop
    const waveCycles = intCycles(waveSpeed);
    
    return (ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
      const { durationInFrames } = TEMPLATE_CONFIG;
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.globalCompositeOperation = "source-over";
      // Get seamless angle with integer cycles
      const timeAngle = getSeamlessAngle(frame, durationInFrames, waveCycles);
      // Star twinkle uses integer cycles only
      const starTwinkleCycles = intCycles(3);

      // Clear with gradient sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, "#050510");
      skyGradient.addColorStop(0.5, backgroundColor);
      skyGradient.addColorStop(1, "#020205");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw twinkling stars
      ctx.shadowBlur = 0;
      for (const star of stars) {
        // FIX: Use getSeamlessSine with integer cycles + constant phase offset (safe)
        const twinkle = 0.5 + getSeamlessSine(frame, durationInFrames, starTwinkleCycles) * 0.5;
        ctx.globalAlpha = twinkle * 0.8;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size * twinkle, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw aurora curtains
      for (let c = 0; c < curtainCount; c++) {
        const curtainPhase = (c / curtainCount) * Math.PI * 2;
        const curtainOffset = (c / curtainCount) * width * 0.3;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Create gradient for this curtain
        const gradient = ctx.createLinearGradient(0, height * 0.3, 0, height * 0.9);
        // FIX: Use integer cycles for hue shift (c + 1 is integer since c is integer)
        const hueShift = getSeamlessSine(frame, durationInFrames, c + 1) * 30;
        
        gradient.addColorStop(0, `hsla(${(120 + hueShift) % 360}, 100%, 60%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${(200 + hueShift) % 360}, 100%, 50%, 0.6)`);
        gradient.addColorStop(1, `hsla(${(280 + hueShift) % 360}, 100%, 40%, 0.1)`);

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 40 * glowIntensity;
        ctx.shadowColor = c % 2 === 0 ? primaryColor : secondaryColor;

        // Draw wavy curtain shape
        ctx.beginPath();
        const segments = 80;
        for (let x = 0; x <= segments; x++) {
          const px = (x / segments) * width;
          const xRatio = x / segments;
          
          // FIX: Use getSeamlessAngle with integer cycles instead of loopTime * 2π * waveSpeed
          // Spatial component (Math.sin with xRatio) is safe — time component uses seamless angle
          const wave1 = Math.sin(xRatio * Math.PI * 2 + timeAngle + curtainPhase) * 50;
          const wave2 = Math.sin(xRatio * Math.PI * 3 + timeAngle * 2 + curtainPhase * 0.7) * 30;
          const wave3 = Math.sin(xRatio * Math.PI * 5 + timeAngle * 3 + curtainPhase * 1.5) * 20;
          
          const baseY = height * 0.3 + curtainOffset;
          const py = baseY + wave1 + wave2 + wave3;

          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        // Complete shape to bottom
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Ground silhouette
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 50) {
        const py = height - 50 + Math.sin(x * 0.01) * 20;
        ctx.lineTo(x, py);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Vignette
      applyVignette(ctx, width, height, 0.5);
    };
  }, [primaryColor, secondaryColor, backgroundColor, curtainCount, waveSpeed, glowIntensity, stars]);

  const canvasRef = useCanvas(draw);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050510" }}>
      <canvas
        ref={canvasRef}
        width={TEMPLATE_CONFIG.width}
        height={TEMPLATE_CONFIG.height}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
