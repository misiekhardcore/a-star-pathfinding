'use client';

import { INTERACTION_MODES } from '@/lib/grid-utils';
import type { InteractionMode } from '@/types';

interface InteractionModeBarProps {
  interactionMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
}

export function InteractionModeBar({ interactionMode, onModeChange }: InteractionModeBarProps) {
  return (
    <div className="interaction-modes">
      {INTERACTION_MODES.map((mode) => (
        <button
          key={mode.id}
          className={`mode-btn ${interactionMode === mode.id ? 'active' : ''}`}
          onClick={() => onModeChange(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
