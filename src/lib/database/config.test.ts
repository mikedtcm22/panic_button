import { getDatabaseConfig } from './config';

describe('Database Configuration', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env.DATABASE_URL;
    delete process.env.DATABASE_AUTH_TOKEN;
  });

  it('should validate required database environment variables', () => {
    // Set up environment variables
    process.env.DATABASE_URL = 'file:./dev.db';
    process.env.DATABASE_AUTH_TOKEN = 'test-auth-token';

    const config = getDatabaseConfig();

    expect(config.databaseUrl).toBeDefined();
    expect(config.authToken).toBeDefined();
  });

  it('should throw error when environment variables are missing', () => {
    process.env.DATABASE_URL = '';
    expect(() => getDatabaseConfig()).toThrow('Missing database configuration');
  });
});
