# Improv Panic Button - Technical Stack Reference

## Overview
This document provides comprehensive technical guidance for the Learning-Friendly Hybrid stack selected for the Improv Panic Button project. Each technology section covers best practices, limitations, conventions, and common pitfalls to avoid.

## Selected Stack Summary
- **Frontend**: Next.js 14 + Radix UI + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript  
- **Database**: SQLite + Turso + Prisma
- **Vector DB**: Pinecone
- **Auth**: Clerk.dev
- **Payments**: Paddle
- **File Processing**: Cloudflare R2 + Workers
- **AI**: OpenAI GPT-4o-mini
- **Hosting**: Vercel + Railway
- **Real-time**: Server-Sent Events
- **State Management**: Zustand
- **API**: SWR + Upstash Redis

---

## 1. Frontend: Next.js 14 + Radix UI + Tailwind CSS

### Next.js 14 with App Router

#### Best Practices
- **File-based routing**: Use `app/` directory structure for routes
- **Server Components by default**: Only use `'use client'` when necessary
- **Colocate components**: Keep page-specific components near their routes
- **Use TypeScript**: Enable strict mode for better type safety
- **Optimize images**: Always use `next/image` for performance
- **Use `loading.tsx` and `error.tsx`**: Provide proper loading states and error boundaries

#### Limitations
- **App Router learning curve**: Different from Pages Router, requires new patterns
- **Streaming SSR**: Can be complex for certain use cases
- **Build optimization**: Large applications may have longer build times
- **Route caching**: Aggressive caching can sometimes cause confusion during development

#### Conventions
```typescript
// File structure
app/
├── globals.css
├── layout.tsx
├── page.tsx
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   └── sessions/
│       └── page.tsx
```

#### Common Pitfalls
- **Overusing client components**: Don't add `'use client'` everywhere
- **Missing error boundaries**: Always provide error.tsx files
- **Ignoring SEO**: Use proper metadata API for each page
- **Not optimizing images**: Always use next/image with proper sizing

### Radix UI Primitives

#### Best Practices
- **Unstyled first**: Start with unstyled primitives, then add Tailwind
- **Accessibility built-in**: Leverage Radix's accessibility features
- **Compose components**: Build reusable components from primitives
- **Use refs properly**: Forward refs for proper component composition

#### Limitations
- **Bundle size**: Can increase bundle size if not tree-shaken properly
- **Styling complexity**: Requires custom styling for everything
- **Limited pre-built components**: More work than component libraries like Material-UI

#### Conventions
```typescript
// Example: Custom Button component
import { Button } from '@radix-ui/themes';
import { cn } from '@/lib/utils';

const PanicButton = ({ className, ...props }) => {
  return (
    <Button
      className={cn(
        "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded",
        className
      )}
      {...props}
    />
  );
};
```

#### Common Pitfalls
- **Not using compound components**: Leverage Radix's compound patterns
- **Ignoring accessibility**: Don't override accessibility attributes
- **Poor styling organization**: Keep styling consistent across primitives

### Tailwind CSS

#### Best Practices
- **Mobile-first responsive**: Use `sm:`, `md:`, `lg:` breakpoints progressively
- **Use semantic class names**: Create custom utilities for repeated patterns
- **Leverage design tokens**: Use consistent spacing, colors, and typography
- **Purge unused CSS**: Configure content paths correctly

#### Limitations
- **Large HTML**: Can create verbose HTML with many classes
- **Learning curve**: Requires memorizing utility classes
- **Design system discipline**: Easy to create inconsistent designs

#### Conventions
```typescript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'panic-red': '#dc2626',
        'dm-blue': '#1e40af',
      },
      animation: {
        'radial-expand': 'radial-expand 0.3s ease-out',
      },
    },
  },
};
```

#### Common Pitfalls
- **Over-customization**: Don't fight Tailwind's conventions
- **Inconsistent spacing**: Stick to Tailwind's spacing scale
- **Not using component classes**: Use `@apply` for repeated patterns

---

## 2. Backend: Node.js + Express.js + TypeScript

### Node.js with TypeScript

#### Best Practices
- **Use strict TypeScript**: Enable strict mode and noImplicitAny
- **Environment variables**: Use `dotenv` and validate env vars at startup
- **Error handling**: Implement global error handlers and proper error types
- **Async/await**: Prefer async/await over callbacks and promises
- **Use ESLint and Prettier**: Maintain consistent code style

