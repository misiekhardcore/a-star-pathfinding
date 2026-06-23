import { FCalculationStrategy } from './FCalculationStrategy';

/**
 * Additive f(n) = g(n) + h(n) calculation.
 * Backward compatible with the original hardcoded behavior.
 */
export class AdditiveFCalculation implements FCalculationStrategy {
  calculate(g: number, h: number): number {
    return g + h;
  }
}
