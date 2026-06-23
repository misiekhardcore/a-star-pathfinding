import { FCalculationStrategy } from './FCalculationStrategy';

/**
 * Default f(n) = g(n) + h(n) calculation.
 * Backward compatible with the original hardcoded behavior.
 */
export class DefaultFCalculation implements FCalculationStrategy {
  calculate(g: number, h: number): number {
    return g + h;
  }
}
