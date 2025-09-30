import { Node } from '@/entities';
import { HCalculationStrategy } from '../interfaces';

export class DefaultHCalculation implements HCalculationStrategy {
  calculate(node: Node, goalNode: Node): number {
    return node.position.getDistance(goalNode.position);
  }
}
