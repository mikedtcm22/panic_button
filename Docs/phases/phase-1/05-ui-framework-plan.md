# Phase 1: Basic UI Framework - TDD Implementation Plan

## Overview
This document provides a detailed TDD-driven implementation plan for establishing the Next.js 14 application with Tailwind CSS and Radix UI components, following the RED/GREEN/REFACTOR cycle for each feature.

## Prerequisites
- Node.js 18+ and npm installed
- Git initialized
- Basic project structure ready

## Implementation Steps

### Step 1: Next.js 14 Setup with App Router

#### 🟥 RED Phase - Test 1.1: Next.js Configuration
```typescript
// tests/setup/nextjs-config.test.ts
describe('Next.js Configuration', () => {
  it('should have Next.js 14 with App Router configured', () => {
    const packageJson = require('../package.json');
    expect(packageJson.dependencies.next).toMatch(/^14\./);
    
    const nextConfig = require('../next.config.js');
    expect(nextConfig).toBeDefined();
  });
  
  it('should have TypeScript configuration', () => {
    const tsConfig = require('../tsconfig.json');
    expect(tsConfig.compilerOptions.jsx).toBe('preserve');
    expect(tsConfig.compilerOptions.strict).toBe(true);
  });
});
```
**Purpose**: Ensures Next.js 14 is properly configured with TypeScript and App Router.

#### 🟩 GREEN Phase - Implementation 1.1
```bash
# Terminal commands
npx create-next-app@14 . --typescript --app --tailwind --no-src-dir
```

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 🟥 RED Phase - Test 1.2: App Directory Structure
```typescript
// tests/structure/app-structure.test.ts
import fs from 'fs';
import path from 'path';

describe('App Directory Structure', () => {
  it('should have required app directory files', () => {
    const appDir = path.join(process.cwd(), 'src/app');
    
    expect(fs.existsSync(path.join(appDir, 'layout.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'page.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'globals.css'))).toBe(true);
  });
  
  it('should have error handling files', () => {
    const appDir = path.join(process.cwd(), 'src/app');
    
    expect(fs.existsSync(path.join(appDir, 'error.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'not-found.tsx'))).toBe(true);
  });
});
```

#### 🟩 GREEN Phase - Implementation 1.2
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Improv Panic Button',
  description: 'AI-powered D&D assistant for Dungeon Masters',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

```typescript
// src/app/page.tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Improv Panic Button</h1>
    </main>
  );
}
```

```typescript
// src/app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Try again
      </button>
    </div>
  );
}
```

```typescript
// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="mt-2">Could not find the requested resource</p>
    </div>
  );
}
```

### Step 2: Tailwind CSS and Radix UI Configuration

