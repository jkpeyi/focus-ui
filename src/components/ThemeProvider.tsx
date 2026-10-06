import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  /** The theme actually applied after resolving `system`. */
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  /** localStorage key used to persist the choice. Set to `null` to disable persistence. */
  storageKey?: string | null;
}

function readStored(key: string | null): ThemeMode | null {
  if (!key) return null;
  try {
    const v = localStorage.getItem(key);
    return v === 'light' || v === 'dark' || v === 'system' ? v : null;
  } catch {
    return null;
  }
}

/** Applies `.dark` on <html> based on the chosen mode and the OS preference. */
export function ThemeProvider({ children, defaultMode = 'system', storageKey = 'focus-ui-theme' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    typeof window === 'undefined' ? defaultMode : (readStored(storageKey) ?? defaultMode),
  );
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemDark(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);

  const value = useMemo(
    () => ({
      mode,
      resolved,
      setMode: (next: ThemeMode) => {
        setModeState(next);
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, next);
          } catch {
            /* storage unavailable */
          }
        }
      },
    }),
    [mode, resolved, storageKey],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
