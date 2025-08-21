import { checkEnvironment } from './env-check';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should detect missing environment variables', () => {
    const config = checkEnvironment();

    expect(config.clerk.configured).toBeDefined();
    expect(config.openai.configured).toBeDefined();
    expect(config.r2.configured).toBeDefined();
    expect(config.database.configured).toBeDefined();
  });

  it('should provide helpful messages for missing config', () => {
    delete process.env.OPENAI_API_KEY;
    const config = checkEnvironment();

    expect(config.openai.message).toContain('OpenAI API key not configured');
    expect(config.openai.instructions).toContain('https://platform.openai.com');
  });

  it('should detect when services are configured', () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-key';
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.R2_ACCESS_KEY_ID = 'test-r2-key';
    process.env.DATABASE_URL = 'file:./test.db';

    const config = checkEnvironment();

    expect(config.clerk.configured).toBe(true);
    expect(config.openai.configured).toBe(true);
    expect(config.r2.configured).toBe(true);
    expect(config.database.configured).toBe(true);
  });

  it('should detect mock mode when enabled', () => {
    process.env.NEXT_PUBLIC_MOCK_MODE = 'true';
    const config = checkEnvironment();

    expect(config.mockMode).toBe(true);
  });

  it('should detect mock mode as disabled by default', () => {
    delete process.env.NEXT_PUBLIC_MOCK_MODE;
    const config = checkEnvironment();

    expect(config.mockMode).toBe(false);
  });
});
