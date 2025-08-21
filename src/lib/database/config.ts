export function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  
  if (!databaseUrl || !authToken) {
    throw new Error('Missing database configuration');
  }
  
  return { databaseUrl, authToken };
}