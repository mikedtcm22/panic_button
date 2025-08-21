import { prisma } from '@/lib/database';

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
    input: 0.15 / 1000000, // $0.15 per 1M tokens
    output: 0.6 / 1000000, // $0.60 per 1M tokens
  },
};

export async function trackTokenUsage(userId: string, usage: TokenUsage): Promise<TrackedUsage> {
  const cost = calculateTokenCost(usage.prompt_tokens, usage.completion_tokens, 'gpt-4o-mini');

  const tracked: TrackedUsage = {
    userId,
    inputTokens: usage.prompt_tokens,
    outputTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    cost,
    timestamp: new Date(),
  };

  // Save to panic call record
  // In production, would save to a dedicated TokenUsage table

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

  return inputTokens * pricing.input + outputTokens * pricing.output;
}
