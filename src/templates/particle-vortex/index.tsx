import { AbsoluteFill } from "remotion";
import React, { useMemo } from "react";
import type { ParticleVortexProps } from "./types";
import {
  useCanvas,
  applyVignette,
  getSeamlessAngle,
  getSeamlessSine,
  intCycles,
  seeded,
  TEMPLATE_CONFIG,
} from "../../shared";

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  hueOffset: number;
  armPhase: number;
};

/**
 * ParticleVortex - Particles spiraling into glowing core with light trails
 * Seamless loop: All animations use periodic functions based on loopTime
 * Frame 0 = Frame 900 (identical, no flickering)
 */
export const ParticleVortex: React.FC<ParticleVortexProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  backgroundColor,
  particleCount,
  vortexSpeed,
  spiralStrength,
  coreGlow,
  trailLength,
  glowIntensity,
}) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      angle: seeded(i * 13 + 1) * Math.PI * 2,
      radius: seeded(i * 13 + 2) * 400 + 50,
      speed: seeded(i * 13 + 3) * 0.8 + 0.2,
      size: seeded(i * 13 + 4) * 5 + 2,
      hueOffset: seeded(i * 13 + 5) * 60,
      armPhase: seeded(i * 13 + 6) * Math.PI * 2,
    }));
  }, [particleCount]);

  const draw = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
      const { durationInFrames: D } = TEMPLATE_CONFIG;
      const loopT = getLoopTime(frame, D);
      const baseCycles = intCycles(vortexSpeed);
      const armCycles = intCycles(vortexSpeed * 2);
      const coreCycles = intCycles(vortexSpeed * 3);

      const timeAngle = getSeamlessAngle(frame, D, baseCycles);
      const coreTimeAngle = getSeamlessAngle(frame, D, coreCycles);
      const armTimeAngle = getSeamlessAngle(frame, D, armCycles);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Draw outer glow ring
      const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(width, height) * 0.6);
      outerGlow.addColorStop(0, "rgba(255, 140, 0, 0.1)");
      outerGlow.addColorStop(0.5, "rgba(255, 0, 128, 0.05)");
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(-cx, -cy, width, height);

      // Draw particles with trails
      for (const particle of particles) {
        // Seamless base rotation (same cycles for all, static offset per particle)
        const baseAngle = particle.angle + timeAngle + particle.armPhase;
        // Spiral angle: static per-particle offset, same timeAngle — seamless
        const spiralAngle = baseAngle + (1 - particle.radius / 450) * spiralStrength * Math.PI * 4;
        // Radial pulse: uses coreCycles (integer), static per-particle offset
        const radialPulse = getSeamlessSine(frame, D, coreCycles) * 40 +
                            Math.sin(particle.armPhase * 0.3) * 20;
        const currentRadius = particle.radius + radialPulse;

        const px = Math.cos(spiralAngle) * currentRadius;
        const py = Math.sin(spiralAngle) * currentRadius;

        // Draw trail
        const trailSteps = Math.floor(8 * trailLength);
        for (let t = trailSteps; t >= 0; t--) {
          const tNorm = t / trailSteps;
          // Trail angle: use same timeAngle with slight backward offset per trail segment
          const trailAngle = spiralAngle - tNorm * 0.3 * baseCycles * Math.PI * 2 * particle.speed;
          const trailRadius = currentRadius + tNorm * 40;
          const tx = Math.cos(trailAngle + spiralAngle * 0) * trailRadius;
          const ty = Math.sin(trailAngle + spiralAngle * 0) * trailRadius;
          const alpha = (1 - tNorm) * 0.4;
          const hue = (particle.hueOffset +
                       getSeamlessSine(frame, D, coreCycles) * 180) % 360;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
          ctx.shadowBlur = 10 * glowIntensity;
          ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;

          ctx.beginPath();
          ctx.arc(tx, ty, particle.size * (1 - tNorm * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }

        // Main particle (same hue as trail)
        const particleHue = (particle.hueOffset +
                            getSeamlessSine(frame, D, coreCycles) * 180) % 360;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = `hsl(${particleHue}, 100%, 70%)`;
        ctx.shadowBlur = 20 * glowIntensity;
        ctx.shadowColor = `hsl(${particleHue}, 100%, 50%)`;

        ctx.beginPath();
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw core with pulsing glow
      const corePulse = 0.8 + getSeamlessSine(frame, D, coreCycles) * 0.2;
      const coreSize = 200 * corePulse;

      const coreGlowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 4);
      coreGlowGradient.addColorStop(0, tertiaryColor);
      coreGlowGradient.addColorStop(0.3, primaryColor);
      coreGlowGradient.addColorStop(0.6, secondaryColor);
      coreGlowGradient.addColorStop(1, "transparent");

      ctx.globalAlpha = coreGlow;
      ctx.fillStyle = coreGlowGradient;
      ctx.shadowBlur = 60 * coreGlow;
      ctx.shadowColor = tertiaryColor;
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 4, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw rotating spiral arms
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = primaryColor;

      for (let arm = 0; arm < 4; arm++) {
        const armOffset = (arm / 4) * Math.PI * 2;
        ctx.beginPath();
        for (let r = 0; r < 400; r += 5) {
          const angle = armOffset + (r / 400) * Math.PI * 4 + armTimeAngle;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();

      applyVignette(ctx, width, height, 0.4);
    };
  }, [primaryColor, secondaryColor, tertiaryColor, backgroundColor, vortexSpeed, spiralStrength, coreGlow, trailLength, glowIntensity, particles]);alAngle - trailT * 0.3 * intCycles(vortexSpeed);piralAngle - trailT * 0.3 * Math.PI * 2 * intCycles(vortexSpeed);
          const trailRadius = currentRadius + trailT * 30;
          const tx = Math.cos(trailAngle) * trailRadius;
          const ty = Math.sin(trailAngle) * trailRadius;

          const trailAlpha = (1 - trailT) * 0.4;
          // Seamless hue: +i*60 static, sin(pulseCycles) with offset = 0 at seam
          const hue = (particle.hueOffset +
                       Math.sin(getSeamlessAngle(frame, durationInFrames, pulseCycles) + particle.phaseOffset) * 180 +
                       i * 0) % 360;
          // Note: + i*0 since we already have hueOffset; using Math.sin(offset) gives per-particle variation

          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
          ctx.shadowBlur = 10 * glowIntensity;
          ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;

          ctx.beginPath();
          ctx.arc(tx, ty, particle.size * (1 - trailT * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }

        // Main particle hue (same formula as trail — no need for duplicate)
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
        ctx.shadowBlur = 20 * glowIntensity;
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;

        ctx.beginPath();
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw core with pulsing glow
      // FIX: intCycles(vortexSpeed + 2) → integer, seamless
      const corePulseCycles = intCycles(vortexSpeed + 2);
      const corePulse = 0.8 + getSeamlessSine(frame, durationInFrames, corePulseCycles) * 0.2;
      const coreSize = 200 * corePulse;  // was 40, now 200 (visible at 4K)

      const coreGlowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 4);
      coreGlowGradient.addColorStop(0, tertiaryColor);
      coreGlowGradient.addColorStop(0.3, primaryColor);
      coreGlowGradient.addColorStop(0.6, secondaryColor);
      coreGlowGradient.addColorStop(1, "transparent");

      ctx.globalAlpha = coreGlow;
      ctx.fillStyle = coreGlowGradient;
      ctx.shadowBlur = 60 * coreGlow;
      ctx.shadowColor = tertiaryColor;
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 4, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw rotating spiral arms
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = primaryColor;

      for (let arm = 0; arm < 4; arm++) {
        const armOffset = (arm / 4) * Math.PI * 2;
        ctx.beginPath();
        for (let r = 0; r < 400; r += 5) {
          const angle = armOffset + (r / 400) * Math.PI * 4 + armTimeAngle;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();

      applyVignette(ctx, width, height, 0.4);
    };
    }, [primaryColor, secondaryColor, tertiaryColor, backgroundColor, vortexSpeed, spiralStrength, coreGlow, trailLength, glowIntensity, particles]);

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
