# Styling Guide

This document outlines the styling system and design patterns used in the APTSYNC frontend application.

## Overview

The application uses **Styled Components** for CSS-in-JS styling with a centralized theming system that ensures consistency across all components.

## Architecture

### Shared Styling System

All common styled components are defined in `src/styles/shared.ts`:

```typescript
import styled from "styled-components";

// Common components available throughout the app
export const PageContainer = styled.div`...`;
export const Card = styled.div`...`;
export const Button = styled.button<{ variant?: string }>`...`;
```

### Page-Specific Styles

Each page can have its own styled components in `styles.ts`:

```typescript
// src/pages/dashboard/styles.ts
import styled from "styled-components";

export const DashboardContainer = styled.div`...`;
export const StatsGrid = styled.div`...`;
```

## Design System

### Color Palette

#### Primary Colors
```css
--primary-blue: #3b82f6;
--primary-blue-dark: #1d4ed8;
--primary-gradient: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
```

#### Semantic Colors
```css
--success: #10b981;
--success-dark: #059669;
--warning: #f59e0b;
--warning-dark: #d97706;
--error: #dc2626;
--error-light: #fecaca;
```

#### Neutral Colors
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #1e293b;
```

### Typography

#### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500 (interactive elements)
- **Semi-Bold**: 600 (headings)
- **Bold**: 700 (emphasis)

#### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

#### Line Heights
- **Tight**: 1.25
- **Normal**: 1.5
- **Relaxed**: 1.75

### Spacing System

Based on 0.25rem (4px) increments:

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Shadows

#### Card Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

#### Interactive Shadows
```css
--shadow-hover: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
--shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.1);
```

## Component Patterns

### Layout Components

#### PageContainer
```typescript
export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 8rem;
`;
```

#### Card System
```typescript
export const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

export const CardHeader = styled.div`
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;
```

### Form Components

#### Input System
```typescript
export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;
```

#### Button Variants
```typescript
export const Button = styled.button<{ variant?: 'primary' | 'outline' | 'link' }>`
  padding: ${props => props.variant === 'link' ? '0' : '0.75rem 1.5rem'};
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'outline':
        return `
          background: transparent;
          border: 1px solid #d1d5db;
          color: #374151;
          
          &:hover {
            background: #f9fafb;
            border-color: #9ca3af;
          }
        `;
      case 'link':
        return `
          background: none;
          color: #3b82f6;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `;
    }
  }}
`;
```

## Animation System

### Transitions
```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

### Common Animations
```typescript
// Hover lift effect
&:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

// Focus states
&:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

// Loading states
&:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## Responsive Design

### Breakpoints
```css
--mobile: 480px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
```

### Media Query Helpers
```typescript
const breakpoints = {
  mobile: '(max-width: 480px)',
  tablet: '(max-width: 768px)',
  desktop: '(min-width: 1024px)',
};

// Usage in styled components
const ResponsiveComponent = styled.div`
  padding: 1rem;
  
  @media ${breakpoints.tablet} {
    padding: 0.5rem;
  }
  
  @media ${breakpoints.desktop} {
    padding: 2rem;
  }
`;
```

## Theme Variants

### Component Variants

#### Status Variants
```typescript
const getStatusStyles = (status: 'success' | 'warning' | 'error' | 'info') => {
  switch (status) {
    case 'success':
      return `
        background: #dcfce7;
        color: #166534;
        border-color: #bbf7d0;
      `;
    case 'warning':
      return `
        background: #fef3c7;
        color: #92400e;
        border-color: #fde68a;
      `;
    case 'error':
      return `
        background: #fecaca;
        color: #991b1b;
        border-color: #fca5a5;
      `;
    default:
      return `
        background: #e0e7ff;
        color: #3730a3;
        border-color: #c7d2fe;
      `;
  }
};
```

#### Size Variants
```typescript
const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return `
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      `;
    case 'lg':
      return `
        padding: 1rem 2rem;
        font-size: 1.125rem;
      `;
    default:
      return `
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      `;
  }
};
```

## Best Practices

### 1. Consistency
- Always use shared styled components for common elements
- Follow the established color palette and spacing system
- Maintain consistent border radius and shadow patterns

### 2. Performance
- Use CSS custom properties for dynamic values
- Minimize styled component re-renders with React.memo
- Use theme objects for complex theming needs

### 3. Accessibility
- Ensure sufficient color contrast (4.5:1 minimum)
- Provide focus states for interactive elements
- Use semantic HTML elements as the base for styled components

### 4. Maintainability
- Keep styled components close to their usage
- Use descriptive names for component variants
- Document complex styling logic with comments

### 5. Responsiveness
- Design mobile-first, then enhance for larger screens
- Use relative units (rem, em, %) where appropriate
- Test across different screen sizes and devices

## Usage Examples

### Creating a New Styled Component
```typescript
// 1. Import shared components
import { Card, Button } from '@/styles/shared';

// 2. Create page-specific styles
const CustomCard = styled(Card)`
  max-width: 500px;
  margin: 2rem auto;
`;

// 3. Use in component
export default function MyComponent() {
  return (
    <CustomCard>
      <Button variant="primary">
        Click Me
      </Button>
    </CustomCard>
  );
}
```

### Extending Shared Components
```typescript
import { Button } from '@/styles/shared';

const IconButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;
```

### Using Theme Variants
```typescript
const StatusBadge = styled.span<{ status: 'success' | 'warning' | 'error' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => getStatusStyles(props.status)}
`;
```