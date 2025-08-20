# Phase 1: Authentication & User Management - TDD Implementation Plan

## Overview
This document provides a detailed TDD-driven implementation plan for the authentication and user management system using Clerk.dev, following the RED/GREEN/REFACTOR cycle for each feature.

## Prerequisites
- Node.js and npm installed
- Next.js 14 project initialized
- TypeScript configured
- Testing framework (Jest + React Testing Library) set up

## Implementation Steps

### Step 1: Clerk.dev Configuration

#### 🟥 RED Phase - Test 1.1: Environment Variables Validation
```typescript
// src/lib/auth/clerk-config.test.ts
describe('Clerk Configuration', () => {
  it('should validate required environment variables are present', () => {
    const config = getClerkConfig();
    expect(config.publishableKey).toBeDefined();
    expect(config.secretKey).toBeDefined();
  });
});
```
**Purpose**: Ensures Clerk configuration is properly set up with required environment variables.

#### 🟩 GREEN Phase - Implementation 1.1
```typescript
// src/lib/auth/clerk-config.ts
export function getClerkConfig() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  if (!publishableKey || !secretKey) {
    throw new Error('Missing Clerk environment variables');
  }
  
  return { publishableKey, secretKey };
}
```

#### 🟥 RED Phase - Test 1.2: Clerk Provider Setup
```typescript
// src/app/layout.test.tsx
describe('Root Layout', () => {
  it('should wrap application with ClerkProvider', () => {
    const { container } = render(<RootLayout><div>Test</div></RootLayout>);
    expect(container.querySelector('[data-clerk-provider]')).toBeInTheDocument();
  });
});
```

