# Component Architecture Guide

This document describes the component architecture and modular design patterns used in the APTSYNC frontend application.

## Overview

The application follows a **page-based modular architecture** where each page is a self-contained module with its own components, styles, and business logic.

## Folder Structure

```
src/pages/
├── [page-name]/
│   ├── components/         # Page-specific components
│   │   ├── Component1.tsx
│   │   ├── Component2.tsx
│   │   └── index.ts       # Optional: export barrel
│   ├── styles.ts          # Page-specific styled components
│   ├── hooks.ts           # Optional: page-specific hooks
│   ├── utils.ts           # Optional: page-specific utilities
│   └── index.tsx          # Main page component
```

## Component Examples

### Dashboard Page Components

#### StatsCard Component
```typescript
// src/pages/dashboard/components/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}
```

**Usage**: Displays statistics with consistent styling and multiple variants for different data types.

#### RecentActivity Component
```typescript
// src/pages/dashboard/components/RecentActivity.tsx
interface Activity {
  type: string;
  amount: number;
  desc: string;
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}
```

**Usage**: Displays a list of recent activities with status badges and formatting.

#### Sidebar Component
```typescript
// src/pages/dashboard/components/Sidebar.tsx
export default function Sidebar()
```

**Usage**: Contains quick actions and monthly summary information.

### Register/Login Page Components

#### FormField Component
```typescript
// src/pages/register/components/FormField.tsx
interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}
```

**Usage**: Reusable form input component with consistent styling and validation.

#### QuickAccessButtons Component
```typescript
// src/pages/register/components/QuickAccessButtons.tsx
export default function QuickAccessButtons()
```

**Usage**: Social authentication buttons (Google, LinkedIn, SSO).

#### RememberMeCheckbox Component
```typescript
// src/pages/register/components/RememberMeCheckbox.tsx
interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}
```

**Usage**: Custom styled checkbox with remember me functionality.

## Shared Components

### Global Components (`src/components/`)

#### Header Component
```typescript
// src/components/Header.tsx
interface HeaderProps {
  variant?: "default" | "auth";
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}
```

**Features**:
- Responsive navigation header
- User profile dropdown with logout functionality
- Contact information display
- Branding with tagline
- Glass-morphism design

### Styled Components (`src/styles/shared.ts`)

Common styled components for consistent design:

```typescript
// Layout Components
export const PageContainer: StyledComponent
export const FormWrapper: StyledComponent
export const Card: StyledComponent
export const CardHeader: StyledComponent
export const CardContent: StyledComponent

// Form Components
export const Form: StyledComponent
export const FormGroup: StyledComponent
export const Label: StyledComponent
export const Input: StyledComponent
export const Button: StyledComponent<{ variant?: 'primary' | 'outline' | 'link' }>
export const Checkbox: StyledComponent

// Feedback Components
export const ErrorMessage: StyledComponent

// Interactive Components
export const ButtonGrid: StyledComponent
export const QuickAccessSection: StyledComponent
```

## Design Patterns

### 1. Component Composition
```typescript
// Page components are composed of smaller, focused components
export default function RegisterPage() {
  return (
    <>
      <Header variant="auth" />
      <PageContainer>
        <FormWrapper>
          <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>Sign up to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Form onSubmit={handleSubmit}>
                <FormField {...nameFieldProps} />
                <FormField {...emailFieldProps} />
                <FormField {...passwordFieldProps} />
                <RememberMeCheckbox {...checkboxProps} />
                <QuickAccessButtons />
              </Form>
            </CardContent>
          </Card>
        </FormWrapper>
      </PageContainer>
    </>
  );
}
```

### 2. Prop Interfaces
All components have well-defined TypeScript interfaces:

```typescript
interface ComponentProps {
  required: string;
  optional?: number;
  callback: (param: string) => void;
  variant?: 'primary' | 'secondary';
}
```

### 3. Styled Component Variants
Components support multiple visual variants:

```typescript
const Button = styled.button<{ variant?: 'primary' | 'outline' | 'link' }>`
  ${props => {
    switch (props.variant) {
      case 'outline': return outlineStyles;
      case 'link': return linkStyles;
      default: return primaryStyles;
    }
  }}
`;
```

## Best Practices

### 1. Component Organization
- Keep components small and focused on a single responsibility
- Use page-specific folders for components only used on that page
- Put shared components in the global `components/` folder

### 2. Styling Strategy
- Use shared styled components for consistency
- Create page-specific styles only when needed
- Follow the established design system (colors, typography, effects)

### 3. Type Safety
- Define interfaces for all component props
- Use TypeScript's type inference where possible
- Maintain strict type checking for reliability

### 4. Reusability
- Design components to be reusable across pages
- Use composition over inheritance
- Keep business logic separate from presentation

### 5. Performance
- Use React.memo for components that don't need frequent re-renders
- Optimize expensive computations with useMemo
- Avoid unnecessary prop drilling

## Development Workflow

### Creating a New Page
1. Create the page folder: `src/pages/new-page/`
2. Add the main component: `index.tsx`
3. Create page-specific styled components: `styles.ts`
4. Add reusable components in: `components/`
5. Update routing in: `src/Router.tsx`

### Creating a New Component
1. Determine if it's page-specific or shared
2. Define the TypeScript interface for props
3. Implement the component with styled components
4. Add proper JSDoc documentation
5. Write unit tests for complex logic

### Styling Guidelines
1. Use shared styled components first
2. Create page-specific styles for unique designs
3. Follow the color palette and typography system
4. Implement responsive design patterns
5. Add smooth animations and hover effects