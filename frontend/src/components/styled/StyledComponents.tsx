import styled, { css } from 'styled-components';

// Button Components
export const StyledButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: ${({ theme }) => theme.transitions.base};
  cursor: pointer;
  border: none;
  text-decoration: none;
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.fontSizes.sm};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing[4]} ${theme.spacing[8]};
          font-size: ${theme.fontSizes.lg};
        `;
      default:
        return css`
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.fontSizes.base};
        `;
    }
  }}
  
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.primary[300]};
          color: ${theme.colors.primary[900]};
          box-shadow: ${theme.shadows.md};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[400]};
            box-shadow: ${theme.shadows.lg};
          }
        `;
      case 'success':
        return css`
          background-color: ${theme.colors.secondary[200]};
          color: ${theme.colors.secondary[900]};
          box-shadow: ${theme.shadows.md};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary[300]};
            box-shadow: ${theme.shadows.lg};
          }
        `;
      case 'outline':
        return css`
          border: 2px solid ${theme.colors.primary[600]};
          color: ${theme.colors.primary[600]};
          background-color: transparent;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[600]};
            color: ${theme.colors.white};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          box-shadow: ${theme.shadows.lg};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[700]};
            box-shadow: ${theme.shadows.xl};
            transform: scale(1.05);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Card Components
export const StyledCard = styled.div<{
  variant?: 'default' | 'gradient' | 'brand';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}>`
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  transition: ${({ theme }) => theme.transitions.slow};
  
  ${({ padding = 'md', theme }) => {
    switch (padding) {
      case 'sm':
        return css`padding: ${theme.spacing[4]};`;
      case 'lg':
        return css`padding: ${theme.spacing[8]};`;
      default:
        return css`padding: ${theme.spacing[6]};`;
    }
  }}
  
  ${({ variant = 'default', theme }) => {
    switch (variant) {
      case 'gradient':
        return css`
          background: ${theme.gradients.card};
          box-shadow: ${theme.shadows.md};
          border: 1px solid ${theme.colors.primary[100]};
        `;
      case 'brand':
        return css`
          background: ${theme.gradients.brand};
          color: ${theme.colors.white};
          box-shadow: ${theme.shadows.lg};
        `;
      default:
        return css`
          background-color: ${theme.colors.white};
          color: ${theme.colors.gray[900]};
          box-shadow: ${theme.shadows.md};
          border: 1px solid ${theme.colors.gray[200]};
        `;
    }
  }}
  
  ${({ hoverable }) => hoverable && css`
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.lg};
      transform: translateY(-2px);
    }
  `}
`;

// Input Components
export const StyledInput = styled.input<{
  error?: boolean;
}>`
  display: block;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme, error }) => error ? theme.colors.error[500] : theme.colors.gray[300]};
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[900]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ theme }) => theme.transitions.base};
  font-size: ${({ theme }) => theme.fontSizes.base};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
  
  &:focus {
    border-color: ${({ theme, error }) => error ? theme.colors.error[500] : theme.colors.primary[600]};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme, error }) => 
      error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(54, 116, 181, 0.2)'
    };
  }
`;

// Badge Components
export const StyledBadge = styled.span<{
  variant?: 'success' | 'warning' | 'error' | 'info';
}>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  ${({ variant = 'info', theme }) => {
    switch (variant) {
      case 'success':
        return css`
          background-color: ${theme.colors.secondary[200]};
          color: ${theme.colors.secondary[900]};
          border: 1px solid ${theme.colors.secondary[300]};
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warning[50]};
          color: ${theme.colors.warning[600]};
          border: 1px solid ${theme.colors.warning[500]};
        `;
      case 'error':
        return css`
          background-color: ${theme.colors.error[50]};
          color: ${theme.colors.error[600]};
          border: 1px solid ${theme.colors.error[500]};
        `;
      default:
        return css`
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[900]};
          border: 1px solid ${theme.colors.primary[300]};
        `;
    }
  }}
`;

