'use client';

import { FlagIcon, PenLineIcon, PlayIcon } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@konopskidev/ui/components/toggle-group';

import { INTERACTION_MODES } from '@/lib/grid-utils';
import type { InteractionMode } from '@/types';

const MODE_ICONS = {
  obstacle: PenLineIcon,
  start: PlayIcon,
  end: FlagIcon,
} as const;

interface InteractionModeBarProps {
  interactionMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
}

/**
 * Draw-mode switch for the board.
 *
 * A single-choice toggle group, so the active tool is announced as pressed and
 * clicking it again clears the selection — the same behaviour as before, now
 * with the state visible on the control itself.
 */
export function InteractionModeBar({ interactionMode, onModeChange }: InteractionModeBarProps) {
  return (
    <ToggleGroup
      aria-label="Draw mode"
      type="single"
      variant="outline"
      size="sm"
      spacing={0}
      className="w-full flex-wrap justify-start"
      value={interactionMode ?? ''}
      onValueChange={(value) => onModeChange(value ? (value as InteractionMode) : null)}
    >
      {INTERACTION_MODES.map((mode) => {
        const Icon = MODE_ICONS[mode.id];

        return (
          <ToggleGroupItem key={mode.id} value={mode.id}>
            <Icon />
            {mode.label}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
