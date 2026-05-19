/**
 * @file lib/use-store-theme.ts
 * @description Custom hook for managing store theme selection and persistence
 * 
 * Handles:
 * - Theme loading from localStorage
 * - Theme persistence
 * - Theme validation
 * - Theme switching
 */

import { useState, useEffect, useCallback } from 'react';
import { ThemeId, ThemeConfig, getTheme, THEMES } from './themes';

const THEME_STORAGE_KEY = 'selectedTheme';
const DEFAULT_THEME: ThemeId = 'modern';

interface UseStoreThemeReturn {
  theme: ThemeConfig;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  isLoaded: boolean;
}

/**
 * Hook to manage store theme selection with persistence
 * 
 * Usage:
 * const { theme, themeId, setTheme, isLoaded } = useStoreTheme();
 * 
 * @returns Object with current theme, theme ID, setter function, and loaded state
 */
export function useStoreTheme(): UseStoreThemeReturn {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    
    // Validate that saved theme exists in THEMES registry
    if (savedThemeId && savedThemeId in THEMES) {
      setThemeId(savedThemeId);
    } else {
      setThemeId(DEFAULT_THEME);
    }
    
    setIsLoaded(true);
  }, []);

  // Update theme and persist to localStorage
  const handleSetTheme = useCallback((newThemeId: ThemeId) => {
    if (newThemeId in THEMES) {
      setThemeId(newThemeId);
      localStorage.setItem(THEME_STORAGE_KEY, newThemeId);
      
      // Optional: Trigger custom event for theme changes
      const event = new CustomEvent('themeChanged', { detail: { themeId: newThemeId } });
      window.dispatchEvent(event);
    }
  }, []);

  const theme = getTheme(themeId);

  return {
    theme,
    themeId,
    setTheme: handleSetTheme,
    isLoaded,
  };
}

/**
 * Get theme by ID with validation
 * Safe utility function for theme retrieval
 */
export function getValidTheme(themeId: string): ThemeConfig {
  if (themeId in THEMES) {
    return THEMES[themeId as ThemeId];
  }
  return THEMES[DEFAULT_THEME];
}

/**
 * Check if a theme ID is valid
 */
export function isValidThemeId(themeId: string): themeId is ThemeId {
  return themeId in THEMES;
}