// Typography Components
export const StyledHeading = styled.h1<{
  gradient?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}>`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
  
  ${({ size = 'xl', theme }) => {
    return css`
      font-size: ${theme.fontSizes[size]};
    `;
  }}
  
  ${({ gradient, theme }) => gradient && css`
    background: ${theme.gradients.brand};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
`;

export const StyledText = styled.p<{
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  color?: string;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}>`
  margin: 0;
  
  ${({ size = 'base', theme }) => css`
    font-size: ${theme.fontSizes[size]};
  `}
  
  ${({ color, theme }) => color && css`
    color: ${theme.colors.gray[color] || color};
  `}
  
  ${({ weight = 'normal', theme }) => css`
    font-weight: ${theme.fontWeights[weight]};
  `}
`;

// Layout Components
export const StyledContainer = styled.div<{
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}>`
  width: 100%;
  margin: 0 auto;
  
  ${({ maxWidth = 'xl' }) => {
    switch (maxWidth) {
      case 'sm': return css`max-width: 640px;`;
      case 'md': return css`max-width: 768px;`;
      case 'lg': return css`max-width: 1024px;`;
      case 'xl': return css`max-width: 1280px;`;
      case '2xl': return css`max-width: 1536px;`;
      case 'full': return css`max-width: 100%;`;
      default: return css`max-width: 1280px;`;
    }
  }}
  
  ${({ padding = true, theme }) => padding && css`
    padding-left: ${theme.spacing[4]};
    padding-right: ${theme.spacing[4]};
    
    @media (min-width: ${theme.breakpoints.sm}) {
      padding-left: ${theme.spacing[6]};
      padding-right: ${theme.spacing[6]};
    }
    
    @media (min-width: ${theme.breakpoints.lg}) {
      padding-left: ${theme.spacing[8]};
      padding-right: ${theme.spacing[8]};
    }
  `}
`;

export const StyledFlex = styled.div<{
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  
  ${({ direction = 'row' }) => css`
    flex-direction: ${direction};
  `}
  
  ${({ align = 'stretch' }) => css`
    align-items: ${align === 'start' ? 'flex-start' : 
                   align === 'end' ? 'flex-end' : align};
  `}
  
  ${({ justify = 'start' }) => css`
    justify-content: ${justify === 'start' ? 'flex-start' :
                       justify === 'end' ? 'flex-end' :
                       justify === 'between' ? 'space-between' :
                       justify === 'around' ? 'space-around' :
                       justify === 'evenly' ? 'space-evenly' : justify};
  `}
  
  ${({ gap, theme }) => gap && css`
    gap: ${theme.spacing[gap] || gap};
  `}
  
  ${({ wrap }) => wrap && css`
    flex-wrap: wrap;
  `}
`;

// Navigation Components
export const StyledNavLink = styled.a<{
  active?: boolean;
}>`
  color: ${({ theme, active }) => active ? theme.colors.primary[600] : theme.colors.gray[600]};
  transition: ${({ theme }) => theme.transitions.base};
  font-weight: ${({ theme, active }) => active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

// Loading Components
export const StyledSpinner = styled.div<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}>`
  border-radius: 50%;
  border-style: solid;
  border-color: transparent;
  animation: spin 1s linear infinite;
  
  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          width: 1rem;
          height: 1rem;
          border-width: 2px;
        `;
      case 'lg':
        return css`
          width: 2rem;
          height: 2rem;
          border-width: 3px;
        `;
      default:
        return css`
          width: 1.5rem;
          height: 1.5rem;
          border-width: 2px;
        `;
    }
  }}
  
  ${({ color = 'primary', theme }) => css`
    border-top-color: ${theme.colors.primary[600] || color};
  `}
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default {
  Button: StyledButton,
  Card: StyledCard,
  Input: StyledInput,
  Badge: StyledBadge,
  Heading: StyledHeading,
  Text: StyledText,
  Container: StyledContainer,
  Flex: StyledFlex,
  NavLink: StyledNavLink,
  Spinner: StyledSpinner,
};