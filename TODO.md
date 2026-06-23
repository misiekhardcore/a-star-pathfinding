# TODO — PR #151: Strategy Pattern for A\* f/g/h

## PR Context

- **PR**: https://github.com/misiekhardcore/a-star-pathfinding/pull/151
- **Goal**: Abstract f, g, h calculations into strategy pattern
- **Branch**: `copilot/fix-4bc7a02e-5030-4e99-90d7-a1b55ef3247c`
- **Status**: Branch was reset to main (commit ad24531). Only dependency updates + code quality changes remain. Need fresh strategy pattern implementation.
- **Stale since**: Sep 2025

## Design

### Interfaces

- `GCalculationStrategy` — movement cost: `calculate(currentNode: Node, neighbor: Node): number`
- `HCalculationStrategy` — heuristic: `calculate(node: Node, goalNode: Node): number`
- `FCalculationStrategy` — total cost: `calculate(g: number, h: number): number`

### Defaults (backward compatible)

- `DefaultGCalculation` → `neighbor.getDistance(lowestFNode)` (Manhattan-like with diagonal compression)
- `DefaultHCalculation` → `node.position.getDistance(goalNode.position)` (squared Euclidean)
- `DefaultFCalculation` → `g + h`

### Alternative strategies

- `ManhattanHCalculation` → `|dx| + |dy|`
- `WeightedFCalculation` → `g + weight * h`

### Changes to PathFinding

- Constructor accepts optional strategies (defaults to originals)
- `initializeNode` and `getNextStep` use strategies instead of hardcoded calls

## Tasks

- [x] Read PR and understand requirements
- [x] Checkout PR branch and verify tests pass
- [x] Create file structure for strategies
- [x] Implement `GCalculationStrategy`/`DefaultGCalculation`
- [x] Implement `HCalculationStrategy`/`DefaultHCalculation`/`ManhattanHCalculation`
- [x] Implement `FCalculationStrategy`/`DefaultFCalculation`/`WeightedFCalculation`
- [x] Update `PathFinding.ts` to accept and use strategies
- [x] Write tests for all strategies
- [x] Run full test suite — 33/33 pass
- [x] Run lint — clean (only pre-existing next-env.d.ts error)
- [x] Run type check — clean
- [x] Run format check — clean
- [ ] Push branch and verify CI
