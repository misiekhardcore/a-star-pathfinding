import { Node } from '@/entities';

export interface GCalculationStrategy {
  calculate(current: Node, neighbor: Node): number;
}
