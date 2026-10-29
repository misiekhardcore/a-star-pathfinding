'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@konopskidev/ui/lib/utils';

import { Node } from '@/entities';
import { PathFinding } from '@/lib';
import { useGridPalette } from '@/theme/useGridPalette';
import type { InteractionMode } from '@/types';

const MIN_CELL_SIZE = 8;
const MAX_CELL_SIZE = 44;
/** Keeps a tall board from pushing the rest of the page off screen. */
const MAX_BOARD_HEIGHT = 560;
/** The canvas carries a 1px border on each side. */
const BORDER_WIDTH = 2;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const palette = useGridPalette();

  const gridWidth = grid[0]?.length ?? 0;
  const gridHeight = grid.length;
  const columns = Math.max(gridWidth, 1);
  const rows = Math.max(gridHeight, 1);

  /*
   * The board is sized by the column it sits in rather than by a fixed cell
   * size: a 50 × 50 grid used to render a 2000px-wide canvas and overflow the
   * page. Height is capped too, so a square board fits above the fold.
   */
  const fittedByWidth =
    availableWidth > 0 ? Math.floor((availableWidth - BORDER_WIDTH) / columns) : MAX_CELL_SIZE;
  const cellSize = Math.max(
    MIN_CELL_SIZE,
    Math.min(MAX_CELL_SIZE, fittedByWidth, Math.floor(MAX_BOARD_HEIGHT / rows))
  );
  const pixelWidth = gridWidth * cellSize;
  const pixelHeight = gridHeight * cellSize;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setAvailableWidth(entry.contentRect.width);
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(pixelWidth * dpr);
    canvas.height = Math.round(pixelHeight * dpr);
    canvas.style.width = `${pixelWidth}px`;
    canvas.style.height = `${pixelHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, pixelWidth, pixelHeight);
    ctx.fillStyle = palette.cell;
    ctx.fillRect(0, 0, pixelWidth, pixelHeight);

    // Hairlines first, so the cells sit on top of them.
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 1; x < gridWidth; x += 1) {
      const lineX = Math.round(x * cellSize) + 0.5;
      ctx.moveTo(lineX, 0);
      ctx.lineTo(lineX, pixelHeight);
    }

    for (let y = 1; y < gridHeight; y += 1) {
      const lineY = Math.round(y * cellSize) + 0.5;
      ctx.moveTo(0, lineY);
      ctx.lineTo(pixelWidth, lineY);
    }

    ctx.stroke();

    const pathKeys = new Set(path.map((node) => `${node.position.x},${node.position.y}`));
    // Cells below this size are painted as plain squares: a radius would blur
    // away and rounding 2500 rects costs more than it shows.
    const inset = cellSize > 10 ? 0.5 : 0;
    const radius = Math.min(3, cellSize * 0.12);

    for (let y = 0; y < gridHeight; y += 1) {
      for (let x = 0; x < gridWidth; x += 1) {
        const node = grid[y][x];
        let fill: string | null = null;

        if (node === startNode) {
          fill = palette.start;
        } else if (node === endNode) {
          fill = palette.end;
        } else if (pathKeys.has(`${x},${y}`)) {
          fill = palette.path;
        } else if (!node.isWalkable()) {
          fill = palette.obstacle;
        } else if (pathFinder.isPathNode(node)) {
          fill = palette.explored;
        }

        if (!fill) continue;

        const px = x * cellSize;
        const py = y * cellSize;
        ctx.fillStyle = fill;

        if (inset === 0) {
          ctx.fillRect(px, py, cellSize, cellSize);
        } else {
          ctx.beginPath();
          ctx.roundRect(px + inset, py + inset, cellSize - inset * 2, cellSize - inset * 2, radius);
          ctx.fill();
        }
      }
    }

    if (hoveredCell) {
      const px = hoveredCell.x * cellSize;
      const py = hoveredCell.y * cellSize;
      ctx.fillStyle = palette.hover;

      if (inset === 0) {
        ctx.fillRect(px, py, cellSize, cellSize);
      } else {
        ctx.beginPath();
        ctx.roundRect(px + inset, py + inset, cellSize - inset * 2, cellSize - inset * 2, radius);
        ctx.fill();
      }
    }
  }, [
    grid,
    gridWidth,
    gridHeight,
    startNode,
    endNode,
    path,
    pathFinder,
    hoveredCell,
    palette,
    cellSize,
    pixelWidth,
    pixelHeight,
  ]);

  const getCellFromMouse = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas || pixelWidth === 0 || pixelHeight === 0) return null;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      const scaleX = pixelWidth / rect.width;
      const scaleY = pixelHeight / rect.height;
      const x = Math.floor(((clientX - rect.left) * scaleX) / cellSize);
      const y = Math.floor(((clientY - rect.top) * scaleY) / cellSize);

      if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return null;
      return { x, y };
    },
    [gridWidth, gridHeight, pixelWidth, pixelHeight, cellSize]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromMouse(event.clientX, event.clientY);
      if (cell) {
        onNodeClick(grid[cell.y][cell.x]);
      }
    },
    [getCellFromMouse, grid, onNodeClick]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      setHoveredCell(getCellFromMouse(event.clientX, event.clientY));
    },
    [getCellFromMouse]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  return (
    <div ref={containerRef} className="flex w-full justify-center">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Pathfinding grid with ${gridWidth} columns and ${gridHeight} rows`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'touch-none rounded-sm border border-border shadow-sm select-none',
          interactionMode ? 'cursor-crosshair' : 'cursor-default'
        )}
      />
    </div>
  );
}