#### Limitations
- **Single-threaded**: CPU-intensive tasks can block the event loop
- **Memory management**: Garbage collection can cause pauses
- **Error propagation**: Unhandled errors can crash the process
- **Debugging complexity**: Async stack traces can be difficult to follow

#### Conventions
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

#### Common Pitfalls
- **Blocking the event loop**: Avoid synchronous operations in request handlers
- **Memory leaks**: Properly clean up event listeners and timers
- **Not handling rejections**: Always handle promise rejections
- **Ignoring TypeScript errors**: Fix TypeScript errors, don't ignore them

### Express.js

#### Best Practices
- **Middleware organization**: Use middleware for cross-cutting concerns
- **Route organization**: Separate routes into different files/modules
- **Error handling**: Use error-handling middleware
- **Request validation**: Validate all incoming requests
- **Rate limiting**: Implement rate limiting for API endpoints

#### Limitations
- **Callback-heavy**: Can lead to callback hell if not managed properly
- **No built-in validation**: Requires additional libraries for validation
- **Manual organization**: Requires manual structure for larger applications
- **Performance**: Not the fastest Node.js framework

#### Conventions
```typescript
// server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/panic', panicRoutes);

// Error handling
app.use(errorHandler);
```

#### Common Pitfalls
- **No input validation**: Always validate request data
- **Missing error handling**: Implement proper error handling middleware
- **Not using middleware**: Leverage Express middleware for common tasks
- **Synchronous operations**: Don't block the event loop with sync operations

---

## 3. Database: SQLite + Turso + Prisma

### SQLite with Turso

#### Best Practices
- **Connection pooling**: Use connection pooling for better performance
- **Transactions**: Use transactions for data integrity
- **Indexes**: Create appropriate indexes for query performance
- **Backup strategy**: Implement regular backups
- **WAL mode**: Enable Write-Ahead Logging for better concurrency

#### Limitations
- **Concurrent writes**: Limited concurrent write performance
- **No built-in replication**: Requires Turso for multi-region
- **File system dependent**: Performance depends on file system
- **No user management**: No built-in user/role management

#### Conventions
```typescript
// Database URL configuration
DATABASE_URL="libsql://your-database-turso.turso.io"
DATABASE_AUTH_TOKEN="your-auth-token"
```

#### Common Pitfalls
- **No connection limits**: SQLite can handle many readers but few writers
- **Large BLOBs**: Avoid storing large files directly in SQLite
- **No foreign key constraints by default**: Enable foreign key support
- **File locking**: Be aware of file locking issues in networked environments

### Prisma ORM

#### Best Practices
- **Schema-first**: Define schema in `schema.prisma` file
- **Use transactions**: Wrap related operations in transactions
- **Optimize queries**: Use `select` and `include` appropriately
- **Handle errors**: Implement proper error handling for database operations
- **Use migrations**: Always use migrations for schema changes

#### Limitations
- **Bundle size**: Can increase bundle size in client-side applications
- **Raw queries**: Limited support for complex raw SQL queries
- **Performance**: May not be optimal for all use cases
- **Learning curve**: Requires understanding of Prisma-specific patterns

#### Conventions
```typescript
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  sessions  Session[]
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  campaignData Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### Common Pitfalls
- **N+1 queries**: Use `include` or `select` to avoid N+1 problems
- **Missing migrations**: Always generate and run migrations
- **Not handling unique constraints**: Properly handle unique constraint violations
- **Ignoring types**: Leverage TypeScript types generated by Prisma

---

## 4. Vector Database: Pinecone

### Pinecone Vector Database

#### Best Practices
- **Namespace organization**: Use namespaces to organize different campaigns
- **Metadata filtering**: Use metadata for efficient filtering
- **Batch operations**: Use batch operations for better performance
- **Monitor usage**: Keep track of vector storage and query usage
- **Proper indexing**: Choose appropriate index configurations

#### Limitations
- **Cost at scale**: Can become expensive with large vector datasets
- **Vendor lock-in**: Proprietary service with no easy migration path
- **Latency**: Network latency for each query
- **Index limits**: Limits on index size and query complexity

#### Conventions
```typescript
// pinecone.ts
import { PineconeClient } from '@pinecone-database/pinecone';

