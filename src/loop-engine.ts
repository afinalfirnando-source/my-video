// Background seamless loop animation engine

export interface LoopConfig {
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
}

export const createSeamlessLoop = (durationInFrames: number, segments: number) => {
  const segmentDuration = durationInFrames / segments;
  return (frame: number) => {
    const segment = Math.floor((frame % durationInFrames) / segmentDuration);
    const segmentFrame = (frame % durationInFrames) % segmentDuration;
    return { segment, segmentFrame, normalizedFrame: segmentFrame / segmentDuration };
  };
};

export const smoothTransition = (a: number, b: number, tension: number = 0.5) => {
  return a + (b - a) * Math.pow(tension, 60);
};
