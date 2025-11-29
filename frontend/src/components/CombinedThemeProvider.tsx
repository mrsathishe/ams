import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes } from '../styles/theme';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

interface CombinedThemeProviderProps {
  children: React.ReactNode;
}

// Internal component that consumes the theme context
const StyledThemeConsumer: React.FC<CombinedThemeProviderProps> = ({ children }) => {
  const { currentTheme } = useTheme();
  
  return (
    <StyledThemeProvider theme={themes[currentTheme]}>
      {children}
    </StyledThemeProvider>
  );
};

// Combined provider that wraps both Context API and styled-components
export const CombinedThemeProvider: React.FC<CombinedThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <StyledThemeConsumer>
        {children}
      </StyledThemeConsumer>
    </ThemeProvider>
  );
};

export default CombinedThemeProvider;