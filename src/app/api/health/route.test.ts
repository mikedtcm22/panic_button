import { GET } from './route';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any) => ({
      json: async () => data,
      status: 200
    })
  }
}));

// Mock the checkEnvironment function
jest.mock('@/lib/config/env-check', () => ({
  checkEnvironment: jest.fn(() => ({
    mockMode: true,
    clerk: { 
      configured: false, 
      message: 'Clerk authentication not configured' 
    },
    openai: { 
      configured: true, 
      message: 'OpenAI API configured' 
    },
    r2: { 
      configured: false, 
      message: 'Cloudflare R2 not configured' 
    },
    database: { 
      configured: true, 
      message: 'Database configured' 
    }
  }))
}));

// Mock package.json
jest.mock('../../../../package.json', () => ({
  version: '1.0.0'
}), { virtual: true });

describe('Health Check Endpoint', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    process.env = { ...originalEnv };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });
  
  it('should return service status', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.services).toBeDefined();
  });
  
  it('should indicate which services are configured', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.DATABASE_URL = 'file:./test.db';
    
    const response = await GET();
    const data = await response.json();
    
    expect(data.services.openai).toBe(true);
    expect(data.services.database).toBe(true);
    expect(data.services.clerk).toBe(false);
    expect(data.services.storage).toBe(false);
  });
  
  it('should include timestamp and version', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
    expect(data.version).toBe('1.0.0');
  });
  
  it('should include mode indicator', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.mode).toBeDefined();
    expect(data.mode).toBe('mock');
  });
  
  it('should include detailed service messages', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.details).toBeDefined();
    expect(data.details.clerk).toContain('not configured');
    expect(data.details.openai).toContain('configured');
    expect(data.details.database).toContain('configured');
    expect(data.details.storage).toContain('not configured');
  });
});