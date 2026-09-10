import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { HexagonFlowProps } from "./types";

const TOTAL_FRAMES = 900;
const TWO_PI = Math.PI * 2;
const SQRT3 = Math.sqrt(3);

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const rgb = (r: number, g: number, b: number, a = 1): string => {
  return `rgba(${r},${g},${b},${a})`;
};

export const HexagonFlow: React.FC<HexagonFlowProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  hexSize = 72,
  waveSpeed = 0.6,
  colorShift = 0.4,
  flowIntensity = 0.8,
  glowIntensity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);

  const wf = Math.max(1, Math.round(waveSpeed));
  const hexW = hexSize * 1.5;
  const hexH = hexSize * SQRT3;
  const cols = Math.ceil(width / hexW) + 1;
  const rows = Math.ceil(height / hexH) + 2;

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) * 0.6);
    cg.addColorStop(0, rgb(pr, pg, pb, 0.08));
    cg.addColorStop(0.7, rgb(sr, sg, sb, 0.05));
    cg.addColorStop(1, "transparent");
    ctx.globalAlpha = 1;
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let r = 0; r < rows; r++) {
      const odd = r % 2 === 1;
      const yOff = r * hexH + hexH / 2;
      if (yOff < -hexSize || yOff > height + hexSize) continue;
      for (let c = 0; c < cols; c++) {
        const hx = c * hexW + (odd ? hexW / 2 : 0);
        if (hx < -hexSize || hx > width + hexSize) continue;
        const phase = (c + r) * 0.38;
        const rot = Math.sin(t * wf + phase) * 0.45 * flowIntensity;
        const scale = 1 + Math.sin(t * wf * 0.7 - phase) * 0.12 * flowIntensity;
        const lc = Math.sin(t * 0.6 - phase + colorShift) * 0.5 + 0.5;
        const rr2 = Math.round(pr * lc + sr * (1 - lc));
        const gg2 = Math.round(pg * lc + sg * (1 - lc));
        const bb2 = Math.round(pb * lc + sb * (1 - lc));

        ctx.save();
        ctx.translate(hx, yOff);
        ctx.rotate(rot);
        ctx.scale(scale, scale);
        ctx.globalAlpha = 0.92;
        ctx.shadowBlur = 14 * glowIntensity;
        ctx.fillStyle = rgb(rr2, gg2, bb2);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (TWO_PI * i) / 6 + TWO_PI / 6;
          const vx = Math.cos(ang) * hexSize * 0.88;
          const vy = Math.sin(ang) * hexSize * 0.88;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 0.55;
        ctx.shadowBlur = 8 * glowIntensity;
        ctx.strokeStyle = tertiaryColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }

    drawNoiseOverlay(ctx, width, height, t, 0.06);

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
