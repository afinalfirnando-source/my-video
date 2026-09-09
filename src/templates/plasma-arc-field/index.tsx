import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { PlasmaArcFieldProps } from "./types";

const TOTAL_FRAMES = 900;
const TWO_PI = Math.PI * 2;

type Node3 = { x: number; y: number; z: number };
type Arc = {
  a: number;
  b: number;
  segs: number;
  noise: number[];
  phase: number;
};
type Spark = { edge: number; offset: number; speed: number; hue: number };

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

export const PlasmaArcField: React.FC<PlasmaArcFieldProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#02000A",
  nodeCount = 70,
  arcComplexity = 4,
  sparkDensity = 180,
  pulseSpeed = 0.6,
  glowIntensity = 0.95,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * TWO_PI;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [tr, tg, tb] = hexToRgb(tertiaryColor);

  const { nodes, arcs, sparks } = useMemo(() => {
    const rings = [
      { r: 0.35, z: -0.35 },
      { r: 0.6, z: 0 },
      { r: 0.85, z: 0.4 },
    ];
    const nodes: Node3[] = [];
    const per = Math.floor(nodeCount / 3);
    for (let ri = 0; ri < rings.length; ri++) {
      const ring = rings[ri];
      for (let i = 0; i < per; i++) {
        const ang = seeded(ri * 73 + i * 17 + 1) * TWO_PI;
        const jitter = seeded(ri * 73 + i * 17 + 2) * 0.08;
        const rr = ring.r + jitter;
        const x = rr * Math.cos(ang);
        const y = rr * Math.sin(ang);
        const z = ring.z + seeded(ri * 73 + i * 17 + 3) * 0.12;
        nodes.push({ x, y, z });
      }
    }

    const dist2 = (i: number, j: number) => {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      return dx * dx + dy * dy + dz * dz;
    };

    const arcs: Arc[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        dists.push({ j, d: dist2(i, j) });
      }
      dists.sort((a, b) => a.d - b.d);
      const k = Math.min(3, dists.length);
      for (let m = 0; m < k; m++) {
        if (dists[m].d > 1.1) continue;
        const j = dists[m].j;
        if (arcs.some((e) => (e.a === i && e.b === j) || (e.a === j && e.b === i))) continue;
        const segs = 6 + Math.round(arcComplexity);
        const noise: number[] = [];
        for (let s = 0; s < segs - 1; s++) {
          noise.push(seeded(i * 97 + j * 13 + s) * 2 - 1);
        }
        arcs.push({
          a: i,
          b: j,
          segs,
          noise,
          phase: seeded(i * 53 + j * 29 + 7) * TWO_PI,
        });
      }
    }

    const sparkCount = Math.min(sparkDensity, arcs.length * 2);
    const sparks: Spark[] = [];
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        edge: Math.floor(seeded(i * 41 + 1) * arcs.length),
        offset: seeded(i * 41 + 2),
        speed: seeded(i * 41 + 3) * 0.2 + 0.8,
        hue: seeded(i * 41 + 4) * 40 + 190,
      });
    }

    return { nodes, arcs, sparks };
  }, [nodeCount, arcComplexity, sparkDensity]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.38;
    const eye = 720;

    const ay = t;
    const ax = 0.4 + Math.sin(t * 0.7) * 0.12;

    const project = (p: Node3): { x: number; y: number; depth: number } => {
      const cosAy = Math.cos(ay);
      const sinAy = Math.sin(ay);
      const x1 = p.x * cosAy + p.z * sinAy;
      const z1 = p.z * cosAy - p.x * sinAy;
      const cosAx = Math.cos(ax);
      const sinAx = Math.sin(ax);
      const y1 = p.y * cosAx - z1 * sinAx;
      const z2 = z1 * cosAx + p.y * sinAx;
      const scale = eye / (eye + z2 * 360);
      return {
        x: cx + x1 * radius * scale,
        y: cy - y1 * radius * scale,
        depth: z2,
      };
    };

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6);
    bgGrad.addColorStop(0, rgb(pr, pg, pb, 0.1));
    bgGrad.addColorStop(0.6, rgb(sr, sg, sb, 0.06));
    bgGrad.addColorStop(1, "transparent");
    ctx.globalAlpha = 1;
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = rgb(tr, tg, tb, 0.25);
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const rr = (i / 7) * radius * (0.7 + Math.sin(t * 0.5) * 0.05);
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, TWO_PI);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const crackleEnv = Math.sin(t * 1.15) * 0.5 + 0.5;

    for (const arc of arcs) {
      const pa = project(nodes[arc.a]);
      const pb = project(nodes[arc.b]);
      if (pa.depth < -0.55 || pb.depth < -0.55) continue;

      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const len = Math.hypot(dx, dy);
      const nx = -dy / len;
      const ny = dx / len;
      const nearness = Math.max(pa.depth, pb.depth);
      const hue = (nearness * 25 + t * 20) % 360;

      ctx.globalAlpha = Math.max(0, 0.5 + 0.5 * nearness);
      ctx.shadowBlur = 16 * glowIntensity;
      ctx.shadowColor = `hsl(${hue}, 90%, 62%)`;
      ctx.strokeStyle = `hsl(${hue}, 85%, 58%)`;
      ctx.lineWidth = 1.5 * (0.7 + 0.6 * nearness);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      for (let s = 1; s < arc.segs; s++) {
        const f = s / arc.segs;
        const mx = pa.x + dx * f + nx * (arc.noise[s - 1] * len * 0.06 * arcComplexity * crackleEnv);
        const my = pa.y + dy * f + ny * (arc.noise[s - 1] * len * 0.06 * arcComplexity * crackleEnv);
        ctx.lineTo(mx, my);
      }
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    for (const sp of sparks) {
      const arc = arcs[sp.edge];
      if (!arc) continue;
      const pa = project(nodes[arc.a]);
      const pb = project(nodes[arc.b]);
      if (pa.depth < -0.55 || pb.depth < -0.55) continue;
      const prog = (sp.offset + time * sp.speed * pulseSpeed) % 1;
      const baseX = pa.x + (pb.x - pa.x) * prog;
      const baseY = pa.y + (pb.y - pa.y) * prog;
      const sparkH = (sp.hue + time * 40) % 360;
      ctx.globalAlpha = 0.9;
      ctx.shadowBlur = 18 * glowIntensity;
      ctx.shadowColor = `hsl(${sparkH}, 95%, 60%)`;
      ctx.fillStyle = `hsl(${sparkH}, 95%, 62%)`;
      ctx.beginPath();
      ctx.arc(baseX, baseY, 2.0 + Math.sin(t * 2 + sp.offset) * 0.7, 0, TWO_PI);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    for (const node of nodes) {
      const p = project(node);
      if (p.depth < -0.55) continue;
      const alpha = 0.5 + 0.5 * p.depth;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 18 * glowIntensity;
      ctx.shadowColor = `hsl(${(t * 25) % 360}, 90%, 60%)`;
      ctx.fillStyle = rgb(
        Math.round(pr * 0.6 + sr * 0.4),
        Math.round(pg * 0.6 + sg * 0.4),
        Math.round(pb * 0.6 + sb * 0.4),
      );
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.6 + p.depth * 1.6, 0, TWO_PI);
      ctx.fill();
    }

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
