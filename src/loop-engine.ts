// Background seamless loop animation engine
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import React, { useMemo, useRef } from "react";

export interface LoopConfig {
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
}

const createSeamlessLoop = (durationInFrames: number, segments: number) => {
  const segmentDuration = durationInFrames / segments;
  return (frame: number) => {
    const segment = Math.floor((frame % durationInFrames) / segmentDuration);
    const segmentFrame = (frame % durationInFrames) % segmentDuration;
    return { segment, segmentFrame, normalizedFrame: segmentFrame / segmentDuration };
  };
};

const smoothTransition = (a: number, b: number, tension: number = 0.5) => {
  return a + (b - a) * Math.pow(tension, 60);
};

// Engine configuration for 4K seamless loops
export interface LoopConfig {
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
}

// Universal seamless loop calculation for any duration
const createSeamlessLoop = (durationInFrames: number, segments: number) => {
  const segmentDuration = durationInFrames / segments;
  return (frame: number) => {
    const segment = Math.floor((frame % durationInFrames) / segmentDuration);
    const segmentFrame = (frame % durationInFrames) % segmentDuration;
    return { segment, segmentFrame, normalizedFrame: segmentFrame / segmentDuration };
  };
};

// Smooth transition function for seamless looping
const smoothTransition = (a: number, b: number, tension: number = 0.5) => {
  return a + (b - a) * Math.pow(tension, 60);
};
