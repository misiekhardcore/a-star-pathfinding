'use client';

import { Node } from '@/entities';
import { PathFinding } from '@/lib';
import type { InteractionMode } from '@/types';

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
  return (
    <div className="grid">
      {grid.map((row, y) => (
        <div key={y} className="row">
          {row.map((node, x) => {
            const isStart = node === startNode;
            const isEnd = node === endNode;
            const isPathNode = path.includes(node);
            const isEndReached = pathFinder.isEndReached();
            const classNames = [
              'node',
              !node.isWalkable() ? 'obstacle' : '',
              isStart ? 'start' : '',
              isEnd ? 'end' : '',
              isEndReached && pathFinder.isPathNode(node) ? 'visited' : '',
              isPathNode ? 'on-path' : '',
              interactionMode !== 'obstacle' && interactionMode !== null ? 'placement-mode' : '',
            ]
              .filter(Boolean)
              .join(' ');

            const displayText = !node.isWalkable()
              ? 'X'
              : isStart
                ? 'S'
                : isEnd
                  ? 'E'
                  : isPathNode
                    ? 'P'
                    : '';

            return (
              <div key={x} className={classNames} onClick={() => onNodeClick(node)}>
                {displayText}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
