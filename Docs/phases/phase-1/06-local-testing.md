# Phase 1: Local Testing Setup - TDD Implementation Plan

## Overview
This document provides a detailed TDD-driven implementation plan for setting up local testing capabilities, allowing developers to run and test the application without requiring all external API keys. This enables immediate UI testing and gradual feature enablement as services are configured.

## Prerequisites
- Node.js 18+ and npm installed
- Phase 1 Tasks 1-5 completed
- Git repository cloned locally
- Basic understanding of Next.js development

## Implementation Steps

### Step 1: Environment Configuration and Validation

#### 🟥 RED Phase - Test 1.1: Environment Variable Detection
```typescript
// src/lib/config/env-check.test.ts
describe('Environment Configuration', () => {
  it('should detect missing environment variables', () => {
    const config = checkEnvironment();
    
    expect(config.clerk.configured).toBeDefined();
    expect(config.openai.configured).toBeDefined();
    expect(config.r2.configured).toBeDefined();
    expect(config.database.configured).toBeDefined();
  });
  
  it('should provide helpful messages for missing config', () => {
    process.env.OPENAI_API_KEY = undefined;
    const config = checkEnvironment();
    
    expect(config.openai.message).toContain('OpenAI API key not configured');
    expect(config.openai.instructions).toContain('https://platform.openai.com');
  });
});
```
**Purpose**: Ensures the application can detect which services are configured and provide helpful setup instructions.

#### 🟩 GREEN Phase - Implementation 1.1
```typescript
// src/lib/config/env-check.ts
export interface ServiceConfig {
  configured: boolean;
  message: string;
  instructions?: string;
}

export interface EnvironmentConfig {
  clerk: ServiceConfig;
  openai: ServiceConfig;
  r2: ServiceConfig;
  database: ServiceConfig;
  mockMode: boolean;
}

export function checkEnvironment(): EnvironmentConfig {
  return {
    clerk: {
      configured: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      message: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 
        ? 'Clerk authentication configured' 
        : 'Clerk authentication not configured',
      instructions: 'Get your keys at https://clerk.dev'
    },
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
      message: process.env.OPENAI_API_KEY 
        ? 'OpenAI API configured' 
        : 'OpenAI API key not configured',
      instructions: 'Get your API key at https://platform.openai.com'
    },
    r2: {
      configured: !!process.env.R2_ACCESS_KEY_ID,
      message: process.env.R2_ACCESS_KEY_ID 
        ? 'Cloudflare R2 storage configured' 
        : 'Cloudflare R2 not configured',
      instructions: 'Set up R2 at https://developers.cloudflare.com/r2'
    },
    database: {
      configured: !!process.env.DATABASE_URL,
      message: process.env.DATABASE_URL 
        ? 'Database configured' 
        : 'Database not configured',
      instructions: 'Using SQLite by default for development'
    },
    mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
  };
}
```

#### 🟥 RED Phase - Test 1.2: Setup Script
```typescript
// scripts/setup-dev.test.ts
describe('Development Setup Script', () => {
  it('should create .env.local from template if missing', async () => {
    const result = await runSetupScript();
    
    expect(result.envFileCreated).toBe(true);
    expect(fs.existsSync('.env.local')).toBe(true);
  });
  
  it('should initialize database if not exists', async () => {
    const result = await runSetupScript();
    
    expect(result.databaseInitialized).toBe(true);
    expect(fs.existsSync('prisma/dev.db')).toBe(true);
  });
  
  it('should report configuration status', async () => {
    const result = await runSetupScript();
    
    expect(result.status).toContain('Environment Check');
    expect(result.status).toContain('Mock Mode: Enabled');
  });
});
```

#### 🟩 GREEN Phase - Implementation 1.2
```typescript
// scripts/setup-dev.ts
import fs from 'fs';
import { execSync } from 'child_process';
import { checkEnvironment } from '../src/lib/config/env-check';

export async function runSetupScript() {
  const result = {
    envFileCreated: false,
    databaseInitialized: false,
    status: ''
  };
  
  // Create .env.local if missing
  if (!fs.existsSync('.env.local')) {
    const template = `# Development Configuration
