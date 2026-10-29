import { THEME_STORAGE_KEY } from './theme-storage';

/**
 * Applies the stored theme before the first paint.
 *
 * This is the only inline script in the app. It runs synchronously, before the
 * page content renders, so a dark-mode visitor never sees a light flash while
 * React hydrates. `ThemeProvider` keeps it in sync afterwards.
 */
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s==='dark'||((s===null||s==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
