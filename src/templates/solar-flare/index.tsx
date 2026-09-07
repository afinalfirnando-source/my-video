import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { SolarFlareProps } from "./types";

const TOTAL_FRAMES = 900;

type Flare = {
  cx: number;
  cy: number;
  baseLength: number;
  width: number;
  phase: number;
  speed: number;
  hue: number;
};

type PlasmaStream = {
  x: number;
  y: number;
  speed: number;
  size: number;
  hue: number;
  phase: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const SolarFlare: React.FC<SolarFlareProps> = ({
  solarColor = "#FFA500",
  flareColor = "#FF4500",
  plasmaColor = "#FFD700",
  surfaceIntensity = 0.8,
  flareCount = 10,
  magneticLineCount = 20,
  plasmaStreamDensity = 100,
  rotationSpeed = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const cx = width / 2;
  const cy = height / 2;
  const solarRadius = Math.min(width, height) * 0.3;

  const flares = useMemo(
    () =>
      Array.from({ length: flareCount }, (_, i): Flare => ({
        cx: cx + (seeded(i * 13 + 1) - 0.5) * solarRadius * 0.6,
        cy: cy + (seeded(i * 13 + 2) - 0.5) * solarRadius * 0.6,
        baseLength: seeded(i * 13 + 3) * solarRadius * 0.5 + solarRadius * 0.3,
        width: seeded(i * 13 + 4) * 15 + 10,
        phase: seeded(i * 13 + 5) * Math.PI * 2,
        speed: seeded(i * 13 + 6) * 0.3 + 0.7,
        hue: 20 + seeded(i * 13 + 7) * 40,
      })),
    [width, height, cx, cy, solarRadius, flareCount]
  );

  const plasmaStreams = useMemo(
    () =>
      Array.from({ length: plasmaStreamDensity }, (_, i): PlasmaStream => ({
        x: seeded(i * 31 + 1) * width,
        y: seeded(i * 31 + 2) * height,
        speed: seeded(i * 31 + 3) * 0.3 + 0.5,
        size: seeded(i * 31 + 4) * 2 + 1,
        hue: 30 + seeded(i * 31 + 5) * 30,
        phase: seeded(i * 31 + 6) * Math.PI * 2,
      })),
    [width, height, plasmaStreamDensity]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const sunGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, solarRadius);
    sunGradient.addColorStop(0, hsl(40, 100, 60));
    sunGradient.addColorStop(0.5, hsl(30, 100, 50));
    sunGradient.addColorStop(0.8, hsl(20, 100, 30));
    sunGradient.addColorStop(1, hsl(10, 90, 15));

    ctx.globalAlpha = surfaceIntensity;
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, solarRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 60;
    ctx.shadowColor = solarColor;
    ctx.beginPath();
    ctx.arc(cx, cy, solarRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 100;
    ctx.fillStyle = solarColor;
    ctx.beginPath();
    ctx.arc(cx, cy, solarRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 40;
    ctx.shadowColor = flareColor;

    for (let i = 0; i < magneticLineCount; i++) {
      const angle = (t * rotationSpeed + (i / magneticLineCount) * Math.PI * 2);
      const curved = Math.sin(t * 0.3 + i * 0.5) * 0.2;

      ctx.globalAlpha = 0.4 + i * 0.02;
      ctx.strokeStyle = hsl((20 + i * 10) % 360, 90, 50);
      ctx.lineWidth = 2;
      ctx.beginPath();

      const endAngle = angle + Math.PI + curved;

      for (let seg = 0; seg <= 20; seg++) {
        const segT = seg / 20;
        const midAngle = angle + (endAngle - angle) * segT;
        const bulge = Math.sin(segT * Math.PI) * 50 * curved;
        const px = cx + Math.cos(midAngle) * (solarRadius * (0.5 + segT * 0.7)) + bulge;
        const py = cy + Math.sin(midAngle) * (solarRadius * (0.5 + segT * 0.7)) + bulge;

        if (seg === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 50;
    ctx.shadowColor = flareColor;

    for (let i = 0; i < flares.length; i++) {
      const f = flares[i];
      const flareT = t * f.speed + f.phase;
      const flarePulse = 0.5 + Math.sin(flareT) * 0.5;
      const flareLen = f.baseLength * (0.3 + flarePulse * 0.7);
      const flareAngle = (i / flares.length) * Math.PI * 2 + t * 0.2;

      const endX = f.cx + Math.cos(flareAngle) * flareLen;
      const endY = f.cy + Math.sin(flareAngle) * flareLen;

      const hue = (f.hue + time * 10) % 360;

      const flareGradient = ctx.createLinearGradient(f.cx, f.cy, endX, endY);
      flareGradient.addColorStop(0, hsl(hue, 100, 60));
      flareGradient.addColorStop(0.5, hsl(hue, 100, 50));
      flareGradient.addColorStop(1, hsl(hue, 100, 20));

      ctx.globalAlpha = flarePulse * 0.6;
      ctx.fillStyle = flareGradient;
      ctx.beginPath();
      ctx.moveTo(f.cx, f.cy);
      ctx.lineTo(endX, endY);
      ctx.lineTo(endX + Math.cos(flareAngle + 0.3) * f.width, endY + Math.sin(flareAngle + 0.3) * f.width);
      ctx.lineTo(f.cx + Math.cos(flareAngle + 0.3) * f.width * 0.5, f.cy + Math.sin(flareAngle + 0.3) * f.width * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = flarePulse * 0.4;
      ctx.shadowBlur = 30;
      ctx.shadowColor = plasmaColor;
      ctx.beginPath();
      ctx.arc(endX, endY, f.width, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 20;
    ctx.shadowColor = plasmaColor;

    for (let i = 0; i < plasmaStreams.length; i++) {
      const ps = plasmaStreams[i];
      const streamT = t * ps.speed + ps.phase;
      const py = ps.y + Math.sin(streamT) * 50;
      const px = ps.x + Math.cos(streamT * 0.5) * 20;
      const alpha = 0.3 + ps.size * 0.1;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = hsl(ps.hue, 90, 50);
      ctx.beginPath();
      ctx.arc(px, py, ps.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.15;
    ctx.shadowBlur = 40;
    ctx.shadowColor = flareColor;
    for (let i = 0; i < 300; i++) {
      const sparkX = seeded(i * 41 + time * 100) * width;
      const sparkY = seeded(i * 43 + time * 80) * height;
      const sparkSize = seeded(i * 47) * 2 + 0.5;
      const sparkAlpha = seeded(i * 53) * 0.3;

      ctx.globalAlpha = sparkAlpha;
      ctx.fillStyle = hsl((30 + seeded(i * 59) * 30), 90, 50);
      ctx.fillRect(sparkX, sparkY, sparkSize, sparkSize);
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 80;
    ctx.shadowColor = solarColor;
    const sunSurfaceGradient = ctx.createRadialGradient(cx, cy, solarRadius * 0.5, cx, cy, solarRadius * 2);
    sunSurfaceGradient.addColorStop(0, "transparent");
    sunSurfaceGradient.addColorStop(0.7, hsl(40, 100, 50));
    sunSurfaceGradient.addColorStop(1, "transparent");
    ctx.fillStyle = sunSurfaceGradient;
    ctx.fillRect(cx - solarRadius * 2, cy - solarRadius * 2, solarRadius * 4, solarRadius * 4);

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
