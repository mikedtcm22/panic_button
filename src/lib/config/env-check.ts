export interface ServiceConfig {
  configured: boolean;
  message: string;
  instructions?: string;
}

export interface EnvironmentConfig {
  clerk: ServiceConfig;
  openai: ServiceConfig;
  r2: ServiceConfig;
  database: ServiceConfig;
  mockMode: boolean;
}

export function checkEnvironment(): EnvironmentConfig {
  return {
    clerk: {
      configured: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      message: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        ? 'Clerk authentication configured'
        : 'Clerk authentication not configured',
      instructions: 'Get your keys at https://clerk.dev',
    },
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
      message: process.env.OPENAI_API_KEY
        ? 'OpenAI API configured'
        : 'OpenAI API key not configured',
      instructions: 'Get your API key at https://platform.openai.com',
    },
    r2: {
      configured: !!process.env.R2_ACCESS_KEY_ID,
      message: process.env.R2_ACCESS_KEY_ID
        ? 'Cloudflare R2 storage configured'
        : 'Cloudflare R2 not configured',
      instructions: 'Set up R2 at https://developers.cloudflare.com/r2',
    },
    database: {
      configured: !!process.env.DATABASE_URL,
      message: process.env.DATABASE_URL ? 'Database configured' : 'Database not configured',
      instructions: 'Using SQLite by default for development',
    },
    mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  };
}
