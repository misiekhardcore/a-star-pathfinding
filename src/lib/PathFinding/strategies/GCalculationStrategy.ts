import { Node } from '@/entities';

export interface GCalculationStrategy {
  calculate(from: Node, to: Node): number;
}
