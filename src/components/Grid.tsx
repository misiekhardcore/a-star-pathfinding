'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Node } from '@/entities';
import { PathFinding } from '@/lib';
import type { InteractionMode } from '@/types';

const CELL_SIZE = 40;

interface GridProps {
  grid: Node[][];
  startNode: Node;
  endNode: Node;
  path: Node[];
  pathFinder: PathFinding;
  interactionMode: InteractionMode;
  onNodeClick: (node: Node) => void;
}

export function Grid({
  grid,
  startNode,
  endNode,
  path,
  pathFinder,
  interactionMode,
  onNodeClick,
}: GridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  const gridWidth = grid[0]?.length ?? 0;
  const gridHeight = grid.length;
  const pixelWidth = gridWidth * CELL_SIZE;
  const pixelHeight = gridHeight * CELL_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = pixelWidth * dpr;
    canvas.height = pixelHeight * dpr;
    canvas.style.width = `${pixelWidth}px`;
    canvas.style.height = `${pixelHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isEndReached = pathFinder.isEndReached();
    const pathSet = new Set(path.map((n) => `${n.position.x},${n.position.y}`));

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const node = grid[y][x];
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        const isObstacle = !node.isWalkable();
        const isStart = node === startNode;
        const isEnd = node === endNode;
        const isOnPath = pathSet.has(`${x},${y}`);
        const isVisited = isEndReached && pathFinder.isPathNode(node);

        // Fill cell (priority: default < obstacle < start < end < on-path < visited)
        let bgColor = '';
        let text = '';
        let textColor = 'white';

        if (isVisited) {
          bgColor = '#ffff00';
          textColor = 'black';
        } else if (isOnPath) {
          bgColor = '#800080';
          textColor = 'white';
        } else if (isEnd) {
          bgColor = '#ff0000';
          textColor = 'white';
        } else if (isStart) {
          bgColor = '#008000';
          textColor = 'white';
        } else if (isObstacle) {
          bgColor = '#000080';
          textColor = 'white';
        }

        if (bgColor) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        }

        // Grid line (border)
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);

        // Text label (priority: obstacle X > start S > end E > path P)
        if (isObstacle) {
          text = 'X';
        } else if (isStart) {
          text = 'S';
        } else if (isEnd) {
          text = 'E';
        } else if (isOnPath && !isVisited) {
          text = 'P';
        }

        if (text) {
          ctx.fillStyle = textColor;
          ctx.font = 'bold 0.75rem monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
        }
      }
    }

    // Hover overlay
    if (hoveredCell) {
      const { x, y } = hoveredCell;
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;
      ctx.fillStyle =
        interactionMode !== null ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
    }
  }, [
    grid,
    gridWidth,
    gridHeight,
    pixelWidth,
    pixelHeight,
    startNode,
    endNode,
    path,
    pathFinder,
    hoveredCell,
    interactionMode,
  ]);

  const getCellFromMouse = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = pixelWidth / rect.width;
      const scaleY = pixelHeight / rect.height;
      const x = Math.floor(((clientX - rect.left) * scaleX) / CELL_SIZE);
      const y = Math.floor(((clientY - rect.top) * scaleY) / CELL_SIZE);

      if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return null;
      return { x, y };
    },
    [gridWidth, gridHeight, pixelWidth, pixelHeight]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromMouse(e.clientX, e.clientY);
      if (cell) {
        onNodeClick(grid[cell.y][cell.x]);
      }
    },
    [getCellFromMouse, grid, onNodeClick]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setHoveredCell(getCellFromMouse(e.clientX, e.clientY));
    },
    [getCellFromMouse]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  const cursorClass = interactionMode !== null ? 'placement-mode' : '';

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`grid-canvas ${cursorClass}`}
    />
  );
}
