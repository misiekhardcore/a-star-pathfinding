/**
 * Storage key for the theme choice.
 *
 * It lives in a module without `'use client'` on purpose: the inline
 * `ThemeScript` is rendered by the server, and a value imported from a client
 * module reaches it as a client reference instead of the string, which turns
 * the generated script into a syntax error.
 */
export const THEME_STORAGE_KEY = 'a-star-theme';
