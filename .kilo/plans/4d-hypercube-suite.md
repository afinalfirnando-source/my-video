# Plan: 4D Hypercube Rotation Suite (`hypercube-suite`)

## Concept
**Nested 4D tesseracts projected to 2D with simultaneous multi-plane rotation.** Multiple tesseracts at different scales and colors rotate in the 6 four-dimensional planes (xy, xz, xw, yz, yw, zw). Project 4D→3D (perspective in w) → 2D screen. Creates hypnotic, structured, cyberpunk full-screen motion — unique in portfolio (no 4D content exists yet).

## Why It's "Lebih Mainblowing"
- **True 4D visualization** — more impressive than existing 3D templates
- **Structured full-screen motion** — nested tesseracts fill entire 4K frame with geometric edges
- **6 simultaneous rotation planes** — chaotic-yet-deterministic motion
- **Periodic guaranteed** — all rotation speeds integer multiples of 2π/TOTAL_FRAMES → f(0)=f(900)
- Canvas 2D friendly — only need 4x4 matrix math + perspective divide

## Files
- `src/templates/hypercube-suite/index.tsx` — canvas render, 4D vertex buffer + projection
- `src/templates/hypercube-suite/types.ts` — Zod schema (same color props pattern)
- `src/Root.tsx` — add composition `HypercubeSuite-Professional-5`, 3840×2160, 900f, 60fps
- `.github/workflows/render-hypercube.yml` — single-job matrix entry, crf=12, 100–250 MB guard, upload artifact

## Technical Details

### 4D Tesseract Data
- 16 vertices: (±1, ±1, ±1, ±1)
- 32 edges (pairs differing in exactly one coordinate)
- 5 nested layers, each scaled by `1 / 2^layer` and phase-shifted by 27° in rotation space

### Rotation
- 6 rotation planes, each driven by `sin/cos(t * freq)` where `freq` is integer
- Rotation matrix built from sequential plane rotations:
  - `R_xy(α) · R_xz(β) · R_xw(γ) · R_yz(δ) · R_yw(ε) · R_zw(ζ)`
- Frequencies: `[3, 5, 2, 7, 4, 6]` — coprime set, full-period return at t=2π

### Projection (4D → 3D → 2D)
1. **4D→3D perspective**: `w' = 2.0` (camera in w), scale = `d / (d - w)` where d=4
2. **3D→2D perspective**: FOV-based divide, then scale to screen with distance `camZ = width * 0.6`
3. Edge clipping: fade edges beyond 90% radius for tunnel effect

### Render
- `globalCompositeOperation = "lighter"` for additive glow overlap
- `shadowBlur = 12 * glowIntensity`, `lineWidth = 1.8 + (1-layer*0.15)`
- Colors per layer via `colorForHue(layer * 37°, primary, secondary, tertiary, 0)`
- Noise overlay via `drawNoiseOverlay(ctx, w, h, t, 0.05)`

### Seamless Loop Guarantee
- `time = (frame % 900) / 900`; `t = time * 2π`
- All rotation frequencies are integers → at t=0 and t=2π, all sin/cos values reset
- Layer phases offset by fractions of 2π → all reset positions at frame 0 and frame 900

## Execution Order
1. Create `types.ts` + `index.tsx` in `src/templates/hypercube-suite/`
2. Register in `src/Root.tsx` → `HypercubeSuite-Professional-5`
3. Run `npm run lint`
4. Add `.github/workflows/render-hypercube.yml` (crf=12, non-fatal size guard)
5. Commit + push → CI renders 4K/900f/60fps MP4
