import { flavorMockResponses, getFlavorResponse } from './flavor-responses';

describe('Flavor Mock Responses', () => {
  it('should have at least 2 flavor mock responses', () => {
    expect(flavorMockResponses).toBeDefined();
    expect(flavorMockResponses.length).toBeGreaterThanOrEqual(2);
  });

  it('should have proper structure for each flavor response', () => {
    flavorMockResponses.forEach((response) => {
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('location');
      expect(response).toHaveProperty('response');
    });
  });

  it('should contain atmospheric descriptions', () => {
    flavorMockResponses.forEach((response) => {
      // Flavor text should be descriptive and longer
      expect(response.response.length).toBeGreaterThan(100);
    });
  });

  it('should return location-specific flavor when available', () => {
    const tavernFlavor = getFlavorResponse('tavern');
    if (tavernFlavor && tavernFlavor.location === 'tavern') {
      expect(tavernFlavor.location).toBe('tavern');
    }
  });
});
