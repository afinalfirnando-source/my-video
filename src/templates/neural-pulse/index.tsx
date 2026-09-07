// Neural Pulse background animation
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { createSeamlessLoop, smoothTransition } from "../loop-engine";
import type { LoopConfig } from "../loop-engine";

interface NeuralPulseProps {
  pulseIntensity: number;
  nodeDensity: number;
  connectionStrength: number;
}

const NODE_COUNT = 20;

export const NeuralPulse: React.FC<NeuralPulseProps & LoopConfig> = ({
  pulseIntensity = 1.0,
  nodeDensity = 1.0,
  connectionStrength = 0.5,
  durationInFrames,
  fps,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopData = useMemo(() => createSeamlessLoop(durationInFrames, 3), [durationInFrames]);

  const time = (frame % durationInFrames) / durationInFrames;
  const loop = loopData(frame);

  const nodes = useMemo(() => {
    return Array.from({ length: NODE_COUNT }, (_, i) => {
      const angle = (i * Math.PI * 2) / NODE_COUNT;
      const baseRadius = Math.min(width, height) * 0.2;
      const radius = baseRadius + Math.sin(time * 0.5 + i * 0.3) * baseRadius * pulseIntensity * 0.5;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      const pulse = Math.sin(time * 3 + i * 0.7) * 0.5 + 1;
      const size = 2 + pulse * 8 * pulseIntensity * nodeDensity;
      const alpha = Math.max(0, Math.min(1, pulse * connectionStrength * loop.normalizedFrame));
      
      return { x, y, size, alpha, pulse };
    });
  }, [width, height, pulseIntensity, nodeDensity, connectionStrength, time, loop.normalizedFrame]);

  const connections = useMemo(() => {
    const conns: { from: number; to: number; alpha: number }[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.min(width, height) * 0.3;
        
        if (dist < maxDist) {
          const connectionAlpha = Math.max(0, (1 - dist / maxDist)) * connectionStrength * loop.normalizedFrame * 0.5;
          if (connectionAlpha > 0.1) {
            conns.push({ from: i, to: j, alpha: connectionAlpha });
          }
        }
      }
    }
    return conns.slice(0, 15);
  }, [nodes, width, height, connectionStrength, loop.normalizedFrame]);

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
