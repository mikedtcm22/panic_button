import { getClerkConfig } from './clerk-config';

describe('Clerk Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should validate required environment variables are present', () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_123';
    process.env.CLERK_SECRET_KEY = 'sk_test_456';

    const config = getClerkConfig();
    
    expect(config.publishableKey).toBe('pk_test_123');
    expect(config.secretKey).toBe('sk_test_456');
  });

  it('should throw error when publishable key is missing', () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    process.env.CLERK_SECRET_KEY = 'sk_test_456';

    expect(() => getClerkConfig()).toThrow('Missing Clerk environment variables');
  });

  it('should throw error when secret key is missing', () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_123';
    delete process.env.CLERK_SECRET_KEY;

    expect(() => getClerkConfig()).toThrow('Missing Clerk environment variables');
  });

  it('should throw error when both keys are missing', () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;

    expect(() => getClerkConfig()).toThrow('Missing Clerk environment variables');
  });
});