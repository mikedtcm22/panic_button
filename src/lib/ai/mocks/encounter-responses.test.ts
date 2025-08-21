import { encounterMockResponses, getEncounterResponse } from './encounter-responses';

describe('Encounter Mock Responses', () => {
  it('should have at least 2 encounter mock responses', () => {
    expect(encounterMockResponses).toBeDefined();
    expect(encounterMockResponses.length).toBeGreaterThanOrEqual(2);
  });

  it('should have proper structure for each encounter response', () => {
    encounterMockResponses.forEach(response => {
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('difficulty');
      expect(response).toHaveProperty('partyLevel');
      expect(response).toHaveProperty('response');
    });
  });

  it('should contain encounter details in responses', () => {
    encounterMockResponses.forEach(response => {
      const text = response.response.toLowerCase();
      // Should contain enemies, terrain, and tactics
      expect(text).toContain('enemies');
      expect(text).toContain('terrain');
      expect(text).toContain('tactics');
    });
  });

  it('should return appropriate difficulty encounter', () => {
    const mediumEncounter = getEncounterResponse('medium');
    if (mediumEncounter) {
      expect(['easy', 'medium', 'hard']).toContain(mediumEncounter.difficulty);
    }
  });
});