import { getR2Config, createR2Client } from './r2-client';

describe('R2 Storage Client', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env.CLOUDFLARE_ACCOUNT_ID;
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
    delete process.env.R2_BUCKET_NAME;
  });

  it('should validate required R2 environment variables', () => {
    // Set up environment variables
    process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account-id';
    process.env.R2_ACCESS_KEY_ID = 'test-access-key';
    process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.R2_BUCKET_NAME = 'test-bucket';

    const config = getR2Config();

    expect(config.accountId).toBeDefined();
    expect(config.accessKeyId).toBeDefined();
    expect(config.secretAccessKey).toBeDefined();
    expect(config.bucketName).toBeDefined();
  });

  it('should throw error when environment variables are missing', () => {
    expect(() => getR2Config()).toThrow('Missing Cloudflare R2 environment variables');
  });
});

describe('R2 S3 Client', () => {
  beforeEach(() => {
    // Set up environment variables for client tests
    process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account-id';
    process.env.R2_ACCESS_KEY_ID = 'test-access-key';
    process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.R2_BUCKET_NAME = 'test-bucket';
  });

  it('should create S3 client with R2 endpoint', async () => {
    const client = createR2Client();
    expect(client).toBeDefined();
    expect(client.config.endpoint).toBeDefined();
    // Check that endpoint was configured properly
    if (client.config.endpoint && typeof client.config.endpoint === 'function') {
      const endpointProvider = await client.config.endpoint();
      expect(endpointProvider.hostname).toContain('r2.cloudflarestorage.com');
    }
  });
});
