import { FCalculationStrategy } from '../interfaces';

/**
 * Weighted F calculation that emphasizes the heuristic more heavily
 * This can make the search faster but potentially less optimal
 */
export class WeightedFCalculation implements FCalculationStrategy {
  constructor(private weight: number = 1.5) {}

  calculate(g: number, h: number): number {
    return g + h * this.weight;
  }
}