#### 🟩 GREEN Phase - Implementation 1.2
```typescript
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <div data-clerk-provider>{children}</div>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

### Step 2: User Registration Flow

#### 🟥 RED Phase - Test 2.1: Sign-up Page Rendering
```typescript
// src/app/(auth)/sign-up/page.test.tsx
describe('Sign Up Page', () => {
  it('should render email and password input fields', () => {
    render(<SignUpPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.1
```typescript
// src/app/(auth)/sign-up/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

#### 🟥 RED Phase - Test 2.2: Registration Form Validation
```typescript
// src/components/auth/sign-up-form.test.tsx
describe('Sign Up Form', () => {
  it('should show validation error for invalid email', async () => {
    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/email/i);
    
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });
  
  it('should show validation error for weak password', async () => {
    render(<SignUpForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await userEvent.type(passwordInput, '123');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.2
```typescript
// src/components/auth/sign-up-form.tsx
import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';

export function SignUpForm() {
  const { signUp } = useSignUp();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const newErrors: Record<string, string> = {};
    
    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Proceed with sign up
    await signUp?.create({ emailAddress: email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### Step 3: Protected Routes

#### 🟥 RED Phase - Test 3.1: Middleware Protection
```typescript
// src/middleware.test.ts
describe('Authentication Middleware', () => {
  it('should redirect unauthenticated users to sign-in page', async () => {
    const req = new NextRequest('http://localhost:3000/dashboard');
    const res = await middleware(req);
    
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/sign-in');
  });
  
  it('should allow authenticated users to access protected routes', async () => {
    const req = new NextRequest('http://localhost:3000/dashboard');
    // Mock authenticated state
    mockAuth({ userId: 'user_123' });
    
    const res = await middleware(req);
    expect(res).toBeUndefined(); // No redirect
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.1
```typescript
// src/middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      return Response.redirect(signInUrl, 307);
    }
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

#### 🟥 RED Phase - Test 3.2: Protected Page Component
```typescript
// src/components/auth/protected-route.test.tsx
describe('Protected Route Component', () => {
  it('should render children when user is authenticated', () => {
    mockAuth({ userId: 'user_123' });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
  
  it('should redirect to sign-in when user is not authenticated', () => {
    mockAuth({ userId: null });
    const push = jest.fn();
    mockRouter({ push });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(push).toHaveBeenCalledWith('/sign-in');
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.2
```typescript
// src/components/auth/protected-route.tsx
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return null;
  
  return <>{children}</>;
}
```

### Step 4: User Profile Management

#### 🟥 RED Phase - Test 4.1: Profile Display
```typescript
// src/app/profile/page.test.tsx
describe('Profile Page', () => {
  it('should display user email and name', async () => {
    mockAuth({ 
      userId: 'user_123',
      user: { emailAddress: 'test@example.com', firstName: 'John' }
    });
    
    render(<ProfilePage />);
    
    expect(await screen.findByText('test@example.com')).toBeInTheDocument();
    expect(await screen.findByText('John')).toBeInTheDocument();
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.1
```typescript
// src/app/profile/page.tsx
import { currentUser } from '@clerk/nextjs';

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) return <div>Not authenticated</div>;
  
  return (
    <div>
      <h1>Profile</h1>
      <p>{user.emailAddresses[0]?.emailAddress}</p>
      <p>{user.firstName}</p>
    </div>
  );
}
```

#### 🟥 RED Phase - Test 4.2: Profile Update Form
```typescript
// src/components/profile/update-form.test.tsx
describe('Profile Update Form', () => {
  it('should update user profile on form submission', async () => {
    const updateUser = jest.fn();
    mockClerk({ updateUser });
    
    render(<ProfileUpdateForm />);
    
    const nameInput = screen.getByLabelText(/first name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane');
    
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(updateUser).toHaveBeenCalledWith({
      firstName: 'Jane'
    });
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.2
```typescript
// src/components/profile/update-form.tsx
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export function ProfileUpdateForm() {
  const { user, update } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await update({ firstName });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

### Step 5: Session State Management

#### 🟥 RED Phase - Test 5.1: Zustand Auth Store
```typescript
// src/stores/auth-store.test.ts
describe('Auth Store', () => {
  it('should initialize with null user', () => {
    const { user } = useAuthStore.getState();
    expect(user).toBeNull();
  });
  
  it('should set user on login', () => {
    const testUser = { id: 'user_123', email: 'test@example.com' };
    useAuthStore.getState().setUser(testUser);
    
    const { user } = useAuthStore.getState();
    expect(user).toEqual(testUser);
  });
  
  it('should clear user on logout', () => {
    useAuthStore.getState().setUser({ id: 'user_123', email: 'test@example.com' });
    useAuthStore.getState().clearUser();
    
    const { user } = useAuthStore.getState();
    expect(user).toBeNull();
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.1
```typescript
// src/stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### 🟥 RED Phase - Test 5.2: Auth Hook Integration
```typescript
// src/hooks/use-auth.test.ts
describe('useAuth Hook', () => {
  it('should sync Clerk user with Zustand store', () => {
    mockClerk({ userId: 'user_123', emailAddress: 'test@example.com' });
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual({
      id: 'user_123',
      email: 'test@example.com'
    });
  });
  
  it('should provide logout function that clears both Clerk and store', async () => {
    const signOut = jest.fn();
    mockClerk({ signOut });
    
    const { result } = renderHook(() => useAuth());
    await result.current.logout();
    
    expect(signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.2
```typescript
// src/hooks/use-auth.ts
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';

export function useAuth() {
  const { userId, signOut, user: clerkUser } = useClerkAuth();
  const { user, setUser, clearUser } = useAuthStore();
  
  useEffect(() => {
    if (userId && clerkUser) {
      setUser({
        id: userId,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
      });
    } else {
      clearUser();
    }
  }, [userId, clerkUser, setUser, clearUser]);
  
  const logout = async () => {
    await signOut();
    clearUser();
  };
  
  return { user, logout };
}
```

## Testing Checklist

### Unit Tests
- [ ] Clerk configuration validation
- [ ] Sign-up form validation
- [ ] Sign-in form validation
- [ ] Protected route component
- [ ] Profile display component
- [ ] Profile update form
- [ ] Auth store operations
- [ ] useAuth hook integration

### Integration Tests
- [ ] Complete registration flow
- [ ] Complete login flow
- [ ] Protected route navigation
- [ ] Profile update flow
- [ ] Session persistence
- [ ] Logout flow

### E2E Tests
- [ ] User can register new account
- [ ] User can log in with credentials
- [ ] User can access protected pages
- [ ] User can update profile
- [ ] User can log out
- [ ] Session persists on page refresh

## Success Metrics
- All unit tests passing (100% of auth components)
- Integration tests passing with mocked Clerk
- Zero authentication-related errors in production
- Average authentication flow completion < 2 seconds
- Session persistence working across browser restarts

## Next Steps
After completing all tests and implementations:
1. Run full test suite: `npm run test`
2. Check coverage: `npm run test:coverage`
3. Commit with message: `feat: implement authentication system with Clerk.dev`
4. Document any environment variables in `.env.example`
5. Update README with authentication setup instructions