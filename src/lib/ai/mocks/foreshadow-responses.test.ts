import { foreshadowMockResponses, getForeshadowResponse } from './foreshadow-responses';

describe('Foreshadow Mock Responses', () => {
  it('should have at least 2 foreshadow mock responses', () => {
    expect(foreshadowMockResponses).toBeDefined();
    expect(foreshadowMockResponses.length).toBeGreaterThanOrEqual(2);
  });

  it('should have proper structure for each foreshadow response', () => {
    foreshadowMockResponses.forEach((response) => {
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('response');
      expect(typeof response.id).toBe('string');
      expect(typeof response.response).toBe('string');
    });
  });

  it('should contain mysterious or ominous elements', () => {
    foreshadowMockResponses.forEach((response) => {
      // Foreshadowing should be substantial
      expect(response.response.length).toBeGreaterThan(50);
    });
  });

  it('should return random foreshadow response', () => {
    const foreshadow = getForeshadowResponse();
    expect(foreshadow).toBeDefined();
    expect(foreshadow).toHaveProperty('id');
    expect(foreshadow).toHaveProperty('response');
  });
});
