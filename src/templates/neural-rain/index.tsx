import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { NeuralRainProps } from "./types";

const TOTAL_FRAMES = 900;
const GLYPHS =
  "ｱｶｻﾀﾅﾊﾏﾔﾗﾜｶﾞｻﾞﾀﾞﾅﾞﾊﾞﾏﾞﾔﾞﾗﾞﾜﾞ0123456789ABCDEF";

type Column = {
  x: number;
  seed: number;
  xShift: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const rgb = (r: number, g: number, b: number, a = 1): string => {
  return `rgba(${r},${g},${b},${a})`;
};

export const NeuralRain: React.FC<NeuralRainProps> = ({
  primaryColor = "#00FF80",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#00F0FF",
  backgroundColor = "#050014",
  columnCount = 80,
  maxDepth = 5,
  fallSpeed = 0.85,
  glyphCount = 92,
  glowIntensity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [tr, tg, tb] = hexToRgb(tertiaryColor);

  const cols = useMemo(() => {
    return Array.from({ length: columnCount }, (_, i): Column => {
      return {
        x: ((i + 0.5) / columnCount) * width,
        seed: seeded(i * 53 + 1),
        xShift: seeded(i * 53 + 2) * 5 - 2.5,
      };
    });
  }, [width, columnCount]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const groundY = height * 0.84;
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = rgb(pr, pg, pb, 0.18);
    ctx.lineWidth = 1;
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * width;
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + (t * 0.05), height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const fontSize = Math.max(10, Math.round(height * 0.021));
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const trailLen = 3;
    const headIndex = Math.floor(time * (glyphCount * 6)) % glyphCount;

    for (let L = 0; L < maxDepth; L++) {
      const layer = maxDepth - 1 - L;
      const sizeFactor = 0.55 + (layer / maxDepth) * 0.45;
      const alphaBase = 0.55 + (layer / maxDepth) * 0.45;
      const speed = (1 - (L * 0.18)) * fallSpeed;

      for (let c = 0; c < cols.length; c++) {
        const col = cols[c];
        const x = col.x + col.xShift * L;
        const step = fontSize * 1.05;
        const baseY = seeded(c * 53 + 3) * height;
        const yHead = (baseY + time * height * speed * 1.15) % height;

        for (let k = 0; k < trailLen; k++) {
          const yi = ((yHead - k * step) % height + height) % height;
          const gi = (headIndex - k + glyphCount) % glyphCount;
          const g = GLYPHS[gi % GLYPHS.length];
          const a = alphaBase * (1 - k * 0.28);
          if (k === 0) {
            ctx.globalAlpha = a;
            ctx.shadowBlur = 8 * glowIntensity;
            ctx.shadowColor = rgb(pr, pg, pb);
            ctx.fillStyle = rgb(pr, pg, pb, 0.95);
          } else {
            ctx.globalAlpha = a * 0.6;
            ctx.shadowBlur = 0;
            ctx.fillStyle = rgb(
              Math.round(pr * 0.6 + sr * 0.4),
              Math.round(pg * 0.6 + sg * 0.4),
              Math.round(pb * 0.6 + sb * 0.4),
              0.8,
            );
          }
          ctx.save();
          ctx.translate(x, yi);
          ctx.scale(sizeFactor, sizeFactor);
          ctx.fillText(g, 0, 0);
          ctx.restore();
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.22;
    ctx.shadowBlur = 30 * glowIntensity;
    ctx.fillStyle = rgb(tr, tg, tb, 0.55);
    ctx.fillRect(0, groundY + height * 0.04, width, height * 0.06);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 0.35;
    ctx.shadowBlur = 20;
    ctx.shadowColor = secondaryColor;
    ctx.fillStyle = rgb(sr, sg, sb, 0.5);
    for (let c = 0; c < cols.length; c += 4) {
      const col = cols[c];
      const x = col.x + col.xShift;
      ctx.beginPath();
      ctx.arc(x, groundY + 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
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
