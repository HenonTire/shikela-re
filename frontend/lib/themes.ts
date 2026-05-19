/**
 * @file lib/themes.ts
 * @description Theme configuration system for Shikela store
 * 
 * Provides a modular, scalable theming system with complete layout configurations,
 * color schemes, typography, and spacing for professional store aesthetics.
 * 
 * Themes are defined with:
 * - Color tokens (primary, secondary, accent, neutral)
 * - Typography specifications (fonts, sizes, weights)
 * - Layout configurations (spacing, component styles)
 * - Visual characteristics (gradients, shadows, borders)
 */

export type ThemeId = 'modern' | 'minimal' | 'elegant';

export interface ThemeColor {
  primary: string;
  secondary: string;
  accent: string;
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: string;
  warning: string;
  error: string;
}

export interface ThemeTypography {
  heading1: {
    size: string;
    weight: string;
    lineHeight: string;
  };
  heading2: {
    size: string;
    weight: string;
    lineHeight: string;
  };
  body: {
    size: string;
    weight: string;
    lineHeight: string;
  };
  caption: {
    size: string;
    weight: string;
    lineHeight: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  colors: ThemeColor;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  header: {
    bgClass: string;
    textClass: string;
    gradientClass: string;
    shadowClass: string;
  };
  card: {
    bgClass: string;
    borderClass: string;
    shadowClass: string;
  };
  button: {
    primaryClass: string;
    secondaryClass: string;
    accentClass: string;
  };
  footer: {
    bgClass: string;
    textClass: string;
    gradientClass: string;
  };
  page: {
    bgClass: string;
  };
  preview: {
    gradient: string; // For dashboard preview
    colors: [string, string]; // Primary and secondary preview colors
  };
}

/**
 * MODERN THEME - Contemporary design with vibrant teal and green gradient
 * Perfect for: Tech-savvy audience, modern fashion, SaaS products
 * Character: Fresh, energetic, forward-thinking
 */
export const modernTheme: ThemeConfig = {
  id: 'modern',
  name: 'Modern',
  description: 'Contemporary design with vibrant gradients and clean layouts',
  colors: {
    primary: '#14b8a6', // teal-500
    secondary: '#10b981', // emerald-500
    accent: '#0891b2', // cyan-600
    neutral: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#134e4a',
      900: '#0f2f2e',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  typography: {
    heading1: { size: '32px', weight: '700', lineHeight: '1.2' },
    heading2: { size: '24px', weight: '600', lineHeight: '1.3' },
    body: { size: '16px', weight: '400', lineHeight: '1.6' },
    caption: { size: '14px', weight: '500', lineHeight: '1.4' },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  header: {
    bgClass: 'bg-gradient-to-r from-teal-500 to-emerald-500',
    textClass: 'text-white',
    gradientClass: 'from-teal-400 to-emerald-400',
    shadowClass: 'shadow-lg',
  },
  card: {
    bgClass: 'bg-white',
    borderClass: 'border border-teal-100',
    shadowClass: 'shadow-sm hover:shadow-md',
  },
  button: {
    primaryClass: 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white',
    secondaryClass: 'border border-teal-500 text-teal-500 hover:bg-teal-50',
    accentClass: 'bg-cyan-500 hover:bg-cyan-600 text-white',
  },
  footer: {
    bgClass: 'bg-gradient-to-r from-teal-600 to-emerald-600',
    textClass: 'text-white',
    gradientClass: 'from-teal-500 to-emerald-500',
  },
  page: {
    bgClass: 'bg-gradient-to-br from-teal-50 via-white to-emerald-50',
  },
  preview: {
    gradient: 'from-teal-400 to-emerald-500',
    colors: ['#14b8a6', '#10b981'],
  },
};

/**
 * MINIMAL THEME - Elegant simplicity with neutral palette
 * Perfect for: Luxury goods, minimalist brands, professional services
 * Character: Clean, sophisticated, timeless
 */
export const minimalTheme: ThemeConfig = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Elegant simplicity with neutral palette and refined typography',
  colors: {
    primary: '#1f2937', // gray-800
    secondary: '#6b7280', // gray-500
    accent: '#000000',
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
  },
  typography: {
    heading1: { size: '36px', weight: '300', lineHeight: '1.1' },
    heading2: { size: '28px', weight: '400', lineHeight: '1.2' },
    body: { size: '16px', weight: '400', lineHeight: '1.6' },
    caption: { size: '14px', weight: '400', lineHeight: '1.5' },
  },
  spacing: {
    xs: '6px',
    sm: '12px',
    md: '20px',
    lg: '32px',
    xl: '48px',
    '2xl': '64px',
  },
  header: {
    bgClass: 'bg-white border-b border-gray-200',
    textClass: 'text-gray-900',
    gradientClass: 'to-gray-100',
    shadowClass: 'shadow-sm',
  },
  card: {
    bgClass: 'bg-white',
    borderClass: 'border border-gray-300',
    shadowClass: 'shadow-sm hover:shadow-md',
  },
  button: {
    primaryClass: 'bg-gray-900 hover:bg-gray-800 text-white',
    secondaryClass: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
    accentClass: 'bg-gray-600 hover:bg-gray-700 text-white',
  },
  footer: {
    bgClass: 'bg-gray-900',
    textClass: 'text-white',
    gradientClass: 'to-gray-800',
  },
  page: {
    bgClass: 'bg-white',
  },
  preview: {
    gradient: 'from-gray-400 to-gray-600',
    colors: ['#1f2937', '#6b7280'],
  },
};

/**
 * ELEGANT THEME - Luxury aesthetic with warm gold and deep navy
 * Perfect for: Premium products, fashion, beauty, high-end services
 * Character: Luxurious, warm, inviting, exclusive
 */
export const elegantTheme: ThemeConfig = {
  id: 'elegant',
  name: 'Elegant',
  description: 'Luxury aesthetic with warm tones and refined elegance',
  colors: {
    primary: '#b8860b', // goldenrod
    secondary: '#1e3a8a', // blue-900
    accent: '#d4af37', // gold
    neutral: {
      50: '#faf8f3',
      100: '#f5f1e8',
      200: '#e8e0d5',
      300: '#d4c5b9',
      400: '#a89968',
      500: '#8b7355',
      600: '#6b5344',
      700: '#4a3728',
      800: '#2c2416',
      900: '#1a1410',
    },
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
  },
  typography: {
    heading1: { size: '40px', weight: '700', lineHeight: '1.1' },
    heading2: { size: '28px', weight: '600', lineHeight: '1.2' },
    body: { size: '16px', weight: '400', lineHeight: '1.7' },
    caption: { size: '13px', weight: '400', lineHeight: '1.5' },
  },
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '18px',
    lg: '28px',
    xl: '40px',
    '2xl': '56px',
  },
  header: {
    bgClass: 'bg-gradient-to-r from-blue-900 to-blue-800',
    textClass: 'text-amber-50',
    gradientClass: 'from-blue-800 to-blue-700',
    shadowClass: 'shadow-xl',
  },
  card: {
    bgClass: 'bg-amber-50',
    borderClass: 'border border-amber-200',
    shadowClass: 'shadow-md hover:shadow-lg',
  },
  button: {
    primaryClass: 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-950 hover:to-blue-900 text-amber-50',
    secondaryClass: 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50',
    accentClass: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  footer: {
    bgClass: 'bg-gradient-to-r from-blue-900 to-blue-800',
    textClass: 'text-amber-50',
    gradientClass: 'from-blue-800 to-blue-700',
  },
  page: {
    bgClass: 'bg-gradient-to-br from-amber-50 via-white to-blue-50',
  },
  preview: {
    gradient: 'from-blue-900 to-amber-500',
    colors: ['#1e3a8a', '#b8860b'],
  },
};

/**
 * Theme registry - centralized theme management
 */
export const THEMES: Record<ThemeId, ThemeConfig> = {
  modern: modernTheme,
  minimal: minimalTheme,
  elegant: elegantTheme,
};

export const THEME_LIST = [modernTheme, minimalTheme, elegantTheme];

/**
 * Utility function to get theme configuration
 * @param themeId - ID of the theme to retrieve
 * @returns Theme configuration object
 */
export function getTheme(themeId: ThemeId | string): ThemeConfig {
  return THEMES[themeId as ThemeId] || modernTheme;
}

/**
 * Utility function to get all available themes
 * @returns Array of all available theme configurations
 */
export function getAllThemes(): ThemeConfig[] {
  return THEME_LIST;
}

/**
 * Get Tailwind classes for a theme component
 * Used for safe inline styling with Tailwind
 */
export function getThemeClasses(themeId: ThemeId | string, component: keyof Omit<ThemeConfig, 'id' | 'name' | 'description' | 'colors' | 'typography' | 'spacing' | 'preview'>): Record<string, string> {
  const theme = getTheme(themeId);
  const componentConfig = theme[component] as Record<string, string>;
  return componentConfig;
}