#### 🟥 RED Phase - Test 2.1: Tailwind Configuration
```typescript
// tests/styling/tailwind.test.ts
describe('Tailwind CSS Configuration', () => {
  it('should have Tailwind CSS configured', () => {
    const tailwindConfig = require('../tailwind.config.js');
    
    expect(tailwindConfig.content).toContain('./src/**/*.{js,ts,jsx,tsx,mdx}');
    expect(tailwindConfig.theme.extend).toBeDefined();
  });
  
  it('should have custom color palette', () => {
    const tailwindConfig = require('../tailwind.config.js');
    
    expect(tailwindConfig.theme.extend.colors['panic-red']).toBeDefined();
    expect(tailwindConfig.theme.extend.colors['dm-purple']).toBeDefined();
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.1
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'panic-red': '#dc2626',
        'dm-purple': '#7c3aed',
        'parchment': '#f5e6d3',
        'ink-black': '#1a1a1a',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

#### 🟥 RED Phase - Test 2.2: Radix UI Setup
```typescript
// tests/components/radix-ui.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Radix UI Components', () => {
  it('should render Radix UI button component', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('should apply custom styling to Radix components', () => {
    render(<Button className="bg-panic-red">Panic!</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-panic-red');
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.2
```bash
# Install Radix UI primitives
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
npm install class-variance-authority clsx tailwind-merge
```

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```typescript
// src/components/ui/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        panic: 'bg-panic-red text-white hover:bg-red-700',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

### Step 3: Layout Components

#### 🟥 RED Phase - Test 3.1: Header Component
```typescript
// src/components/layout/header.test.tsx
describe('Header Component', () => {
  it('should render site title and navigation', () => {
    render(<Header />);
    
    expect(screen.getByText('Improv Panic Button')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  
  it('should show auth buttons when not logged in', () => {
    render(<Header isAuthenticated={false} />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
  
  it('should show user menu when logged in', () => {
    render(<Header isAuthenticated={true} userName="DM John" />);
    
    expect(screen.getByText('DM John')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.1
```typescript
// src/components/layout/header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export function Header({ isAuthenticated = false, userName }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-dm-purple">
              Improv Panic Button
            </Link>
          </div>
          
          <nav role="navigation" className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/campaigns" className="text-gray-700 hover:text-gray-900">
                  Campaigns
                </Link>
                <div className="text-gray-700">{userName}</div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

#### 🟥 RED Phase - Test 3.2: Sidebar Navigation
```typescript
// src/components/layout/sidebar.test.tsx
describe('Sidebar Component', () => {
  it('should render navigation links', () => {
    render(<Sidebar />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
  
  it('should highlight active route', () => {
    render(<Sidebar activeRoute="/campaigns" />);
    
    const campaignsLink = screen.getByText('Campaigns').parentElement;
    expect(campaignsLink).toHaveClass('bg-gray-100');
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.2
```typescript
// src/components/layout/sidebar.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeRoute?: string;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/campaigns', label: 'Campaigns', icon: '📚' },
  { href: '/sessions', label: 'Sessions', icon: '🎲' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar({ activeRoute }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
              activeRoute === item.href
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

### Step 4: Responsive Navigation

#### 🟥 RED Phase - Test 4.1: Mobile Navigation
```typescript
// src/components/layout/mobile-nav.test.tsx
describe('Mobile Navigation', () => {
  it('should show hamburger menu on mobile', () => {
    render(<MobileNav />);
    
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });
  
  it('should toggle menu visibility on click', async () => {
    render(<MobileNav />);
    
    const menuButton = screen.getByLabelText('Open menu');
    
    // Menu should be hidden initially
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    
    // Click to open
    await userEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Click to close
    await userEvent.click(menuButton);
    await waitFor(() => {
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.1
```typescript
// src/components/layout/mobile-nav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </Button>
      
      {isOpen && (
        <nav
          role="navigation"
          className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg"
        >
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/campaigns"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Campaigns
            </Link>
            <Link
              href="/sessions"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Sessions
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
```

### Step 5: Loading and Error States

#### 🟥 RED Phase - Test 5.1: Loading Components
```typescript
// src/components/ui/loading.test.tsx
describe('Loading Components', () => {
  it('should render spinner with loading text', () => {
    render(<LoadingSpinner text="Loading campaigns..." />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading campaigns...')).toBeInTheDocument();
  });
  
  it('should render skeleton loader with correct dimensions', () => {
    render(<Skeleton className="h-10 w-32" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-10', 'w-32');
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.1
```typescript
// src/components/ui/loading.tsx
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = 'Loading...', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-4', className)}>
      <div role="status" className="relative">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-dm-purple" />
        <span className="sr-only">{text}</span>
      </div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      data-testid="skeleton"
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
    />
  );
}
```

#### 🟥 RED Phase - Test 5.2: Toast Notifications
```typescript
// src/components/ui/toast.test.tsx
describe('Toast Notifications', () => {
  it('should show success toast', () => {
    const { showToast } = renderHook(() => useToast()).result.current;
    
    act(() => {
      showToast({
        title: 'Success!',
        description: 'Campaign saved successfully',
        variant: 'success',
      });
    });
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Campaign saved successfully')).toBeInTheDocument();
  });
  
  it('should auto-dismiss after timeout', async () => {
    const { showToast } = renderHook(() => useToast()).result.current;
    
    act(() => {
      showToast({
        title: 'Info',
        duration: 1000,
      });
    });
    
    expect(screen.getByText('Info')).toBeInTheDocument();
    
    await waitFor(
      () => {
        expect(screen.queryByText('Info')).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.2
```typescript
// src/hooks/use-toast.tsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error';
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration || 3000);
    }
  }, []);
  
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            'rounded-lg p-4 shadow-lg',
            {
              'bg-white border': toast.variant === 'default',
              'bg-green-50 border-green-200': toast.variant === 'success',
              'bg-red-50 border-red-200': toast.variant === 'error',
            }
          )}
        >
          <h3 className="font-semibold">{toast.title}</h3>
          {toast.description && (
            <p className="mt-1 text-sm text-gray-600">{toast.description}</p>
          )}
          <button
            onClick={() => onDismiss(toast.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Testing Checklist

### Unit Tests
- [ ] Next.js configuration validation
- [ ] TypeScript configuration
- [ ] App directory structure
- [ ] Tailwind CSS configuration
- [ ] Radix UI component rendering
- [ ] Header component states
- [ ] Sidebar navigation
- [ ] Mobile navigation toggle
- [ ] Loading components
- [ ] Toast notifications

### Integration Tests
- [ ] Layout composition
- [ ] Navigation flow
- [ ] Responsive behavior
- [ ] Error boundary handling
- [ ] Loading state transitions

### Visual Tests
- [ ] Component styling consistency
- [ ] Responsive breakpoints
- [ ] Dark mode support (if implemented)
- [ ] Animation smoothness

## Success Metrics
- All unit tests passing (100% of UI components)
- Lighthouse score > 90 for performance
- Mobile responsive at all breakpoints
- Zero accessibility violations
- Page load time < 3 seconds

## Next Steps
After completing all tests and implementations:
1. Run full test suite: `npm run test`
2. Check coverage: `npm run test:coverage`
3. Run build: `npm run build`
4. Commit with message: `feat: implement basic UI framework with Next.js 14, Tailwind, and Radix UI`
5. Document component usage in Storybook
6. Set up visual regression testing