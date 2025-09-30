import { Node } from '@/entities';
import { GCalculationStrategy } from '../interfaces';

export class DefaultGCalculation implements GCalculationStrategy {
  calculate(current: Node, neighbor: Node): number {
    return neighbor.getDistance(current);
  }
}