const pinecone = new PineconeClient();

await pinecone.init({
  environment: process.env.PINECONE_ENV!,
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index('campaign-content');

// Store embeddings with metadata
await index.upsert({
  upsertRequest: {
    vectors: [
      {
        id: `campaign-${campaignId}-${chunkId}`,
        values: embedding,
        metadata: {
          campaignId,
          chunkId,
          type: 'npc',
          content: 'snippet of content',
        },
      },
    ],
    namespace: `campaign-${campaignId}`,
  },
});
```

#### Common Pitfalls
- **No metadata strategy**: Plan metadata structure for efficient filtering
- **Large batch sizes**: Don't exceed batch size limits
- **Missing error handling**: Handle rate limits and API errors
- **Ignoring namespaces**: Use namespaces for data organization

---

## 5. Authentication: Clerk.dev

### Clerk.dev Authentication

#### Best Practices
- **Use middleware**: Implement Clerk middleware for route protection
- **Customize UI**: Customize authentication UI to match your brand
- **Handle edge cases**: Implement proper loading and error states
- **User metadata**: Use user metadata for application-specific data
- **Session management**: Properly handle session expiration

#### Limitations
- **Vendor dependency**: Reliance on external service
- **Customization limits**: UI customization has limitations
- **Cost scaling**: Costs increase with user count
- **Data residency**: Consider data residency requirements

#### Conventions
```typescript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/'],
  ignoredRoutes: ['/api/webhook'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs';

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    return <div>Not authenticated</div>;
  }
  
  return <div>Welcome to your dashboard</div>;
}
```

#### Common Pitfalls
- **Not protecting API routes**: Ensure API routes are properly protected
- **Ignoring user metadata**: Use Clerk's user metadata for app-specific data
- **Poor error handling**: Handle authentication errors gracefully
- **Not customizing redirects**: Set appropriate redirect URLs

---

## 6. Payments: Paddle

### Paddle Payment Processing

#### Best Practices
- **Webhook security**: Verify webhook signatures
- **Handle failures**: Implement proper error handling for failed payments
- **Subscription management**: Handle subscription lifecycle properly
- **Test thoroughly**: Use Paddle's sandbox for testing
- **Comply with regulations**: Ensure compliance with tax regulations

#### Limitations
- **Limited payment methods**: Fewer payment options than Stripe
- **Customization limits**: Less UI customization than Stripe
- **Regional availability**: Not available in all countries
- **Integration complexity**: Some integrations may be more complex

#### Conventions
```typescript
// paddle.ts
import { Paddle } from '@paddle/paddle-js';

const paddle = new Paddle({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  token: process.env.PADDLE_API_KEY!,
});

// Handle subscription creation
export async function createSubscription(userId: string, priceId: string) {
  try {
    const subscription = await paddle.subscriptions.create({
      items: [{ price: priceId, quantity: 1 }],
      customData: { userId },
    });
    
    return subscription;
  } catch (error) {
    console.error('Subscription creation failed:', error);
    throw error;
  }
}
```

#### Common Pitfalls
- **Not handling webhooks**: Implement proper webhook handling
- **Ignoring tax compliance**: Paddle handles this, but verify coverage
- **Poor subscription management**: Handle subscription state changes
- **Not testing payments**: Always test payment flows thoroughly

---

## 7. File Processing: Cloudflare R2 + Workers

### Cloudflare R2 Storage

#### Best Practices
- **Organize with prefixes**: Use consistent file naming conventions
- **Set proper permissions**: Configure appropriate access policies
- **Use presigned URLs**: For secure file uploads from clients
- **Implement versioning**: Use versioning for important files
- **Monitor storage costs**: Track storage usage and costs

#### Limitations
- **Consistency model**: Eventually consistent, not strongly consistent
- **Feature parity**: Fewer features than AWS S3
- **Integration ecosystem**: Smaller ecosystem than AWS
- **Regional availability**: Limited regions compared to AWS

#### Conventions
```typescript
// r2.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Upload file
export async function uploadFile(key: string, body: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  
  return await r2.send(command);
}
```

#### Common Pitfalls
- **Not setting content types**: Always specify appropriate content types
- **Ignoring CORS**: Configure CORS for browser uploads
- **Poor error handling**: Handle upload failures gracefully
- **Not using CDN**: Leverage Cloudflare CDN for better performance

### Cloudflare Workers

#### Best Practices
- **Keep functions small**: Workers have execution time limits
- **Use environment variables**: Store secrets in environment variables
- **Handle errors gracefully**: Implement proper error handling
- **Optimize for cold starts**: Minimize initialization code
- **Use Durable Objects**: For stateful operations when needed

#### Limitations
- **CPU time limits**: Limited execution time per request
- **Memory limits**: Memory constraints for large operations
- **No file system**: No persistent file system access
- **Limited Node.js APIs**: Not all Node.js APIs are available

#### Conventions
```typescript
// worker.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      if (url.pathname === '/api/process-file') {
        return await handleFileProcessing(request, env);
      }
      
      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

