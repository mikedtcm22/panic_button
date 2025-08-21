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