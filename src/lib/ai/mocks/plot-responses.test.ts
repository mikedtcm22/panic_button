import { plotMockResponses, getPlotResponse } from './plot-responses';

describe('Plot Mock Responses', () => {
  it('should have at least 2 plot mock responses', () => {
    expect(plotMockResponses).toBeDefined();
    expect(plotMockResponses.length).toBeGreaterThanOrEqual(2);
  });

  it('should have proper structure for each plot response', () => {
    plotMockResponses.forEach((response) => {
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('response');
      expect(typeof response.id).toBe('string');
      expect(typeof response.response).toBe('string');
    });
  });

  it('should contain plot redirection elements', () => {
    plotMockResponses.forEach((response) => {
      const text = response.response;
      // Should contain bold titles
      expect(text).toContain('**');
    });
  });

  it('should return random plot response', () => {
    const plot = getPlotResponse();
    expect(plot).toBeDefined();
    expect(plot).toHaveProperty('id');
    expect(plot).toHaveProperty('response');
  });
});
