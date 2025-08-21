import { generateMockResponse } from './mock-service';

describe('Mock Service Layer', () => {
  it('should generate NPC mock response', async () => {
    const response = await generateMockResponse('npc');

    expect(response).toBeDefined();
    expect(response).toContain('**'); // Contains bold formatting
    expect(response.toLowerCase()).toContain('appearance');
  });

  it('should generate encounter mock response', async () => {
    const response = await generateMockResponse('encounter');

    expect(response).toBeDefined();
    expect(response.toLowerCase()).toContain('enemies');
    expect(response.toLowerCase()).toContain('terrain');
  });

  it('should generate plot mock response', async () => {
    const response = await generateMockResponse('plot');

    expect(response).toBeDefined();
    expect(response).toContain('**'); // Contains bold title
  });

  it('should generate flavor mock response', async () => {
    const response = await generateMockResponse('flavor');

    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(100); // Flavor text is descriptive
  });

  it('should generate foreshadow mock response', async () => {
    const response = await generateMockResponse('foreshadow');

    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(50);
  });

  it('should simulate realistic API delay', async () => {
    const startTime = Date.now();
    await generateMockResponse('npc');
    const endTime = Date.now();

    const duration = endTime - startTime;
    // Should take between 800-1200ms (800 + random up to 400)
    expect(duration).toBeGreaterThanOrEqual(700); // Allow some variance
    expect(duration).toBeLessThan(1400);
  });

  it('should use context to select appropriate response when available', async () => {
    const response = await generateMockResponse('npc', { context: 'tavern' });

    expect(response).toBeDefined();
    // Should contain tavern-specific NPC
    expect(response).toContain('Gareth');
  });

  it('should return fallback for unknown type', async () => {
    const response = await generateMockResponse('unknown-type');

    expect(response).toBeDefined();
    expect(response).toContain('Mock response for: unknown-type');
  });

  it('should handle context for flavor responses', async () => {
    const response = await generateMockResponse('flavor', { location: 'tavern' });

    expect(response).toBeDefined();
    expect(response.toLowerCase()).toContain('ale');
  });
});
