import { Node } from '@/entities';

export interface HCalculationStrategy {
  calculate(node: Node, goalNode: Node): number;
}
