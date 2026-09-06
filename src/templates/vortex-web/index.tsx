import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { VortexWebProps } from "./types";

const TOTAL_FRAMES = 720;
const VERTICES = 16;
const FOV = 800;

type Star = {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkle: number;
};

type Dust = {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  opacity: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h % 360}, ${s}%, ${l}%)`;
}

export const VortexWeb: React.FC<VortexWebProps> = ({
  primaryColor = "#00F0FF",
  rotationSpeed = 1.0,
  forwardSpeed = 1.0,
  vortexIntensity = 0.7,
  webDensity = 0.8,
  particleCount = 200,
  ringCount = 12,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorShift = (frame % 240) / 240;

  const stars = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i): Star => ({
        x: seeded(i * 7 + 1) * width,
        y: seeded(i * 7 + 2) * height * 0.85,
        size: seeded(i * 7 + 3) * 1.8 + 0.3,
        brightness: seeded(i * 7 + 4) * 0.5 + 0.5,
        twinkle: seeded(i * 7 + 5) * Math.PI * 2,
      })),
    [width, height, particleCount]
  );

  const dust = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i): Dust => ({
        x: seeded(i * 13 + 1) * width,
        y: seeded(i * 13 + 2) * height,
        z: seeded(i * 13 + 3) * width * 0.3,
        size: seeded(i * 13 + 4) * 2 + 0.5,
        speed: seeded(i * 13 + 5) * 0.03 + 0.01,
        opacity: seeded(i * 13 + 6) * 0.15 + 0.05,
      })),
    [width, height]
  );

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    drawBackground(ctx, width, height);
    drawStars(ctx, stars, time);
    drawCosmicDust(ctx, dust, time, width, height);
     drawNebula(ctx, width, height, time);

    drawVortexTunnel(ctx, width, height, time, ringCount, rotationSpeed, forwardSpeed, vortexIntensity, primaryColor, webDensity, colorShift);
    drawGlowingCore(ctx, width, height, time, vortexIntensity, primaryColor);
    drawLensFlare(ctx, width, height, time);

    drawVignette(ctx, width, height);
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

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0A001A");
  gradient.addColorStop(0.5, "#000000");
  gradient.addColorStop(1, "#05000F");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawNebula(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  const clouds = [
    { hue: 270, x: 0.65, y: 0.3, r: 900 },
    { hue: 200, x: 0.3, y: 0.7, r: 1000 },
    { hue: 310, x: 0.5, y: 0.2, r: 700 },
    { hue: 250, x: 0.8, y: 0.6, r: 750 },
  ];

  clouds.forEach((cloud, i) => {
    const t = time * Math.PI * 2 + i * 1.5;
    const cx = width * cloud.x + Math.cos(t) * 120;
    const cy = height * cloud.y + Math.sin(t * 0.7) * 80;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cloud.r);
    gradient.addColorStop(0, `hsla(${cloud.hue}, 90%, 65%, 0.22)`);
    gradient.addColorStop(0.4, `hsla(${cloud.hue}, 80%, 50%, 0.1)`);
    gradient.addColorStop(1, "transparent");

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
  });
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  time: number
) {
  stars.forEach((star) => {
    const twinkle = Math.sin(time * Math.PI * 2 + star.twinkle) * 0.5 + 0.5;
    ctx.globalAlpha = star.brightness * twinkle;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawCosmicDust(
  ctx: CanvasRenderingContext2D,
  dust: Dust[],
  time: number,
  width: number,
  height: number
) {
  dust.forEach((d) => {
    const t = time * Math.PI * 2;
    const x = ((d.x + Math.cos(t + d.z) * 25) % width + width) % width;
    const y = ((d.y + Math.sin(t * 0.7 + d.z) * 20) % height + height) % height;

    ctx.globalAlpha = d.opacity;
    ctx.fillStyle = "#FFB6C1";
    ctx.beginPath();
    ctx.arc(x, y, d.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawVortexTunnel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  ringCount: number,
  rotSpeed: number,
  fwdSpeed: number,
  intensity: number,
  color: string,
  density: number,
  colorShift: number
) {
  const cx = width * 0.5;
  const cy = height * 0.55;
  const ringSpacing = height * 0.15;
  const maxRadius = width * 0.65;
  const nearZ = 1;
  const totalDepth = ringCount * ringSpacing;
  const forwardDist = ((time * fwdSpeed) % 1) * totalDepth;

    const hueShift = colorShift * 120;
    const colors = [
      hsl(interpolate(hueShift, [0, 360], [195, 15]), 90, 70),
      hsl(interpolate(hueShift, [0, 360], [235, 330]), 90, 70),
      hsl(interpolate(hueShift, [0, 360], [305, 15]), 90, 70),
      hsl(interpolate(hueShift, [0, 360], [15, 200]), 90, 70),
    ];

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.globalAlpha = intensity * 0.8;

  for (let ring = 0; ring < ringCount; ring++) {
    let z = ring * ringSpacing + nearZ - forwardDist;
    if (z < nearZ) z += totalDepth;

    const scale = FOV / (FOV + z);
    const ringRadius = maxRadius * scale;
    const alpha = 0.15 + (z / (totalDepth + nearZ)) * 0.85;
    const hue = colors[ring % colors.length];

      ctx.strokeStyle = hue;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 30;
      ctx.shadowColor = hue;

    const rotation = ((time * rotSpeed) % 1) * Math.PI * 2 + (ring * Math.PI * 0.25);
    const vertices = Math.floor(VERTICES * density) + 4;

    for (let v = 0; v < vertices; v++) {
      const a1 = (v / vertices) * Math.PI * 2 + rotation;
      const a2 = ((v + 1) / vertices) * Math.PI * 2 + rotation;

      const x1 = cx + Math.cos(a1) * ringRadius;
      const y1 = cy + Math.sin(a1) * ringRadius;
      const x2 = cx + Math.cos(a2) * ringRadius;
      const y2 = cy + Math.sin(a2) * ringRadius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    if (ring < ringCount - 1) {
      let nz = (ring + 1) * ringSpacing + nearZ - forwardDist;
      if (nz < nearZ) nz += totalDepth;

      const nScale = FOV / (FOV + nz);
      const nRadius = maxRadius * nScale;
      const nAlpha = 0.15 + (nz / (totalDepth + nearZ)) * 0.85;
      const nHue = colors[(ring + 1) % colors.length];

      ctx.strokeStyle = nHue;
      ctx.globalAlpha = nAlpha;
      ctx.shadowBlur = 20;
      ctx.shadowColor = nHue;

      for (let v = 0; v < vertices; v++) {
        const a1 = (v / vertices) * Math.PI * 2 + rotation;
        const a2 = (v / vertices) * Math.PI * 2 + ((time * rotSpeed) % 1) * Math.PI * 2 + ((ring + 1) * Math.PI * 0.25);

        const x1 = cx + Math.cos(a1) * ringRadius;
        const y1 = cy + Math.sin(a1) * ringRadius;
        const x2 = cx + Math.cos(a2) * nRadius;
        const y2 = cy + Math.sin(a2) * nRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

function drawGlowingCore(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  intensity: number,
  color: string
) {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const pulse = 0.8 + Math.sin(time * Math.PI * 2) * 0.2;
  const size = 20 + intensity * 30;

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 4);
  gradient.addColorStop(0, "#FFFFFF");
  gradient.addColorStop(0.15, "#FFFFFF");
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(0.6, "transparent");

  ctx.globalAlpha = intensity * pulse;
  ctx.shadowBlur = 30;
  ctx.shadowColor = color;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.95;
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
}

function drawLensFlare(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  const lightX = width * 0.5;
  const lightY = height * 0.42;
  const pulse = 0.6 + Math.sin(time * Math.PI * 2 * 2.5) * 0.4;

  ctx.save();
  ctx.globalAlpha = 0.25 * pulse;

  const flareCount = 6;
  for (let i = 0; i < flareCount; i++) {
    const ratio = i / flareCount;
    const fx = lightX + (width * 0.5 - lightX) * ratio;
    const fy = lightY + (height * 0.5 - lightY) * ratio;
    const size = 6 + i * 18;

    const gradient = ctx.createRadialGradient(fx, fy, 0, fx, fy, size);
    gradient.addColorStop(0, "#00F0FF");
    gradient.addColorStop(0.3, "#8A2BE2");
    gradient.addColorStop(0.5, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(fx, fy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.2 * pulse;
  ctx.strokeStyle = "#00F0FF";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lightX - 180, lightY);
  ctx.lineTo(lightX + 180, lightY);
  ctx.moveTo(lightX, lightY - 180);
  ctx.lineTo(lightX, lightY + 180);
  ctx.stroke();

  ctx.restore();
}

function drawVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const gradient = ctx.createRadialGradient(
    width * 0.5, height * 0.5, 0,
    width * 0.5, height * 0.5, width * 0.6
  );
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

