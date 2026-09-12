// verify-loop.ts — Automated seamless loop verification via ffmpeg + pngjs MSE
// Replaces the old approach that rendered individual frames via `remotion still`
// (slow, 1080p) with a fast ffmpeg extraction + pixel MSE comparison at full 4K.
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync } from "fs";
import path from "path";
import { PNG } from "pngjs";

const EXPECTED_FRAMES = 900;
const EXPECTED_WIDTH = 3840;
const EXPECTED_HEIGHT = 2160;
const MSE_THRESHOLD = 0.1;

const TEST_OUTPUT_DIR = path.resolve("test-output");

const templates = [
  "FluidGradientWaves-001",
  "NeonGridTunnel-001",
  "AuroraBorealis-001",
  "ParticleVortex-001",
  "LiquidChrome-001",
];

const extractFrame = (videoPath: string, frame: number, outPath: string): void => {
  execSync(
    `ffmpeg -y -i "${videoPath}" -vf "select=eq(n\\,${frame})" -vframes 1 "${outPath}"`,
    { stdio: "pipe" }
  );
};

const computeMSE = (png1: string, png2: string): number => {
  const img1 = PNG.sync.read(readFileSync(png1));
  const img2 = PNG.sync.read(readFileSync(png2));

  if (img1.width !== img2.width || img1.height !== img2.height) {
    throw new Error(`Frame dimensions differ: ${img1.width}x${img1.height} vs ${img2.width}x${img2.height}`);
  }

  const d1 = img1.data;
  const d2 = img2.data;
  const len = Math.min(d1.length, d2.length);
  let sumSq = 0;
  for (let i = 0; i < len; i++) {
    const diff = d1[i] - d2[i];
    sumSq += diff * diff;
  }
  return sumSq / len;
};

const getVideoInfo = (videoPath: string) => {
  const result = execSync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,width,height -show_entries format=duration -of json "${videoPath}"`,
    { encoding: "utf-8" }
  );
  return JSON.parse(result);
};

const verifyVideo = (videoPath: string): boolean => {
  const info = getVideoInfo(videoPath);
  const stream = info.streams[0];
  const fmt = info.format;

  const frameCount = parseInt(stream.nb_frames, 10);
  const width = stream.width;
  const height = stream.height;

  console.log(`  Resolution: ${width}x${height} (expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT})`);
  console.log(`  Frame count: ${frameCount} (expected ${EXPECTED_FRAMES})`);
  console.log(`  Duration: ${parseFloat(fmt.duration).toFixed(2)}s`);

  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    console.log("  ✗ Resolution mismatch");
    return false;
  }

  if (frameCount !== EXPECTED_FRAMES) {
    console.log("  ✗ Frame count mismatch");
    return false;
  }

  const frame0 = path.join(TEST_OUTPUT_DIR, "frame0.png");
  const frameLast = path.join(TEST_OUTPUT_DIR, "frame899.png");

  extractFrame(videoPath, 0, frame0);
  extractFrame(videoPath, EXPECTED_FRAMES - 1, frameLast);

  const mse = computeMSE(frame0, frameLast);
  console.log(`  MSE (frame 0 vs ${EXPECTED_FRAMES - 1}): ${mse.toFixed(6)} (threshold: ${MSE_THRESHOLD})`);

  unlinkSync(frame0);
  unlinkSync(frameLast);

  if (mse > MSE_THRESHOLD) {
    console.log("  ✗ Seamless loop check FAILED");
    return false;
  }

  console.log("  ✅ Seamless loop check PASSED");
  return true;
};

const main = () => {
  console.log("🔍 Verifying seamless loop for all templates...\n");

  mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
  const outDir = path.resolve("out");

  let allPassed = true;

  for (const template of templates) {
    const videoPath = path.join(outDir, `${template}.mp4`);

    if (!existsSync(videoPath)) {
      console.log(`Testing ${template}...`);
      console.log(`  ⚠ No rendered video found: ${videoPath}`);
      console.log("  Skipping (render the video first with: npx tsx scripts/render-all.ts)\n");
      continue;
    }

    console.log(`Testing ${template}...`);
    const passed = verifyVideo(videoPath);
    if (!passed) allPassed = false;
    console.log("");
  }

  if (allPassed) {
    console.log("✅ All templates pass seamless loop verification!");
    process.exit(0);
  } else {
    console.log("❌ Some templates failed verification!");
    process.exit(1);
  }
};

main();
