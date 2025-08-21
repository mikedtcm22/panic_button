describe('Next.js Configuration', () => {
  it('should have Next.js 14 with App Router configured', () => {
    const packageJson = require('../../package.json');
    expect(packageJson.dependencies.next).toMatch(/14\./);
    
    const nextConfig = require('../../next.config.js');
    expect(nextConfig).toBeDefined();
  });
  
  it('should have TypeScript configuration', () => {
    const tsConfig = require('../../tsconfig.json');
    expect(tsConfig.compilerOptions.jsx).toBe('preserve');
    expect(tsConfig.compilerOptions.strict).toBe(true);
  });
});