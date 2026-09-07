import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef } from "react";
import type { FractalZoomProps } from "./types";

const TOTAL_FRAMES = 900;

const colorSchemes: Record<string, (t: number) => [number, number, number]> = {
  fire: (t: number) => {
    const r = Math.min(1, t * 2);
    const g = Math.min(1, t * 4);
    const b = Math.max(0, t * 2 - 0.5);
    return [r * 255, g * 255, b * 255];
  },
  ice: (t: number) => {
    const r = Math.max(0, t * 0.8 - 0.3);
    const g = t * 0.9;
    const b = Math.min(1, t * 2);
    return [r * 255, g * 255, b * 255];
  },
  electric: (t: number) => {
    const r = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
    const g = Math.sin(t * Math.PI * 3) * 0.5 + 0.5;
    const b = Math.sin(t * Math.PI * 5) * 0.5 + 0.5;
    return [r * 255, g * 255, b * 255];
  },
  neon: (t: number) => {
    const r = Math.max(0.2, Math.sin(t * Math.PI) * 0.8);
    const g = Math.max(0.3, Math.cos(t * Math.PI * 0.5) * 0.7);
    const b = Math.max(0.5, Math.cos(t * Math.PI * 2) * 0.5);
    return [r * 255, g * 255, b * 255];
  },
  deep: (t: number) => {
    const r = t * 0.3;
    const g = t * 0.2;
    const b = Math.min(1, t * 1.5);
    return [r * 255, g * 255, b * 255];
  },
};

export const FractalZoom: React.FC<FractalZoomProps> = ({
  colorScheme = "fire",
  zoomSpeed = 1.0,
  maxIterations = 100,
  intensity = 0.8,
  fractalType = "mandelbrot",
  backgroundColor = "#000000",
  glowIntensity = 0.5,
  orbitTrap = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const getColor = colorSchemes[colorScheme] || colorSchemes.fire;

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const zoom = Math.exp(time * 3 * zoomSpeed) * 0.8;
    const offsetX = Math.sin(time * 0.5) * 0.3;
    const offsetY = Math.cos(time * 0.3) * 0.3;

    const centerX = -0.745428 + offsetX;
    const centerY = 0.113009 + offsetY;

    const maxDist = Math.max(width, height);
    const step = 1;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        let px: number;
        let py: number;

        if (fractalType === "julia") {
          px = (x / zoom) / maxDist - 0.5;
          py = (y / zoom) / maxDist - 0.5;
        } else {
          px = (x / maxDist - 0.5) / zoom;
          py = (y / maxDist - 0.5) / zoom;
        }

        let zx: number;
        let zy: number;

        if (fractalType === "julia") {
          zx = px;
          zy = py;
        } else {
          zx = 0;
          zy = 0;
        }

        let iteration = 0;
        let xTemp = zx;
        let yTemp = zy;
        let orbitDist = Infinity;
        let orbitAngle = 0;

        while (xTemp * xTemp + yTemp * yTemp <= 4 && iteration < maxIterations) {
          const xNew = xTemp * xTemp - yTemp * yTemp;
          if (fractalType === "julia") {
            yTemp = 2 * xTemp * yTemp + (0.27015 + Math.cos(time * 0.15) * 0.1);
            xTemp = xNew + (-0.7 + Math.sin(time * 0.1) * 0.1);
          } else {
            yTemp = 2 * xTemp * yTemp + (py + centerY);
            xTemp = xNew + (px + centerX);
          }

          if (orbitTrap) {
            const dist = Math.min(Math.abs(xTemp), Math.abs(yTemp));
            if (dist < orbitDist) {
              orbitDist = dist;
              orbitAngle = Math.atan2(yTemp, xTemp);
            }
          }

          iteration++;
        }

        const iterT = 0.15 + 1.85 * (iteration / maxIterations);
        const smoothT = iteration - Math.log2(Math.log2(xTemp * xTemp + yTemp * yTemp));
        const t = (smoothT + 0.5 * iterT) / maxIterations;

        let [r, g, b] = [0, 0, 0];
        if (iteration < maxIterations) {
          if (orbitTrap) {
            const hue = (orbitAngle / (Math.PI * 2) + 0.5) * 360;
            const sat = 80 + orbitDist * 40;
            const light = 50 + orbitDist * 30;
            r = Math.min(255, sat * Math.cos(hue * Math.PI / 180) * 0.5 + 128);
            g = Math.min(255, sat * Math.sin(hue * Math.PI / 180) * 0.5 + 128);
            b = Math.min(255, light);
          } else {
            [r, g, b] = getColor(t * intensity);
          }
        }
        const idx = (y * width + x) * 4;

        if (idx < data.length - 3) {
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    if (glowIntensity > 0) {
      ctx.globalAlpha = glowIntensity * 0.3;
      ctx.filter = "blur(3px)";
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = 40;
      ctx.shadowColor = "#00F0FF";
      ctx.drawImage(canvasRef.current!, 1, 1, width - 2, height - 2);
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
    }
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
