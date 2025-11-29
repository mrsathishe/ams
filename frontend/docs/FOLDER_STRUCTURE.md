# Folder Structure Guide

This document explains the organized folder structure and file organization patterns used in the APTSYNC frontend application.

## Root Structure

```
frontend/
├── public/                 # Static assets
├── src/                   # Source code
├── docs/                  # Documentation
├── tests/                 # Test files
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
├── .prettierrc           # Prettier configuration
└── README.md             # Project documentation
```

## Source Code Structure (`src/`)

```
src/
├── components/           # Shared/global components
│   ├── Header.tsx       # Navigation header with profile dropdown
│   ├── ThemeToggle.tsx  # Dark/light theme switcher
│   ├── ui/              # Basic UI components (being refactored)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── CombinedThemeProvider.tsx
├── pages/               # Page-specific modules
│   ├── register/        # Registration page module
│   │   ├── components/  # Page-specific components
│   │   │   ├── FormField.tsx
│   │   │   ├── QuickAccessButtons.tsx
│   │   │   └── RememberMeCheckbox.tsx
│   │   ├── styles.ts    # Page-specific styled components
│   │   └── index.tsx    # Main page component
│   ├── login/           # Login page module
│   │   ├── styles.ts
│   │   └── index.tsx
│   ├── dashboard/       # Dashboard page module
│   │   ├── components/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── styles.ts
│   │   └── index.tsx
│   ├── HomePage.tsx     # Single file pages
│   ├── AdminPage.tsx
│   └── ProfilePage.tsx
├── styles/              # Shared styling system
│   └── shared.ts        # Common styled components
├── lib/                 # Utilities and business logic
│   ├── api.ts          # API client and endpoints
│   ├── auth.tsx        # Authentication context
│   ├── useAuth.ts      # Authentication hook
│   ├── queryClient.ts  # React Query client
│   └── utils.ts        # General utilities
├── types/              # TypeScript type definitions
│   └── api.ts         # API-related types
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── stores/             # State management (Zustand)
├── assets/             # Images, icons, fonts
│   ├── logo.png
│   └── logo.svg
├── test/               # Test utilities and setup
│   └── setup.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
├── Router.tsx          # Application routing
└── index.css           # Global styles and CSS variables
```

## Page Module Structure

Each page follows a consistent modular structure:

```
pages/[page-name]/
├── components/         # Page-specific components
│   ├── Component1.tsx # Focused, single-purpose components
│   ├── Component2.tsx
│   └── index.ts       # Optional: export barrel
├── hooks/             # Optional: page-specific hooks
│   └── usePageLogic.ts
├── utils/             # Optional: page-specific utilities
│   └── helpers.ts
├── types.ts           # Optional: page-specific types
├── styles.ts          # Page-specific styled components
└── index.tsx          # Main page component (entry point)
```

### Example: Dashboard Page

```
pages/dashboard/
├── components/
│   ├── StatsCard.tsx        # Statistics display component
│   ├── RecentActivity.tsx   # Activity feed component
│   ├── Sidebar.tsx          # Quick actions sidebar
│   └── index.ts             # Export barrel (optional)
├── styles.ts                # Dashboard-specific styled components
└── index.tsx                # Main dashboard page component
```

### Example: Register Page

```
pages/register/
├── components/
│   ├── FormField.tsx        # Reusable form input
│   ├── QuickAccessButtons.tsx # Social auth buttons
│   └── RememberMeCheckbox.tsx # Custom checkbox
├── styles.ts                # Register-specific styles
└── index.tsx                # Main registration component
```

## Component Organization Principles

### 1. Shared vs. Page-Specific

#### Shared Components (`src/components/`)
- Used across multiple pages
- Global navigation (Header)
- Common UI patterns
- Theme providers

#### Page-Specific Components (`src/pages/[page]/components/`)
- Only used within that specific page
- Page-specific business logic
- Specialized UI components

### 2. File Naming Conventions

#### Component Files
```
ComponentName.tsx        # PascalCase for React components
hooks.ts                # camelCase for utilities
types.ts                # camelCase for type definitions
styles.ts               # camelCase for styled components
index.tsx               # Entry point files
```

#### Directory Names
```
component-name/         # kebab-case for directories
page-name/             # kebab-case for page directories
```

