import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

// Stock video defaults:
// - PNG frames for maximum quality (ProRes/H.264 at render time)
// - 4K dimensions & 60fps di-set per Composition di src/Root.tsx
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.setRspack(true);
Config.overrideBundlerConfig(enableTailwind);
