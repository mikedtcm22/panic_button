import fs from 'fs';
import path from 'path';

describe('App Directory Structure', () => {
  it('should have required app directory files', () => {
    const appDir = path.join(process.cwd(), 'src/app');

    expect(fs.existsSync(path.join(appDir, 'layout.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'page.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'globals.css'))).toBe(true);
  });

  it('should have error handling files', () => {
    const appDir = path.join(process.cwd(), 'src/app');

    expect(fs.existsSync(path.join(appDir, 'error.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'not-found.tsx'))).toBe(true);
  });
});
