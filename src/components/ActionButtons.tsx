'use client';

import { EraserIcon, PlayIcon, RotateCcwIcon, StepForwardIcon } from 'lucide-react';

import { Button } from '@konopskidev/ui/components/button';

interface ActionButtonsProps {
  onRunAuto: () => void;
  onNextStep: () => void;
  onClearObstacles: () => void;
  onReset: () => void;
}

export function ActionButtons({
  onRunAuto,
  onNextStep,
  onClearObstacles,
  onReset,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <Button onClick={onRunAuto} className="sm:flex-1">
        <PlayIcon />
        Run auto
      </Button>
      <Button variant="outline" onClick={onNextStep} className="sm:flex-1">
        <StepForwardIcon />
        Next step
      </Button>
      <Button variant="ghost" onClick={onClearObstacles}>
        <EraserIcon />
        Clear obstacles
      </Button>
      <Button variant="outline" onClick={onReset}>
        <RotateCcwIcon />
        Reset
      </Button>
    </div>
  );
}
