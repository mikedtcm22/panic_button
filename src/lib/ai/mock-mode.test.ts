import { isInMockMode } from './mock-mode';

describe('Mock Mode Detection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should return true when OPENAI_API_KEY is not set', () => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.NEXT_PUBLIC_DEMO_MODE;

    expect(isInMockMode()).toBe(true);
  });

  it('should return true when NEXT_PUBLIC_DEMO_MODE is set to true', () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';

    expect(isInMockMode()).toBe(true);
  });

  it('should return false when OPENAI_API_KEY is set and demo mode is not enabled', () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false';

    expect(isInMockMode()).toBe(false);
  });

  it('should return false when OPENAI_API_KEY is set and demo mode is not set', () => {
    process.env.OPENAI_API_KEY = 'test-key';
    delete process.env.NEXT_PUBLIC_DEMO_MODE;

    expect(isInMockMode()).toBe(false);
  });

  it('should handle empty string OPENAI_API_KEY as not set', () => {
    process.env.OPENAI_API_KEY = '';
    delete process.env.NEXT_PUBLIC_DEMO_MODE;

    expect(isInMockMode()).toBe(true);
  });
});
