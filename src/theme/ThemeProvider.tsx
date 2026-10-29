'use client';

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { THEME_STORAGE_KEY } from './theme-storage';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

interface ThemeContextValue {
  /** The user's choice. `system` follows the OS preference. */
  theme: Theme;
  /** The scheme actually in effect, with `system` already resolved. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // Private mode or blocked storage: fall back to the OS preference.
  }

  return 'system';
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;

  return window.matchMedia(DARK_QUERY).matches;
}

/** Dark mode is the `.dark` class on `<html>`, as the design system expects. */
function applyTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle('dark', resolvedTheme === 'dark');
  root.style.colorScheme = resolvedTheme;
}

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Holds the light / system / dark choice for the whole app.
 *
 * The first paint is already correct because the inline script in `<body>`
 * applies the stored theme before React hydrates; this provider then takes
 * over, and only starts reading storage after mount so the server and client
 * markup agree.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeChoice, setThemeChoice] = useState<Theme>('system');
  const [systemPrefersDarkState, setSystemPrefersDarkState] = useState(false);

  useEffect(() => {
    setThemeChoice(readStoredTheme());
    setSystemPrefersDarkState(systemPrefersDark());
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;

    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => setSystemPrefersDarkState(event.matches);

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    themeChoice === 'system' ? (systemPrefersDarkState ? 'dark' : 'light') : themeChoice;

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeChoice(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Persisting is a nicety; the current session still switches.
    }
  }, []);

  const value = useMemo(
    () => ({ theme: themeChoice, resolvedTheme, setTheme }),
    [themeChoice, resolvedTheme, setTheme]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