NEXT_PUBLIC_MOCK_MODE=true

# Add your API keys as you obtain them:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=
# OPENAI_API_KEY=
# R2_ACCESS_KEY_ID=
# R2_SECRET_ACCESS_KEY=

DATABASE_URL=file:./dev.db
`;
    fs.writeFileSync('.env.local', template);
    result.envFileCreated = true;
  }
  
  // Initialize database
  if (!fs.existsSync('prisma/dev.db')) {
    execSync('npx prisma db push', { stdio: 'inherit' });
    result.databaseInitialized = true;
  }
  
  // Check configuration
  const config = checkEnvironment();
  result.status = formatConfigStatus(config);
  
  return result;
}
```

### Step 2: Mock Mode Implementation

#### 🟥 RED Phase - Test 2.1: Mock Data Provider
```typescript
// src/lib/mock/mock-provider.test.tsx
describe('Mock Mode Provider', () => {
  it('should provide mock authentication when in mock mode', () => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true';
    
    const { result } = renderHook(() => useMockAuth());
    
    expect(result.current.user).toEqual({
      id: 'mock-user-1',
      email: 'dm@example.com',
      name: 'Test DM'
    });
  });
  
  it('should simulate file upload in mock mode', async () => {
    const { uploadFile } = useMockStorage();
    
    const result = await uploadFile({
      name: 'campaign.pdf',
      size: 1024,
      type: 'application/pdf'
    });
    
    expect(result.success).toBe(true);
    expect(result.url).toContain('mock://');
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.1
```typescript
// src/lib/mock/mock-provider.tsx
'use client';

import { createContext, useContext } from 'react';

interface MockUser {
  id: string;
  email: string;
  name: string;
}

