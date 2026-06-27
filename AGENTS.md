# AGENTS.md — A\* Pathfinding Visualizer

Interactive A\* pathfinding algorithm visualization built with Next.js, TypeScript, and React.

## Project overview

- **Repo**: https://github.com/misiekhardcore/a-star-pathfinding
- **Stack**: Next.js 16, React 19, TypeScript 5.9, Sass, Jest, ESLint, Prettier
- **Package manager**: Yarn 4.x
- **Entry point**: `src/app/page.tsx`

## Code structure

```plain
src/
├── app/                        # Next.js App Router pages & global styles
│   ├── page.tsx                # Main visualization page (client component)
│   ├── page.scss               # Page-specific styles
│   ├── layout.tsx              # Root layout
│   └── globals.scss            # Global styles / CSS variables
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

## Key conventions

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
- `src/app/page.tsx` — UI with interactive grid, controls, and strategy selectors
- `src/entities/Node/Node.ts` — Grid node with neighbors, walkability, distance
