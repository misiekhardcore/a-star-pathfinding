'use client';

import { Badge } from '@konopskidev/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@konopskidev/ui/components/card';
import { Separator } from '@konopskidev/ui/components/separator';

import { Node } from '@/entities';
import { PathFinding } from '@/lib';
import type { InteractionMode } from '@/types';

import { ActionButtons } from './ActionButtons';
import { Grid } from './Grid';
import { InteractionModeBar } from './InteractionModeBar';

const LEGEND = [
  { label: 'Start', token: '--grid-start' },
  { label: 'End', token: '--grid-end' },
  { label: 'Path', token: '--grid-path' },
  { label: 'Explored', token: '--grid-explored' },
  { label: 'Obstacle', token: '--grid-obstacle' },
];

interface VisualizerPanelProps {
  grid: Node[][];
  startNode: Node;
  endNode: Node;
  path: Node[];
  pathFinder: PathFinding;
  interactionMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
  onNodeClick: (node: Node) => void;
  onRunAuto: () => void;
  onNextStep: () => void;
  onClearObstacles: () => void;
  onReset: () => void;
}

/**
 * The board and everything that acts on it.
 *
 * Keeping the draw mode and the run controls in the same card as the grid means
 * the thing you click and the switch that decides what clicking does never drift
 * apart, and the legend stays in view while the search runs.
 */
export function VisualizerPanel({
  grid,
  startNode,
  endNode,
  path,
  pathFinder,
  interactionMode,
  onModeChange,
  onNodeClick,
  onRunAuto,
  onNextStep,
  onClearObstacles,
  onReset,
}: VisualizerPanelProps) {
  const gridWidth = grid[0]?.length ?? 0;
  const gridHeight = grid.length;

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <CardTitle role="heading" aria-level={2}>
            Grid
          </CardTitle>
          <CardDescription>
            {gridWidth} × {gridHeight} cells. Choose a tool, then click a cell to use it.
          </CardDescription>
        </div>
        {path.length > 0 ? (
          <div className="shrink-0">
            <Badge variant="secondary">{path.length} nodes</Badge>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Grid
          grid={grid}
          startNode={startNode}
          endNode={endNode}
          path={path}
          pathFinder={pathFinder}
          interactionMode={interactionMode}
          onNodeClick={onNodeClick}
        />

        <ul aria-label="Grid legend" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {LEGEND.map(({ label, token }) => (
            <li key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                aria-hidden
                className="size-3 rounded-sm border border-border"
                style={{ backgroundColor: `var(${token})` }}
              />
              {label}
            </li>
          ))}
        </ul>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="eyebrow">Draw mode</span>
          <InteractionModeBar interactionMode={interactionMode} onModeChange={onModeChange} />
        </div>

        <Separator />

        <ActionButtons
          onRunAuto={onRunAuto}
          onNextStep={onNextStep}
          onClearObstacles={onClearObstacles}
          onReset={onReset}
        />
      </CardContent>
    </Card>
  );
}
