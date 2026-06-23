import { Node } from '@/entities';
import { HCalculationStrategy } from './HCalculationStrategy';

/**
 * Heuristic calculation using squared Euclidean distance (dx² + dy²).
 * Uses Position.getDistance().
 * Backward compatible with the original hardcoded behavior.
 */
export class SquaredEuclideanHCalculation implements HCalculationStrategy {
  calculate(node: Node, goalNode: Node): number {
    return node.position.getDistance(goalNode.position);
  }
}