async function handleFileProcessing(request: Request, env: Env) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return new Response('No file provided', { status: 400 });
  }
  
  // Process file...
  return new Response('File processed successfully');
}
```

#### Common Pitfalls
- **Exceeding time limits**: Be aware of execution time constraints
- **Not handling large files**: Split large file processing into chunks
- **Ignoring error handling**: Implement comprehensive error handling
- **Not optimizing for edge**: Design for distributed execution

---

## 8. AI: OpenAI GPT-4o-mini

### OpenAI GPT-4o-mini

#### Best Practices
- **Prompt engineering**: Craft specific, contextual prompts
- **Token management**: Monitor and optimize token usage
- **Error handling**: Handle API errors and rate limits
- **Caching**: Cache responses when appropriate
- **Safety measures**: Implement content filtering and safety checks

#### Limitations
- **Rate limits**: API has rate limits based on usage tier
- **Cost per token**: Usage-based pricing can be unpredictable
- **Latency**: Network latency for each API call
- **Context window**: 128k token limit for input
- **Content restrictions**: Certain content types are restricted

#### Conventions
```typescript
// openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateNPC(context: string, location: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a D&D assistant helping a DM create NPCs that fit their campaign world. 
                   Always provide: name, description, personality, and a connection to the larger story.`,
        },
        {
          role: 'user',
          content: `Campaign context: ${context}\nLocation: ${location}\n\nGenerate an NPC for this location that could become a quest giver.`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || 'Unable to generate NPC';
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error:', error.message);
      throw new Error('AI service temporarily unavailable');
    }
    throw error;
  }
}
```

#### Common Pitfalls
- **Not handling rate limits**: Implement proper rate limiting and retries
- **Ignoring token costs**: Monitor token usage for cost management
- **Poor prompt engineering**: Invest time in prompt optimization
- **Not caching responses**: Cache appropriate responses to reduce costs

---

## 9. Hosting: Vercel + Railway

### Vercel (Frontend)

#### Best Practices
- **Use environment variables**: Store secrets in Vercel environment variables
- **Optimize builds**: Configure build optimization settings
- **Use edge functions**: Leverage edge functions for better performance
- **Monitor performance**: Use Vercel Analytics for performance monitoring
- **Set up proper domains**: Configure custom domains and SSL

#### Limitations
- **Build time limits**: Build time limits on free tier
- **Function execution limits**: Time limits for serverless functions
- **Bandwidth limits**: Bandwidth limits on free tier
- **Storage limits**: Limited storage for static assets

#### Conventions
```typescript
// vercel.json
{
  "builds": [
    {
      "src": "next.config.js",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@clerk_publishable_key",
    "CLERK_SECRET_KEY": "@clerk_secret_key"
  },
  "functions": {
    "app/api/*/route.ts": {
      "maxDuration": 30
    }
  }
}
```

#### Common Pitfalls
- **Not configuring environment variables**: Set up environment variables for all environments
- **Ignoring build optimization**: Optimize for faster builds and smaller bundles
- **Not monitoring performance**: Use Vercel Analytics for performance insights
- **Poor edge function usage**: Understand edge function limitations

### Railway (Backend)

#### Best Practices
- **Use health checks**: Implement health check endpoints
- **Configure environment variables**: Set up environment variables properly
- **Monitor resource usage**: Track CPU and memory usage
- **Implement logging**: Use structured logging for debugging
- **Set up auto-scaling**: Configure auto-scaling based on load

#### Limitations
- **Resource limits**: Resource limits based on plan
- **Cold starts**: Potential cold start delays
- **Database connections**: Limited database connections
- **Deployment frequency**: Deployment frequency limits

