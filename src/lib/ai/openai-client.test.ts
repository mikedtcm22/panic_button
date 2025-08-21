import { createOpenAIClient, generateText } from './openai-client';

// Mock OpenAI module
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Test response' } }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        }),
      },
    },
  }));
});

// Mock the config
jest.mock('./openai-config', () => ({
  getOpenAIConfig: () => ({
    apiKey: 'test-key',
    organizationId: 'test-org',
    model: 'gpt-4o-mini',
    maxTokens: 128000,
  }),
}));

describe('OpenAI Client', () => {
  it('should create OpenAI client with configuration', () => {
    const client = createOpenAIClient();
    expect(client).toBeDefined();
  });
  
  it('should generate text using the client', async () => {
    const response = await generateText('Test prompt');
    expect(response.choices[0].message.content).toBe('Test response');
    expect(response.usage).toBeDefined();
  });
});