interface MockAuthContext {
  user: MockUser | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const MockContext = createContext<MockAuthContext | undefined>(undefined);

export function MockProvider({ children }: { children: React.ReactNode }) {
  const mockUser: MockUser = {
    id: 'mock-user-1',
    email: 'dm@example.com',
    name: 'Test DM'
  };
  
  const signIn = async () => {
    console.log('Mock sign in');
  };
  
  const signOut = async () => {
    console.log('Mock sign out');
  };
  
  return (
    <MockContext.Provider value={{ user: mockUser, signIn, signOut }}>
      {children}
    </MockContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMockAuth must be used within MockProvider');
  }
  return context;
}

export function useMockStorage() {
  return {
    uploadFile: async (file: { name: string; size: number; type: string }) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        url: `mock://storage/${file.name}`,
        id: `mock-file-${Date.now()}`
      };
    }
  };
}
```

#### 🟥 RED Phase - Test 2.2: Mock AI Responses
```typescript
// src/lib/mock/mock-ai.test.ts
describe('Mock AI Provider', () => {
  it('should generate mock NPC response', async () => {
    const response = await generateMockResponse('npc', {
      context: 'tavern scene'
    });
    
    expect(response.content).toContain('Gruff Ironbeard');
    expect(response.content).toContain('dwarf');
    expect(response.tokens).toBeGreaterThan(0);
  });
  
  it('should generate different responses for different panic types', async () => {
    const npc = await generateMockResponse('npc');
    const encounter = await generateMockResponse('encounter');
    
    expect(npc.content).not.toEqual(encounter.content);
    expect(encounter.content).toContain('encounter');
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.2
```typescript
// src/lib/mock/mock-ai.ts
export type PanicType = 'npc' | 'encounter' | 'plot' | 'flavor' | 'foreshadow';

const mockResponses: Record<PanicType, string[]> = {
  npc: [
    "**Gruff Ironbeard** - A stocky dwarf blacksmith with soot-covered hands and a perpetual scowl. He speaks in short, clipped sentences and has a secret fondness for elvish poetry.",
    "**Melody Swiftwater** - A cheerful halfling bard who juggles poorly but sings beautifully. She knows all the local gossip and trades information for coin.",
  ],
  encounter: [
    "**Tavern Brawl** - Three drunk mercenaries start a fight over a card game. DC 12 Persuasion to calm them or DC 10 Athletics to subdue.",
    "**Mysterious Stranger** - A cloaked figure approaches offering information about the quest, but demands a favor in return.",
  ],
  plot: [
    "The innkeeper reveals they're actually a retired adventurer who faced the same evil 20 years ago and barely survived.",
    "A messenger arrives with urgent news: the king has fallen ill and the succession is in dispute.",
  ],
  flavor: [
    "The tavern smells of pipe smoke and spilled ale. A bard in the corner plays a melancholy tune about lost love.",
    "Thunder rumbles overhead as rain begins to patter against the windows. The fire crackles invitingly.",
  ],
  foreshadow: [
    "You notice a patron nervously glancing at the door every few minutes, as if expecting trouble.",
    "The bartender mentions that strange lights have been seen in the old tower ruins at night.",
  ],
};

export async function generateMockResponse(
  type: PanicType,
  options?: { context?: string }
): Promise<{ content: string; tokens: number; cost: number }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const responses = mockResponses[type];
  const content = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    content,
    tokens: content.length,
    cost: 0
  };
}
```

### Step 3: Demo Dashboard

#### 🟥 RED Phase - Test 3.1: Demo Dashboard Page
```typescript
// src/app/demo/page.test.tsx
describe('Demo Dashboard', () => {
  it('should display all UI components showcase', () => {
    render(<DemoPage />);
    
    expect(screen.getByText('Component Showcase')).toBeInTheDocument();
    expect(screen.getByText('Buttons')).toBeInTheDocument();
    expect(screen.getByText('Loading States')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });
  
  it('should show configuration status', () => {
    render(<DemoPage />);
    
    expect(screen.getByText('Environment Status')).toBeInTheDocument();
    expect(screen.getByText(/Mock Mode: Enabled/)).toBeInTheDocument();
  });
  
  it('should provide interactive panic button demo', async () => {
    render(<DemoPage />);
    
    const panicButton = screen.getByText('Try Panic Button');
    await userEvent.click(panicButton);
    
    expect(screen.getByText(/Generate NPC/)).toBeInTheDocument();
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.1
```typescript
// src/app/demo/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { checkEnvironment } from '@/lib/config/env-check';
import { generateMockResponse, PanicType } from '@/lib/mock/mock-ai';

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { showToast } = useToast();
  const config = checkEnvironment();
  
  const handlePanicButton = async (type: PanicType) => {
    setLoading(true);
    try {
      const result = await generateMockResponse(type);
      setResponse(result.content);
      showToast({
        title: 'Generated!',
        description: `Used ${result.tokens} tokens`,
        variant: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to generate response',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Demo Dashboard</h1>
      
      {/* Environment Status */}
      <section className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Status</h2>
        <div className="space-y-2">
          <StatusItem label="Mock Mode" value={config.mockMode ? 'Enabled' : 'Disabled'} status={config.mockMode} />
          <StatusItem label="Clerk Auth" value={config.clerk.message} status={config.clerk.configured} />
          <StatusItem label="OpenAI" value={config.openai.message} status={config.openai.configured} />
          <StatusItem label="Storage" value={config.r2.message} status={config.r2.configured} />
          <StatusItem label="Database" value={config.database.message} status={config.database.configured} />
        </div>
      </section>
      
      {/* Component Showcase */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Component Showcase</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-3">Buttons</h3>
            <div className="space-x-2">
              <Button>Default</Button>
              <Button variant="panic">Panic</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          
          {/* Loading States */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-3">Loading States</h3>
            <LoadingSpinner text="Loading..." />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
      </section>
      
      {/* Panic Button Demo */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Panic Button Demo</h2>
        <div className="space-x-2 mb-4">
          <Button onClick={() => handlePanicButton('npc')} disabled={loading}>
            Generate NPC
          </Button>
          <Button onClick={() => handlePanicButton('encounter')} disabled={loading}>
            Create Encounter
          </Button>
          <Button onClick={() => handlePanicButton('plot')} disabled={loading}>
            Redirect Plot
          </Button>
        </div>
        
        {loading && <LoadingSpinner text="Generating..." />}
        
        {response && (
          <div className="p-4 bg-parchment rounded mt-4">
            <div dangerouslySetInnerHTML={{ __html: response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        )}
      </section>
    </div>
  );
}

function StatusItem({ label, value, status }: { label: string; value: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{label}:</span>
      <span className={status ? 'text-green-600' : 'text-gray-500'}>
        {status ? '✓ ' : '○ '}{value}
      </span>
    </div>
  );
}
```

### Step 4: Health Check Endpoint

#### 🟥 RED Phase - Test 4.1: Health Check API
```typescript
// src/app/api/health/route.test.ts
describe('Health Check Endpoint', () => {
  it('should return service status', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.services).toBeDefined();
  });
  
  it('should indicate which services are configured', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    
    const response = await GET();
    const data = await response.json();
    
    expect(data.services.openai).toBe(true);
  });
  
  it('should include timestamp and version', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.1
```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { checkEnvironment } from '@/lib/config/env-check';
import packageJson from '../../../../package.json';

export async function GET() {
  const config = checkEnvironment();
  
  // Test database connection
  let databaseHealthy = false;
  try {
    // Simple check - in production would do actual query
    databaseHealthy = !!process.env.DATABASE_URL;
  } catch (error) {
    databaseHealthy = false;
  }
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: packageJson.version,
    mode: config.mockMode ? 'mock' : 'production',
    services: {
      clerk: config.clerk.configured,
      openai: config.openai.configured,
      storage: config.r2.configured,
      database: databaseHealthy,
    },
    details: {
      clerk: config.clerk.message,
      openai: config.openai.message,
      storage: config.r2.message,
      database: config.database.message,
    }
  };
  
  return NextResponse.json(health);
}
```

### Step 5: Setup Documentation

#### 🟥 RED Phase - Test 5.1: Setup Guide Generation
```typescript
// src/lib/docs/setup-guide.test.ts
describe('Setup Guide Generator', () => {
  it('should generate markdown setup guide', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('# Local Development Setup');
    expect(guide).toContain('## Quick Start');
    expect(guide).toContain('npm install');
    expect(guide).toContain('npm run dev');
  });
  
  it('should include troubleshooting section', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('## Troubleshooting');
    expect(guide).toContain('Port already in use');
    expect(guide).toContain('Database errors');
  });
  
  it('should customize based on environment', () => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true';
    const guide = generateSetupGuide();
    
    expect(guide).toContain('Running in Mock Mode');
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.1
```typescript
// src/lib/docs/setup-guide.ts
import { checkEnvironment } from '../config/env-check';

export function generateSetupGuide(): string {
  const config = checkEnvironment();
  
  return `# Local Development Setup

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment:**
   \`\`\`bash
   npm run setup:dev
   \`\`\`
   This will create a .env.local file and initialize the database.

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Current Configuration

${config.mockMode ? '✅ **Running in Mock Mode** - No API keys required!' : '⚠️ **Production Mode** - API keys required'}

### Service Status:
- ${config.clerk.configured ? '✅' : '❌'} Clerk Authentication ${!config.clerk.configured ? `\n  ${config.clerk.instructions}` : ''}
- ${config.openai.configured ? '✅' : '❌'} OpenAI API ${!config.openai.configured ? `\n  ${config.openai.instructions}` : ''}
- ${config.r2.configured ? '✅' : '❌'} Cloudflare R2 Storage ${!config.r2.configured ? `\n  ${config.r2.instructions}` : ''}
- ${config.database.configured ? '✅' : '❌'} Database ${!config.database.configured ? `\n  ${config.database.instructions}` : ''}

## Available Pages

- \`/\` - Homepage
- \`/demo\` - Component showcase and testing
- \`/api/health\` - Service health check
${config.clerk.configured ? '- `/sign-in` - Sign in page\n- `/sign-up` - Sign up page\n- `/profile` - User profile' : ''}

## Testing Features

### Without API Keys (Mock Mode):
- Browse all UI components
- Test navigation and layouts
- Try mock panic button responses
- Preview loading states and animations

### With API Keys:
- Full authentication flow
- Real file uploads
- Live AI text generation
- Database persistence

## Troubleshooting

### Port already in use
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000
\`\`\`

### Database errors
\`\`\`bash
# Reset database
rm prisma/dev.db
npx prisma db push
\`\`\`

### Module not found
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
\`\`\`

## Next Steps

1. Visit \`/demo\` to explore components
2. Check \`/api/health\` for service status
3. Obtain API keys for full functionality
4. Read phase documentation in \`/Docs/phases/\`

---
Generated on: ${new Date().toLocaleString()}
`;
}
```

#### 🟥 RED Phase - Test 5.2: Auto-generate README
```typescript
// scripts/generate-readme.test.ts
describe('README Generator', () => {
  it('should create LOCAL_TESTING.md file', async () => {
    await generateReadme();
    
    expect(fs.existsSync('LOCAL_TESTING.md')).toBe(true);
  });
  
  it('should include current configuration status', async () => {
    await generateReadme();
    const content = fs.readFileSync('LOCAL_TESTING.md', 'utf-8');
    
    expect(content).toContain('Service Status');
    expect(content).toContain('Mock Mode');
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.2
```typescript
// scripts/generate-readme.ts
import fs from 'fs';
import { generateSetupGuide } from '../src/lib/docs/setup-guide';

export async function generateReadme() {
  const guide = generateSetupGuide();
  fs.writeFileSync('LOCAL_TESTING.md', guide);
  console.log('✅ LOCAL_TESTING.md generated successfully');
}

// Add to package.json scripts
// "setup:dev": "tsx scripts/setup-dev.ts && tsx scripts/generate-readme.ts"
```

## Testing Checklist

### Unit Tests
- [ ] Environment configuration detection
- [ ] Mock authentication provider
- [ ] Mock storage functions
- [ ] Mock AI response generation
- [ ] Health check endpoint
- [ ] Setup guide generator
- [ ] Demo page components

### Integration Tests
- [ ] Mock mode activation
- [ ] Service status reporting
- [ ] Error message clarity
- [ ] Setup script execution
- [ ] Demo interactions

### Manual Testing
- [ ] Run without any API keys
- [ ] Browse all pages in mock mode
- [ ] Test each panic button type
- [ ] Verify component showcase
- [ ] Check health endpoint
- [ ] Follow setup instructions

## Success Metrics
- Application runs with `npm run dev` without any API keys
- Clear indication of which services are configured
- All UI components visible and interactive in mock mode
- Demo page provides comprehensive component testing
- Setup documentation is clear and accurate
- Health check endpoint provides useful debugging info
- New developers can start testing within 5 minutes

## Implementation Order
1. Environment configuration and validation
2. Mock providers for auth, storage, and AI
3. Demo dashboard page
4. Health check endpoint
5. Setup documentation and scripts
6. Update package.json with helper scripts

## Next Steps
After completing all tests and implementations:
1. Run full test suite: `npm test`
2. Test setup script: `npm run setup:dev`
3. Start development server: `npm run dev`
4. Visit http://localhost:3000/demo
5. Commit with message: `feat: implement local testing setup with mock mode and demo dashboard`
6. Update main README with local testing instructions