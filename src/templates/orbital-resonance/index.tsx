import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { OrbitalResonanceProps } from "./types";

const TOTAL_FRAMES = 900;
const TWO_PI = Math.PI * 2;

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const rgb = (r: number, g: number, b: number, a = 1): string => {
  return `rgba(${r},${g},${b},${a})`;
};

type Body = {
  freq: number;
  phase: number;
  a: number;
  color: [number, number, number];
};

export const OrbitalResonance: React.FC<OrbitalResonanceProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  bodyCount = 6,
  resonance = 2,
  trailLength = 24,
  orbitTilt = 0.6,
  glowIntensity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * TWO_PI;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [tr, tg, tb] = hexToRgb(tertiaryColor);

  const cx = width / 2;
  const cy = height / 2;
  const baseR = Math.min(width, height) * 0.4;
  const resMul = Math.max(1, Math.round(resonance));

  const bodies = useMemo(() => {
    const cols: [number, number, number][] = [
      [pr, pg, pb],
      [sr, sg, sb],
      [tr, tg, tb],
    ];
    const out: Body[] = [];
    for (let i = 0; i < bodyCount; i++) {
      out.push({
        freq: (i + 1) * resMul,
        phase: i * 1.7 + 0.6,
        a: baseR * (0.28 + 0.11 * i),
        color: cols[i % cols.length],
      });
    }
    return out;
  }, [bodyCount, resMul, pr, pg, pb, sr, sg, sb, tr, tg, tb, baseR]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.6);
    cg.addColorStop(0, rgb(tr, tg, tb, 0.15));
    cg.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 80 * glowIntensity;
    ctx.fillStyle = cg;
    ctx.fillRect(cx - baseR * 0.6, cy - baseR * 0.6, baseR * 1.2, baseR * 1.2);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.lineCap = "round";

    for (const body of bodies) {
      const b = body.a * orbitTilt;
      ctx.globalAlpha = 0.45;
      ctx.shadowBlur = 12 * glowIntensity;
      ctx.strokeStyle = tertiaryColor;
      ctx.lineWidth = 1.1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, body.a, b, 0, 0, TWO_PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (let k = 1; k <= trailLength; k++) {
      const frac = k / trailLength;
      for (const body of bodies) {
        const b = body.a * orbitTilt;
        const ang = body.freq * t + body.phase - (k * TWO_PI) / body.freq;
        const x = cx + body.a * Math.cos(ang);
        const y = cy + b * Math.sin(ang);
        ctx.globalAlpha = (0.42 - frac * 0.4) * (1 - frac * 0.3);
        ctx.shadowBlur = 6 * glowIntensity;
        ctx.shadowColor = rgb(body.color[0], body.color[1], body.color[2]);
        ctx.fillStyle = rgb(body.color[0], body.color[1], body.color[2], 0.6);
        const sz = 1.8 * (1 - frac * 0.5);
        ctx.beginPath();
        ctx.arc(x, y, sz, 0, TWO_PI);
        ctx.fill();
      }
    }

    for (const body of bodies) {
      const b = body.a * orbitTilt;
      const ang = body.freq * t + body.phase;
      const x = cx + body.a * Math.cos(ang);
      const y = cy + b * Math.sin(ang);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 26 * glowIntensity;
      ctx.shadowColor = rgb(body.color[0], body.color[1], body.color[2]);
      ctx.fillStyle = rgb(body.color[0], body.color[1], body.color[2]);
      ctx.beginPath();
      ctx.arc(x, y, 4.2, 0, TWO_PI);
      ctx.fill();
    }

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const ai = bodies[i].freq * t + bodies[i].phase;
        const aj = bodies[j].freq * t + bodies[j].phase;
        const diff = Math.abs(Math.sin((ai - aj) / 2));
        if (diff < 0.12 + 0.4 / resMul) {
          const xi = cx + bodies[i].a * Math.cos(ai);
          const yi = cy + bodies[i].a * orbitTilt * Math.sin(ai);
          const xj = cx + bodies[j].a * Math.cos(aj);
          const yj = cy + bodies[j].a * orbitTilt * Math.sin(aj);
          const width = 1.2 + (0.12 - diff) * 18;
          ctx.globalAlpha = 0.78;
          ctx.shadowBlur = 22 * glowIntensity;
          ctx.strokeStyle = tertiaryColor;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.moveTo(xi, yi);
          ctx.lineTo(xj, yj);
          ctx.stroke();
        }
      }
    }

    drawNoiseOverlay(ctx, width, height, t, 0.06);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
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
