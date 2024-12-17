// src/app/hooks/useTheme.ts
'use client';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useNextTheme();

  useEffect(() => {
    setMounted(true);
    // Set initial theme to dark if not already set
    if (!theme) {
      setTheme('dark');
    }
  }, [theme, setTheme]);

  // During server-side rendering or initial mount, assume dark theme
  if (!mounted) {
    return { theme: 'dark', setTheme };
  }

  return { theme, setTheme, systemTheme };
}