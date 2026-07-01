'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type ViewMode = 'normal' | 'tv' | 'presentation';

interface ThemeContextType {
  theme: Theme;
  viewMode: ViewMode;
  setTheme: (theme: Theme) => void;
  setViewMode: (mode: ViewMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [viewMode, setViewMode] = useState<ViewMode>('normal');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('tv-mode', 'presentation-mode');
    if (viewMode === 'tv') {
      root.classList.add('tv-mode');
    } else if (viewMode === 'presentation') {
      root.classList.add('presentation-mode');
    }
  }, [viewMode]);

  return (
    <ThemeContext.Provider value={{ theme, viewMode, setTheme, setViewMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
