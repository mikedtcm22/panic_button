# Phase 1: AI Integration Proof of Concept - TDD Implementation Plan

## Overview
This document provides a detailed TDD-driven implementation plan for integrating OpenAI GPT-4o-mini for text generation, following the RED/GREEN/REFACTOR cycle for each feature.

## Prerequisites
- OpenAI API account with API key
- Node.js and npm installed
- Testing framework configured
- Environment variables set up

## Implementation Steps

### Step 1: OpenAI Client Configuration

#### 🟥 RED Phase - Test 1.1: API Configuration Validation
```typescript
// src/lib/ai/openai-config.test.ts
describe('OpenAI Configuration', () => {
  it('should validate required OpenAI environment variables', () => {
    const config = getOpenAIConfig();
    expect(config.apiKey).toBeDefined();
    expect(config.organizationId).toBeDefined();
    expect(config.model).toBe('gpt-4o-mini');
  });
  
  it('should throw error when API key is missing', () => {
    process.env.OPENAI_API_KEY = '';
    expect(() => getOpenAIConfig()).toThrow('Missing OpenAI API key');
  });
});
```
**Purpose**: Ensures OpenAI API is properly configured with credentials and model settings.

#### 🟩 GREEN Phase - Implementation 1.1
```typescript
// src/lib/ai/openai-config.ts
export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const organizationId = process.env.OPENAI_ORG_ID;
  
  if (!apiKey) {
    throw new Error('Missing OpenAI API key');
  }
  
  return {
    apiKey,
    organizationId: organizationId || '',
    model: 'gpt-4o-mini',
    maxTokens: 128000,
  };
}
```

#### 🟥 RED Phase - Test 1.2: OpenAI Client Initialization
```typescript
// src/lib/ai/openai-client.test.ts
describe('OpenAI Client', () => {
  it('should create OpenAI client with configuration', () => {
    const client = createOpenAIClient();
    expect(client).toBeDefined();
    expect(client.apiKey).toBeDefined();
  });
  
  it('should use correct model for completions', async () => {
    const client = createOpenAIClient();
    const spy = jest.spyOn(client.chat.completions, 'create');
    
    await generateText('Test prompt');
    
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini',
      })
    );
  });
});
```

#### 🟩 GREEN Phase - Implementation 1.2
```typescript
// src/lib/ai/openai-client.ts
import OpenAI from 'openai';
import { getOpenAIConfig } from './openai-config';

let openaiClient: OpenAI | null = null;

export function createOpenAIClient() {
  if (!openaiClient) {
    const config = getOpenAIConfig();
    
    openaiClient = new OpenAI({
      apiKey: config.apiKey,
      organization: config.organizationId || undefined,
    });
  }
  
  return openaiClient;
}

export async function generateText(prompt: string) {
  const client = createOpenAIClient();
  const config = getOpenAIConfig();
  
  const response = await client.chat.completions.create({
    model: config.model,
    messages: [{ role: 'user', content: prompt }],
  });
  
  return response;
}
```

### Step 2: Prompt Engineering System

