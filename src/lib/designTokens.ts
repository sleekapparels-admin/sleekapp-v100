/**
 * Design Tokens - 2025 Modern Design System
 * Based on industry research and best practices
 */

export const designTokens = {
  // Color System
  colors: {
    // Primary (LoopTrace™ Blue)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main
      600: '#2563eb', // Hover
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a', // Dark mode
      950: '#172554',
    },
    
    // Accent (Energy Orange)
    accent: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Main
      600: '#ea580c', // Hover
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
    
    // Semantic Colors
    success: {
      50: '#f0fdf4',
      500: '#10b981', // Main
      600: '#059669', // Hover
      900: '#064e3b',
    },
    
    warning: {
      50: '#fffbeb',
      500: '#f59e0b', // Main
      600: '#d97706', // Hover
      900: '#78350f',
    },
    
    error: {
      50: '#fef2f2',
      500: '#ef4444', // Main
      600: '#dc2626', // Hover
      900: '#7f1d1d',
    },
    
    info: {
      50: '#ecfeff',
      500: '#06b6d4', // Main
      600: '#0891b2', // Hover
      900: '#164e63',
    },
    
    // Neutrals (Modern Gray Scale)
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827', // Almost black
      950: '#030712',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      heading: "'Inter', system-ui, -apple-system, sans-serif",
      body: "'Inter', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'Courier New', monospace",
    },
    
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.563rem', // 25px
      '3xl': '1.953rem', // 31px
      '4xl': '2.441rem', // 39px
      '5xl': '3.052rem', // 49px
      '6xl': '3.815rem', // 61px
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Spacing (4px grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.5rem',  // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px',
  },
  
  // Shadows (Elevation)
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
    
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // Z-Index
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Breakpoints (Mobile-first)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Export individual token groups for convenience
export const { colors, typography, spacing, borderRadius, shadows, animation, zIndex, breakpoints } = designTokens;
