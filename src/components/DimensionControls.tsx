'use client';

import { Field, FieldLabel } from '@konopskidev/ui/components/field';
import { Slider } from '@konopskidev/ui/components/slider';

import { MAX_DIMENSION, MIN_DIMENSION } from '@/lib/grid-utils';

import { Panel } from './Panel';

interface DimensionControlsProps {
  gridWidth: number;
  gridHeight: number;
  onDimensionChange: (dimension: 'width' | 'height', value: number) => void;
}

export function DimensionControls({
  gridWidth,
  gridHeight,
  onDimensionChange,
}: DimensionControlsProps) {
  return (
    <Panel title="Grid size" description="Resize the board. Every change re-rolls the obstacles.">
      <DimensionSlider
        id="grid-width"
        label="Columns"
        value={gridWidth}
        onChange={(value) => onDimensionChange('width', value)}
      />
      <DimensionSlider
        id="grid-height"
        label="Rows"
        value={gridHeight}
        onChange={(value) => onDimensionChange('height', value)}
      />
    </Panel>
  );
}

interface DimensionSliderProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/**
 * A dimension slider with a mono readout.
 *
 * The name lives on the thumb, which is what takes focus, so a screen reader
 * announces "Columns, 25" rather than an unnamed slider. The label therefore
 * carries no `htmlFor`: a slider's root is not a labelable form element, and
 * `name` reaches the hidden input Radix renders for form submissions.
 */
function DimensionSlider({ id, label, value, onChange }: DimensionSliderProps) {
  return (
    <Field className="gap-2">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>{label}</FieldLabel>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{value}</span>
      </div>
      <Slider
        id={id}
        name={id}
        aria-label={label}
        thumbLabels={[label]}
        min={MIN_DIMENSION}
        max={MAX_DIMENSION}
        step={1}
        value={[value]}
        onValueChange={([nextValue]) => onChange(nextValue)}
      />
    </Field>
  );
}
