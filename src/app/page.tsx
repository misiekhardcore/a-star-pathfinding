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

type GStrategyId = 'diagonal';
type HStrategyId = 'squaredEuclidean' | 'manhattan';
type FStrategyId = 'additive' | 'weighted';

const G_STRATEGIES: { id: GStrategyId; label: string; factory: () => GCalculationStrategy }[] = [
  { id: 'diagonal', label: 'Diagonal (default)', factory: () => new DiagonalGCalculation() },
];

const H_STRATEGIES: { id: HStrategyId; label: string; factory: () => HCalculationStrategy }[] = [
  {
    id: 'squaredEuclidean',
    label: 'Squared Euclidean (default)',
    factory: () => new SquaredEuclideanHCalculation(),
  },
  { id: 'manhattan', label: 'Manhattan', factory: () => new ManhattanHCalculation() },
];

const F_STRATEGIES: { id: FStrategyId; label: string; factory: () => FCalculationStrategy }[] = [
  { id: 'additive', label: 'Additive (default)', factory: () => new AdditiveFCalculation() },
  { id: 'weighted', label: 'Weighted (1.5)', factory: () => new WeightedFCalculation(1.5) },
];

function createPathFinding(
  gId: GStrategyId,
  hId: HStrategyId,
  fId: FStrategyId
): PathFinding {
  const gStrategy = G_STRATEGIES.find((s) => s.id === gId)!.factory();
  const hStrategy = H_STRATEGIES.find((s) => s.id === hId)!.factory();
  const fStrategy = F_STRATEGIES.find((s) => s.id === fId)!.factory();

  const grid = generateFreshGrid();
  return new PathFinding(grid, START_NODE, END_NODE, gStrategy, hStrategy, fStrategy);
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
  const [gId, setGId] = useState<GStrategyId>('diagonal');
  const [hId, setHId] = useState<HStrategyId>('squaredEuclidean');
  const [fId, setFId] = useState<FStrategyId>('additive');

  const [pf, setPf] = useState<PathFinding>(() => createPathFinding(gId, hId, fId));
  const [grid, setGrid] = useState<Node[][]>(pf.getGrid());
  const [path, setPath] = useState<Node[]>(pf.getPath());
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const rebuild = useCallback(
    (g: GStrategyId, h: HStrategyId, f: FStrategyId) => {
      stopAuto();
      const newPf = createPathFinding(g, h, f);
      setPf(newPf);
      setGrid(newPf.getGrid());
      setPath(newPf.getPath());
    },
    []
  );

  function onGChange(id: GStrategyId) {
    setGId(id);
    rebuild(id, hId, fId);
  }

  function onHChange(id: HStrategyId) {
    setHId(id);
    rebuild(gId, id, fId);
  }

  function onFChange(id: FStrategyId) {
    setFId(id);
    rebuild(gId, hId, id);
  }

  function getNextGrid() {
    const nextPath = pf.getNextStep();
    if (nextPath) {
      setPath(pf.getPath());
    }
  }

  function reset() {
    pf.clear();
    setPath(pf.getPath());
    const newGrid = generateFreshGrid();
    pf.setGrid(newGrid);
    setGrid(pf.getGrid());
    stopAuto();
  }

  function runAuto() {
    interval.current = setInterval(() => {
      if (pf.isEndReached()) {
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
          <label htmlFor="g-strategy">G (movement cost):</label>
          <select
            id="g-strategy"
            value={gId}
            onChange={(e) => onGChange(e.target.value as GStrategyId)}
          >
            {G_STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="h-strategy">H (heuristic):</label>
          <select
            id="h-strategy"
            value={hId}
            onChange={(e) => onHChange(e.target.value as HStrategyId)}
          >
            {H_STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="f-strategy">F (total cost):</label>
          <select
            id="f-strategy"
            value={fId}
            onChange={(e) => onFChange(e.target.value as FStrategyId)}
          >
            {F_STRATEGIES.map((s) => (
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
                  color: getNodeColor(node, pf),
                }}
              >
                {!node.isWalkable()
                  ? 'X'
                  : [pf.getStartNode(), pf.getEndNode(), ...path].includes(node)
                    ? 'P'
                    : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );

  function getNodeColor(node: Node, pathFinding: PathFinding): CSSProperties['color'] | undefined {
    if (pathFinding.isEndReached() && pathFinding.isPathNode(node)) {
      return 'yellow';
    } else if (node === pathFinding.getStartNode()) {
      return 'green';
    } else if (node === pathFinding.getEndNode()) {
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
