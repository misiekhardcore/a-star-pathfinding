'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@konopskidev/ui/components/toggle-group';

import { useTheme, type Theme } from '@/theme/ThemeProvider';

const THEME_OPTIONS: { value: Theme; label: string; Icon: typeof SunIcon }[] = [
  { value: 'light', label: 'Light theme', Icon: SunIcon },
  { value: 'system', label: 'System theme', Icon: MonitorIcon },
  { value: 'dark', label: 'Dark theme', Icon: MoonIcon },
];

/**
 * Segmented light / system / dark switch.
 *
 * The options carry no tooltips: a tooltip trigger wrapper would replace the
 * toggle's `data-state` and leave the control showing no active selection.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      aria-label="Color theme"
      type="single"
      variant="outline"
      size="sm"
      spacing={0}
      value={theme}
      onValueChange={(value) => value && setTheme(value as Theme)}
    >
      {THEME_OPTIONS.map(({ value, label, Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label} title={label}>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
