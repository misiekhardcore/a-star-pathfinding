# 📖 AGENTS.md — Internal Developer Documentation

- **Tech Stack**:
  - Next.js 16 (App Router)
  - React 19 with TypeScript 5.9+
  - Tailwind CSS v4 + [`@konopskidev/ui`](https://www.npmjs.com/package/@konopskidev/ui) for styling
  - Jest + Testing Library for tests
  - ESLint, Prettier, Husky + lint-staged
- **Package Manager**: Yarn v4.x
- **Entry Point**: `src/app/page.tsx`

## Code structure

```plain
src/
├── app/                        # Next.js App Router pages & global styles
│   ├── page.tsx                # Main visualization page (client component)
│   ├── layout.tsx              # Root layout: fonts, theme provider, metadata
│   └── globals.css             # Tailwind entry, design-system import, grid palette
├── components/                 # UI, styled with Tailwind + @konopskidev/ui
│   ├── AppHeader.tsx           # Sticky header with the theme toggle
│   ├── ThemeToggle.tsx         # Light / system / dark switch
│   ├── Panel.tsx               # Shared titled card wrapper
│   ├── DimensionControls.tsx   # Grid size sliders
│   ├── StrategyControls.tsx    # Movement / heuristic / total-cost selects
│   ├── VisualizerPanel.tsx     # Grid card: legend, draw mode, actions
│   ├── Grid.tsx                # Canvas board, responsive cells
│   ├── InteractionModeBar.tsx  # Draw-mode toggle group
│   ├── ActionButtons.tsx       # Run / step / clear / reset
│   └── index.ts                # Barrel exports
├── theme/                      # Colour scheme + canvas palette
│   ├── ThemeProvider.tsx       # Theme context, localStorage, system preference
│   ├── ThemeScript.tsx         # Inline script that prevents a theme flash
│   └── useGridPalette.ts       # Reads the --grid-* tokens for the canvas
├── entities/                   # Domain entities (co-located tests)
│   ├── Node/Node.ts            # Grid node with position, walkability, neighbors
│   ├── Position/Position.ts    # 2D coordinate with distance utilities
│   └── index.ts                # Barrel exports
└── lib/
    ├── PathFinding/
    │   ├── PathFinding.ts      # A* algorithm implementation
    │   ├── PathFinding.test.ts # Integration tests
    │   └── strategies/         # Strategy pattern for f/g/h calculations
    │       ├── *Strategy.ts    # 3 interfaces (G, H, F calculations)
    │       ├── DiagonalGCalculation.ts, ...   # Implementations
    │       └── strategies.test.ts             # Unit tests
    └── index.ts
```

## A\* algorithm overview

The A\* algorithm calculates path cost as **f(n) = g(n) + h(n)**:

- **g(n)** — movement cost from start to node n (strategizable via `GCalculationStrategy`)
- **h(n)** — heuristic estimate from node n to goal (strategizable via `HCalculationStrategy`)
- **f(n)** — total estimated cost (strategizable via `FCalculationStrategy`)

All three calculations use the **strategy pattern** via `PathFinding` constructor injection, defaulting to original behavior when omitted.

## 🎨 UI layer

- `@konopskidev/ui` supplies every component, colour token and the type scale; Tailwind v4 compiles
  it through `postcss.config.mjs`.
- `src/app/globals.css` imports Tailwind first, then `@konopskidev/ui/styles.css`; the package's
  published stylesheet registers its own modules as Tailwind sources, so the app writes no
  `@source` path.
- Dark mode is the `.dark` class on `<html>`. `ThemeProvider` owns the choice (`a-star-theme` in
  `localStorage`), and `ThemeScript` applies it before first paint to avoid a flash.
- The canvas API cannot resolve the design system's referenced tokens, so board colours are explicit
  hex `--grid-*` tokens per scheme, read through `useGridPalette`.
- Interaction state stays in `page.tsx`; `components/` holds presentation only.

## 📐 Code Quality & Validation Workflow

- **Strategy naming**: Name implementations by their mathematical behavior (e.g., `DiagonalGCalculation`, `SquaredEuclideanHCalculation`, `AdditiveFCalculation`), never `Default*`.
- **Co-located tests**: Tests live next to source files (`.test.ts`).
- **Client components**: The page is `'use client'` — uses React hooks (`useState`, `useRef`, `useCallback`).
- **Path aliases**: `@/` maps to `src/`.
- **ESLint**: Flat config (`eslint.config.mjs`), includes `prettier/prettier` as error.
- **Prettier**: Runs as part of lint — `yarn lint` runs ESLint + Prettier check.

## Validation — run before finishing any change

Run these in order. A change is not done until all pass.

```bash
# 1. Type check
npx tsc --noEmit

# 2. Tests
npx jest --no-cache

# 3. Lint (ESLint + Prettier check)
yarn lint

# 4. Build (runs lint then Next.js production build)
yarn build
```

## Scripts

| Script            | What it does                         |
| ----------------- | ------------------------------------ |
| `yarn dev`        | Start dev server (Next.js Turbopack) |
| `yarn build`      | `yarn lint && next build`            |
| `yarn lint`       | `yarn eslint && yarn prettier`       |
| `yarn eslint`     | `eslint .`                           |
| `yarn prettier`   | `prettier . --check`                 |
| `yarn test`       | `jest`                               |
| `yarn test:watch` | `jest --watch`                       |

## Key files

- `src/lib/PathFinding/PathFinding.ts` — Core A\* algorithm with strategy injection
- `src/lib/PathFinding/strategies/` — Strategy interfaces and implementations
- `src/app/page.tsx` — UI shell: state, handlers, and the two-column layout
- `src/app/globals.css` — Tailwind entry, design-system import, `--grid-*` palette
- `src/components/Grid.tsx` — canvas board with responsive cell sizing and palette drawing
- `src/theme/ThemeProvider.tsx` — light / system / dark theme state
- `src/entities/Node/Node.ts` — Grid node with neighbors, walkability, distance
