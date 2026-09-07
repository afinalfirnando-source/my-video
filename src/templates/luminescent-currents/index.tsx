// Background seamless loop components optimized for 4K
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { createSeamlessLoop, smoothTransition } from "../loop-engine";
import type { LoopConfig } from "../loop-engine";

interface LuminescentCurrentsProps {
  flowSpeed: number;
  intensity: number;
  colorMode: "cyan" | "magenta" | "white";
}

const PATH_COUNT = 8;
const MAX_POINTS = 50;

export const LuminescentCurrents: React.FC<LuminescentCurrentsProps & LoopConfig> = ({
  flowSpeed = 1.0,
  intensity = 1.0,
  colorMode = "cyan",
  durationInFrames,
  fps,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopData = useMemo(() => createSeamlessLoop(durationInFrames, 4), [durationInFrames]);

  const time = (frame % durationInFrames) / durationInFrames;
  const loop = loopData(frame);

  const currents = useMemo(() => {
    return Array.from({ length: PATH_COUNT }, (_, i) => {
      const angle = (i * Math.PI * 2) / PATH_COUNT;
      const baseX = width / 2 + Math.cos(angle) * width * 0.3;
      const baseY = height / 2 + Math.sin(angle) * height * 0.3;
      const points: { x: number; y: number; alpha: number }[] = [];
      
      for (let j = 0; j < MAX_POINTS; j++) {
        const noiseX = Math.sin(time * flowSpeed + j * 0.3 + i * 0.5);
        const noiseY = Math.cos(time * flowSpeed * 0.7 + j * 0.4 + i * 0.8);
        const offsetX = noiseX * width * 0.1 * intensity;
        const offsetY = noiseY * height * 0.1 * intensity;
        
        const pulse = Math.sin(time * 2 + j * 0.5) * 0.3 + 1;
        const alpha = Math.max(0, Math.min(1, pulse * intensity * loop.normalizedFrame * 0.8));
        
        points.push({
          x: baseX + offsetX + Math.cos(j * 0.5) * width * 0.05 * intensity,
          y: baseY + offsetY + Math.sin(j * 0.5) * height * 0.05 * intensity,
          alpha,
        });
      }
      
      return points;
    });
  }, [width, height, flowSpeed, intensity, time, loop.normalizedFrame]);

  const getColor = (alpha: number) => {
    const baseAlpha = alpha * intensity;
    switch (colorMode) {
      case "cyan":
        return `rgba(0, 240, 255, ${baseAlpha})`;
      case "magenta":
        return `rgba(255, 0, 240, ${baseAlpha})`;
      case "white":
        return `rgba(255, 255, 255, ${baseAlpha * 0.6})`;
    }
  };

  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FFFFFF";

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = 0.5 + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.5;

      ctx.globalAlpha = twinkle * 0.6;
      ctx.fillStyle = hsl(s.hue + time * 20, 90, 50);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * twinkle, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 30;
    ctx.shadowColor = primaryColor;

    for (let i = 0; i < curtains.length; i++) {
      const c = curtains[i];
      const waveT = t * c.waveSpeed * waveSpeed + c.phase;
      const hue = (c.hueShift + time * 30) % 360;

      ctx.globalAlpha = auroraIntensity * 0.5;
      ctx.shadowBlur = 30;
      ctx.shadowColor = hsl(hue, 90, 50);

      ctx.fillStyle = hsl(hue, 90, 50);
      ctx.strokeStyle = hsl(hue, 90, 30);
      ctx.lineWidth = 2;
      ctx.beginPath();

      const topY = height * 0.2;
      const bottomY = height * 0.8;

      for (let y = topY; y < bottomY; y += 2) {
        const waveOffset = Math.sin((y - topY) * c.waveFrequency + waveT) * c.waveAmplitude;
        const x = c.startX + waveOffset;

        if (y === topY) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(c.startX, bottomY);
      ctx.lineTo(c.startX + c.width, bottomY);

      const waveOffset2 = Math.sin((bottomY - topY) * c.waveFrequency + waveT) * c.waveAmplitude;
      ctx.lineTo(c.startX + c.width + waveOffset2, topY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.globalAlpha = interferenceIntensity * 0.4;
    ctx.shadowBlur = 40;
    ctx.shadowColor = secondaryColor;

    for (let i = 0; i < 10; i++) {
      const interferenceT = t * 0.5 + i * 1.5;
      const amplitude = height * 0.05;
      const frequency = 0.005 + i * 0.003;
      const hue = (time * 60 + i * 40) % 360;

      ctx.strokeStyle = hsl(hue, 90, 60);
      ctx.lineWidth = 1 + i * 0.5;
      ctx.beginPath();

      for (let x = 0; x < width; x += 3) {
        const y1 = height * 0.3 + Math.sin(x * frequency + interferenceT) * amplitude;
        const y2 = height * 0.7 + Math.cos(x * frequency * 1.3 + interferenceT) * amplitude * 0.7;

        ctx.globalAlpha = interferenceIntensity * 0.2;
        ctx.lineTo(x, y1);

        if (x === 0) ctx.moveTo(x, y1);
        else ctx.lineTo(x, y1);

        ctx.globalAlpha = interferenceIntensity * 0.15;
        if (x === 0) ctx.moveTo(x, y2);
        else ctx.lineTo(x, y2);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 35;
    ctx.shadowColor = tertiaryColor;

    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < 8; i++) {
      const radius = i * 80 + 50 + Math.sin(t * 0.3 + i) * 20;
      const hue = (time * 80 + i * 45) % 360;
      const pulse = 0.7 + Math.sin(t * 0.5 + i * 0.7) * 0.3;

      ctx.globalAlpha = pulse * 0.3;
      ctx.strokeStyle = hsl(hue, 90, 60);
      ctx.lineWidth = pulse * 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = primaryColor;
    for (let i = 0; i < 200; i++) {
      const sparkX = seeded(i * 43 + time * 80) * width;
      const sparkY = seeded(i * 47 + time * 60) * height;
      const sparkSize = seeded(i * 53) * 2 + 0.5;
      const sparkHue = (time * 100 + seeded(i * 59) * 60) % 360;

      ctx.globalAlpha = seeded(i * 61) * 0.3 + 0.1;
      ctx.fillStyle = hsl(sparkHue, 90, 50);
      ctx.fillRect(sparkX, sparkY, sparkSize, sparkSize);
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 50;
    ctx.shadowColor = secondaryColor;
    const horizonY = height * 0.8 + Math.sin(t * 0.2) * 30;
    const horizonGradient = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY);
    horizonGradient.addColorStop(0, hsl((time * 30) % 360, 90, 50));
    horizonGradient.addColorStop(1, "transparent");
    ctx.fillRect(0, horizonY - 50, width, 100);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
