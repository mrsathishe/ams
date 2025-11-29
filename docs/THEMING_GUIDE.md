# Frontend Theming Guide

This document provides a comprehensive guide for implementing themed color styles in the AptSync frontend using Tailwind CSS and React.

## Table of Contents
- [Current Setup](#current-setup)
- [Color Palette Strategy](#color-palette-strategy)
- [Dark Mode Implementation](#dark-mode-implementation)
- [Custom Theme Components](#custom-theme-components)
- [Implementation Examples](#implementation-examples)
- [Best Practices](#best-practices)
- [Advanced Theming](#advanced-theming)

---

## Current Setup

### Existing Configuration
The project currently uses:
- **Tailwind CSS v4.1.17** with PostCSS
- **Primary color palette** (blue theme)
- **@tailwindcss/forms** plugin
- **React Context** for state management

### Current Tailwind Config
```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe", 
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Main brand color
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
```

---

## Color Palette Strategy

### 1. Expand Color System

Update `tailwind.config.js` to include a complete theme system:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors (Blue)
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe", 
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Main brand
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        
        // Secondary Colors (Green for success/money)
        secondary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac", 
          400: "#4ade80",
          500: "#22c55e", // Success/money
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        
        // Accent Colors (Purple for admin/premium)
        accent: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7", // Admin/premium
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
        
        // Neutral/Gray System
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        
        // Status Colors
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        warning: {
          50: "#fffbeb", 
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        error: {
          50: "#fef2f2",
          500: "#ef4444", 
          600: "#dc2626",
          700: "#b91c1c",
        },
        info: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb", 
          700: "#1d4ed8",
        },
      },
      
      // Custom spacing for consistent design
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      
      // Custom shadows for depth
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
```

### 2. CSS Custom Properties for Dynamic Theming

Create `src/styles/themes.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light Theme Variables */
    --color-background: 255 255 255;
    --color-foreground: 15 23 42;
    --color-muted: 248 250 252;
    --color-muted-foreground: 100 116 139;
    --color-border: 226 232 240;
    --color-input: 255 255 255;
    --color-ring: 59 130 246;
    
    /* Brand Colors */
    --color-primary: 59 130 246;
    --color-primary-foreground: 255 255 255;
    --color-secondary: 34 197 94;
    --color-secondary-foreground: 255 255 255;
    --color-accent: 168 85 247;
    --color-accent-foreground: 255 255 255;
    
    /* Status Colors */
    --color-success: 34 197 94;
    --color-warning: 245 158 11;
    --color-error: 239 68 68;
    --color-info: 59 130 246;
  }
  
  .dark {
    /* Dark Theme Variables */
    --color-background: 15 23 42;
    --color-foreground: 248 250 252;
    --color-muted: 30 41 59;
    --color-muted-foreground: 148 163 184;
    --color-border: 51 65 85;
    --color-input: 30 41 59;
    --color-ring: 59 130 246;
    
    /* Brand Colors (adjusted for dark mode) */
    --color-primary: 96 165 250;
    --color-primary-foreground: 15 23 42;
    --color-secondary: 74 222 128;
    --color-secondary-foreground: 15 23 42;
    --color-accent: 196 181 253;
    --color-accent-foreground: 15 23 42;
    
    /* Status Colors (adjusted) */
    --color-success: 74 222 128;
    --color-warning: 251 191 36;
    --color-error: 248 113 113;
    --color-info: 96 165 250;
  }
  
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  /* Utility classes using CSS variables */
  .bg-background { background-color: rgb(var(--color-background)); }
  .text-foreground { color: rgb(var(--color-foreground)); }
  .bg-muted { background-color: rgb(var(--color-muted)); }
  .text-muted-foreground { color: rgb(var(--color-muted-foreground)); }
  .border-border { border-color: rgb(var(--color-border)); }
}
```

---

## Dark Mode Implementation

### 1. Theme Context Provider

Create `src/context/ThemeContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme;
    return stored || "system";
  });

  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark" 
        : "light";
      setActualTheme(systemTheme);
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      setActualTheme(theme);
      root.classList.toggle("dark", theme === "dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? "dark" : "light");
        document.documentElement.classList.toggle("dark", e.matches);
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

### 2. Theme Toggle Component

Create `src/components/ThemeToggle.tsx`:

```typescript
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${theme === value 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }
          `}
          title={`Switch to ${label} theme`}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
```

---

## Custom Theme Components

### 1. Apartment Management Specific Themes

Create theme variations for different user roles:

```typescript
// src/config/themes.ts
export const roleThemes = {
  admin: {
    primary: "accent", // Purple for admin
    gradient: "from-accent-500 to-accent-700",
    icon: "text-accent-500",
  },
  tenant: {
    primary: "primary", // Blue for tenants
    gradient: "from-primary-500 to-primary-700", 
    icon: "text-primary-500",
  },
  owner: {
    primary: "secondary", // Green for owners
    gradient: "from-secondary-500 to-secondary-700",
    icon: "text-secondary-500",
  },
} as const;

export const statusThemes = {
  paid: "text-success-600 bg-success-50 border-success-200",
  pending: "text-warning-600 bg-warning-50 border-warning-200", 
  overdue: "text-error-600 bg-error-50 border-error-200",
  upcoming: "text-info-600 bg-info-50 border-info-200",
} as const;
```

### 2. Themed Card Component

Create `src/components/ThemedCard.tsx`:

```typescript
import { ReactNode } from "react";
import { roleThemes } from "../config/themes";

interface ThemedCardProps {
  children: ReactNode;
  role?: keyof typeof roleThemes;
  variant?: "default" | "gradient" | "outline";
  className?: string;
}

export function ThemedCard({ 
  children, 
  role = "tenant", 
  variant = "default",
  className = "" 
}: ThemedCardProps) {
  const theme = roleThemes[role];
  
  const variants = {
    default: "bg-background border border-border shadow-card",
    gradient: `bg-gradient-to-br ${theme.gradient} text-white`,
    outline: `border-2 border-${theme.primary}-200 bg-${theme.primary}-50/50`,
  };

  return (
    <div className={`
      rounded-xl p-6 transition-all duration-200 hover:shadow-card-hover
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </div>
  );
}
```

---

## Implementation Examples

### 1. Updated Login Page with Theming

```typescript
// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <span className="text-2xl text-primary-600 dark:text-primary-400">🏠</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to AptSync
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Apartment Management System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-xl bg-muted p-6 shadow-card">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password" 
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-error-50 border border-error-200 p-4">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate("/register")}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 2. Dashboard with Role-Based Theming

```typescript
// src/pages/DashboardPage.tsx
import { useAuth } from "../lib/useAuth";
import { ThemedCard } from "../components/ThemedCard";
import { ThemeToggle } from "../components/ThemeToggle";
import { roleThemes, statusThemes } from "../config/themes";

export default function DashboardPage() {
  const { user } = useAuth();
  const userRole = user?.role || "tenant";
  const theme = roleThemes[userRole];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                <span className="text-white text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {userRole} Dashboard
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ThemedCard role={userRole} variant="gradient">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-white">₹12,450</p>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </ThemedCard>

          <ThemedCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Payments</p>
                <p className="text-2xl font-bold text-foreground">₹3,200</p>
              </div>
              <div className={`h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center`}>
                <span className="text-warning-600 text-xl">⏳</span>
              </div>
            </div>
          </ThemedCard>

          <ThemedCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Paid This Month</p>
                <p className="text-2xl font-bold text-foreground">₹8,750</p>
              </div>
              <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center">
                <span className="text-success-600 text-xl">✅</span>
              </div>
            </div>
          </ThemedCard>

          <ThemedCard role={userRole} variant="outline">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${theme.primary}-600 text-sm`}>Savings</p>
                <p className={`text-2xl font-bold text-${theme.primary}-700`}>₹2,100</p>
              </div>
              <div className={`h-12 w-12 bg-${theme.primary}-100 rounded-lg flex items-center justify-center`}>
                <span className={`${theme.icon} text-xl`}>📈</span>
              </div>
            </div>
          </ThemedCard>
        </div>

        {/* Recent Activity */}
        <ThemedCard className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { type: "paid", amount: "₹1,200", desc: "Electricity Bill - Nov 2025", date: "2 days ago" },
              { type: "pending", amount: "₹800", desc: "Water Bill - Nov 2025", date: "5 days ago" },
              { type: "overdue", amount: "₹1,500", desc: "Maintenance Fee - Oct 2025", date: "1 week ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusThemes[activity.type as keyof typeof statusThemes]}`}>
                    {activity.type.toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.desc}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">{activity.amount}</span>
              </div>
            ))}
          </div>
        </ThemedCard>
      </main>
    </div>
  );
}
```

---

## Best Practices

### 1. Consistent Color Usage
- Use semantic color names (`primary`, `secondary`, `success`) rather than specific colors (`blue`, `green`)
- Maintain consistent contrast ratios for accessibility
- Test all themes in both light and dark modes

### 2. CSS Custom Properties Benefits
- Dynamic theme switching without CSS rebuilds
- Better performance than class-based theming
- Easier integration with JavaScript theme logic

### 3. Accessibility Considerations
- Ensure WCAG 2.1 AA compliance (4.5:1 contrast ratio)
- Provide system theme detection
- Support reduced motion preferences
- Include focus indicators for keyboard navigation

### 4. Performance Tips
- Use CSS custom properties for theme colors
- Minimize theme-specific CSS bundles
- Lazy load theme-specific components
- Cache user theme preferences

---

## Advanced Theming

### 1. Apartment-Specific Themes
Create building or apartment complex specific color schemes:

```typescript
// src/config/apartmentThemes.ts
export const apartmentThemes = {
  "oak-residency": {
    primary: "#8B4513", // Brown
    secondary: "#228B22", // Forest Green
    accent: "#DAA520", // Goldenrod
  },
  "blue-bay-apartments": {
    primary: "#4682B4", // Steel Blue
    secondary: "#20B2AA", // Light Sea Green  
    accent: "#FF6347", // Tomato
  },
  "green-valley": {
    primary: "#32CD32", // Lime Green
    secondary: "#8FBC8F", // Dark Sea Green
    accent: "#FFD700", // Gold
  },
} as const;
```

### 2. Seasonal Theme Variants
Implement seasonal color adjustments:

```typescript
// src/hooks/useSeasonalTheme.ts
export function useSeasonalTheme() {
  const currentMonth = new Date().getMonth();
  
  const seasonalAdjustments = {
    winter: { hue: 220, saturation: 0.9 }, // Cooler blues
    spring: { hue: 120, saturation: 1.1 }, // Vibrant greens
    summer: { hue: 60, saturation: 1.2 },  // Warm yellows
    autumn: { hue: 30, saturation: 1.0 },  // Warm oranges
  };
  
  const getSeason = (month: number) => {
    if (month >= 11 || month <= 1) return "winter";
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    return "autumn";
  };
  
  return seasonalAdjustments[getSeason(currentMonth)];
}
```

### 3. Dynamic Brand Color Generation
Create themes from a single brand color:

```typescript
// src/utils/colorGenerator.ts
export function generateThemeFromColor(baseColor: string) {
  // Implementation to generate full color palette from single color
  // Using color theory (complementary, triadic, etc.)
}
```

---

## Testing Themes

### 1. Visual Regression Testing
- Test all components in light/dark modes
- Verify accessibility standards
- Check responsive design across themes

### 2. User Preference Testing
- A/B test different theme options
- Gather feedback on color accessibility
- Monitor theme switching usage

---

*This theming guide provides a comprehensive foundation for implementing beautiful, accessible, and maintainable themes in the AptSync frontend application.*