import { FCalculationStrategy } from './FCalculationStrategy';

/**
 * Weighted f(n) = g(n) + weight * h(n) calculation.
 * Higher weight values make the search more greedy (faster but potentially less optimal).
 * Weight < 1 makes the search more thorough (slower but more optimal).
 */
export class WeightedFCalculation implements FCalculationStrategy {
  constructor(private readonly weight: number = 1) {}

  calculate(g: number, h: number): number {
    return g + this.weight * h;
  }
}
