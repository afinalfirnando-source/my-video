import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { PrismaticShatterProps } from "./types";

const TOTAL_FRAMES = 900;

type Shard = {
  angle: number;
  hue: number;
  spin: number;
  size: number;
  ring: number;
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

export const PrismaticShatter: React.FC<PrismaticShatterProps> = ({
  primaryColor = "#FF00FF",
  secondaryColor = "#00F0FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  shardCount = 160,
  spinSpeed = 0.4,
  dispersion = 0.8,
  glowIntensity = 0.85,
  fractureDensity = 3,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [tr, tg, tb] = hexToRgb(tertiaryColor);

  const shards = useMemo(() => {
    const out: Shard[] = [];
    for (let i = 0; i < shardCount; i++) {
      out.push({
        angle: seeded(i * 17 + 1) * Math.PI * 2,
        hue: seeded(i * 17 + 2) * 360,
        spin: seeded(i * 17 + 3) * 2 + 0.5,
        size: seeded(i * 17 + 4) * 22 + 8,
        ring: seeded(i * 17 + 5) * 3,
      });
    }
    return out;
  }, [shardCount]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.42;

    const burst = Math.pow(Math.sin(t * 1.1) * 0.5 + 0.5, fractureDensity / 1.5);
    const shatter = burst * dispersion;
    const spinT = t * spinSpeed;

    ctx.shadowBlur = 0;

    const drawShard = (
      x: number,
      y: number,
      rot: number,
      size: number,
      col: string,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.866, size * 0.5);
      ctx.lineTo(-size * 0.866, size * 0.5);
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.fill();
      ctx.restore();
    };

    for (const shard of shards) {
      const a = shard.angle + spinT;
      const pop = 1 + shatter * 0.6;
      const r = maxR * (0.5 + (shard.ring % 1) * 0.4) * pop;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const rot = t * shard.spin + shard.hue * 0.017;

      const localBurst = Math.sin(t * 1.1 + shard.hue * 0.05) * 0.5 + 0.5;

      ctx.shadowBlur = 20 * glowIntensity * (0.6 + localBurst * 0.4);
      ctx.shadowColor = `hsl(${((shard.hue + t * 40) % 360)}, 90%, 65%)`;

      const rr = Math.round(pr * 0.55 + sr * 0.45);
      const gg = Math.round(pg * 0.55 + sg * 0.45);
      const bb = Math.round(pb * 0.55 + sb * 0.45);
      const col = rgb(rr, gg, bb, 0.92);

      drawShard(x, y, rot, shard.size * (0.85 + localBurst * 0.25), col);

      const disp = 1.6 * dispersion * localBurst;
      drawShard(x + disp, y, rot, shard.size * (0.4 + localBurst * 0.5), rgb(pr, pg, pb, 0.55));
      drawShard(x, y + disp, rot, shard.size * (0.4 + localBurst * 0.5), rgb(tr, tg, tb, 0.45));
      drawShard(x - disp, y, rot, shard.size * (0.4 + localBurst * 0.5), rgb(sr, sg, sb, 0.5));
    }

    const ringR = maxR * 0.2;
    const ringPulse = 0.8 + Math.sin(t * 2.2) * 0.2;
    ctx.globalAlpha = 0.85;
    ctx.shadowBlur = 70 * glowIntensity;
    ctx.shadowColor = `hsl(${(t * 50) % 360}, 95%, 60%)`;
    ctx.strokeStyle = `hsl(${(t * 50 + 180) % 360}, 90%, 55%)`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR * ringPulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.5;
    ctx.shadowBlur = 60 * glowIntensity;
    ctx.fillStyle = rgb(tr, tg, tb, 0.5);
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * 0.06 + Math.sin(t * 2.2) * 2, 0, Math.PI * 2);
    ctx.fill();

    drawNoiseOverlay(ctx, width, height, t, 0.07);

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
