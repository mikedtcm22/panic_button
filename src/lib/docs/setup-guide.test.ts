import { generateSetupGuide } from './setup-guide';

// Mock the checkEnvironment function
jest.mock('../config/env-check', () => ({
  checkEnvironment: jest.fn(() => ({
    mockMode: true,
    clerk: { 
      configured: false, 
      message: 'Clerk authentication not configured',
      instructions: 'Get your keys at https://clerk.dev'
    },
    openai: { 
      configured: false, 
      message: 'OpenAI API key not configured',
      instructions: 'Get your API key at https://platform.openai.com'
    },
    r2: { 
      configured: true, 
      message: 'Cloudflare R2 storage configured',
      instructions: 'Set up R2 at https://developers.cloudflare.com/r2'
    },
    database: { 
      configured: true, 
      message: 'Database configured',
      instructions: 'Using SQLite by default for development'
    }
  }))
}));

describe('Setup Guide Generator', () => {
  it('should generate markdown setup guide', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('# Local Development Setup');
    expect(guide).toContain('## Quick Start');
    expect(guide).toContain('npm install');
    expect(guide).toContain('npm run dev');
  });
  
  it('should include troubleshooting section', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('## Troubleshooting');
    expect(guide).toContain('Port already in use');
    expect(guide).toContain('Database errors');
  });
  
  it('should customize based on environment', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('Running in Mock Mode');
    expect(guide).toContain('No API keys required!');
  });
  
  it('should show service configuration status', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('Service Status:');
    expect(guide).toContain('❌ Clerk Authentication');
    expect(guide).toContain('❌ OpenAI API');
    expect(guide).toContain('✅ Cloudflare R2 Storage');
    expect(guide).toContain('✅ Database');
  });
  
  it('should include setup instructions for missing services', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('Get your keys at https://clerk.dev');
    expect(guide).toContain('Get your API key at https://platform.openai.com');
    // R2 is configured, so should not show instructions
    expect(guide).not.toContain('Set up R2 at https://developers.cloudflare.com/r2');
  });
  
  it('should include available pages section', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('## Available Pages');
    expect(guide).toContain('/demo');
    expect(guide).toContain('/api/health');
  });
  
  it('should include testing features section', () => {
    const guide = generateSetupGuide();
    
    expect(guide).toContain('## Testing Features');
    expect(guide).toContain('### Without API Keys (Mock Mode):');
    expect(guide).toContain('### With API Keys:');
  });
});