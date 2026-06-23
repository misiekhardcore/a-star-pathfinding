'use client';

import { CSSProperties, useCallback, useRef, useState } from 'react';

import './page.scss';
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

const COLS = 25;
const ROWS = 25;
const START_NODE = new Node(new Position(0, 0), null, true);
const END_NODE = new Node(new Position(COLS - 1, ROWS - 1), null, true);

type MovementCostStrategyId = 'diagonal';
type HeuristicStrategyId = 'squaredEuclidean' | 'manhattan';
type TotalCostStrategyId = 'additive' | 'weighted';

const MOVEMENT_COST_STRATEGIES: {
  id: MovementCostStrategyId;
  label: string;
  factory: () => GCalculationStrategy;
}[] = [
  { id: 'diagonal', label: 'Diagonal (default)', factory: () => new DiagonalGCalculation() },
];

const HEURISTIC_STRATEGIES: {
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

const TOTAL_COST_STRATEGIES: {
  id: TotalCostStrategyId;
  label: string;
  factory: () => FCalculationStrategy;
}[] = [
  { id: 'additive', label: 'Additive (default)', factory: () => new AdditiveFCalculation() },
  { id: 'weighted', label: 'Weighted (1.5)', factory: () => new WeightedFCalculation(1.5) },
];

function createPathFinding(
  movementCostId: MovementCostStrategyId,
  heuristicId: HeuristicStrategyId,
  totalCostId: TotalCostStrategyId
): PathFinding {
  const movementCostStrategy = MOVEMENT_COST_STRATEGIES.find((s) => s.id === movementCostId)!.factory();
  const heuristicStrategy = HEURISTIC_STRATEGIES.find((s) => s.id === heuristicId)!.factory();
  const totalCostStrategy = TOTAL_COST_STRATEGIES.find((s) => s.id === totalCostId)!.factory();

  const grid = generateFreshGrid();
  return new PathFinding(
    grid,
    START_NODE,
    END_NODE,
    movementCostStrategy,
    heuristicStrategy,
    totalCostStrategy
  );
}

function generateFreshGrid(): Node[][] {
  return generateGrid({
    width: COLS,
    height: ROWS,
    startNode: START_NODE,
    endNode: END_NODE,
  });
}

export default function Home() {
  const [movementCostId, setMovementCostId] = useState<MovementCostStrategyId>('diagonal');
  const [heuristicId, setHeuristicId] = useState<HeuristicStrategyId>('squaredEuclidean');
  const [totalCostId, setTotalCostId] = useState<TotalCostStrategyId>('additive');

  const [pathFinder, setPathFinder] = useState<PathFinding>(() =>
    createPathFinding(movementCostId, heuristicId, totalCostId)
  );
  const [grid, setGrid] = useState<Node[][]>(pathFinder.getGrid());
  const [path, setPath] = useState<Node[]>(pathFinder.getPath());
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const rebuild = useCallback(
    (movementCost: MovementCostStrategyId, heuristic: HeuristicStrategyId, totalCost: TotalCostStrategyId) => {
      stopAuto();
      const newPathFinder = createPathFinding(movementCost, heuristic, totalCost);
      setPathFinder(newPathFinder);
      setGrid(newPathFinder.getGrid());
      setPath(newPathFinder.getPath());
    },
    []
  );

  function onMovementCostChange(id: MovementCostStrategyId) {
    setMovementCostId(id);
    rebuild(id, heuristicId, totalCostId);
  }

  function onHeuristicChange(id: HeuristicStrategyId) {
    setHeuristicId(id);
    rebuild(movementCostId, id, totalCostId);
  }

  function onTotalCostChange(id: TotalCostStrategyId) {
    setTotalCostId(id);
    rebuild(movementCostId, heuristicId, id);
  }

  function getNextGrid() {
    const nextPath = pathFinder.getNextStep();
    if (nextPath) {
      setPath(pathFinder.getPath());
    }
  }

  function reset() {
    pathFinder.clear();
    setPath(pathFinder.getPath());
    const newGrid = generateFreshGrid();
    pathFinder.setGrid(newGrid);
    setGrid(pathFinder.getGrid());
    stopAuto();
  }

  function runAuto() {
    interval.current = setInterval(() => {
      if (pathFinder.isEndReached()) {
        stopAuto();
      } else {
        getNextGrid();
      }
    }, 100);
  }

  function stopAuto() {
    clearInterval(interval.current);
    interval.current = undefined;
  }

  return (
    <main className="main">
      <h1>Pathfinding Visualizer</h1>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="movement-cost-strategy">Movement cost:</label>
          <select
            id="movement-cost-strategy"
            value={movementCostId}
            onChange={(e) => onMovementCostChange(e.target.value as MovementCostStrategyId)}
          >
            {MOVEMENT_COST_STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="heuristic-strategy">Heuristic:</label>
          <select
            id="heuristic-strategy"
            value={heuristicId}
            onChange={(e) => onHeuristicChange(e.target.value as HeuristicStrategyId)}
          >
            {HEURISTIC_STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="total-cost-strategy">Total cost:</label>
          <select
            id="total-cost-strategy"
            value={totalCostId}
            onChange={(e) => onTotalCostChange(e.target.value as TotalCostStrategyId)}
          >
            {TOTAL_COST_STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="buttons">
        <button onClick={runAuto}>Run auto</button>
        <button onClick={getNextGrid}>Next step</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div className="grid">
        {grid.map((row, y) => (
          <div key={y} className="row">
            {row.map((node, x) => (
              <div
                key={x}
                className="node"
                style={{
                  color: getNodeColor(node, pathFinder),
                }}
              >
                {!node.isWalkable()
                  ? 'X'
                  : [pathFinder.getStartNode(), pathFinder.getEndNode(), ...path].includes(node)
                    ? 'P'
                    : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );

  function getNodeColor(
    node: Node,
    pathFinder: PathFinding
  ): CSSProperties['color'] | undefined {
    if (pathFinder.isEndReached() && pathFinder.isPathNode(node)) {
      return 'yellow';
    } else if (node === pathFinder.getStartNode()) {
      return 'green';
    } else if (node === pathFinder.getEndNode()) {
      return 'red';
    } else if (!node.isWalkable()) {
      return 'navy';
    } else if (path.includes(node)) {
      return 'purple';
    } else {
      return 'white';
    }
  }
}

function generateGrid({
  width,
  height,
  endNode,
  startNode,
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