### 3. Import/Export Patterns

#### Barrel Exports (Optional)
```typescript
// components/index.ts
export { default as FormField } from './FormField';
export { default as QuickAccessButtons } from './QuickAccessButtons';
export { default as RememberMeCheckbox } from './RememberMeCheckbox';
```

#### Direct Imports (Recommended)
```typescript
// Prefer direct imports for better tree-shaking
import FormField from './components/FormField';
import { Button } from '@/styles/shared';
```

## Styling Organization

### Shared Styles (`src/styles/`)

```
styles/
├── shared.ts           # Common styled components
├── themes.ts           # Theme definitions (future)
├── breakpoints.ts      # Responsive breakpoints (future)
└── animations.ts       # Animation definitions (future)
```

### Page-Specific Styles

```typescript
// pages/dashboard/styles.ts
import styled from 'styled-components';

export const DashboardContainer = styled.div`
  /* Dashboard-specific styles */
`;

export const StatsGrid = styled.div`
  /* Grid layout for stats cards */
`;
```

## Assets Organization

```
assets/
├── images/             # Static images
│   ├── logos/
│   │   ├── logo.png
│   │   └── logo.svg
│   └── icons/
├── fonts/              # Custom fonts (if needed)
└── data/               # Static JSON data
```

## Testing Organization

```
tests/                  # Test files (mirror src structure)
├── components/
│   └── Header.test.tsx
├── pages/
│   ├── dashboard/
│   │   └── Dashboard.test.tsx
│   └── register/
│       └── Register.test.tsx
└── utils/
    └── test-utils.tsx
```

## Configuration Files

### Root Configuration
```
vite.config.ts         # Vite bundler configuration
tsconfig.json          # TypeScript compiler options
tsconfig.app.json      # App-specific TypeScript config
eslint.config.js       # ESLint linting rules
.prettierrc            # Prettier formatting rules
components.json        # UI library configuration
playwright.config.ts   # E2E testing configuration
```

## Development Workflow

### Adding a New Page

1. **Create page directory**:
   ```bash
   mkdir src/pages/new-page
   ```

2. **Create main component**:
   ```bash
   touch src/pages/new-page/index.tsx
   ```

3. **Add page-specific styles**:
   ```bash
   touch src/pages/new-page/styles.ts
   ```

4. **Create components directory** (if needed):
   ```bash
   mkdir src/pages/new-page/components
   ```

5. **Update routing**:
   ```typescript
   // src/Router.tsx
   import NewPage from './pages/new-page';
   ```

### Adding a New Component

1. **Determine location**:
   - Shared: `src/components/`
   - Page-specific: `src/pages/[page]/components/`

2. **Create component file**:
   ```typescript
   // ComponentName.tsx
   interface ComponentNameProps {
     // Define props
   }
   
   export default function ComponentName(props: ComponentNameProps) {
     // Component implementation
   }
   ```

3. **Add styles** (if needed):
   ```typescript
   // In shared.ts or page styles.ts
   export const StyledComponent = styled.div`
     // Styles
   `;
   ```

## Best Practices

### 1. File Organization
- Keep related files close together
- Use consistent naming conventions
- Prefer flat directory structures when possible
- Group by feature, not by file type

### 2. Import Organization
```typescript
// 1. External library imports
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 2. Internal library imports
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/styles/shared';

// 3. Relative imports
import FormField from './components/FormField';
import { PageContainer } from './styles';
```

### 3. Component Placement Guidelines

#### Move to Shared When:
- Used in 2+ pages
- Represents a common UI pattern
- Has no page-specific business logic

#### Keep Page-Specific When:
- Only used within one page
- Contains page-specific logic
- Tightly coupled to page requirements

### 4. Documentation
- Include README files for complex modules
- Document component props with JSDoc
- Maintain this folder structure guide
- Update documentation when structure changes

## Migration Strategy

### From Monolithic to Modular

1. **Identify page-specific components**
2. **Create page directories**
3. **Move components to appropriate locations**
4. **Extract shared styled components**
5. **Update imports throughout codebase**
6. **Update routing configuration**

This modular structure improves maintainability, enables better code organization, and makes it easier for teams to work on different features simultaneously.