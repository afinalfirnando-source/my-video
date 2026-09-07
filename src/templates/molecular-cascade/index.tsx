// Molecular Cascade background animation
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { createSeamlessLoop, smoothTransition } from "../loop-engine";
import type { LoopConfig } from "../loop-engine";

interface MolecularCascadeProps {
  moleculeSpeed: number;
  emissionRate: number;
  energyLevel: number;
}

const MOLECULE_COUNT = 25;
const BOND_DISTANCE = 40;

export const MolecularCascade: React.FC<MolecularCascadeProps & LoopConfig> = ({
  moleculeSpeed = 1.0,
  emissionRate = 1.0,
  energyLevel = 1.0,
  durationInFrames,
  fps,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopData = useMemo(() => createSeamlessLoop(durationInFrames, 5), [durationInFrames]);

  const time = (frame % durationInFrames) / durationInFrames;
  const loop = loopData(frame);

  const molecules = useMemo(() => {
    return Array.from({ length: MOLECULE_COUNT }, (_, i) => {
      const angle = (i * Math.PI * 2) / MOLECULE_COUNT;
      const baseRadius = Math.min(width, height) * 0.15;
      const radius = baseRadius * (1 + Math.sin(time * moleculeSpeed + i * 0.4) * 0.5);
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      const emission = Math.sin(time * emissionRate * 2 + i * 0.6);
      const energy = Math.max(0, emission * energyLevel);
      const size = 3 + energy * 15;
      const alpha = Math.max(0, Math.min(1, energy * loop.normalizedFrame * 0.7));
      
      return { x, y, size, alpha, energy, emission };
    });
  }, [width, height, moleculeSpeed, emissionRate, energyLevel, time, loop.normalizedFrame]);

  const bonds = useMemo(() => {
    const bondsList: { from: number; to: number; alpha: number }[] = [];
    for (let i = 0; i < MOLECULE_COUNT; i++) {
      for (let j = i + 1; j < MOLECULE_COUNT; j++) {
        const dx = molecules[i].x - molecules[j].x;
        const dy = molecules[i].y - molecules[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < BOND_DISTANCE) {
          const bondAlpha = Math.max(0, (1 - dist / BOND_DISTANCE)) * energyLevel * loop.normalizedFrame * 0.3;
          if (bondAlpha > 0.1) {
            bondsList.push({ from: i, to: j, alpha: bondAlpha });
          }
        }
      }
    }
    return bondsList.slice(0, 20);
  }, [molecules, width, height, energyLevel, loop.normalizedFrame]);

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
