# Plan: 5 New Seamless Loop Video Templates

## Overview
Add 5 new canvas-based seamless loop compositions to `src/templates/` and register them in `src/Root.tsx`.
All compositions use 4K (3840x2160), 60fps, 900 frames (15 seconds), optimized for stock/background footage.

---

## 1. Fluid Gradient Waves
- **ID**: `FluidGradientWaves-Professional-1`
- **Visual**: Smooth, organic color gradients flowing like liquid silk. Multiple layered wave bands with soft motion blur effect. Very trendy "fluid art" aesthetic.
- **Palette**: Coral `#FF6B6B`, Purple `#A855F7`, Teal `#14B8A6`, on Deep Navy `#0F172A`
- **Duration**: 900 frames (15 sec)
- **Seamless technique**: Periodic sine-based wave displacement with phase offset that repeats exactly at frame 0 and 900
- **Props**: `waveCount`, `flowSpeed`, `colorShift`, `amplitude`, `primaryColor`, `secondaryColor`, `tertiaryColor`, `backgroundColor`, `glowIntensity`
- **Why popular**: Smooth gradients are trending everywhere (social media, presentations, tech backgrounds). Calming, premium, highly shareable.

---

## 2. Neon Grid Tunnel
- **ID**: `NeonGridTunnel-Professional-1`
- **Visual**: Endless perspective grid flying toward viewer with neon horizontal scan lines. Retro-futuristic "synthwave" vibe with depth and motion. Very high engagement aesthetic.
- **Palette**: Neon Pink `#FF2A6D`, Cyan `#00F0FF`, Deep Purple `#7B2FFF`, on Black `#0A0A1A`
- **Duration**: 900 frames (15 sec)
- **Seamless technique**: Continuous forward Z-scroll with tiled grid pattern + horizontal scan line repeats
- **Props**: `gridSize`, `flightSpeed`, `scanLineCount`, `pulseIntensity`, `primaryColor`, `secondaryColor`, `backgroundColor`, `lineWidth`, `glowIntensity`
- **Why popular**: Retro-futurism and synthwave are massive on YouTube, TikTok, and streaming intros. High energy, visually hypnotic.

---

## 3. Aurora Borealis
- **ID**: `AuroraBorealis-Professional-1`
- **Visual**: Curtains of northern lights dancing across starry night sky. Soft particle glow, gentle wave motion, ethereal atmosphere.
- **Palette**: Green `#00FF87`, Blue `#60A5FA`, Purple `#A855F7`, on Midnight `#0F172A`
- **Duration**: 900 frames (15 sec)
- **Seamless technique**: Sinusoidal curtain wave functions with phase-shifted layers that create perfect loop
- **Props**: `curtainCount`, `waveSpeed`, `starDensity`, `colorShift`, `primaryColor`, `secondaryColor`, `tertiaryColor`, `backgroundColor`, `glowIntensity`
- **Why popular**: Nature-tech hybrid is extremely popular. Used in meditation, relaxation, education, and premium branding. Highly downloaded on stock sites.

---

## 4. Particle Vortex
- **ID**: `ParticleVortex-Professional-1`
- **Visual**: Thousands of particles spiraling into a glowing core with trailing light streaks. Hypnotic, energetic, cosmic energy feel.
- **Palette**: Orange `#FF8C00`, Magenta `#FF0080`, Gold `#FFD700`, on Dark `#0A0A1A`
- **Duration**: 900 frames (15 sec)
- **Seamless technique**: Angular rotation modulo 360° + radial particle regeneration at outer edge
- **Props**: `particleCount`, `vortexSpeed`, `spiralStrength`, `coreGlow`, `trailLength`, `primaryColor`, `secondaryColor`, `backgroundColor`, `glowIntensity`
- **Why popular**: Particle effects are viral on TikTok/Reels. Perfect for energy drinks, gaming, sports, music visualizers. High shareability.

---

## 5. Liquid Chrome
- **ID**: `LiquidChrome-Professional-1`
- **Visual**: Flowing metallic liquid surface with neon reflections and ripples. Abstract, premium, futuristic. Very "Apple-style" aesthetic.
- **Palette**: Chrome Silver `#E2E8F0`, Neon Blue `#00F0FF`, Hot Pink `#FF2A6D`, on Dark `#0A0A1A`
- **Duration**: 900 frames (15 sec)
- **Seamless technique**: Periodic 2D noise field with scrolling UV offset + metallic shine calculation
- **Props**: `rippleCount`, `flowSpeed`, `waveAmplitude`, `metallicShine`, `primaryColor`, `secondaryColor`, `backgroundColor`, `glowIntensity`
- **Why popular**: Liquid metal is one of the most downloaded stock footage styles. Used by major brands, product launches, tech reviews. Premium, sleek, timeless.

---

## Implementation Steps
1. Create `src/templates/<name>/types.ts` with Zod schema for each template (900 frames, 3840x2160, 60fps).
2. Create `src/templates/<name>/index.tsx` with Remotion component using `useCurrentFrame`, `useVideoConfig`, and HTML5 Canvas.
3. Register all 5 compositions in `src/Root.tsx` inside `RemotionRoot`.
4. Verify with `npm run lint` and preview with `npm run dev`.

---

## Trending Rationale
- **Fluid gradients**: Top trend 2024-2025 (Apple, Instagram, LinkedIn backgrounds)
- **Synthwave/neon grid**: Dominates gaming and music culture (YouTube intros, Twitch overlays)
- **Aurora/nature tech**: High demand for calming, premium stock (wellness, education, corporate)
- **Particle vortex**: Viral on short-form video (TikTok effects, Reels transitions)
- **Liquid chrome**: Premium product aesthetic (unboxing videos, luxury branding, tech reviews)

All 5 concepts target high-download stock categories: abstract, backgrounds, technology, nature, energy.
