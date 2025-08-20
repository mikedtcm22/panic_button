# Improv Panic Button - Project Rules & Standards

## Overview
This document defines the complete development standards, file organization, and coding conventions for the Improv Panic Button project. These rules ensure the codebase remains AI-first, highly navigable, and maintainable as the project scales.

## Core Development Philosophy

### AI-First Principles
- **Modular Architecture**: Every component, utility, and service exists as a discrete, well-defined module
- **Clear Interfaces**: All functions and components have explicit input/output contracts
- **Self-Documenting Code**: Code structure and naming should be immediately understandable
- **Predictable Patterns**: Consistent patterns across all code areas for easy AI comprehension
- **500-Line Rule**: No file exceeds 500 lines to maximize AI tool compatibility

### Scalability Standards
- **Separation of Concerns**: Each file has a single, clear purpose
- **Loose Coupling**: Components depend on interfaces, not implementations
- **High Cohesion**: Related functionality is grouped together
- **Progressive Enhancement**: Features can be added without breaking existing functionality

---

## Project Directory Structure

### Root Level Organization
```
panic_button/
├── README.md                    # Project overview and setup instructions
├── .cursor/                     # Cursor AI workspace configuration
│   └── scratchpad.md           # Project management and progress tracking
├── Docs/                        # Project documentation
│   ├── project-overview.md      # Core requirements and vision
│   ├── user-flow.md            # User journey and feature flows
│   ├── tech-stack.md           # Technology implementation guide
│   ├── ui-rules.md             # UI design principles and patterns
│   ├── theme-rules.md          # Visual design system and CSS
│   └── project-rules.md        # This file - development standards
├── .env.local                   # Local environment variables
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore patterns
├── package.json                 # Node.js dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── prisma/                     # Database configuration
│   ├── schema.prisma           # Database schema definition
│   └── migrations/             # Database migration files
├── public/                     # Static assets
│   ├── icons/                  # Icon assets
│   ├── images/                 # Image assets
│   └── favicon.ico             # Site favicon
├── src/                        # Source code (all application code)
│   ├── app/                    # Next.js 14 app directory
│   ├── components/             # React components
│   ├── lib/                    # Utility functions and configurations
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # State management (Zustand)
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Pure utility functions
│   └── styles/                 # CSS and styling files
├── server/                     # Backend server code
│   ├── src/                    # Server source code
│   ├── tests/                  # Server tests
│   └── dist/                   # Built server code
└── tests/                      # Frontend tests
    ├── components/             # Component tests
    ├── pages/                  # Page tests
    └── utils/                  # Utility tests
```

