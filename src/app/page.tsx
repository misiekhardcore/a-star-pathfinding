'use client';

import { CSSProperties, useState } from 'react';

import './page.scss';
import { Node, Position } from '@/entities';
import { PathFinding } from '@/lib';

const COLS = 25;
const ROWS = 25;
const START_NODE = new Node(new Position(0, 0), null, true);
const END_NODE = new Node(new Position(COLS - 1, ROWS - 1), null, true);
const INITIAL_GRID = generateGrid({
  width: COLS,
  height: ROWS,
  startNode: START_NODE,
  endNode: END_NODE,
});
const pathFinding = new PathFinding(INITIAL_GRID, START_NODE, END_NODE);

export default function Home() {
  const [startNode] = useState<Node>(START_NODE);
  const [endNode] = useState<Node>(END_NODE);
  const [grid, setGrid] = useState<Node[][]>(INITIAL_GRID);
  const [path, setPath] = useState<Node[]>(pathFinding.reconstructPath(startNode));

  function getNextGrid() {
    const nextPath = pathFinding.getNextStep();
    if (nextPath) {
      setPath([...nextPath]);
      setGrid([...grid]);
    }
  }

  function reset() {
    setPath(pathFinding.reconstructPath(startNode));
    const newGrid = generateGrid({ width: COLS, height: ROWS, startNode, endNode });
    setGrid(newGrid);
    pathFinding.setGrid(newGrid);
  }

  function runAuto() {
    const interval = setInterval(() => {
      if (pathFinding.isEndReached(grid)) {
        clearInterval(interval);
      }
      getNextGrid();
    }, 100);
  }

  return (
    <main className="main">
      <h1>Pathfinding Visualizer</h1>
      <button onClick={runAuto}>Run auto</button>
      <button onClick={getNextGrid}>next step</button>
      <button onClick={reset}>reset</button>
      <div className="grid">
        {grid.map((row, y) => (
          <div key={y} className="row">
            {row.map((node, x) => (
              <div
                key={x}
                className="node"
                style={{
                  color: getNodeColor(node, pathFinding),
                }}
              >
                {!node.isWalkable() ? 'X' : [startNode, endNode, ...path].includes(node) ? 'P' : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );

  function getNodeColor(node: Node, pathFinding: PathFinding): CSSProperties['color'] | undefined {
    if (pathFinding.isEndReached(grid) && pathFinding.isPathNode(node)) {
      return 'yellow';
    } else if (node === startNode) {
      return 'green';
    } else if (node === endNode) {
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
