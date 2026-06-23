import { Node } from '@/entities';
import { HCalculationStrategy } from './HCalculationStrategy';

/**
 * Manhattan distance heuristic.
 * Computes |dx| + |dy|, suitable for grid-based movement
 * where only cardinal moves are allowed.
 */
export class ManhattanHCalculation implements HCalculationStrategy {
  calculate(node: Node, goalNode: Node): number {
    return (
      Math.abs(node.position.x - goalNode.position.x) +
      Math.abs(node.position.y - goalNode.position.y)
    );
  }
}