### Frontend Structure (src/)
```
src/
├── app/                        # Next.js 14 App Router
│   ├── globals.css            # Global CSS imports
│   ├── layout.tsx             # Root layout component
│   ├── page.tsx               # Home page
│   ├── loading.tsx            # Global loading component
│   ├── error.tsx              # Global error boundary
│   ├── not-found.tsx          # 404 page
│   ├── (auth)/                # Authentication routes group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/             # Dashboard routes
│   │   ├── layout.tsx         # Dashboard layout
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── campaigns/         # Campaign management
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── sessions/          # Session management
│   │       ├── page.tsx
│   │       ├── [id]/
│   │       │   └── page.tsx
│   │       └── active/
│   │           └── page.tsx
│   └── api/                   # API routes
│       ├── auth/              # Authentication endpoints
│       ├── campaigns/         # Campaign CRUD endpoints
│       ├── sessions/          # Session management endpoints
│       ├── panic/             # Panic button endpoints
│       ├── files/             # File upload endpoints
│       └── webhooks/          # Webhook handlers
├── components/                # Reusable UI components
│   ├── ui/                    # Base UI components (Radix + Tailwind)
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.stories.tsx
│   │   │   └── button.test.tsx
│   │   ├── card/
│   │   ├── input/
│   │   ├── modal/
│   │   └── index.ts           # Export all UI components
│   ├── forms/                 # Form components
│   │   ├── login-form.tsx
│   │   ├── campaign-form.tsx
│   │   ├── file-upload.tsx
│   │   └── panic-form.tsx
│   ├── navigation/            # Navigation components
│   │   ├── nav-bar.tsx
│   │   ├── sidebar.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── mobile-nav.tsx
│   ├── radial/                # Radial interface components
│   │   ├── radial-menu.tsx
│   │   ├── radial-segment.tsx
│   │   └── panic-button.tsx
│   ├── campaign/              # Campaign-specific components
│   │   ├── campaign-card.tsx
│   │   ├── campaign-list.tsx
│   │   ├── digest-review.tsx
│   │   └── content-editor.tsx
│   ├── session/               # Session-specific components
│   │   ├── session-card.tsx
│   │   ├── session-timer.tsx
│   │   ├── panic-history.tsx
│   │   └── live-session.tsx
│   └── layout/                # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       ├── sidebar.tsx
│       └── dashboard-shell.tsx
├── lib/                       # Configuration and setup
│   ├── auth.ts                # Authentication configuration
│   ├── database.ts            # Database connection and setup
│   ├── openai.ts              # OpenAI client configuration
│   ├── pinecone.ts            # Pinecone client configuration
│   ├── paddle.ts              # Paddle payment configuration
│   ├── cloudflare.ts          # Cloudflare R2 configuration
│   ├── redis.ts               # Redis client configuration
│   └── utils.ts               # Utility functions for lib
├── hooks/                     # Custom React hooks
│   ├── use-auth.ts            # Authentication hook
│   ├── use-campaigns.ts       # Campaign data hook
│   ├── use-sessions.ts        # Session management hook
│   ├── use-panic.ts           # Panic button functionality
│   ├── use-file-upload.ts     # File upload hook
│   └── use-local-storage.ts   # Local storage hook
├── stores/                    # State management
│   ├── auth-store.ts          # Authentication state
│   ├── campaign-store.ts      # Campaign state
│   ├── session-store.ts       # Session state
│   ├── ui-store.ts            # UI state (modals, etc)
│   └── index.ts               # Export all stores
├── types/                     # TypeScript definitions
│   ├── auth.ts                # Authentication types
│   ├── campaign.ts            # Campaign types
│   ├── session.ts             # Session types
│   ├── panic.ts               # Panic button types
│   ├── api.ts                 # API response types
│   └── index.ts               # Export all types
├── utils/                     # Pure utility functions
│   ├── formatting.ts          # Text and date formatting
│   ├── validation.ts          # Input validation functions
│   ├── constants.ts           # Application constants
│   ├── helpers.ts             # General helper functions
│   └── testing.ts             # Testing utilities
└── styles/                    # CSS files
    ├── globals.css            # Global styles
    ├── components.css         # Component-specific styles
    └── utilities.css          # Utility classes
```

### Backend Structure (server/)
```
server/
├── src/
│   ├── index.ts               # Server entry point
│   ├── app.ts                 # Express app configuration
│   ├── routes/                # API route handlers
│   │   ├── auth/
│   │   │   ├── index.ts
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   └── refresh.ts
│   │   ├── campaigns/
│   │   │   ├── index.ts
│   │   │   ├── create.ts
│   │   │   ├── read.ts
│   │   │   ├── update.ts
│   │   │   └── delete.ts
│   │   ├── sessions/
│   │   ├── panic/
│   │   ├── files/
│   │   └── webhooks/
│   ├── services/              # Business logic services
│   │   ├── auth-service.ts
│   │   ├── campaign-service.ts
│   │   ├── session-service.ts
│   │   ├── panic-service.ts
│   │   ├── file-service.ts
│   │   └── ai-service.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── error-handler.ts
│   │   ├── rate-limiter.ts
│   │   └── cors.ts
│   ├── models/                # Data models
│   │   ├── user.ts
│   │   ├── campaign.ts
│   │   ├── session.ts
│   │   └── panic-call.ts
│   ├── utils/                 # Server utilities
│   │   ├── logger.ts
│   │   ├── crypto.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   └── config/                # Configuration files
│       ├── database.ts
│       ├── auth.ts
│       ├── env.ts
│       └── constants.ts
├── tests/                     # Server tests
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── utils/
└── dist/                      # Built server code
```

