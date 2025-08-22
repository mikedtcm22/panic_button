import { mockDigestSummary, getMockDigest } from './digest-response';

describe('Campaign Digest Mock Response', () => {
  it('should have mock digest summary with proper structure', () => {
    expect(mockDigestSummary).toBeDefined();
    expect(mockDigestSummary.id).toBeDefined();
    expect(mockDigestSummary.uploadedFile).toBeDefined();
    expect(mockDigestSummary.summary).toBeDefined();
    expect(mockDigestSummary.statistics).toBeDefined();
  });

  it('should have comprehensive statistics', () => {
    const stats = mockDigestSummary.statistics;
    expect(stats.totalTokens).toBeGreaterThan(0);
    expect(stats.npcsFound).toBeGreaterThan(0);
    expect(stats.locationsFound).toBeGreaterThan(0);
    expect(stats.factionsFound).toBeGreaterThan(0);
    expect(stats.plotHooksFound).toBeGreaterThan(0);
  });

  it('should contain digest analysis in summary', () => {
    const summary = mockDigestSummary.summary;
    expect(summary).toContain('Campaign Digest Created Successfully');
    expect(summary).toContain('Setting:');
    expect(summary).toContain('Core Conflict:');
    expect(summary).toContain('Token Usage:');
  });

  it('should return digest for a given filename', () => {
    const digest = getMockDigest('test-campaign.md');
    expect(digest).toBeDefined();
    // Type guard to check if it's not a Promise
    if (!('then' in digest)) {
      expect(digest.uploadedFile).toBe('test-campaign.md');
    }
  });

  it('should simulate processing delay', async () => {
    const startTime = Date.now();
    const digest = await getMockDigest('test.md', true);
    const endTime = Date.now();

    expect(endTime - startTime).toBeGreaterThanOrEqual(2000);
    expect(digest).toBeDefined();
  });
});
