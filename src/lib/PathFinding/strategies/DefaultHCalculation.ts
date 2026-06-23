import { Node } from '@/entities';
import { HCalculationStrategy } from './HCalculationStrategy';

/**
 * Default heuristic calculation.
 * Uses Position.getDistance(), which computes squared Euclidean distance.
 * Backward compatible with the original hardcoded behavior.
 */
export class DefaultHCalculation implements HCalculationStrategy {
  calculate(node: Node, goalNode: Node): number {
    return node.position.getDistance(goalNode.position);
  }
}
