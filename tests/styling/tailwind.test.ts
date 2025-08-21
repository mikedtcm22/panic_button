describe('Tailwind CSS Configuration', () => {
  it('should have Tailwind CSS configured', () => {
    const tailwindConfig = require('../../tailwind.config.js');

    expect(tailwindConfig.content).toContain('./src/app/**/*.{js,ts,jsx,tsx,mdx}');
    expect(tailwindConfig.content).toContain('./src/components/**/*.{js,ts,jsx,tsx,mdx}');
    expect(tailwindConfig.theme.extend).toBeDefined();
  });

  it('should have custom color palette', () => {
    const tailwindConfig = require('../../tailwind.config.js');

    expect(tailwindConfig.theme.extend.colors['panic-red']).toBeDefined();
    expect(tailwindConfig.theme.extend.colors['dm-purple']).toBeDefined();
  });
});
