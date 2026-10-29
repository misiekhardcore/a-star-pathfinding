'use client';

import { useEffect, useState } from 'react';

/**
 * Canvas colours for the grid.
 *
 * They come from the `--grid-*` tokens in `src/app/globals.css`, so light and
 * dark stay in one place. The values are hex because the canvas API cannot
 * parse the design system's referenced tokens.
 */
export interface GridPalette {
  cell: string;
  line: string;
  start: string;
  end: string;
  path: string;
  explored: string;
  obstacle: string;
  hover: string;
}

const TOKENS: Record<keyof GridPalette, string> = {
  cell: '--grid-cell',
  line: '--grid-line',
  start: '--grid-start',
  end: '--grid-end',
  path: '--grid-path',
  explored: '--grid-explored',
  obstacle: '--grid-obstacle',
  hover: '--grid-hover',
};

/** Mirrors the light values, and covers the first render before tokens are read. */
const FALLBACK: GridPalette = {
  cell: '#ffffff',
  line: '#e1e4e7',
  start: '#1f7a4d',
  end: '#b4362f',
  path: '#1f4fa3',
  explored: '#1f4fa31f',
  obstacle: '#5d6670',
  hover: '#00000014',
};

function readPalette(): GridPalette {
  const styles = getComputedStyle(document.documentElement);
  const palette = { ...FALLBACK };

  for (const key of Object.keys(TOKENS) as (keyof GridPalette)[]) {
    const value = styles.getPropertyValue(TOKENS[key]).trim();

    if (value) {
      palette[key] = value;
    }
  }

  return palette;
}

/**
 * Re-read the palette whenever the scheme changes.
 *
 * The scheme lives in the `dark` class on `<html>`, so watching that attribute
 * catches both the theme toggle and an OS preference change, and does not
 * depend on the provider's effects running in a particular order.
 */
export function useGridPalette(): GridPalette {
  const [palette, setPalette] = useState<GridPalette>(FALLBACK);

  useEffect(() => {
    const root = document.documentElement;

    const update = () => setPalette(readPalette());
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return palette;
}
