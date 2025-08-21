import { NextResponse } from 'next/server';
import { checkEnvironment } from '@/lib/config/env-check';

export async function GET() {
  const config = checkEnvironment();

  // Test database connection
  let databaseHealthy = false;
  try {
    // Simple check - in production would do actual query
    databaseHealthy = !!process.env.DATABASE_URL;
  } catch (error) {
    databaseHealthy = false;
  }

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0', // Hard-coded to match package.json
    mode: config.mockMode ? 'mock' : 'production',
    services: {
      clerk: config.clerk.configured,
      openai: config.openai.configured,
      storage: config.r2.configured,
      database: databaseHealthy,
    },
    details: {
      clerk: config.clerk.message,
      openai: config.openai.message,
      storage: config.r2.message,
      database: config.database.message,
    },
  };

  return NextResponse.json(health);
}
