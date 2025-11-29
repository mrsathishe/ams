import { type DefaultTheme } from 'styled-components';

// Light Theme Configuration
const lightTheme: DefaultTheme = {
  colors: {
    // Brand Colors (User Specified)
    brand: {
      primary: '#3674B5',     // Deep Blue - Main brand color
      secondary: '#578FCA',   // Medium Blue - Interactive elements  
      accent: '#A1E3F9',     // Light Blue - Highlights & accents
      success: '#D1F8EF',    // Mint Green - Success states
    },
    
    // Semantic Colors
    primary: {
      50: '#F0F6FF',
      100: '#E1EFFF',
      200: '#C3DFFF',
      300: '#A1E3F9',  // User's light blue
      400: '#7CB8E8',
      500: '#578FCA',  // User's medium blue
      600: '#3674B5',  // User's deep blue
      700: '#2D5A91',
      800: '#24456F',
      900: '#1B334D',
      950: '#0F1A26',
    },
    
    secondary: {
      50: '#F5FFFE',
      100: '#EBFFFB',
      200: '#D1F8EF',  // User's mint green
      300: '#B7F1E3',
      400: '#9DEAD7',
      500: '#83E3CB',
      600: '#69DCBF',
      700: '#4FD5B3',
      800: '#35CEA7',
      900: '#1BC79B',
    },
    
    // Status Colors
    success: {
      50: '#F5FFFE',
      100: '#EBFFFB',
      500: '#D1F8EF',
      600: '#B7F1E3',
      700: '#9DEAD7',
    },
    
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      600: '#D97706',
    },
    
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
      600: '#DC2626',
    },
    
    info: {
      50: '#F0F6FF',
      500: '#578FCA',
      600: '#3674B5',
    },
    
    // Neutral Colors
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#030712',
    },
    
    // Foundation
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
  
  // Gradients using user colors
  gradients: {
    brand: 'linear-gradient(135deg, #3674B5 0%, #578FCA 50%, #A1E3F9 100%)',
    success: 'linear-gradient(135deg, #A1E3F9 0%, #D1F8EF 100%)',
    hero: 'linear-gradient(135deg, #3674B5 0%, #578FCA 25%, #A1E3F9 75%, #D1F8EF 100%)',
    card: 'linear-gradient(145deg, #FFFFFF 0%, #A1E3F9 100%)',
    dark: 'linear-gradient(135deg, #1F2937 0%, #374151 50%, #4B5563 100%)',
  },
  
  // Typography
  fonts: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Monaco", "Consolas", monospace',
  },
  
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Spacing
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
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    full: '9999px',
  },
  
  // Shadows with brand colors
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    brand: '0 4px 14px 0 rgba(54, 116, 181, 0.15)',
    brandLg: '0 10px 40px 0 rgba(54, 116, 181, 0.2)',
    success: '0 4px 14px 0 rgba(209, 248, 239, 0.4)',
    glow: '0 0 20px rgba(161, 227, 249, 0.5)',
    none: '0 0 #0000',
  },
  
  // Breakpoints
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-Index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    slower: '500ms ease-in-out',
  },
};

// Dark Theme Configuration  
const darkTheme: DefaultTheme = {
  colors: {
    // Brand Colors (Same across themes)
    brand: {
      primary: '#3674B5',
      secondary: '#578FCA', 
      accent: '#A1E3F9',
      success: '#D1F8EF',
    },
    
    // Semantic Colors (Adjusted for dark mode)
    primary: {
      50: '#0F1A26',
      100: '#1B334D',
      200: '#24456F',
      300: '#2D5A91',
      400: '#3674B5',
      500: '#578FCA',
      600: '#A1E3F9',
      700: '#C3DFFF',
      800: '#E1EFFF',
      900: '#F0F6FF',
      950: '#FFFFFF',
    },
    
    secondary: {
      50: '#1BC79B',
      100: '#35CEA7',
      200: '#4FD5B3',
      300: '#69DCBF',
      400: '#83E3CB',
      500: '#9DEAD7',
      600: '#B7F1E3',
      700: '#D1F8EF',
      800: '#EBFFFB',
      900: '#F5FFFE',
    },
    
    // Status Colors (Dark mode variants)
    success: {
      50: '#1BC79B',
      100: '#35CEA7',
      500: '#69DCBF',
      600: '#83E3CB',
      700: '#9DEAD7',
    },
    
    warning: {
      50: '#92400E',
      500: '#F59E0B',
      600: '#FBBF24',
    },
    
    error: {
      50: '#991B1B',
      500: '#EF4444',
      600: '#F87171',
    },
    
    info: {
      50: '#1E40AF',
      500: '#3B82F6',
      600: '#60A5FA',
    },
    
    // Neutral Colors (Inverted for dark mode)
    gray: {
      50: '#030712',
      100: '#111827',
      200: '#1F2937',
      300: '#374151',
      400: '#4B5563',
      500: '#6B7280',
      600: '#9CA3AF',
      700: '#D1D5DB',
      800: '#E5E7EB',
      900: '#F3F4F6',
      950: '#F9FAFB',
    },
    
    // Foundation
    white: '#1F2937', // Dark background
    black: '#F9FAFB', // Light text
    transparent: 'transparent',
  },
  
  // Gradients (Adjusted for dark mode)
  gradients: {
    brand: 'linear-gradient(135deg, #3674B5 0%, #578FCA 50%, #A1E3F9 100%)',
    success: 'linear-gradient(135deg, #69DCBF 0%, #9DEAD7 100%)',
    hero: 'linear-gradient(135deg, #1E40AF 0%, #3674B5 25%, #578FCA 75%, #69DCBF 100%)',
    card: 'linear-gradient(145deg, #1F2937 0%, #374151 100%)',
    dark: 'linear-gradient(135deg, #030712 0%, #111827 50%, #1F2937 100%)',
  },
  
  // Typography (Same across themes)
  fonts: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Monaco", "Consolas", monospace',
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Spacing (Same across themes)
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  
  // Border Radius (Same across themes)
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  
  // Shadows (Adjusted for dark mode)
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
    brand: '0 4px 14px 0 rgba(54, 116, 181, 0.3)',
    brandLg: '0 10px 40px 0 rgba(54, 116, 181, 0.4)',
    success: '0 4px 14px 0 rgba(105, 220, 191, 0.3)',
    glow: '0 0 20px rgba(161, 227, 249, 0.3)',
    none: '0 0 #0000',
  },
  
  // Breakpoints (Same across themes)
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-Index scale (Same across themes)
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  // Transitions (Same across themes)
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    slower: '500ms ease-in-out',
  },
};

// Theme exports
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const theme = lightTheme; // Default export for backward compatibility

export default theme;

// Theme type declaration
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      brand: {
        primary: string;
        secondary: string;
        accent: string;
        success: string;
      };
      primary: Record<string, string>;
      secondary: Record<string, string>;
      success: Record<string, string>;
      warning: Record<string, string>;
      error: Record<string, string>;
      info: Record<string, string>;
      gray: Record<string, string>;
      white: string;
      black: string;
      transparent: string;
    };
    gradients: Record<string, string>;
    fonts: Record<string, string>;
    fontSizes: Record<string, string>;
    fontWeights: Record<string, number>;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    shadows: Record<string, string>;
    breakpoints: Record<string, string>;
    zIndex: Record<string, string | number>;
    transitions: Record<string, string>;
  }
}