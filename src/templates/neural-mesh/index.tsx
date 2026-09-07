import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useMemo, useRef } from "react";
import type { NeuralMeshProps } from "./types";

const TOTAL_FRAMES = 900;

type NetworkNode = {
  x: number;
  y: number;
  z: number;
  layer: number;
  size: number;
  pulsePhase: number;
  pulseSpeed: number;
};

type DataPulse = {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  size: number;
  hue: number;
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const hsl = (h: number, s: number, l: number): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const NeuralMesh: React.FC<NeuralMeshProps> = ({
  nodeColor = "#00F0FF",
  connectionColor = "#8A2BE2",
  pulseColor = "#FF00FF",
  nodeCount = 80,
  layerCount = 5,
  pulseSpeed = 0.8,
  networkDensity = 0.7,
  glowIntensity = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const time = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const t = time * Math.PI * 2;

  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i): NetworkNode => ({
        x: seeded(i * 17 + 1) * width,
        y: seeded(i * 17 + 2) * height,
        z: seeded(i * 17 + 3),
        layer: Math.floor(seeded(i * 17 + 4) * layerCount),
        size: seeded(i * 17 + 5) * 8 + 3,
        pulsePhase: seeded(i * 17 + 6) * Math.PI * 2,
        pulseSpeed: seeded(i * 17 + 7) * 0.3 + 0.5,
      })),
    [width, height, nodeCount, layerCount]
  );

  const dataPulses = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i): DataPulse => ({
        fromIdx: Math.floor(seeded(i * 31 + 1) * nodeCount),
        toIdx: Math.floor(seeded(i * 31 + 2) * nodeCount),
        progress: seeded(i * 31 + 3),
        speed: seeded(i * 31 + 4) * 0.3 + 0.5,
        size: seeded(i * 31 + 5) * 4 + 2,
        hue: 280 + seeded(i * 31 + 6) * 80,
      })),
    [nodeCount]
  );

  const connections = useMemo(() => {
    const connList: { from: number; to: number; dist: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (seeded(i * 137 + j * 97) < networkDensity * 0.1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          connList.push({ from: i, to: j, dist: Math.sqrt(dx * dx + dy * dy) });
        }
      }
    }
    return connList;
  }, [nodes, networkDensity]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#000000";

    for (let layer = 0; layer < layerCount; layer++) {
      const layerTime = t * (0.2 + layer * 0.1);
      const layerSize = Math.min(width, height) * (0.3 + layer * 0.1);
      const layerX = width / 2 + Math.cos(layerTime) * layerSize * 0.2;
      const layerY = height / 2 + Math.sin(layerTime) * layerSize * 0.2;

      ctx.globalAlpha = 0.1 + layer * 0.05;
      ctx.strokeStyle = hsl(260 + layer * 20, 90, 40);
      ctx.lineWidth = 1000 - layer * 150;
      ctx.beginPath();
      ctx.arc(layerX, layerY, layerSize, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 20;
    ctx.shadowColor = nodeColor;

    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = connectionColor;
    ctx.lineWidth = 1;
    for (const conn of connections) {
      const distFactor = conn.dist / Math.max(width, height);
      ctx.globalAlpha = (1 - distFactor) * 0.3;
      ctx.beginPath();
      ctx.moveTo(nodes[conn.from].x, nodes[conn.from].y);
      ctx.lineTo(nodes[conn.to].x, nodes[conn.to].y);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 25;
    ctx.shadowColor = nodeColor;

    for (let i = 0; i < dataPulses.length; i++) {
      const dp = dataPulses[i];
      const pulseProgress = (time * dp.speed + dp.progress) % 1;
      const fromNode = nodes[dp.fromIdx];
      const toNode = nodes[dp.toIdx];

      if (!fromNode || !toNode) continue;

      const px = fromNode.x + (toNode.x - fromNode.x) * pulseProgress;
      const py = fromNode.y + (toNode.y - fromNode.y) * pulseProgress;

      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = hsl(dp.hue, 90, 50);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.globalAlpha = 0.8;
      ctx.shadowBlur = 20;
      ctx.shadowColor = hsl(dp.hue, 90, 50);
      ctx.fillStyle = hsl(dp.hue, 90, 50);
      ctx.beginPath();
      ctx.arc(px, py, dp.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(px, py, dp.size * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 30;
    ctx.shadowColor = nodeColor;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const nodePulse = 0.7 + Math.sin(t * n.pulseSpeed + n.pulsePhase) * 0.3;

      ctx.globalAlpha = nodePulse * 0.9;
      ctx.fillStyle = hsl(200 + n.layer * 20, 90, 60);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size * nodePulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = nodePulse * 0.4;
      ctx.fillStyle = hsl(280 + n.layer * 20, 90, 50);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size * 0.7 * nodePulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = nodePulse * 0.2;
      ctx.strokeStyle = hsl(300 + n.layer * 20, 90, 60);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size * 3 * nodePulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = pulseColor;
    for (let i = 0; i < 100; i++) {
      const sparkX = seeded(i * 41 + time * 100) * width;
      const sparkY = seeded(i * 43 + time * 80) * height;
      const sparkSize = seeded(i * 47) * 2 + 0.5;

      ctx.globalAlpha = seeded(i * 53) * 0.3;
      ctx.fillStyle = hsl((280 + seeded(i * 59) * 80), 90, 50);
      ctx.fillRect(sparkX, sparkY, sparkSize, sparkSize);
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
