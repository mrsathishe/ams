import { css } from 'styled-components';

type StyleFunction = () => ReturnType<typeof css>;

export const breakpoints = {
  mobile: '320px',
  tablet: '768px', 
  desktop: '1024px',
  wide: '1280px'
} as const;

/**
 * Responsive media query utilities for styled-components v4+
 */
export const respondTo = {
  mobile: (styles: ReturnType<typeof css>) => css`@media (max-width: ${breakpoints.tablet}) { ${styles} }`,
  tablet: (styles: ReturnType<typeof css>) => css`@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop}) { ${styles} }`,
  desktop: (styles: ReturnType<typeof css>) => css`@media (min-width: ${breakpoints.desktop}) { ${styles} }`,
  wide: (styles: ReturnType<typeof css>) => css`@media (min-width: ${breakpoints.wide}) { ${styles} }`
};

/**
 * CSS media query strings for use in regular CSS
 */
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.tablet})`,
  tablet: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`
};

/**
 * Check if current screen size matches breakpoint
 * @param breakpoint - Breakpoint name
 * @returns Boolean indicating if screen matches
 */
export const isScreenSize = (breakpoint: keyof typeof breakpoints): boolean => {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  const bp = parseInt(breakpoints[breakpoint]);
  
  switch (breakpoint) {
    case 'mobile':
      return width < parseInt(breakpoints.tablet);
    case 'tablet':
      return width >= parseInt(breakpoints.tablet) && width < parseInt(breakpoints.desktop);
    case 'desktop':
      return width >= parseInt(breakpoints.desktop) && width < parseInt(breakpoints.wide);
    case 'wide':
      return width >= parseInt(breakpoints.wide);
    default:
      return false;
  }
};