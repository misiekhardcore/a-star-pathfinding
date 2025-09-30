# A\* Pathfinding Strategy Pattern Usage Examples

This document demonstrates how to use the new strategy pattern implementation for A\* pathfinding.

## Basic Usage (Default Strategies)

```typescript
import { PathFinding } from '@/lib';
import { Node, Position } from '@/entities';

// Create your grid
const grid = createGrid(); // Your grid creation logic
const startNode = new Node(new Position(0, 0));
const endNode = new Node(new Position(10, 10));

// Use default strategies (same behavior as before)
const pathFinding = new PathFinding(grid, startNode, endNode);
```

## Using Custom Strategies

```typescript
import {
  PathFinding,
  ManhattanHCalculation,
  WeightedFCalculation,
  DefaultGCalculation,
} from '@/lib';

// Use Manhattan distance for heuristic (better for grid-based movement)
const manhattanPathFinding = new PathFinding(
  grid,
  startNode,
  endNode,
  new DefaultGCalculation(),
  new ManhattanHCalculation(),
  new DefaultFCalculation()
);

// Use weighted F calculation for faster but potentially less optimal paths
const weightedPathFinding = new PathFinding(
  grid,
  startNode,
  endNode,
  new DefaultGCalculation(),
  new DefaultHCalculation(),
  new WeightedFCalculation(2.0) // Weight of 2.0 prioritizes heuristic more
);
```

## Creating Your Own Strategies

```typescript
import { GCalculationStrategy, HCalculationStrategy, FCalculationStrategy } from '@/lib';

// Custom G calculation that adds terrain costs
class TerrainGCalculation implements GCalculationStrategy {
  calculate(current: Node, neighbor: Node): number {
    const baseDistance = neighbor.getDistance(current);
    const terrainMultiplier = getTerrainCost(neighbor); // Your terrain logic
    return baseDistance * terrainMultiplier;
  }
}

// Custom H calculation using Chebyshev distance
class ChebyshevHCalculation implements HCalculationStrategy {
  calculate(node: Node, goalNode: Node): number {
    return Math.max(
      Math.abs(node.position.x - goalNode.position.x),
      Math.abs(node.position.y - goalNode.position.y)
    );
  }
}

// Use your custom strategies
const customPathFinding = new PathFinding(
  grid,
  startNode,
  endNode,
  new TerrainGCalculation(),
  new ChebyshevHCalculation(),
  new DefaultFCalculation()
);
```

## Strategy Comparison

| Strategy       | Use Case                  | Trade-offs                               |
| -------------- | ------------------------- | ---------------------------------------- |
| Default        | General purpose           | Balanced, works well for most cases      |
| Manhattan      | Grid-based movement       | More accurate for 4-directional movement |
| Weighted F     | Fast pathfinding          | Faster but may not find optimal path     |
| Custom Terrain | Complex terrain costs     | Realistic movement costs                 |
| Chebyshev      | Diagonal movement allowed | Good for 8-directional movement          |
