import { Node, Position } from '@/entities';
import { PathFinding } from '@/lib';
import {
  AdditiveFCalculation,
  DiagonalGCalculation,
  FCalculationStrategy,
  GCalculationStrategy,
  HCalculationStrategy,
  ManhattanHCalculation,
  SquaredEuclideanHCalculation,
  WeightedFCalculation,
} from '@/lib/PathFinding/strategies';
import type { HeuristicStrategyId, MovementCostStrategyId, TotalCostStrategyId } from '@/types';

export const MOVEMENT_COST_STRATEGIES: {
  id: MovementCostStrategyId;
  label: string;
  factory: () => GCalculationStrategy;
}[] = [{ id: 'diagonal', label: 'Diagonal (default)', factory: () => new DiagonalGCalculation() }];

export const HEURISTIC_STRATEGIES: {
  id: HeuristicStrategyId;
  label: string;
  factory: () => HCalculationStrategy;
}[] = [
  {
    id: 'squaredEuclidean',
    label: 'Squared Euclidean (default)',
    factory: () => new SquaredEuclideanHCalculation(),
  },
  { id: 'manhattan', label: 'Manhattan', factory: () => new ManhattanHCalculation() },
];

export const TOTAL_COST_STRATEGIES: {
  id: TotalCostStrategyId;
  label: string;
  factory: () => FCalculationStrategy;
}[] = [
  { id: 'additive', label: 'Additive (default)', factory: () => new AdditiveFCalculation() },
  { id: 'weighted', label: 'Weighted (1.5)', factory: () => new WeightedFCalculation(1.5) },
];

export const INTERACTION_MODES: { id: 'obstacle' | 'start' | 'end'; label: string }[] = [
  { id: 'obstacle', label: 'Draw obstacles' },
  { id: 'start', label: 'Set start' },
  { id: 'end', label: 'Set end' },
];

export const DEFAULT_WIDTH = 25;
export const DEFAULT_HEIGHT = 25;
export const MIN_DIMENSION = 5;
export const MAX_DIMENSION = 50;

export function generateGrid({
  width,
  height,
  startNode,
  endNode,
}: {
  width: number;
  height: number;
  startNode: Node;
  endNode: Node;
}): Node[][] {
  const grid: Node[][] = [];
  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      grid[y][x] = new Node(new Position(x, y), null, Math.random() > 0.2);
    }
  }

  grid[startNode.position.y][startNode.position.x] = startNode;
  grid[endNode.position.y][endNode.position.x] = endNode;

  return grid;
}

export function makeNode(position: Position, walkable = true): Node {
  return new Node(position, null, walkable);
}

export function cloneGrid(grid: Node[][]): Node[][] {
  return grid.map((row) => [...row]);
}

export function buildPathFinding(
  grid: Node[][],
  startPos: Position,
  endPos: Position,
  movementCostId: MovementCostStrategyId,
  heuristicId: HeuristicStrategyId,
  totalCostId: TotalCostStrategyId
): PathFinding {
  const movementCostStrategy = MOVEMENT_COST_STRATEGIES.find(
    (s) => s.id === movementCostId
  )!.factory();
  const heuristicStrategy = HEURISTIC_STRATEGIES.find((s) => s.id === heuristicId)!.factory();
  const totalCostStrategy = TOTAL_COST_STRATEGIES.find((s) => s.id === totalCostId)!.factory();

  const startNode = makeNode(startPos, true);
  const endNode = makeNode(endPos, true);

  grid[startPos.y][startPos.x] = startNode;
  grid[endPos.y][endPos.x] = endNode;

  return new PathFinding(
    grid,
    startNode,
    endNode,
    movementCostStrategy,
    heuristicStrategy,
    totalCostStrategy
  );
}
