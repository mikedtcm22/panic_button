import fs from 'fs';
import path from 'path';
import { generateReadme } from './generate-readme';

// Skip these tests in CI as they manipulate local files
const describeFunc = process.env.CI ? describe.skip : describe;

describeFunc('README Generator', () => {
  const readmePath = path.join(process.cwd(), 'LOCAL_TESTING.md');

  beforeEach(() => {
    // Backup existing file if it exists
    if (fs.existsSync(readmePath)) {
      fs.renameSync(readmePath, `${readmePath}.backup`);
    }
  });

  afterEach(() => {
    // Clean up test file
    if (fs.existsSync(readmePath)) {
      fs.unlinkSync(readmePath);
    }
    // Restore backed up file
    if (fs.existsSync(`${readmePath}.backup`)) {
      fs.renameSync(`${readmePath}.backup`, readmePath);
    }
  });

  it('should create LOCAL_TESTING.md file', async () => {
    await generateReadme();

    expect(fs.existsSync(readmePath)).toBe(true);
  });

  it('should include current configuration status', async () => {
    await generateReadme();
    const content = fs.readFileSync(readmePath, 'utf-8');

    expect(content).toContain('Service Status');
    expect(content).toContain('Mock Mode');
  });

  it('should contain all sections from setup guide', async () => {
    await generateReadme();
    const content = fs.readFileSync(readmePath, 'utf-8');

    expect(content).toContain('# Local Development Setup');
    expect(content).toContain('## Quick Start');
    expect(content).toContain('## Current Configuration');
    expect(content).toContain('## Available Pages');
    expect(content).toContain('## Testing Features');
    expect(content).toContain('## Troubleshooting');
    expect(content).toContain('## Next Steps');
  });

  it('should include timestamp', async () => {
    await generateReadme();
    const content = fs.readFileSync(readmePath, 'utf-8');

    expect(content).toContain('Generated on:');
  });

  it('should log success message', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await generateReadme();

    expect(consoleSpy).toHaveBeenCalledWith('✅ LOCAL_TESTING.md generated successfully');

    consoleSpy.mockRestore();
  });
});
