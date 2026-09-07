// Urban Flow background animation
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { createSeamlessLoop, smoothTransition } from "../loop-engine";
import type { LoopConfig } from "../loop-engine";

interface UrbanFlowProps {
  flowVelocity: number;
  gridDensity: number;
  neonIntensity: number;
}

const PATHWAY_COUNT = 10;
const NODE_COUNT = 30;

export const UrbanFlow: React.FC<UrbanFlowProps & LoopConfig> = ({
  flowVelocity = 1.0,
  gridDensity = 1.0,
  neonIntensity = 1.0,
  durationInFrames,
  fps,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopData = useMemo(() => createSeamlessLoop(durationInFrames, 6), [durationInFrames]);

  const time = (frame % durationInFrames) / durationInFrames;
  const loop = loopData(frame);

  const pathways = useMemo(() => {
    return Array.from({ length: PATHWAY_COUNT }, (_, pathIndex) => {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const nodes: { x: number; y: number; alpha: number }[] = [];
      
      for (let i = 0; i < NODE_COUNT; i++) {
        const noiseX = Math.sin(time * flowVelocity + i * 0.2 + pathIndex * 0.5);
        const noiseY = Math.cos(time * flowVelocity * 0.8 + i * 0.3 + pathIndex * 0.7);
        const offsetX = noiseX * width * 0.03 * gridDensity;
        const offsetY = noiseY * height * 0.03 * gridDensity;
        
        const baseAlpha = Math.sin(i * 0.5 + time * flowVelocity) * 0.5 + 0.5;
        const alpha = Math.max(0, Math.min(1, baseAlpha * neonIntensity * loop.normalizedFrame * 0.8));
        
        nodes.push({
          x: startX + offsetX,
          y: startY + offsetY,
          alpha,
        });
      }
      
      return nodes;
    });
  }, [width, height, flowVelocity, gridDensity, time, loop.normalizedFrame]);

  const connections = useMemo(() => {
    const conns: { from: number; to: number; alpha: number }[] = [];
    for (let pathIndex = 0; pathIndex < PATHWAY_COUNT; pathIndex++) {
      const nodes = pathways[pathIndex];
      for (let i = 0; i < NODE_COUNT - 1; i++) {
        if (nodes[i].alpha > 0.3 && nodes[i + 1].alpha > 0.3) {
          const alpha = Math.min(nodes[i].alpha, nodes[i + 1].alpha) * neonIntensity * loop.normalizedFrame * 0.4;
          if (alpha > 0.1) {
            conns.push({ from: i, to: j, alpha });
          }
        }
      }
    }
    return conns.slice(0, 25);
  }, [pathways, neonIntensity, loop.normalizedFrame]);

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
