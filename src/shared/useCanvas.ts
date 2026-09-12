// Canvas hook for consistent rendering
import { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type DrawCallback = (ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => void;

export const useCanvas = (draw: DrawCallback) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    try {
      draw(ctx, frame, width, height);
    } catch (error) {
      console.error(`Canvas draw error at frame ${frame}:`, error);
    }
  }, [draw, frame, width, height]);

  return canvasRef;
};

/**
 * Base canvas draw helper with common operations
 */
export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number, color: string = "#000000") => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
};

/**
 * Apply vignette effect
 */
export const applyVignette = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number = 0.5) => {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
  
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
};
