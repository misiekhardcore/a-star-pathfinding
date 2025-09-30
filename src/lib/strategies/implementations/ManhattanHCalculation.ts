import { Node } from '@/entities';
import { HCalculationStrategy } from '../interfaces';

/**
 * Manhattan distance heuristic - alternative to Euclidean distance
 * More suitable for grid-based pathfinding where diagonal movement has the same cost
 */
export class ManhattanHCalculation implements HCalculationStrategy {
  calculate(node: Node, goalNode: Node): number {
    return (
      Math.abs(node.position.x - goalNode.position.x) +
      Math.abs(node.position.y - goalNode.position.y)
    );
  }
}
