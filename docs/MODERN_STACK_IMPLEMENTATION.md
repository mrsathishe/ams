# AptSync Modern Development Stack Implementation Guide

This document outlines the implementation of modern development tools and best practices for the AptSync apartment management system.

## 🎯 Implementation Overview

### New Development Stack
- **Package Manager**: Bun (ultra-fast JavaScript runtime & package manager)
- **API Management**: @tanstack/react-query (powerful data fetching & caching)
- **Code Quality**: ESLint + Prettier (automated formatting & linting)
- **End-to-End Testing**: Playwright (reliable browser testing)
- **Unit Testing**: Vitest (fast unit test runner)
- **State Management**: Zustand (lightweight state management)

## 📦 Package Manager Migration: Bun

### Why Bun?
- **⚡ Performance**: Up to 25x faster than npm
- **🔋 Built-in**: Bundler, test runner, and package manager in one
- **🎯 Compatibility**: Drop-in replacement for npm/yarn
- **💾 Memory Efficient**: Lower memory usage and disk space

### Installation Steps

```bash
# Install Bun globally
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version

# Migrate from npm to bun
rm package-lock.json
rm -rf node_modules
bun install

# Update scripts in package.json
bun run dev
bun run build
bun run test
```

### Updated package.json Scripts
```json
{
  \"scripts\": {
    \"dev\": \"bun run vite\",
    \"build\": \"bun run tsc -b && bun run vite build\",
    \"preview\": \"bun run vite preview\",
    \"test\": \"bun run vitest\",
    \"test:ui\": \"bun run vitest --ui\",
    \"test:e2e\": \"bun run playwright test\",
    \"lint\": \"bun run eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0\",
    \"lint:fix\": \"bun run eslint . --ext ts,tsx --fix\",
    \"format\": \"bun run prettier --write \\\"src/**/*.{ts,tsx,css,scss}\\\"\",
    \"format:check\": \"bun run prettier --check \\\"src/**/*.{ts,tsx,css,scss}\\\"\",
    \"type-check\": \"bun run tsc --noEmit\"
  }
}
```

## 🔄 API Management: @tanstack/react-query

### Features
- **Smart Caching**: Automatic background refetching
- **Optimistic Updates**: Immediate UI updates
- **Error Handling**: Robust error recovery
- **Offline Support**: Works without internet connection
- **DevTools**: Excellent debugging experience

### Installation
```bash
bun add @tanstack/react-query @tanstack/react-query-devtools
```

### Implementation Structure

#### 1. Query Client Setup
```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});
```

#### 2. API Hooks
```typescript
// src/hooks/api/useAuth.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../lib/api';

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Handle successful login
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      // Handle login error
      console.error('Login failed:', error);
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem('token'),
  });
};

export const useExpenses = (userId: string) => {
  return useQuery({
    queryKey: ['expenses', userId],
    queryFn: () => expenseApi.getExpenses(userId),
    enabled: !!userId,
  });
};
```

#### 3. Provider Setup
```typescript
// src/main.tsx (updated)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyledThemeProvider>
        <App />
      </StyledThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

## ✨ Code Quality: ESLint + Prettier

### ESLint Configuration
```bash
bun add -d eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### .eslintrc.json
```json
{
  \"extends\": [
    \"eslint:recommended\",
    \"@typescript-eslint/recommended\",
    \"plugin:react/recommended\",
    \"plugin:react-hooks/recommended\",
    \"plugin:react/jsx-runtime\"
  ],
  \"parser\": \"@typescript-eslint/parser\",
  \"parserOptions\": {
    \"ecmaVersion\": \"latest\",
    \"sourceType\": \"module\",
    \"ecmaFeatures\": {
      \"jsx\": true
    }
  },
  \"plugins\": [\"@typescript-eslint\", \"react\", \"react-hooks\", \"react-refresh\"],
  \"rules\": {
    \"react-refresh/only-export-components\": \"warn\",
    \"@typescript-eslint/no-unused-vars\": \"error\",
    \"react/prop-types\": \"off\",
    \"prefer-const\": \"error\",
    \"no-var\": \"error\"
  },
  \"settings\": {
    \"react\": {
      \"version\": \"detect\"
    }
  }
}
```

### Prettier Configuration
```bash
bun add -d prettier eslint-config-prettier eslint-plugin-prettier
```

#### .prettierrc
```json
{
  \"semi\": true,
  \"trailingComma\": \"es5\",
  \"singleQuote\": true,
  \"printWidth\": 80,
  \"tabWidth\": 2,
  \"useTabs\": false,
  \"bracketSpacing\": true,
  \"arrowParens\": \"avoid\",
  \"endOfLine\": \"lf\"
}
```

#### .prettierignore
```
dist
node_modules
*.md
```

### VSCode Integration
#### .vscode/settings.json
```json
{
  \"editor.formatOnSave\": true,
  \"editor.defaultFormatter\": \"esbenp.prettier-vscode\",
  \"editor.codeActionsOnSave\": {
    \"source.fixAll.eslint\": true
  },
  \"eslint.validate\": [\"typescript\", \"typescriptreact\"]
}
```

## 🎭 End-to-End Testing: Playwright

### Installation
```bash
bun add -d @playwright/test
bunx playwright install
```

### Configuration
#### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Example Test Suite
#### tests/e2e/auth.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[data-testid=\"email-input\"]', 'test@example.com');
    await page.fill('[data-testid=\"password-input\"]', 'password123');
    
    // Submit form
    await page.click('[data-testid=\"login-button\"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid=\"welcome-message\"]')).toContainText('Welcome back');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid=\"email-input\"]', 'invalid@example.com');
    await page.fill('[data-testid=\"password-input\"]', 'wrongpassword');
    await page.click('[data-testid=\"login-button\"]');
    
    await expect(page.locator('[data-testid=\"error-message\"]')).toContainText('Invalid email or password');
  });
});
```

## ⚡ Unit Testing: Vitest

### Installation
```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Configuration
#### vite.config.ts (updated)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

