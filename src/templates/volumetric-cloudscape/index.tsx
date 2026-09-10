import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { VolumetricCloudscapeProps } from "./types";

const TOTAL_FRAMES = 900;

type CloudBlob = {
  x: number;
  y: number;
  baseSize: number;
  depth: number;
  driftSpeed: number;
  phase: number;
  density: number;
};

type LightRay = {
  angle: number;
  width: number;
  speed: number;
  phase: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const VolumetricCloudscape: React.FC<VolumetricCloudscapeProps> = ({
  skyTopColor = "#001133",
  skyBottomColor = "#002266",
  cloudColor = "#FFFFFF",
  sunColor = "#FFD700",
  cloudDensity = 0.7,
  sunIntensity = 0.8,
  rayCount = 12,
  windSpeed = 0.3,
  layerCount = 3,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const cloudBlobs = useMemo(
    () =>
      Array.from({ length: 300 }, (_, i): CloudBlob => ({
        x: seeded(i * 13 + 1) * width,
        y: seeded(i * 13 + 2) * height,
        baseSize: seeded(i * 13 + 3) * 200 + 100,
        depth: seeded(i * 13 + 4),
        driftSpeed: seeded(i * 13 + 5) * 0.3 + 0.2,
        phase: seeded(i * 13 + 6) * Math.PI * 2,
        density: seeded(i * 13 + 7) * 0.5 + 0.5,
      })),
    [width, height]
  );

  const lightRays = useMemo(
    () =>
      Array.from({ length: rayCount }, (_, i): LightRay => ({
        angle: (i / rayCount) * Math.PI * 2,
        width: seeded(i * 31 + 1) * 30 + 20,
        speed: seeded(i * 31 + 2) * 0.3 + 0.5,
        phase: seeded(i * 31 + 3) * Math.PI * 2,
      })),
    [rayCount]
  );

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, skyTopColor);
    skyGradient.addColorStop(0.5, hsl(210, 40, 15));
    skyGradient.addColorStop(1, skyBottomColor);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    const sunX = width / 2 + Math.cos(t * 0.2) * width * 0.3;
    const sunY = height * 0.3 + Math.sin(t * 0.15) * height * 0.1;

    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 400);
    sunGradient.addColorStop(0, `#FFD700`);
    sunGradient.addColorStop(0.3, `#FFA500`);
    sunGradient.addColorStop(0.7, `#FF4500`);
    sunGradient.addColorStop(1, "transparent");

    ctx.globalAlpha = sunIntensity;
    ctx.shadowBlur = 80;
    ctx.shadowColor = sunColor;
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 100;
    ctx.shadowColor = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 350, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 50;
    ctx.shadowColor = sunColor;

    for (let i = 0; i < lightRays.length; i++) {
      const ray = lightRays[i];
      const rayT = t * ray.speed + ray.phase;
      const pulse = 0.5 + Math.sin(rayT * 2) * 0.3;

      const startX = sunX + Math.cos(ray.angle) * 100;
      const startY = sunY + Math.sin(ray.angle) * 100;
      const endX = sunX + Math.cos(ray.angle) * 2000;
      const endY = sunY + Math.sin(ray.angle) * 2000;

      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, `hsla(45, 100%, 60%, ${pulse})`);
      gradient.addColorStop(0.3, `hsla(45, 100%, 50%, ${pulse * 0.5})`);
      gradient.addColorStop(1, `hsla(45, 100%, 50%, 0)`);

      ctx.globalAlpha = pulse * 0.2;
      ctx.fillStyle = gradient;
      ctx.fillRect(startX, startY, 2500, ray.width);
      ctx.globalAlpha = 0.3;
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    for (let layer = 0; layer < layerCount; layer++) {
      const layerTime = t * (windSpeed * (0.5 + layer * 0.3));
      const layerScale = 0.7 + layer * 0.3;
      const layerAlpha = cloudDensity * (0.4 + layer * 0.2);
      const layerDepth = layer / layerCount;

      ctx.globalAlpha = layerAlpha * 0.5;
      ctx.shadowBlur = 30;
      ctx.shadowColor = sunColor;

      for (let i = 0; i < cloudBlobs.length; i++) {
        const cb = cloudBlobs[i];
        if (cb.depth < layerDepth || cb.depth > layerDepth + (1 / layerCount)) continue;

        const driftX = Math.sin(layerTime + cb.phase) * cb.driftSpeed * 100;
        const px = cb.x + driftX;
        const py = cb.y + Math.sin(layerTime * 0.5 + cb.phase) * cb.baseSize * 0.1;

        const blobSize = cb.baseSize * layerScale;
        const blobPulse = cb.density * (0.8 + Math.sin(t * 0.3 + cb.phase) * 0.2);

        ctx.globalAlpha = layerAlpha * blobPulse;
        ctx.fillStyle = cloudColor;

        ctx.beginPath();
        ctx.arc(px, py, blobSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px + blobSize * 0.3, py - blobSize * 0.2, blobSize * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px - blobSize * 0.2, py + blobSize * 0.3, blobSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#FFFFFF";
    for (let i = 0; i < 200; i++) {
      const starX = seeded(i * 41 + time * 10) * width;
      const starY = seeded(i * 43 + time * 5) * height;
      const starSize = seeded(i * 47) * 1.5 + 0.3;
      const twinkle = 0.5 + Math.sin(t * seeded(i * 53 + 1) + seeded(i * 53 + 2)) * 0.5;

      ctx.globalAlpha = twinkle * 0.5;
      ctx.fillStyle = hsl(210, 50, 80);
      ctx.fillRect(starX, starY, starSize, starSize);
    }

    ctx.restore();
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
