import { npcMockResponses, getNPCResponse } from './npc-responses';

describe('NPC Mock Responses', () => {
  it('should have at least 3 NPC mock responses', () => {
    expect(npcMockResponses).toBeDefined();
    expect(npcMockResponses.length).toBeGreaterThanOrEqual(3);
  });

  it('should have proper structure for each NPC response', () => {
    npcMockResponses.forEach(response => {
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('context');
      expect(response).toHaveProperty('response');
      expect(typeof response.id).toBe('string');
      expect(typeof response.context).toBe('string');
      expect(typeof response.response).toBe('string');
    });
  });

  it('should contain detailed NPC information in responses', () => {
    npcMockResponses.forEach(response => {
      const text = response.response.toLowerCase();
      // Should contain appearance, personality, motivation, and quest hook
      expect(text).toContain('appearance');
      expect(text).toContain('personality');
      expect(text).toContain('motivation');
      expect(text).toContain('quest hook');
    });
  });

  it('should return tavern context NPC when requested', () => {
    const tavernNPC = getNPCResponse('tavern');
    expect(tavernNPC).toBeDefined();
    expect(tavernNPC.context).toBe('tavern');
    expect(tavernNPC.response).toContain('**');
  });

  it('should return market context NPC when requested', () => {
    const marketNPC = getNPCResponse('market');
    expect(marketNPC).toBeDefined();
    expect(marketNPC.context).toBe('market');
  });

  it('should return road context NPC when requested', () => {
    const roadNPC = getNPCResponse('road');
    expect(roadNPC).toBeDefined();
    expect(roadNPC.context).toBe('road');
  });

  it('should return random NPC when no context provided', () => {
    const randomNPC = getNPCResponse();
    expect(randomNPC).toBeDefined();
    expect(randomNPC).toHaveProperty('id');
    expect(randomNPC).toHaveProperty('response');
  });

  it('should return random NPC when unknown context provided', () => {
    const randomNPC = getNPCResponse('unknown-location');
    expect(randomNPC).toBeDefined();
    expect(randomNPC).toHaveProperty('id');
    expect(randomNPC).toHaveProperty('response');
  });
});