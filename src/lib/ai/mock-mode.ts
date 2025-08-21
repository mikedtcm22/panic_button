export function isInMockMode(): boolean {
  const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '';
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  return !hasOpenAIKey || isDemoMode;
}
