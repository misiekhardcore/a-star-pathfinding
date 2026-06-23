import { Node } from '@/entities';
import { GCalculationStrategy } from './GCalculationStrategy';

/**
 * Movement cost calculation for 8-directional grids with equal diagonal cost.
 * Uses Node.getDistance(), which computes a Manhattan-like distance
 * with diagonal compression (distance=2 → 1, treating diagonal moves as 1 step).
 * Backward compatible with the original hardcoded behavior.
 */
export class DiagonalGCalculation implements GCalculationStrategy {
  calculate(from: Node, to: Node): number {
    return to.getDistance(from);
  }
}
