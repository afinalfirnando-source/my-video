import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import { drawNoiseOverlay } from "../ui/noise";
import type { CosmicWebGLProps } from "./types";

const TOTAL_FRAMES = 900;
const TWO_PI = Math.PI * 2;

type Node3 = { x: number; y: number; z: number };
type Edge = { a: number; b: number };
type Particle = { edge: number; offset: number; speed: number; hue: number };

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

export const CosmicWeb: React.FC<CosmicWebGLProps> = ({
  primaryColor = "#00F0FF",
  secondaryColor = "#FF00FF",
  tertiaryColor = "#FFD700",
  backgroundColor = "#0A0A1A",
  nodeCount = 80,
  edgeDensity = 2.2,
  flowSpeed = 0.5,
  rotationSpeed = 0.25,
  glowIntensity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * TWO_PI;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [tr, tg, tb] = hexToRgb(tertiaryColor);

  const { nodes, edges, particles } = useMemo(() => {
    const nodes: Node3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const u = seeded(i * 31 + 1);
      const v = seeded(i * 31 + 2);
      const theta = u * TWO_PI;
      const phi = Math.acos(2 * v - 1);
      const r = 1;
      nodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
      });
    }

    const threshold = 0.3 + 0.55 / edgeDensity;
    const edges: Edge[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        if (dx * dx + dy * dy + dz * dz < threshold * threshold) {
          edges.push({ a: i, b: j });
        }
      }
    }

    const particles: Particle[] = edges.map((e, ei) => ({
      edge: ei,
      offset: seeded(ei * 13 + 1),
      speed: seeded(ei * 13 + 2) * 0.25 + 0.85,
      hue: seeded(ei * 13 + 3) * 40 + 200,
    }));

    return { nodes, edges, particles };
  }, [nodeCount, edgeDensity]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;
    const eye = 820;

    const ay = t * 0.35 * rotationSpeed;
    const ax = t * 0.18 * rotationSpeed + 0.6;

    const project = (p: Node3): { x: number; y: number; depth: number } => {
      const cosAy = Math.cos(ay);
      const sinAy = Math.sin(ay);
      const x1 = p.x * cosAy + p.z * sinAy;
      const z1 = p.z * cosAy - p.x * sinAy;
      const cosAx = Math.cos(ax);
      const sinAx = Math.sin(ax);
      const y1 = p.y * cosAx - z1 * sinAx;
      const z2 = z1 * cosAx + p.y * sinAx;
      const scale = eye / (eye + z2 * 380);
      return {
        x: cx + x1 * radius * scale,
        y: cy - y1 * radius * scale,
        depth: z2,
      };
    };

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const nebGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.4);
    nebGrad.addColorStop(0, rgb(pr, pg, pb, 0.12));
    nebGrad.addColorStop(0.5, rgb(sr, sg, sb, 0.06));
    nebGrad.addColorStop(1, "transparent");
    ctx.globalAlpha = 1;
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.shadowBlur = 0;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const edgePulse = Math.sin(t * 0.7) * 0.5 + 0.5;

    for (const edge of edges) {
      const pa = project(nodes[edge.a]);
      const pbProj = project(nodes[edge.b]);
      if (pa.depth < -0.55 || pbProj.depth < -0.55) continue;
      const nearness = Math.max(pa.depth, pbProj.depth);
      const alpha = (0.18 + 0.28 * nearness * nearness) * (0.8 + 0.4 * edgePulse);
      const hue = (nearness * 30 + t * 15) % 360;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.shadowBlur = 18 * glowIntensity;
      ctx.strokeStyle = `hsl(${hue}, 90%, 62%)`;
      ctx.lineWidth = 1.2 * (0.7 + 0.6 * nearness);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pbProj.x, pbProj.y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    for (const p of particles) {
      const e = edges[p.edge];
      const na = project(nodes[e.a]);
      const nb = project(nodes[e.b]);
      if (na.depth < -0.55 || nb.depth < -0.55) continue;
      const prog = (p.offset + time * p.speed * flowSpeed) % 1;
      const x = na.x + (nb.x - na.x) * prog;
      const y = na.y + (nb.y - na.y) * prog;
      const hue = (p.hue + time * 30) % 360;
      ctx.globalAlpha = 0.85;
      ctx.shadowBlur = 16 * glowIntensity;
      ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
      ctx.fillStyle = `hsl(${hue}, 95%, 62%)`;
      ctx.beginPath();
      ctx.arc(x, y, 1.8 + Math.sin(t * 2 + p.offset) * 0.8, 0, TWO_PI);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    for (const node of nodes) {
      const p = project(node);
      if (p.depth < -0.55) continue;
      const alpha = 0.55 + 0.45 * p.depth;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 14 * glowIntensity;
      ctx.shadowColor = primaryColor;
      ctx.fillStyle = rgb(
        Math.round(pr * 0.5 + tr * 0.5),
        Math.round(pg * 0.5 + tg * 0.5),
        Math.round(pb * 0.5 + tb * 0.5),
      );
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2 + p.depth * 1.8, 0, TWO_PI);
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