#### src/test/setup.ts
```typescript
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Example Unit Tests
#### src/components/__tests__/LoginForm.test.tsx
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from '../LoginForm';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('LoginForm', () => {
  test('renders login form elements', () => {
    render(<LoginForm />, { wrapper: createWrapper() });
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<LoginForm />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
```

## 🐻 State Management: Zustand

### Installation
```bash
bun add zustand
bun add -d @types/node
```

### Implementation

#### src/stores/authStore.ts
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        setToken: (token) =>
          set((state) => {
            state.token = token;
          }),

        login: (user, token) =>
          set((state) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.error = null;
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        clearError: () =>
          set((state) => {
            state.error = null;
          }),
      })),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// Selectors
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
}));
```

#### src/stores/expenseStore.ts
```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    category?: string;
    dateRange?: [string, string];
  };
}

interface ExpenseActions {
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<ExpenseState['filters']>) => void;
  clearFilters: () => void;
}

type ExpenseStore = ExpenseState & ExpenseActions;

export const useExpenseStore = create<ExpenseStore>()(
  devtools(
    immer((set) => ({
      // Initial state
      expenses: [],
      isLoading: false,
      error: null,
      filters: {},

      // Actions
      setExpenses: (expenses) =>
        set((state) => {
          state.expenses = expenses;
        }),

      addExpense: (expense) =>
        set((state) => {
          state.expenses.push(expense);
        }),

      updateExpense: (id, updates) =>
        set((state) => {
          const index = state.expenses.findIndex((expense) => expense.id === id);
          if (index !== -1) {
            Object.assign(state.expenses[index], updates);
          }
        }),

      deleteExpense: (id) =>
        set((state) => {
          state.expenses = state.expenses.filter((expense) => expense.id !== id);
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      setFilters: (filters) =>
        set((state) => {
          Object.assign(state.filters, filters);
        }),

      clearFilters: () =>
        set((state) => {
          state.filters = {};
        }),
    })),
    { name: 'ExpenseStore' }
  )
);

// Selectors with computed values
export const useExpenses = () => useExpenseStore((state) => {
  let expenses = state.expenses;
  
  // Apply filters
  if (state.filters.status) {
    expenses = expenses.filter(expense => expense.status === state.filters.status);
  }
  
  if (state.filters.category) {
    expenses = expenses.filter(expense => expense.category === state.filters.category);
  }
  
  return {
    expenses,
    isLoading: state.isLoading,
    error: state.error,
    totalExpenses: expenses.length,
    totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
  };
});
```

## 📁 Updated Project Structure

```
src/
├── components/
│   ├── __tests__/               # Component unit tests
│   ├── styled/
│   └── ui/                      # Reusable UI components
├── hooks/
│   ├── api/                     # React Query hooks
│   └── __tests__/               # Hook tests
├── lib/
│   ├── api.ts                   # API client
│   ├── queryClient.ts           # React Query config
│   └── utils.ts                 # Utility functions
├── pages/
│   └── __tests__/               # Page component tests
├── stores/                      # Zustand stores
│   ├── authStore.ts
│   ├── expenseStore.ts
│   └── __tests__/               # Store tests
├── styles/
├── test/
│   ├── mocks/                   # MSW mock handlers
│   ├── setup.ts                 # Test setup
│   └── utils.tsx                # Test utilities
└── types/                       # TypeScript definitions
tests/
├── e2e/                         # Playwright tests
└── fixtures/                    # Test data
```

## 🚀 Migration Steps

### Phase 1: Package Manager & Dependencies
1. Install Bun and migrate from npm
2. Add new dependencies (React Query, Zustand, etc.)
3. Update package.json scripts

### Phase 2: Code Quality Setup
1. Configure ESLint and Prettier
2. Set up pre-commit hooks with husky
3. Configure VSCode settings

### Phase 3: API Layer Refactoring
1. Replace existing API calls with React Query
2. Implement optimistic updates
3. Add error boundaries

### Phase 4: State Management Migration
1. Replace React Context with Zustand stores
2. Migrate authentication state
3. Implement expense management state

### Phase 5: Testing Implementation
1. Set up Vitest for unit tests
2. Configure Playwright for E2E tests
3. Write comprehensive test suite

### Phase 6: Performance Optimization
1. Implement code splitting
2. Optimize bundle size
3. Add performance monitoring

## 📊 Expected Benefits

### Performance Improvements
- **25x faster** package installation with Bun
- **Reduced bundle size** with tree-shaking optimizations
- **Better caching** with React Query
- **Faster test execution** with Vitest

### Developer Experience
- **Auto-formatting** with Prettier
- **Real-time linting** with ESLint
- **Type safety** throughout the application
- **Comprehensive testing** coverage

### Code Quality
- **Consistent formatting** across the codebase
- **Catch errors early** with linting
- **Reliable testing** with Playwright and Vitest
- **Better state management** with Zustand

### Maintenance
- **Easier debugging** with DevTools
- **Better error handling** with React Query
- **Simplified state logic** with Zustand
- **Automated code quality** checks

## 🎯 Next Steps

1. **Review this implementation plan** with the team
2. **Set up development environment** with new tools
3. **Create migration timeline** for gradual rollout
4. **Train team members** on new technologies
5. **Implement CI/CD pipeline** with new tooling

This modern stack will significantly improve the development experience, code quality, and application performance of your AptSync application! 🚀