#### 🟥 RED Phase - Test 2.1: Base Prompt Template
```typescript
// src/lib/ai/prompts/base-prompt.test.ts
describe('Base Prompt Template', () => {
  it('should create system prompt for D&D assistant', () => {
    const prompt = createSystemPrompt();
    
    expect(prompt).toContain('D&D');
    expect(prompt).toContain('Dungeon Master');
    expect(prompt).toContain('5e');
    expect(prompt).toContain('SRD');
  });
  
  it('should include role and constraints', () => {
    const prompt = createSystemPrompt();
    
    expect(prompt).toContain('assistant');
    expect(prompt).toContain('lore-consistent');
    expect(prompt).toContain('avoid copyrighted');
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.1
```typescript
// src/lib/ai/prompts/base-prompt.ts
export function createSystemPrompt(): string {
  return `You are a D&D 5e Dungeon Master assistant helping DMs during live game sessions.
Your responses should be:
- Lore-consistent with the campaign materials provided
- Compatible with D&D 5e rules and the SRD (System Reference Document)
- Creative and engaging for players
- Concise enough to be read quickly during play

Constraints:
- Avoid copyrighted monster stats not in the SRD
- Keep responses under 500 words unless specifically requested otherwise
- Maintain the tone and style established in the campaign materials`;
}
```

#### 🟥 RED Phase - Test 2.2: Context Injection
```typescript
// src/lib/ai/prompts/context-injection.test.ts
describe('Context Injection', () => {
  it('should inject campaign context into prompt', () => {
    const campaignContext = {
      setting: 'Waterdeep',
      tone: 'dark fantasy',
      npcs: ['Volo', 'Durnan'],
      currentLocation: 'Yawning Portal Inn',
    };
    
    const prompt = injectContext(createSystemPrompt(), campaignContext);
    
    expect(prompt).toContain('Waterdeep');
    expect(prompt).toContain('dark fantasy');
    expect(prompt).toContain('Volo');
    expect(prompt).toContain('Yawning Portal Inn');
  });
  
  it('should handle missing context gracefully', () => {
    const prompt = injectContext(createSystemPrompt(), {});
    
    expect(prompt).toBeDefined();
    expect(prompt.length).toBeGreaterThan(0);
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.2
```typescript
// src/lib/ai/prompts/context-injection.ts
interface CampaignContext {
  setting?: string;
  tone?: string;
  npcs?: string[];
  currentLocation?: string;
  recentEvents?: string[];
}

export function injectContext(basePrompt: string, context: CampaignContext): string {
  const contextParts: string[] = [basePrompt];
  
  if (context.setting) {
    contextParts.push(`\nCampaign Setting: ${context.setting}`);
  }
  
  if (context.tone) {
    contextParts.push(`Tone: ${context.tone}`);
  }
  
  if (context.npcs && context.npcs.length > 0) {
    contextParts.push(`Known NPCs: ${context.npcs.join(', ')}`);
  }
  
  if (context.currentLocation) {
    contextParts.push(`Current Location: ${context.currentLocation}`);
  }
  
  if (context.recentEvents && context.recentEvents.length > 0) {
    contextParts.push(`Recent Events:\n- ${context.recentEvents.join('\n- ')}`);
  }
  
  return contextParts.join('\n');
}
```

#### 🟥 RED Phase - Test 2.3: Panic Prompt Templates
```typescript
// src/lib/ai/prompts/panic-prompts.test.ts
describe('Panic Prompt Templates', () => {
  it('should generate NPC prompt', () => {
    const prompt = generatePanicPrompt('npc', {
      location: 'tavern',
      context: 'players need information',
    });
    
    expect(prompt).toContain('Generate an NPC');
    expect(prompt).toContain('tavern');
    expect(prompt).toContain('information');
  });
  
  it('should generate encounter prompt', () => {
    const prompt = generatePanicPrompt('encounter', {
      partyLevel: 5,
      partySize: 4,
      difficulty: 'medium',
    });
    
    expect(prompt).toContain('Create an encounter');
    expect(prompt).toContain('level 5');
    expect(prompt).toContain('4 players');
    expect(prompt).toContain('medium difficulty');
  });
  
  it('should support all five panic types', () => {
    const types = ['npc', 'encounter', 'plot', 'flavor', 'foreshadow'];
    
    types.forEach(type => {
      const prompt = generatePanicPrompt(type as any, {});
      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.3
```typescript
// src/lib/ai/prompts/panic-prompts.ts
type PanicType = 'npc' | 'encounter' | 'plot' | 'flavor' | 'foreshadow';

interface PanicContext {
  location?: string;
  context?: string;
  partyLevel?: number;
  partySize?: number;
  difficulty?: string;
  theme?: string;
}

export function generatePanicPrompt(type: PanicType, context: PanicContext): string {
  const prompts: Record<PanicType, (ctx: PanicContext) => string> = {
    npc: (ctx) => `Generate an NPC for ${ctx.location || 'the current location'}.
Context: ${ctx.context || 'The party encounters someone interesting.'}
Include: Name, appearance, personality quirk, motivation, and potential quest hook.`,
    
    encounter: (ctx) => `Create an encounter for ${ctx.partySize || 4} level ${ctx.partyLevel || 5} players.
Difficulty: ${ctx.difficulty || 'medium'}
Include: Enemy types (SRD only), terrain features, and tactical considerations.`,
    
    plot: (ctx) => `Suggest a plot redirection based on current events.
Theme: ${ctx.theme || 'adventure'}
Provide a twist or complication that moves the story forward.`,
    
    flavor: (ctx) => `Describe ${ctx.location || 'the current scene'} with vivid sensory details.
Focus on atmosphere, sounds, smells, and small details that bring the scene to life.`,
    
    foreshadow: (ctx) => `Create a subtle foreshadowing element.
Theme: ${ctx.theme || 'mystery'}
Provide a hint or omen about future events without being too obvious.`,
  };
  
  return prompts[type](context);
}
```

### Step 3: Text Generation Endpoint

#### 🟥 RED Phase - Test 3.1: API Endpoint Creation
```typescript
// src/app/api/generate/route.test.ts
describe('Text Generation API Endpoint', () => {
  it('should accept POST request with prompt', async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Generate an NPC',
        type: 'npc',
      }),
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.content).toBeDefined();
  });
  
  it('should validate request body', async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    
    expect(response.status).toBe(400);
    const error = await response.json();
    expect(error.message).toContain('required');
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.1
```typescript
// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/openai-client';
import { generatePanicPrompt } from '@/lib/ai/prompts/panic-prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.prompt && !body.type) {
      return NextResponse.json(
        { message: 'Prompt or type is required' },
        { status: 400 }
      );
    }
    
    const prompt = body.prompt || generatePanicPrompt(body.type, body.context || {});
    const response = await generateText(prompt);
    
    return NextResponse.json({
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
```

#### 🟥 RED Phase - Test 3.2: Request Validation
```typescript
// src/lib/ai/validation.test.ts
describe('Request Validation', () => {
  it('should validate panic type', () => {
    const validTypes = ['npc', 'encounter', 'plot', 'flavor', 'foreshadow'];
    
    validTypes.forEach(type => {
      const result = validateGenerateRequest({ type });
      expect(result.valid).toBe(true);
    });
    
    const invalidResult = validateGenerateRequest({ type: 'invalid' });
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.error).toContain('Invalid panic type');
  });
  
  it('should validate prompt length', () => {
    const longPrompt = 'x'.repeat(10001);
    const result = validateGenerateRequest({ prompt: longPrompt });
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum length');
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.2
```typescript
// src/lib/ai/validation.ts
interface GenerateRequest {
  prompt?: string;
  type?: string;
  context?: any;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateGenerateRequest(request: GenerateRequest): ValidationResult {
  const validTypes = ['npc', 'encounter', 'plot', 'flavor', 'foreshadow'];
  
  if (request.type && !validTypes.includes(request.type)) {
    return {
      valid: false,
      error: 'Invalid panic type',
    };
  }
  
  if (request.prompt && request.prompt.length > 10000) {
    return {
      valid: false,
      error: 'Prompt exceeds maximum length of 10000 characters',
    };
  }
  
  if (!request.prompt && !request.type) {
    return {
      valid: false,
      error: 'Either prompt or type must be provided',
    };
  }
  
  return { valid: true };
}
```

### Step 4: Error Handling and Retry Logic

#### 🟥 RED Phase - Test 4.1: API Error Handling
```typescript
// src/lib/ai/error-handling.test.ts
describe('AI Error Handling', () => {
  it('should handle rate limit errors', async () => {
    const mockError = new Error('Rate limit exceeded');
    mockError.name = 'RateLimitError';
    
    const result = await handleAIError(mockError);
    
    expect(result.shouldRetry).toBe(true);
    expect(result.retryAfter).toBeGreaterThan(0);
  });
  
  it('should handle API timeout', async () => {
    const mockError = new Error('Request timeout');
    mockError.name = 'TimeoutError';
    
    const result = await handleAIError(mockError);
    
    expect(result.shouldRetry).toBe(true);
    expect(result.fallbackResponse).toBeDefined();
  });
  
  it('should not retry on invalid API key', async () => {
    const mockError = new Error('Invalid API key');
    mockError.name = 'AuthenticationError';
    
    const result = await handleAIError(mockError);
    
    expect(result.shouldRetry).toBe(false);
    expect(result.criticalError).toBe(true);
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.1
```typescript
// src/lib/ai/error-handling.ts
interface ErrorHandlingResult {
  shouldRetry: boolean;
  retryAfter?: number;
  fallbackResponse?: string;
  criticalError?: boolean;
}

export async function handleAIError(error: Error): Promise<ErrorHandlingResult> {
  if (error.name === 'RateLimitError') {
    return {
      shouldRetry: true,
      retryAfter: 60000, // Retry after 1 minute
    };
  }
  
  if (error.name === 'TimeoutError') {
    return {
      shouldRetry: true,
      fallbackResponse: 'The AI service is taking longer than expected. Please try again.',
    };
  }
  
  if (error.name === 'AuthenticationError') {
    return {
      shouldRetry: false,
      criticalError: true,
    };
  }
  
  // Default handling for unknown errors
  return {
    shouldRetry: true,
    retryAfter: 5000, // Retry after 5 seconds
  };
}
```

#### 🟥 RED Phase - Test 4.2: Retry Logic Implementation
```typescript
// src/lib/ai/retry.test.ts
describe('Retry Logic', () => {
  it('should retry on transient failures', async () => {
    let attempts = 0;
    const mockGenerate = jest.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Temporary failure');
      }
      return { content: 'Success' };
    });
    
    const result = await generateWithRetry(mockGenerate, 3);
    
    expect(result.content).toBe('Success');
    expect(attempts).toBe(3);
  });
  
  it('should respect max retry attempts', async () => {
    const mockGenerate = jest.fn().mockRejectedValue(new Error('Persistent failure'));
    
    await expect(generateWithRetry(mockGenerate, 3)).rejects.toThrow('Persistent failure');
    expect(mockGenerate).toHaveBeenCalledTimes(3);
  });
  
  it('should implement exponential backoff', async () => {
    const delays: number[] = [];
    jest.spyOn(global, 'setTimeout').mockImplementation((fn, delay) => {
      delays.push(delay as number);
      fn();
      return null as any;
    });
    
    const mockGenerate = jest.fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue({ content: 'Success' });
    
    await generateWithRetry(mockGenerate, 3);
    
    expect(delays[0]).toBeLessThan(delays[1]);
    expect(delays[1]).toBeLessThan(delays[2] || Infinity);
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.2
```typescript
// src/lib/ai/retry.ts
export async function generateWithRetry<T>(
  generateFn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await generateFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### Step 5: Token Usage Tracking

#### 🟥 RED Phase - Test 5.1: Token Counting
```typescript
// src/lib/ai/token-tracking.test.ts
describe('Token Usage Tracking', () => {
  it('should track input and output tokens', async () => {
    const usage = {
      prompt_tokens: 150,
      completion_tokens: 200,
      total_tokens: 350,
    };
    
    const tracked = await trackTokenUsage('user_123', usage);
    
    expect(tracked.userId).toBe('user_123');
    expect(tracked.inputTokens).toBe(150);
    expect(tracked.outputTokens).toBe(200);
    expect(tracked.totalTokens).toBe(350);
  });
  
  it('should calculate cost based on token usage', () => {
    const cost = calculateTokenCost(1000, 2000, 'gpt-4o-mini');
    
    // GPT-4o-mini pricing: $0.15/1M input, $0.60/1M output
    const expectedCost = (1000 * 0.15 / 1000000) + (2000 * 0.60 / 1000000);
    expect(cost).toBeCloseTo(expectedCost, 6);
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.1
```typescript
// src/lib/ai/token-tracking.ts
interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface TrackedUsage {
  userId: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  timestamp: Date;
}

const PRICING = {
  'gpt-4o-mini': {
    input: 0.15 / 1000000,  // $0.15 per 1M tokens
    output: 0.60 / 1000000, // $0.60 per 1M tokens
  },
};

export async function trackTokenUsage(
  userId: string,
  usage: TokenUsage
): Promise<TrackedUsage> {
  const cost = calculateTokenCost(
    usage.prompt_tokens,
    usage.completion_tokens,
    'gpt-4o-mini'
  );
  
  const tracked: TrackedUsage = {
    userId,
    inputTokens: usage.prompt_tokens,
    outputTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    cost,
    timestamp: new Date(),
  };
  
  // In production, save to database
  await saveTokenUsage(tracked);
  
  return tracked;
}

export function calculateTokenCost(
  inputTokens: number,
  outputTokens: number,
  model: string
): number {
  const pricing = PRICING[model as keyof typeof PRICING];
  if (!pricing) {
    throw new Error(`Unknown model: ${model}`);
  }
  
  return (inputTokens * pricing.input) + (outputTokens * pricing.output);
}

async function saveTokenUsage(usage: TrackedUsage): Promise<void> {
  // Database save implementation
  // await prisma.tokenUsage.create({ data: usage });
}
```

#### 🟥 RED Phase - Test 5.2: Usage Limits
```typescript
// src/lib/ai/usage-limits.test.ts
describe('Usage Limits', () => {
  it('should enforce daily token limit', async () => {
    const userId = 'user_123';
    const dailyLimit = 100000;
    
    // Mock user has used 95000 tokens today
    jest.spyOn(usageModule, 'getDailyUsage').mockResolvedValue(95000);
    
    const canUse = await checkTokenLimit(userId, 10000, dailyLimit);
    expect(canUse).toBe(false);
    
    const canUseSmaller = await checkTokenLimit(userId, 4000, dailyLimit);
    expect(canUseSmaller).toBe(true);
  });
  
  it('should track session token usage', async () => {
    const sessionId = 'session_123';
    
    await addSessionUsage(sessionId, 1000);
    await addSessionUsage(sessionId, 2000);
    
    const total = await getSessionUsage(sessionId);
    expect(total).toBe(3000);
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.2
```typescript
// src/lib/ai/usage-limits.ts
const sessionUsageMap = new Map<string, number>();

export async function checkTokenLimit(
  userId: string,
  requestedTokens: number,
  dailyLimit: number
): Promise<boolean> {
  const currentUsage = await getDailyUsage(userId);
  return (currentUsage + requestedTokens) <= dailyLimit;
}

export async function getDailyUsage(userId: string): Promise<number> {
  // In production, query from database
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  // 
  // const usage = await prisma.tokenUsage.aggregate({
  //   where: {
  //     userId,
  //     timestamp: { gte: today },
  //   },
  //   _sum: { totalTokens: true },
  // });
  // 
  // return usage._sum.totalTokens || 0;
  
  return 0; // Mock implementation
}

export async function addSessionUsage(sessionId: string, tokens: number): Promise<void> {
  const current = sessionUsageMap.get(sessionId) || 0;
  sessionUsageMap.set(sessionId, current + tokens);
}

export async function getSessionUsage(sessionId: string): Promise<number> {
  return sessionUsageMap.get(sessionId) || 0;
}
```

## Testing Checklist

### Unit Tests
- [ ] OpenAI configuration validation
- [ ] Client initialization
- [ ] System prompt creation
- [ ] Context injection
- [ ] Panic prompt templates
- [ ] Request validation
- [ ] Error handling logic
- [ ] Retry mechanism
- [ ] Token counting
- [ ] Usage limit enforcement

### Integration Tests
- [ ] Complete text generation flow
- [ ] API endpoint responses
- [ ] Error recovery
- [ ] Token tracking persistence
- [ ] Rate limit handling

### Performance Tests
- [ ] Response time < 5 seconds
- [ ] Concurrent request handling
- [ ] Token usage accuracy
- [ ] Retry delay effectiveness

## Success Metrics
- All unit tests passing (100% of AI components)
- API response time < 5 seconds for 90% of requests
- Successful retry rate > 80% for transient failures
- Token usage tracking accuracy > 99%
- Zero critical errors in production

## Next Steps
After completing all tests and implementations:
1. Run full test suite: `npm run test`
2. Check coverage: `npm run test:coverage`
3. Commit with message: `feat: implement OpenAI GPT-4o-mini integration`
4. Document API key setup in `.env.example`
5. Create usage monitoring dashboard
6. Set up cost alerts for token usage