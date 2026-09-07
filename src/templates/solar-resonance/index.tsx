// Solar Resonance background animation
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";
import { createSeamlessLoop, smoothTransition } from "../loop-engine";
import type { LoopConfig } from "../loop-engine";

interface SolarResonanceProps {
  orbitSpeed: number;
  resonanceFrequency: number;
  lightIntensity: number;
}

const ORBIT_COUNT = 6;
const PLANET_COUNT = 12;

export const SolarResonance: React.FC<SolarResonanceProps & LoopConfig> = ({
  orbitSpeed = 1.0,
  resonanceFrequency = 1.0,
  lightIntensity = 1.0,
  durationInFrames,
  fps,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopData = useMemo(() => createSeamlessLoop(durationInFrames, 4), [durationInFrames]);

  const time = (frame % durationInFrames) / durationInFrames;
  const loop = loopData(frame);

  const orbits = useMemo(() => {
    return Array.from({ length: ORBIT_COUNT }, (_, orbitIndex) => {
      const baseSpeed = orbitSpeed * (1 + orbitIndex * 0.3);
      const resonance = Math.sin(time * resonanceFrequency * 2 + orbitIndex * 0.8);
      
      return {
        speed: baseSpeed * (1 + resonance * 0.5),
        radius: Math.min(width, height) * 0.1 * (1 + orbitIndex * 0.15),
        index: orbitIndex,
        resonance,
      };
    });
  }, [width, height, orbitSpeed, resonanceFrequency, time]);

  const planets = useMemo(() => {
    return Array.from({ length: PLANET_COUNT }, (_, planetIndex) => {
      const orbitIndex = planetIndex % ORBIT_COUNT;
      const angle = (planetIndex * Math.PI * 2) / PLANET_COUNT + time * orbits[orbitIndex].speed;
      const orbit = orbits[orbitIndex];
      
      const x = width / 2 + Math.cos(angle) * orbit.radius;
      const y = height / 2 + Math.sin(angle) * orbit.radius;
      
      const pulse = Math.sin(time * resonanceFrequency * 3 + planetIndex * 0.4);
      const size = 2 + pulse * 8 * lightIntensity;
      const alpha = Math.max(0, Math.min(1, pulse * lightIntensity * loop.normalizedFrame * 0.6));
      
      return { x, y, size, alpha, pulse, orbitIndex };
    });
  }, [width, height, orbits, time, resonanceFrequency, lightIntensity, loop.normalizedFrame]);

  const resonances = useMemo(() => {
    const resonanceLines: { x1: number; y1: number; x2: number; y2: number; alpha: number }[] = [];
    for (let i = 0; i < PLANET_COUNT; i++) {
      for (let j = i + 1; j < PLANET_COUNT; j++) {
        if (planets[i].orbitIndex === planets[j].orbitIndex) {
          const frequency = Math.abs(planets[i].pulse - planets[j].pulse);
          if (frequency > 0.3) {
            const alpha = frequency * lightIntensity * loop.normalizedFrame * 0.4;
            if (alpha > 0.1) {
              resonanceLines.push({
                x1: planets[i].x,
                y1: planets[i].y,
                x2: planets[j].x,
                y2: planets[j].y,
                alpha,
              });
            }
          }
        }
      }
    }
    return resonanceLines.slice(0, 15);
  }, [planets, lightIntensity, loop.normalizedFrame]);

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
