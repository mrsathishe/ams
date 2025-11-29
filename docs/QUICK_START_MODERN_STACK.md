# Quick Start: Modern Stack Implementation

This guide provides step-by-step instructions and configuration files to implement the modern development stack for AptSync.

## 🚀 Phase 1: Bun Migration (30 minutes)

### 1. Install Bun
```bash
# Install Bun globally
curl -fsSL https://bun.sh/install | bash

# Restart terminal and verify
bun --version
```

### 2. Migrate Package Manager
```bash
# Remove npm/yarn lock files
rm package-lock.json yarn.lock 2>/dev/null || true
rm -rf node_modules

# Install with Bun
bun install

# Test dev server
bun run dev
```

### 3. Update Package Scripts
Add to your `package.json`:
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

## 📋 Phase 2: Code Quality Setup (20 minutes)

### 1. Install ESLint & Prettier
```bash
bun add -d eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh prettier eslint-config-prettier eslint-plugin-prettier
```

### 2. ESLint Configuration
Create `.eslintrc.json`:
```json
{
  \"extends\": [
    \"eslint:recommended\",
    \"@typescript-eslint/recommended\",
    \"plugin:react/recommended\",
    \"plugin:react-hooks/recommended\",
    \"plugin:react/jsx-runtime\",
    \"prettier\"
  ],
  \"parser\": \"@typescript-eslint/parser\",
  \"parserOptions\": {
    \"ecmaVersion\": \"latest\",
    \"sourceType\": \"module\",
    \"ecmaFeatures\": {
      \"jsx\": true
    }
  },
  \"plugins\": [\"@typescript-eslint\", \"react\", \"react-hooks\", \"react-refresh\", \"prettier\"],
  \"rules\": {
    \"prettier/prettier\": \"error\",
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
  },
  \"env\": {
    \"browser\": true,
    \"es2020\": true,
    \"node\": true
  }
}
```

### 3. Prettier Configuration  
Create `.prettierrc`:
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

### 4. VSCode Settings
Create `.vscode/settings.json`:
```json
{
  \"editor.formatOnSave\": true,
  \"editor.defaultFormatter\": \"esbenp.prettier-vscode\",
  \"editor.codeActionsOnSave\": {
    \"source.fixAll.eslint\": \"explicit\"
  },
  \"eslint.validate\": [\"typescript\", \"typescriptreact\"],
  \"typescript.preferences.importModuleSpecifier\": \"relative\"
}
```

## 🔄 Phase 3: React Query Setup (15 minutes)

### 1. Install Dependencies
```bash
bun add @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Create Query Client
Create `src/lib/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 3. Update Main App
Update `src/main.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import StyledThemeProvider from './components/StyledThemeProvider';
import { queryClient } from './lib/queryClient';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyledThemeProvider>
        <App />
      </StyledThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## 🐻 Phase 4: Zustand State Management (25 minutes)

### 1. Install Zustand
```bash
bun add zustand immer
bun add -d @types/node
```

### 2. Create Auth Store
Create `src/stores/authStore.ts`:
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
        setUser: user =>
          set(state => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        setToken: token =>
          set(state => {
            state.token = token;
          }),

        login: (user, token) =>
          set(state => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.error = null;
          }),

        logout: () =>
          set(state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          }),

        setLoading: loading =>
          set(state => {
            state.isLoading = loading;
          }),

        setError: error =>
          set(state => {
            state.error = error;
          }),

        clearError: () =>
          set(state => {
            state.error = null;
          }),
      })),
      {
        name: 'auth-storage',
        partialize: state => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// Convenient hooks
export const useAuth = () =>
  useAuthStore(state => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));

export const useAuthActions = () =>
  useAuthStore(state => ({
    login: state.login,
    logout: state.logout,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
  }));
```

## ⚡ Phase 5: Vitest Setup (15 minutes)

### 1. Install Testing Dependencies
```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Update Vite Config
Update `vite.config.ts`:
```typescript
/// <reference types=\"vitest\" />
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
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

### 3. Create Test Setup
Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();
```

### 4. Create Test Utilities  
Create `src/test/utils.tsx`:
```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## 🎭 Phase 6: Playwright Setup (20 minutes)

### 1. Install Playwright
```bash
bun add -d @playwright/test
bunx playwright install
```

### 2. Create Playwright Config
Create `playwright.config.ts`:
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

### 3. Create Example E2E Test
Create `tests/e2e/login.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('h2')).toContainText('Sign in to AptSync');
    await expect(page.getByLabelText(/email/i)).toBeVisible();
    await expect(page.getByLabelText(/password/i)).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should stay on login page
    await expect(page).toHaveURL(/login/);
  });
});
```

## 🔧 Phase 7: API Hooks Implementation (30 minutes)

### 1. Create API Hook for Authentication
Create `src/hooks/api/useAuth.ts`:
```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { queryClient } from '../../lib/queryClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
  access_token: string;
}

// Mock API functions (replace with real API calls)
const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },
  
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to get user');
    return response.json();
  },
};

export const useLogin = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.access_token);
      localStorage.setItem('token', data.access_token);
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      useAuthStore.getState().setError(error.message || 'Login failed');
    },
  });
};

export const useCurrentUser = () => {
  const { token } = useAuthStore();
  
  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    retry: false,
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  
  return useMutation({
    mutationFn: async () => {
      // Call logout API if needed
      await fetch('/api/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      logout();
      localStorage.removeItem('token');
      queryClient.clear();
    },
  });
};
```

## 📊 Verification Steps

### 1. Test Package Manager
```bash
# Should be much faster than npm
bun install

# Test dev server
bun run dev
```

### 2. Test Code Quality
```bash
# Run linting
bun run lint

# Test auto-formatting  
bun run format

# Check types
bun run type-check
```

### 3. Test State Management
```bash
# Check Zustand DevTools in browser
# Should see AuthStore in Redux DevTools extension
```

### 4. Test Unit Tests
```bash
# Run unit tests
bun run test

# Run with UI
bun run test:ui
```

### 5. Test E2E
```bash
# Run E2E tests
bun run test:e2e

# Run specific test
bunx playwright test login.spec.ts --headed
```

## 🎯 Success Metrics

After implementation, you should see:

- ⚡ **25x faster** `bun install` vs `npm install`
- 🎨 **Auto-formatting** on file save
- 🛡️ **Type safety** throughout app
- 🔄 **Smart caching** with React Query
- 🐛 **Fewer bugs** with comprehensive testing
- 📊 **Better DevTools** for debugging

## 🚀 Ready to Start?

1. **Backup your current code** 
2. **Follow phases sequentially**
3. **Test each phase** before moving to next
4. **Ask for help** if you encounter issues

The modern stack will transform your development experience! 🌟