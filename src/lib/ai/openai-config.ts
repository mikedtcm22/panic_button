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