---

## File Naming Conventions

### General Rules
- **kebab-case**: Use kebab-case for file names (`user-profile.tsx`)
- **Descriptive**: File names should clearly indicate their purpose
- **Consistent Extensions**: Use `.tsx` for React components, `.ts` for TypeScript
- **No Abbreviations**: Avoid abbreviations unless universally understood

### Component Files
```
✅ Good:
- user-profile.tsx
- campaign-card.tsx
- radial-menu.tsx
- panic-button.tsx
- file-upload-zone.tsx

❌ Bad:
- UserProfile.tsx
- CampaignCard.tsx
- RadialMenu.tsx
- PanicBtn.tsx
- FileUploadZone.tsx
```

### Utility Files
```
✅ Good:
- date-formatting.ts
- input-validation.ts
- api-helpers.ts
- auth-utils.ts

❌ Bad:
- utils.ts (too generic)
- helpers.ts (too generic)
- misc.ts (unclear purpose)
```

### Hook Files
```
✅ Good:
- use-auth.ts
- use-campaigns.ts
- use-file-upload.ts
- use-local-storage.ts

❌ Bad:
- auth-hook.ts
- campaigns-hook.ts
- useAuth.ts
- useFileUpload.ts
```

### Page Files
```
✅ Good:
- page.tsx (Next.js convention)
- layout.tsx (Next.js convention)
- loading.tsx (Next.js convention)
- error.tsx (Next.js convention)

❌ Bad:
- index.tsx (in app directory)
- home.tsx
- dashboard.tsx
```

### Test Files
```
✅ Good:
- button.test.tsx
- campaign-service.test.ts
- auth-utils.test.ts

❌ Bad:
- button.spec.tsx
- campaign-service.spec.ts
- test-auth-utils.ts
```

---

## Code Organization Standards

### File Structure Template
Every file should follow this structure:

```typescript
/**
 * File: src/components/ui/button/button.tsx
 * Purpose: Reusable button component with multiple variants and states
 * Dependencies: React, Radix UI, Tailwind CSS
 * Author: [Team/AI]
 * Created: [Date]
 */

import React from 'react';
import { Button as RadixButton } from '@radix-ui/themes';
import { cn } from '@/lib/utils';

// Type definitions
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'panic';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

// Component implementation
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className,
}) => {
  // Component logic here
};

// Default export
export default Button;
```

### Import Organization
```typescript
// 1. React and React-related imports
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';

// 2. Third-party library imports
import { Button } from '@radix-ui/themes';
import { z } from 'zod';

// 3. Internal imports (absolute paths)
import { useAuth } from '@/hooks/use-auth';
import { CampaignCard } from '@/components/campaign/campaign-card';
import { ApiClient } from '@/lib/api-client';

// 4. Type-only imports (separate group)
import type { Campaign, Session } from '@/types';
import type { ApiResponse } from '@/types/api';

// 5. Relative imports (if any)
import './component-styles.css';
```

### Export Organization
```typescript
// Named exports (preferred)
export { Button };
export { ButtonProps };

// Default export (when needed)
export default Button;

// Re-exports (for index files)
export { Button } from './button';
export { Card } from './card';
export { Input } from './input';
```

---

## Documentation Standards

### File Header Comments
Every file must include a header comment:

```typescript
/**
 * File: [relative path from src/]
 * Purpose: [Brief description of what this file does]
 * Dependencies: [Key dependencies this file relies on]
 * Author: [Team/AI]
 * Created: [Date]
 * Last Modified: [Date]
 */
```

