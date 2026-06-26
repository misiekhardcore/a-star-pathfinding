'use client';

import {
  HEURISTIC_STRATEGIES,
  MOVEMENT_COST_STRATEGIES,
  TOTAL_COST_STRATEGIES,
} from '@/lib/grid-utils';
import type { HeuristicStrategyId, MovementCostStrategyId, TotalCostStrategyId } from '@/types';

interface StrategyControlsProps {
  movementCostId: MovementCostStrategyId;
  heuristicId: HeuristicStrategyId;
  totalCostId: TotalCostStrategyId;
  onMovementCostChange: (id: MovementCostStrategyId) => void;
  onHeuristicChange: (id: HeuristicStrategyId) => void;
  onTotalCostChange: (id: TotalCostStrategyId) => void;
}

export function StrategyControls({
  movementCostId,
  heuristicId,
  totalCostId,
  onMovementCostChange,
  onHeuristicChange,
  onTotalCostChange,
}: StrategyControlsProps) {
  return (
    <>
      <div className="control-group">
        <label htmlFor="movement-cost-strategy">Movement cost:</label>
        <select
          id="movement-cost-strategy"
          value={movementCostId}
          onChange={(e) => onMovementCostChange(e.target.value as MovementCostStrategyId)}
        >
          {MOVEMENT_COST_STRATEGIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="heuristic-strategy">Heuristic:</label>
        <select
          id="heuristic-strategy"
          value={heuristicId}
          onChange={(e) => onHeuristicChange(e.target.value as HeuristicStrategyId)}
        >
          {HEURISTIC_STRATEGIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="total-cost-strategy">Total cost:</label>
        <select
          id="total-cost-strategy"
          value={totalCostId}
          onChange={(e) => onTotalCostChange(e.target.value as TotalCostStrategyId)}
        >
          {TOTAL_COST_STRATEGIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
