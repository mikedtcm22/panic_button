import fs from 'fs';
import path from 'path';
import { runSetupScript } from './setup-dev';

describe('Development Setup Script', () => {
  const envPath = path.join(process.cwd(), '.env.local');
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

  beforeEach(() => {
    // Backup existing files if they exist
    if (fs.existsSync(envPath)) {
      fs.renameSync(envPath, `${envPath}.backup`);
    }
    if (fs.existsSync(dbPath)) {
      fs.renameSync(dbPath, `${dbPath}.backup`);
    }
  });

  afterEach(() => {
    // Restore backed up files
    if (fs.existsSync(`${envPath}.backup`)) {
      if (fs.existsSync(envPath)) {
        fs.unlinkSync(envPath);
      }
      fs.renameSync(`${envPath}.backup`, envPath);
    }
    if (fs.existsSync(`${dbPath}.backup`)) {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
      fs.renameSync(`${dbPath}.backup`, dbPath);
    }
  });

  it('should create .env.local from template if missing', async () => {
    // Ensure .env.local doesn't exist
    if (fs.existsSync(envPath)) {
      fs.unlinkSync(envPath);
    }

    const result = await runSetupScript();

    expect(result.envFileCreated).toBe(true);
    expect(fs.existsSync(envPath)).toBe(true);

    const content = fs.readFileSync(envPath, 'utf-8');
    expect(content).toContain('NEXT_PUBLIC_MOCK_MODE=true');
    expect(content).toContain('DATABASE_URL=file:./dev.db');
  });

  it('should not overwrite existing .env.local', async () => {
    // Create existing .env.local
    fs.writeFileSync(envPath, 'EXISTING_CONTENT=true');

    const result = await runSetupScript();

    expect(result.envFileCreated).toBe(false);
    const content = fs.readFileSync(envPath, 'utf-8');
    expect(content).toContain('EXISTING_CONTENT=true');
  });

  it('should initialize database if not exists', async () => {
    // Ensure database doesn't exist
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }

    const result = await runSetupScript();

    expect(result.databaseInitialized).toBe(true);
    expect(fs.existsSync(dbPath)).toBe(true);
  });

  it('should report configuration status', async () => {
    const result = await runSetupScript();

    expect(result.status).toContain('Environment Check');
    expect(result.status).toContain('Mock Mode');
  });
});
