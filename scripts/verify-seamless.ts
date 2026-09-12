import { execSync } from "child_process";
import { readFileSync, unlinkSync, existsSync, mkdirSync, statSync } from "fs";
import path from "path";
import { PNG } from "pngjs";

export interface QualityGateResult {
  pass: boolean;
  mse: number;
  frame0Path: string;
  frameLastPath: string;
  durationSeconds?: number;
  frameCount?: number;
  resolution?: { width: number; height: number };
  fileSizeMB?: number;
  errors: string[];
  warnings: string[];
}

const MSE_THRESHOLD = 0.1;
const EXPECTED_FRAMES = 900;
const EXPECTED_WIDTH = 3840;
const EXPECTED_HEIGHT = 2160;
const MIN_FILE_SIZE_MB = 80;
const MAX_FILE_SIZE_MB = 250;

const extractFrame = (videoPath: string, frameNumber: number, outputPath: string): void => {
  const cmd = `ffmpeg -y -i "${videoPath}" -vf "select=eq(n\\,${frameNumber})" -vframes 1 "${outputPath}"`;
  execSync(cmd, { stdio: "pipe" });
};

const loadImage = (pngPath: string): PNG => {
  const buffer = readFileSync(pngPath);
  return PNG.sync.read(buffer);
};

const computeMSE = (img1: PNG, img2: PNG): number => {
  if (img1.width !== img2.width || img1.height !== img2.height) {
    return Infinity;
  }
  const data1 = img1.data;
  const data2 = img2.data;
  const len = Math.min(data1.length, data2.length);
  let sumSq = 0;
  for (let i = 0; i < len; i++) {
    const diff = data1[i] - data2[i];
    sumSq += diff * diff;
  }
  return sumSq / len;
};

const getVideoInfo = (videoPath: string): { durationSeconds?: number; frameCount?: number; width?: number; height?: number } => {
  try {
    const result = execSync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,r_frame_rate,width,height -show_entries format=duration -of json "${videoPath}"`,
      { encoding: "utf-8" }
    );
    const info = JSON.parse(result);
    const stream = info.streams?.[0];
    const fmt = info.format;
    return {
      durationSeconds: fmt?.duration ? parseFloat(fmt.duration) : undefined,
      frameCount: stream?.nb_frames ? parseInt(stream.nb_frames, 10) : undefined,
      width: stream?.width,
      height: stream?.height,
    };
  } catch {
    return {};
  }
};

export const verifySeamless = (videoPath: string): QualityGateResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!existsSync(videoPath)) {
    errors.push(`Video file not found: ${videoPath}`);
    return { pass: false, mse: Infinity, frame0Path: "", frameLastPath: "", fileSizeMB: undefined, errors, warnings };
  }

  const stats = statSync(videoPath);
  const fileSizeMB = stats.size / (1024 * 1024);
  if (fileSizeMB < MIN_FILE_SIZE_MB) {
    errors.push(`File size ${fileSizeMB.toFixed(1)} MB is below minimum ${MIN_FILE_SIZE_MB} MB`);
  } else if (fileSizeMB > MAX_FILE_SIZE_MB) {
    errors.push(`File size ${fileSizeMB.toFixed(1)} MB exceeds maximum ${MAX_FILE_SIZE_MB} MB`);
  }

  const tmpDir = path.resolve("jobs/queue");
  mkdirSync(tmpDir, { recursive: true });

  const frame0Path = path.join(tmpDir, `frame0_${Date.now()}.png`);
  const frameLastPath = path.join(tmpDir, `frame899_${Date.now()}.png`);

  try {
    extractFrame(videoPath, 0, frame0Path);
  } catch {
    errors.push("Failed to extract frame 0");
  }

  try {
    extractFrame(videoPath, EXPECTED_FRAMES - 1, frameLastPath);
  } catch {
    errors.push(`Failed to extract frame ${EXPECTED_FRAMES - 1}`);
  }

  let mse = Infinity;
  if (existsSync(frame0Path) && existsSync(frameLastPath)) {
    try {
      const img1 = loadImage(frame0Path);
      const img2 = loadImage(frameLastPath);
      mse = computeMSE(img1, img2);
      if (mse > MSE_THRESHOLD) {
        errors.push(`MSE ${mse.toFixed(6)} exceeds threshold ${MSE_THRESHOLD}`);
      }
    } catch {
      errors.push("Failed to compute MSE between frames 0 and 899");
    }
  } else {
    errors.push("Could not extract both frames for MSE comparison");
  }

  const info = getVideoInfo(videoPath);

  if (info.frameCount !== undefined && info.frameCount !== EXPECTED_FRAMES) {
    errors.push(`Frame count ${info.frameCount} != expected ${EXPECTED_FRAMES}`);
  }

  if (info.width !== undefined && info.width !== EXPECTED_WIDTH) {
    errors.push(`Width ${info.width} != expected ${EXPECTED_WIDTH}`);
  }

  if (info.height !== undefined && info.height !== EXPECTED_HEIGHT) {
    errors.push(`Height ${info.height} != expected ${EXPECTED_HEIGHT}`);
  }

  const pass = errors.length === 0 && mse <= MSE_THRESHOLD;

  if (existsSync(frame0Path)) unlinkSync(frame0Path);
  if (existsSync(frameLastPath)) unlinkSync(frameLastPath);

  return {
    pass,
    mse,
    frame0Path,
    frameLastPath,
    durationSeconds: info.durationSeconds,
    frameCount: info.frameCount,
    resolution: { width: info.width ?? 0, height: info.height ?? 0 },
    fileSizeMB,
    errors,
    warnings,
  };
};

const main = () => {
  const args = process.argv.slice(2);
  const videoPath = args[0];

  if (!videoPath) {
    console.error("Usage: npx tsx scripts/verify-seamless.ts <video.mp4>");
    process.exit(1);
  }

  console.log(`🔍 Verifying seamless loop: ${videoPath}\n`);

  const result = verifySeamless(videoPath);

  console.log(`MSE (frame 0 vs 899): ${result.mse.toFixed(6)}`);
  console.log(`Threshold: ${MSE_THRESHOLD}`);
  console.log(`Frame count: ${result.frameCount ?? "unknown"}`);
  console.log(`Resolution: ${result.resolution?.width}x${result.resolution?.height}`);
  console.log(`Duration: ${result.durationSeconds ? `${result.durationSeconds.toFixed(2)}s` : "unknown"}`);
  if (result.fileSizeMB !== undefined) {
    console.log(`File size: ${result.fileSizeMB.toFixed(1)} MB (target: ${MIN_FILE_SIZE_MB}-${MAX_FILE_SIZE_MB} MB)`);
  }

  if (result.errors.length > 0) {
    console.log("\nErrors:");
    result.errors.forEach((e) => console.log(`  ✗ ${e}`));
  }

  if (result.warnings.length > 0) {
    console.log("\nWarnings:");
    result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }

  if (result.pass) {
    console.log("\n✅ PASS: Seamless loop verified");
    process.exit(0);
  } else {
    console.log("\n❌ FAIL: Seamless loop verification failed");
    process.exit(1);
  }
};

const scriptName = process.argv[1] ? process.argv[1].split(/[/\\]/).pop() : "";
if (scriptName === "verify-seamless.ts") {
  main();
}
