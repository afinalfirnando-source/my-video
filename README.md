# My Video - Professional Seamless Loop Templates

A collection of 5 professional seamless loop video templates built with Remotion, designed for 4K stock footage, backgrounds, and motion graphics.

## 🎬 Templates

| # | Template | Category | Description |
|---|----------|----------|-------------|
| 1 | Fluid Gradient Waves | Abstract | Smooth organic color gradients flowing like liquid silk |
| 2 | Neon Grid Tunnel | Tech | Endless perspective grid flying toward viewer with neon scan lines |
| 3 | Aurora Borealis | Nature | Curtains of northern lights dancing across starry night sky |
| 4 | Particle Vortex | Energy | Thousands of particles spiraling into a glowing core with light trails |
| 5 | Liquid Chrome | Premium | Flowing metallic liquid surface with neon reflections and ripples |

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Studio
```bash
npm run dev
```

### Render All Templates (4K 60fps 15s)
```bash
npm run render:all
```

### Render Single Template
```bash
npm run render:single "Fluid Gradient Waves"
```

### List Available Compositions
```bash
npm run list
```

## 📁 Project Structure

```
src/
├── index.ts                    # Entry point
├── Root.tsx                    # Composition registry
├── Composition.tsx             # Base composition (compatibility)
├── index.css                   # Tailwind imports
├── shared/
│   ├── index.ts                # Shared exports
│   ├── utils.ts                # Utility functions (seeded, hsl, lerp, clamp, etc.)
│   └── useCanvas.ts            # Custom canvas hook
├── templates/
│   ├── index.ts                # Template exports
│   ├── fluid-gradient-waves/   # Template 1
│   ├── neon-grid-tunnel/       # Template 2
│   ├── aurora-borealis/        # Template 3
│   ├── particle-vortex/        # Template 4
│   └── liquid-chrome/          # Template 5
└── data/
    └── template-registry.ts    # Centralized template configuration

scripts/
├── render-all.ts               # Batch render all templates
├── render-single.ts            # Render single template
└── generate-list.ts            # List compositions
```

## ⚙️ Configuration

All templates use consistent settings:
- **Resolution**: 4K (3840×2160)
- **FPS**: 60
- **Duration**: 900 frames (15 seconds)
- **Codec**: H.264
- **Bitrate**: 100 Mbps

## 🎨 Customization

Each template accepts customizable props:
- Colors (primary, secondary, tertiary, background)
- Animation speed and intensity
- Particle/element counts
- Glow and effect intensities

See individual `types.ts` files for full prop schemas.

## 📝 Adding New Templates

1. Create folder in `src/templates/`
2. Add `types.ts` with Zod schema
3. Add `index.tsx` with React component
4. Export from `src/templates/index.ts`
5. Register in `src/data/template-registry.ts`

## 🛠️ Tech Stack

- **Remotion** - Video rendering framework
- **React 19** - UI components
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **Tailwind CSS** - Styling (if needed)

## 📄 License

Private project. See Remotion license for framework terms.