### Function Documentation (TSDoc)
All functions must include TSDoc comments:

```typescript
/**
 * Generates an NPC based on campaign context and location
 * 
 * @param context - The campaign context and world information
 * @param location - The location where the NPC should be generated
 * @param options - Optional configuration for NPC generation
 * @returns Promise that resolves to the generated NPC data
 * 
 * @example
 * ```typescript
 * const npc = await generateNPC(
 *   campaignContext,
 *   "tavern",
 *   { includeQuests: true }
 * );
 * ```
 * 
 * @throws {ApiError} When the AI service is unavailable
 * @throws {ValidationError} When context or location is invalid
 */
export async function generateNPC(
  context: CampaignContext,
  location: string,
  options?: NPCGenerationOptions
): Promise<GeneratedNPC> {
  // Implementation
}
```

### Component Documentation
React components should include comprehensive documentation:

```typescript
/**
 * A reusable panic button component for the radial interface
 * 
 * This component serves as the central trigger for all panic functionality,
 * expanding into a radial menu with five distinct prompt options.
 * 
 * @component
 * @example
 * ```tsx
 * <PanicButton
 *   onPanicTrigger={handlePanicCall}
 *   disabled={!isSessionActive}
 *   position="bottom-right"
 * />
 * ```
 */
export const PanicButton: React.FC<PanicButtonProps> = ({
  onPanicTrigger,
  disabled = false,
  position = 'bottom-right',
}) => {
  // Component implementation
};
```

### Type Documentation
TypeScript types should be documented:

```typescript
/**
 * Represents a D&D campaign with all associated metadata
 * 
 * @interface Campaign
 * @property {string} id - Unique identifier for the campaign
 * @property {string} title - Campaign title/name
 * @property {string} description - Brief campaign description
 * @property {CampaignDigest} digest - Processed campaign content
 * @property {Date} createdAt - When the campaign was created
 * @property {Date} updatedAt - When the campaign was last modified
 * @property {string} userId - ID of the user who owns this campaign
 */
export interface Campaign {
  id: string;
  title: string;
  description: string;
  digest: CampaignDigest;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

---

## Technology-Specific Rules

### Next.js App Router
- **Page Components**: Use `page.tsx` for route pages
- **Layout Components**: Use `layout.tsx` for shared layouts
- **Loading States**: Use `loading.tsx` for loading UI
- **Error Boundaries**: Use `error.tsx` for error handling
- **Route Groups**: Use `(groupName)` for organizing routes without affecting URL

### React Components
- **Functional Components**: Use functional components with hooks
- **Props Interface**: Always define props interface
- **Default Props**: Use default parameters instead of defaultProps
- **Memo Usage**: Use React.memo for performance-critical components
- **Hook Order**: Follow rules of hooks consistently

### TypeScript
- **Strict Mode**: Enable strict mode in tsconfig.json
- **Type Imports**: Use `import type` for type-only imports
- **Explicit Types**: Prefer explicit return types for functions
- **Generic Constraints**: Use generic constraints when appropriate
- **Utility Types**: Leverage TypeScript utility types

### Tailwind CSS
- **Custom Components**: Use `@apply` directive for repeated patterns
- **Responsive Design**: Use mobile-first responsive utilities
- **Color System**: Use CSS custom properties for theme colors
- **Spacing**: Follow 8px grid system using Tailwind's spacing scale

### Prisma
- **Schema Organization**: Group related models together
- **Naming**: Use PascalCase for model names, camelCase for fields
- **Relations**: Always define both sides of relations
- **Migrations**: Use descriptive migration names

---

## Testing Standards

### Test File Organization
```
src/
├── components/
│   └── ui/
│       └── button/
│           ├── button.tsx
│           ├── button.test.tsx
│           └── button.stories.tsx
```

### Test Structure
```typescript
/**
 * File: src/components/ui/button/button.test.tsx
 * Purpose: Unit tests for the Button component
 * Dependencies: @testing-library/react, jest
 * Author: [Team/AI]
 * Created: [Date]
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with correct text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies correct variant class', () => {
      render(<Button variant="panic">Emergency</Button>);
      expect(screen.getByRole('button')).toHaveClass('panic-button');
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Click me</Button>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
```

### Test Naming
- **Describe Blocks**: Use component/function name and behavior
- **Test Cases**: Use clear, descriptive test names
- **Test Groups**: Group related tests together

---

## Error Handling Standards

### Error Types
```typescript
/**
 * File: src/utils/errors.ts
 * Purpose: Standardized error types for the application
 * Dependencies: None
 * Author: [Team/AI]
 * Created: [Date]
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Error Handling Patterns
```typescript
/**
 * Handles API calls with proper error handling and logging
 * 
 * @param apiCall - The API function to execute
 * @param errorContext - Context for error logging
 * @returns Promise with result or handled error
 */
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  errorContext: string
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error in ${errorContext}:`, error);
      // Handle API errors
    } else if (error instanceof ValidationError) {
      console.error(`Validation Error in ${errorContext}:`, error);
      // Handle validation errors
    } else {
      console.error(`Unexpected Error in ${errorContext}:`, error);
      // Handle unexpected errors
    }
    return null;
  }
}
```

