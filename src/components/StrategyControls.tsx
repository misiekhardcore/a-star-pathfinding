'use client';

import { Field, FieldDescription, FieldLabel } from '@konopskidev/ui/components/field';
import { NativeSelect, NativeSelectOption } from '@konopskidev/ui/components/native-select';

import {
  HEURISTIC_STRATEGIES,
  MOVEMENT_COST_STRATEGIES,
  TOTAL_COST_STRATEGIES,
} from '@/lib/grid-utils';
import type { HeuristicStrategyId, MovementCostStrategyId, TotalCostStrategyId } from '@/types';

import { Panel } from './Panel';

interface StrategyControlsProps {
  movementCostId: MovementCostStrategyId;
  heuristicId: HeuristicStrategyId;
  totalCostId: TotalCostStrategyId;
  onMovementCostChange: (id: MovementCostStrategyId) => void;
  onHeuristicChange: (id: HeuristicStrategyId) => void;
  onTotalCostChange: (id: TotalCostStrategyId) => void;
}

/**
 * One-line explanations of what each strategy changes about the search.
 *
 * They live here rather than beside the strategy wiring: the algorithm only
 * needs the factories, while these are copy for the panel.
 */
const STRATEGY_HINTS: Record<string, string> = {
  diagonal: 'A diagonal step costs the same as an orthogonal one.',
  squaredEuclidean:
    'Squared distance to the goal. Fast, but can settle on a slightly longer route.',
  manhattan: 'Grid-aligned distance to the goal. Steady and predictable on open boards.',
  additive: 'f(n) = g(n) + h(n), the textbook estimate.',
  weighted:
    'The heuristic counts 1.5×, so the search reaches the goal sooner but can miss the optimal path.',
};

export function StrategyControls({
  movementCostId,
  heuristicId,
  totalCostId,
  onMovementCostChange,
  onHeuristicChange,
  onTotalCostChange,
}: StrategyControlsProps) {
  return (
    <Panel
      title="Algorithm"
      description="How the next node is chosen. Each choice changes the route the search takes."
    >
      <Field>
        <FieldLabel htmlFor="movement-cost-strategy">Movement cost</FieldLabel>
        <NativeSelect
          id="movement-cost-strategy"
          className="w-full"
          value={movementCostId}
          onChange={(event) => onMovementCostChange(event.target.value as MovementCostStrategyId)}
        >
          {MOVEMENT_COST_STRATEGIES.map((strategy) => (
            <NativeSelectOption key={strategy.id} value={strategy.id}>
              {strategy.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <FieldDescription>{STRATEGY_HINTS[movementCostId]}</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="heuristic-strategy">Heuristic</FieldLabel>
        <NativeSelect
          id="heuristic-strategy"
          className="w-full"
          value={heuristicId}
          onChange={(event) => onHeuristicChange(event.target.value as HeuristicStrategyId)}
        >
          {HEURISTIC_STRATEGIES.map((strategy) => (
            <NativeSelectOption key={strategy.id} value={strategy.id}>
              {strategy.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <FieldDescription>{STRATEGY_HINTS[heuristicId]}</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="total-cost-strategy">Total cost</FieldLabel>
        <NativeSelect
          id="total-cost-strategy"
          className="w-full"
          value={totalCostId}
          onChange={(event) => onTotalCostChange(event.target.value as TotalCostStrategyId)}
        >
          {TOTAL_COST_STRATEGIES.map((strategy) => (
            <NativeSelectOption key={strategy.id} value={strategy.id}>
              {strategy.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <FieldDescription>{STRATEGY_HINTS[totalCostId]}</FieldDescription>
      </Field>
    </Panel>
  );
}
