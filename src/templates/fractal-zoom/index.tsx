import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef, useEffect } from "react";
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
  maxIterations = 80,
  intensity = 0.8,
  fractalType = "mandelbrot",
  backgroundColor = "#000000",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const getColor = colorSchemes[colorScheme] || colorSchemes.fire;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const zoom = Math.exp(time * 4 * zoomSpeed) * 0.5;
    const offsetX = Math.sin(time * 0.5) * 0.5;
    const offsetY = Math.cos(time * 0.3) * 0.5;

    const centerX = -0.745428 + offsetX;
    const centerY = 0.113009 + offsetY;

    const maxDist = Math.max(width, height);

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const px = (x / zoom) / maxDist - 0.5 + offsetX;
        const py = (y / zoom) / maxDist - 0.5 + offsetY;

        const zx = fractalType === "julia" ? px : 0;
        const zy = fractalType === "julia" ? py : 0;

        let cx: number;
        let cy: number;

        if (fractalType === "julia") {
          cx = -0.7 + Math.sin(time * 0.1) * 0.1;
          cy = 0.27015 + Math.cos(time * 0.15) * 0.1;
        } else {
          cx = px + centerX;
          cy = py + centerY;
        }

        let iteration = 0;
        let xTemp = zx;
        let yTemp = zy;

        while (xTemp * xTemp + yTemp * yTemp <= 4 && iteration < maxIterations) {
          const xNew = xTemp * xTemp - yTemp * yTemp + cx;
          yTemp = 2 * xTemp * yTemp + cy;
          xTemp = xNew;
          iteration++;
        }

        const t = iteration / maxIterations;
        const [r, g, b] = getColor(t * intensity);
        const idx = (y * width + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;

        if (x + 1 < width) {
          const idx2 = (y * width + x + 1) * 4;
          data[idx2] = r;
          data[idx2 + 1] = g;
          data[idx2 + 2] = b;
          data[idx2 + 3] = 255;
        }
        if (y + 1 < height) {
          const idx3 = ((y + 1) * width + x) * 4;
          data[idx3] = r;
          data[idx3 + 1] = g;
          data[idx3 + 2] = b;
          data[idx3 + 3] = 255;

          if (x + 1 < width) {
            const idx4 = ((y + 1) * width + x + 1) * 4;
            data[idx4] = r;
            data[idx4 + 1] = g;
            data[idx4 + 2] = b;
            data[idx4 + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  });

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
