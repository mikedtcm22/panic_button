import { getOpenAIConfig } from './openai-config';

describe('OpenAI Configuration', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_ORG_ID;
  });

  it('should validate required OpenAI environment variables', () => {
    // Set up environment variables
    process.env.OPENAI_API_KEY = 'test-api-key';
    process.env.OPENAI_ORG_ID = 'test-org-id';

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
