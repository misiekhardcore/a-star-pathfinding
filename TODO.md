# TODO — Interactive Map Features

## Done

- [x] Click cells to toggle obstacles (walkable / non-walkable)
- [x] Clear all obstacles button
- [x] Change map width/height via number inputs
- [x] Selectable interaction mode: Draw obstacles / Set start / Set end
- [x] Click cells to move start node (green S)
- [x] Click cells to move end node (red E)
- [x] Visual styling: node colors, hover effects, active mode button highlight
- [x] Refactored monolith page.tsx into components:
  - `DimensionControls` — width/height inputs
  - `StrategyControls` — algorithm strategy selectors
  - `InteractionModeBar` — obstacle/start/end mode buttons
  - `ActionButtons` — run/step/clear/reset buttons
  - `Grid` — grid visualization with per-cell click handling
- [x] Extracted shared types to `src/types.ts`
- [x] Extracted grid utilities to `src/lib/grid-utils.ts`
- [x] Validation: tsc, jest, eslint, prettier, build — all pass
