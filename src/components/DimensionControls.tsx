'use client';

import { MIN_DIMENSION, MAX_DIMENSION } from '@/lib/grid-utils';

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
    <>
      <div className="control-group">
        <label htmlFor="grid-width">Width:</label>
        <input
          id="grid-width"
          type="number"
          min={MIN_DIMENSION}
          max={MAX_DIMENSION}
          value={gridWidth}
          onChange={(e) => onDimensionChange('width', Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="grid-height">Height:</label>
        <input
          id="grid-height"
          type="number"
          min={MIN_DIMENSION}
          max={MAX_DIMENSION}
          value={gridHeight}
          onChange={(e) => onDimensionChange('height', Number(e.target.value))}
        />
      </div>
    </>
  );
}
