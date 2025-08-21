import { generateMockResponse, PanicType } from './mock-ai';

describe('Mock AI Provider', () => {
  it('should generate mock NPC response', async () => {
    const response = await generateMockResponse('npc', {
      context: 'tavern scene',
    });

    expect(response.content).toBeDefined();
    expect(response.content.length).toBeGreaterThan(0);
    expect(response.tokens).toBeGreaterThan(0);
    expect(response.cost).toBe(0); // Mock responses are free
  });

  it('should generate different responses for different panic types', async () => {
    const npc = await generateMockResponse('npc');
    const encounter = await generateMockResponse('encounter');

    expect(npc.content).not.toEqual(encounter.content);

    // Verify response contains appropriate content
    const npcLower = npc.content.toLowerCase();
    const encounterLower = encounter.content.toLowerCase();

    // NPC responses should contain character-related terms
    expect(
      npcLower.includes('dwarf') ||
        npcLower.includes('halfling') ||
        npcLower.includes('elf') ||
        npcLower.includes('human')
    ).toBe(true);

    // Encounter responses should contain encounter-related terms
    expect(
      encounterLower.includes('brawl') ||
        encounterLower.includes('fight') ||
        encounterLower.includes('approach') ||
        encounterLower.includes('dc') ||
        encounterLower.includes('attempt') ||
        encounterLower.includes('demand')
    ).toBe(true);
  });

  it('should handle all panic types', async () => {
    const types: PanicType[] = ['npc', 'encounter', 'plot', 'flavor', 'foreshadow'];

    for (const type of types) {
      const response = await generateMockResponse(type);
      expect(response.content).toBeDefined();
      expect(response.content.length).toBeGreaterThan(0);
    }
  });

  it('should simulate API delay', async () => {
    const startTime = Date.now();
    await generateMockResponse('npc');
    const endTime = Date.now();

    // Should take at least 200ms but not more than 500ms
    expect(endTime - startTime).toBeGreaterThanOrEqual(200);
    expect(endTime - startTime).toBeLessThan(600);
  });

  it('should return consistent token count', async () => {
    const response = await generateMockResponse('npc');

    // Token count should roughly match content length
    expect(response.tokens).toBe(response.content.length);
  });
});
