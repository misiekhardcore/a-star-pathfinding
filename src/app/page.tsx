'use client';

import { useRef, useState } from 'react';

import './page.scss';
import { Node, Position } from '@/entities';
import { PathFinding } from '@/lib';
import {
  ActionButtons,
  DimensionControls,
  Grid,
  InteractionModeBar,
  StrategyControls,
} from '@/components';
import {
  buildPathFinding,
  cloneGrid,
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  generateGrid,
  makeNode,
} from '@/lib/grid-utils';
import type {
  HeuristicStrategyId,
  InteractionMode,
  MovementCostStrategyId,
  TotalCostStrategyId,
} from '@/types';

export default function Home() {
  const [gridWidth, setGridWidth] = useState(DEFAULT_WIDTH);
  const [gridHeight, setGridHeight] = useState(DEFAULT_HEIGHT);
  const [movementCostId, setMovementCostId] = useState<MovementCostStrategyId>('diagonal');
  const [heuristicId, setHeuristicId] = useState<HeuristicStrategyId>('squaredEuclidean');
  const [totalCostId, setTotalCostId] = useState<TotalCostStrategyId>('additive');
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(null);

  const [pathFinder, setPathFinder] = useState<PathFinding>(() => {
    const startPos = new Position(0, 0);
    const endPos = new Position(DEFAULT_WIDTH - 1, DEFAULT_HEIGHT - 1);
    const startNode = makeNode(startPos, true);
    const endNode = makeNode(endPos, true);
    const grid = generateGrid({
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      startNode,
      endNode,
    });
    return buildPathFinding(grid, startPos, endPos, movementCostId, heuristicId, totalCostId);
  });
  const [grid, setGrid] = useState<Node[][]>(pathFinder.getGrid());
  const [path, setPath] = useState<Node[]>(pathFinder.getPath());
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const autoActive = useRef(false);

  const startNode = pathFinder.getStartNode();
  const endNode = pathFinder.getEndNode();

  function stopAuto() {
    autoActive.current = false;
    clearInterval(interval.current);
    interval.current = undefined;
  }

  function setNewPathFinder(newPf: PathFinding) {
    newPf.clear();
    setPathFinder(newPf);
    setGrid(newPf.getGrid());
    setPath(newPf.getPath());
  }

  function onMovementCostChange(id: MovementCostStrategyId) {
    stopAuto();
    setMovementCostId(id);
    setNewPathFinder(
      buildPathFinding(
        cloneGrid(grid),
        startNode.position,
        endNode.position,
        id,
        heuristicId,
        totalCostId
      )
    );
  }

  function onHeuristicChange(id: HeuristicStrategyId) {
    stopAuto();
    setHeuristicId(id);
    setNewPathFinder(
      buildPathFinding(
        cloneGrid(grid),
        startNode.position,
        endNode.position,
        movementCostId,
        id,
        totalCostId
      )
    );
  }

  function onTotalCostChange(id: TotalCostStrategyId) {
    stopAuto();
    setTotalCostId(id);
    setNewPathFinder(
      buildPathFinding(
        cloneGrid(grid),
        startNode.position,
        endNode.position,
        movementCostId,
        heuristicId,
        id
      )
    );
  }

  function onDimensionChange(dimension: 'width' | 'height', value: number) {
    const clampedValue = Math.max(5, Math.min(50, value));
    const newWidth = dimension === 'width' ? clampedValue : gridWidth;
    const newHeight = dimension === 'height' ? clampedValue : gridHeight;

    if (!isFinite(clampedValue) || clampedValue < 5) {
      return;
    }

    stopAuto();
    const startPos = new Position(0, 0);
    const endPos = new Position(newWidth - 1, newHeight - 1);
    const newStartNode = makeNode(startPos);
    const newEndNode = makeNode(endPos);
    const newGrid = generateGrid({
      width: newWidth,
      height: newHeight,
      startNode: newStartNode,
      endNode: newEndNode,
    });

    if (dimension === 'width') {
      setGridWidth(clampedValue);
    } else {
      setGridHeight(clampedValue);
    }

    setNewPathFinder(
      buildPathFinding(newGrid, startPos, endPos, movementCostId, heuristicId, totalCostId)
    );
  }

  function onNodeClick(node: Node) {
    if (interactionMode === null) {
      return;
    } else if (interactionMode === 'obstacle') {
      toggleNodeWalkability(node);
    } else if (interactionMode === 'start') {
      moveStart(node);
    } else if (interactionMode === 'end') {
      moveEnd(node);
    }
  }

  function toggleNodeWalkability(node: Node) {
    if (node === startNode || node === endNode) {
      return;
    }

    stopAuto();
    const newGrid = cloneGrid(grid);
    const targetNode = newGrid[node.position.y][node.position.x];
    targetNode.setWalkable(!targetNode.isWalkable());
    pathFinder.setGrid(newGrid);
    pathFinder.clear();
    setGrid(newGrid);
    setPath(pathFinder.getPath());
  }

  function moveStart(node: Node) {
    if (node.position.x === endNode.position.x && node.position.y === endNode.position.y) {
      return;
    }

    stopAuto();
    const newGrid = cloneGrid(grid);
    const newPos = new Position(node.position.x, node.position.y);
    setNewPathFinder(
      buildPathFinding(newGrid, newPos, endNode.position, movementCostId, heuristicId, totalCostId)
    );
  }

  function moveEnd(node: Node) {
    if (node.position.x === startNode.position.x && node.position.y === startNode.position.y) {
      return;
    }

    stopAuto();
    const newGrid = cloneGrid(grid);
    const newPos = new Position(node.position.x, node.position.y);
    setNewPathFinder(
      buildPathFinding(
        newGrid,
        startNode.position,
        newPos,
        movementCostId,
        heuristicId,
        totalCostId
      )
    );
  }

  function clearObstacles() {
    stopAuto();
    const newGrid = cloneGrid(grid);
    for (const row of newGrid) {
      for (const cell of row) {
        if (cell !== startNode && cell !== endNode) {
          cell.setWalkable(true);
        }
      }
    }
    pathFinder.setGrid(newGrid);
    pathFinder.clear();
    setGrid(newGrid);
    setPath(pathFinder.getPath());
  }

  function getNextGrid() {
    const nextPath = pathFinder.getNextStep();
    if (nextPath) {
      setPath(pathFinder.getPath());
    }
  }

  function reset() {
    stopAuto();
    const startPos = new Position(0, 0);
    const endPos = new Position(gridWidth - 1, gridHeight - 1);
    const newStartNode = makeNode(startPos);
    const newEndNode = makeNode(endPos);
    const newGrid = generateGrid({
      width: gridWidth,
      height: gridHeight,
      startNode: newStartNode,
      endNode: newEndNode,
    });
    setNewPathFinder(
      buildPathFinding(newGrid, startPos, endPos, movementCostId, heuristicId, totalCostId)
    );
  }

  function runAuto() {
    stopAuto();
    autoActive.current = true;
    interval.current = setInterval(() => {
      if (!autoActive.current) return;
      if (pathFinder.isEndReached()) {
        stopAuto();
      } else {
        getNextGrid();
      }
    }, 100);
  }

  return (
    <main className="main">
      <h1>Pathfinding Visualizer</h1>

      <div className="controls">
        <DimensionControls
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          onDimensionChange={onDimensionChange}
        />
        <StrategyControls
          movementCostId={movementCostId}
          heuristicId={heuristicId}
          totalCostId={totalCostId}
          onMovementCostChange={onMovementCostChange}
          onHeuristicChange={onHeuristicChange}
          onTotalCostChange={onTotalCostChange}
        />
      </div>

      <InteractionModeBar interactionMode={interactionMode} onModeChange={setInteractionMode} />

      <ActionButtons
        onRunAuto={runAuto}
        onNextStep={getNextGrid}
        onClearObstacles={clearObstacles}
        onReset={reset}
      />

      <Grid
        grid={grid}
        startNode={startNode}
        endNode={endNode}
        path={path}
        pathFinder={pathFinder}
        interactionMode={interactionMode}
        onNodeClick={onNodeClick}
      />
    </main>
  );
}
