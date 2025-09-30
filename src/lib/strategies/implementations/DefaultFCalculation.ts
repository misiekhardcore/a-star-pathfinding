import { FCalculationStrategy } from '../interfaces';

export class DefaultFCalculation implements FCalculationStrategy {
  calculate(g: number, h: number): number {
    return g + h;
  }
}