#### Conventions
```typescript
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

#### Common Pitfalls
- **Not implementing health checks**: Always implement health check endpoints
- **Ignoring resource monitoring**: Monitor resource usage to prevent crashes
- **Poor logging**: Implement comprehensive logging for debugging
- **Not handling graceful shutdowns**: Handle SIGTERM signals properly

---

## 10. Real-time: Server-Sent Events (SSE)

### Server-Sent Events

#### Best Practices
- **Use EventSource API**: Use the standard EventSource API on the client
- **Implement reconnection**: Handle connection drops with automatic reconnection
- **Send heartbeats**: Send periodic heartbeats to keep connections alive
- **Structured data**: Use JSON for structured event data
- **Proper CORS**: Configure CORS for cross-origin requests

#### Limitations
- **One-way communication**: Only server-to-client communication
- **Connection limits**: Browser limits on concurrent connections
- **No binary data**: Only text data transmission
- **Proxy issues**: Some proxies may buffer SSE streams

#### Conventions
```typescript
// Server side (Express.js)
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  
  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // Send heartbeat every 30 seconds
  const heartbeat = setInterval(() => {
    sendEvent({ type: 'heartbeat', timestamp: Date.now() });
  }, 30000);
  
  req.on('close', () => {
    clearInterval(heartbeat);
  });
});

// Client side
const eventSource = new EventSource('/api/events');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