---

## Performance Standards

### Code Splitting
- **Route-based**: Split code at route boundaries
- **Component-based**: Split large components using React.lazy
- **Library-based**: Split large libraries using dynamic imports

### Bundle Size Rules
- **Individual Files**: Maximum 500 lines per file
- **Component Size**: Maximum 200 lines per component
- **Hook Size**: Maximum 100 lines per hook
- **Utility Size**: Maximum 50 lines per utility function

### Loading Strategies
- **Critical Path**: Load essential code first
- **Progressive Enhancement**: Load features as needed
- **Lazy Loading**: Use lazy loading for non-critical components

---

## Git and Version Control

### Branch Naming
```
feature/panic-button-implementation
bugfix/session-timer-accuracy
hotfix/critical-auth-issue
refactor/component-organization
docs/api-documentation-update
```

### Commit Messages
```
feat: implement radial panic button interface
fix: resolve session timer accuracy issue
docs: update API documentation for panic endpoints
refactor: reorganize component directory structure
test: add comprehensive button component tests
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature  
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

---

## Development Workflow

### Local Development Setup
1. **Environment Setup**: Copy `.env.example` to `.env.local`
2. **Database Setup**: Run `npx prisma db push` for local database
3. **Development Server**: Run `npm run dev` for Next.js development
4. **Type Checking**: Run `npm run type-check` before commits

### Code Quality Checks
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with consistent configuration
- **Type Checking**: TypeScript strict mode enabled
- **Testing**: Jest with React Testing Library

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check && npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

---

## AI Development Guidelines

### AI-Friendly Code Patterns
- **Single Responsibility**: Each function has one clear purpose
- **Explicit Interfaces**: Clear input/output contracts
- **Descriptive Naming**: Function and variable names explain purpose
- **Minimal Dependencies**: Reduce coupling between modules

### AI Collaboration Standards
- **Code Generation**: AI can generate boilerplate following these patterns
- **Code Review**: AI can review code against these standards
- **Documentation**: AI can generate documentation following these templates
- **Testing**: AI can generate tests following these patterns

### Context Preservation
- **File Headers**: Always include purpose and dependencies
- **Function Documentation**: Include examples and error conditions
- **Type Definitions**: Document all interfaces and types
- **Usage Examples**: Include practical examples in documentation

This comprehensive set of project rules ensures consistent, maintainable, and AI-friendly code throughout the Improv Panic Button application. Following these standards will make the codebase highly navigable and easy to understand for both human developers and AI tools. 