eventSource.onerror = (error) => {
  console.error('SSE error:', error);
};
```

#### Common Pitfalls
- **Not handling reconnection**: Implement proper reconnection logic
- **Ignoring connection limits**: Be aware of browser connection limits
- **No heartbeat mechanism**: Implement heartbeats to detect dead connections
- **Poor error handling**: Handle connection errors gracefully

---

## 11. State Management: Zustand

### Zustand State Management

#### Best Practices
- **Small, focused stores**: Create small stores for specific domains
- **Use TypeScript**: Type your stores properly
- **Avoid deeply nested state**: Keep state structure flat
- **Use selectors**: Use selectors to prevent unnecessary re-renders
- **Implement persistence**: Use persist middleware for persistent state

#### Limitations
- **No time travel**: No built-in time travel debugging
- **Limited dev tools**: Fewer dev tools compared to Redux
- **Manual optimization**: Requires manual optimization for performance
- **No middleware ecosystem**: Smaller middleware ecosystem

#### Conventions
```typescript
// stores/sessionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  currentSession: Session | null;
  isActive: boolean;
  panicHistory: PanicCall[];
  setCurrentSession: (session: Session) => void;
  addPanicCall: (call: PanicCall) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      isActive: false,
      panicHistory: [],
      
      setCurrentSession: (session) => 
        set({ currentSession: session, isActive: true }),
      
      addPanicCall: (call) => 
        set((state) => ({ 
          panicHistory: [...state.panicHistory, call] 
        })),
      
      clearSession: () => 
        set({ currentSession: null, isActive: false, panicHistory: [] }),
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({ 
        currentSession: state.currentSession,
        panicHistory: state.panicHistory 
      }),
    }
  )
);
```

#### Common Pitfalls
- **Large single store**: Don't create one large store for everything
- **Not using selectors**: Use selectors to prevent unnecessary re-renders
- **Mutating state**: Don't mutate state directly, always return new state
- **Ignoring TypeScript**: Use TypeScript for better developer experience

---

## 12. API Communication: SWR + Upstash Redis

### SWR (Stale-While-Revalidate)

#### Best Practices
- **Use TypeScript**: Type your API responses properly
- **Implement error handling**: Handle API errors gracefully
- **Use custom hooks**: Create custom hooks for API operations
- **Configure caching**: Set appropriate cache strategies
- **Handle loading states**: Provide proper loading indicators

#### Limitations
- **Less features**: Fewer features than TanStack Query
- **Manual optimization**: Requires manual optimization for complex cases
- **Limited mutation support**: Basic mutation support compared to alternatives
- **No offline support**: No built-in offline support

#### Conventions
```typescript
// hooks/useAPI.ts
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export function useCampaignData(campaignId: string) {
  const { data, error, isLoading } = useSWR(
    campaignId ? `/api/campaigns/${campaignId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
    }
  );
  
  return {
    campaign: data,
    isLoading,
    error,
  };
}

// Mutation with optimistic updates
export function usePanicCall() {
  const { mutate } = useSWRConfig();
  
  const triggerPanic = async (promptType: string, context: string) => {
    const response = await fetch('/api/panic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptType, context }),
    });
    
    if (!response.ok) {
      throw new Error('Panic call failed');
    }
    
    const result = await response.json();
    
    // Revalidate related data
    mutate('/api/sessions/current');
    
    return result;
  };
  
  return { triggerPanic };
}
```

#### Common Pitfalls
- **Not handling errors**: Always handle API errors properly
- **Ignoring loading states**: Provide proper loading indicators
- **Over-fetching**: Use conditional fetching to avoid unnecessary requests
- **Not using TypeScript**: Type your API responses for better DX

### Upstash Redis (Rate Limiting)

#### Best Practices
- **Use appropriate data types**: Choose the right Redis data types
- **Set expiration times**: Always set TTL for temporary data
- **Handle connection errors**: Implement proper error handling
- **Monitor usage**: Track Redis usage and performance
- **Use atomic operations**: Use atomic operations for consistency

#### Limitations
- **Cold starts**: Potential cold start delays for serverless
- **Memory limits**: Memory limits based on plan
- **Geographic distribution**: Limited geographic distribution
- **Connection limits**: Connection limits based on plan

#### Conventions
```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting
export async function checkRateLimit(userId: string, limit: number = 10) {
  const key = `rate_limit:${userId}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  
  return current <= limit;
}

// Caching API responses
export async function cacheApiResponse(key: string, data: any, ttl: number = 300) {
  await redis.setex(key, ttl, JSON.stringify(data));
}

export async function getCachedResponse(key: string) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached as string) : null;
}
```

#### Common Pitfalls
- **Not setting TTL**: Always set expiration times for temporary data
- **Ignoring connection errors**: Handle Redis connection errors gracefully
- **Poor key naming**: Use consistent, descriptive key naming conventions
- **Not monitoring usage**: Monitor Redis usage to avoid limits

---

## General Best Practices

### Security
- **Environment variables**: Never commit secrets to version control
- **Input validation**: Validate all user inputs
- **Rate limiting**: Implement rate limiting on all API endpoints
- **HTTPS only**: Use HTTPS for all production traffic
- **CSP headers**: Implement Content Security Policy headers

### Performance
- **Caching strategies**: Implement appropriate caching at multiple levels
- **Database optimization**: Use indexes and optimize queries
- **Bundle optimization**: Optimize frontend bundle sizes
- **Image optimization**: Optimize images for web delivery
- **CDN usage**: Use CDN for static assets

### Monitoring
- **Error tracking**: Implement comprehensive error tracking
- **Performance monitoring**: Monitor application performance
- **Usage analytics**: Track user behavior and usage patterns
- **Resource monitoring**: Monitor server resources and costs
- **Alerting**: Set up alerts for critical issues

### Development
- **Version control**: Use Git with proper branching strategy
- **Code review**: Implement code review processes
- **Testing**: Write comprehensive tests for critical functionality
- **Documentation**: Document APIs and complex business logic
- **Linting**: Use linting tools to maintain code quality

---

## Development Workflow

### Local Development Setup
1. **Environment variables**: Set up `.env.local` with all required variables
2. **Database setup**: Initialize local SQLite database with Prisma
3. **Service setup**: Configure local development for external services
4. **Hot reloading**: Ensure hot reloading works for both frontend and backend
5. **Testing setup**: Set up testing environment with test database

### Deployment Process
1. **Build process**: Ensure builds work in CI/CD environment
2. **Environment configuration**: Set up environment variables for production
3. **Database migration**: Run database migrations in production
4. **Health checks**: Implement health checks for all services
5. **Monitoring setup**: Set up monitoring and alerting

### Common Issues and Solutions
- **CORS errors**: Configure CORS properly for development and production
- **Database connection issues**: Handle connection pooling and timeouts
- **Authentication flow**: Test authentication flow in all environments
- **File upload issues**: Handle file size limits and upload errors
- **Rate limiting**: Configure rate limiting properly for production load

This comprehensive guide provides the foundation for building the Improv Panic Button application with the selected technology stack. Remember to adapt these practices based on your specific requirements and constraints. 