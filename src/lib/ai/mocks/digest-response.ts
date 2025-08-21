export interface MockDigestSummary {
  id: string;
  uploadedFile: string;
  summary: string;
  statistics: {
    totalTokens: number;
    npcsFound: number;
    locationsFound: number;
    factionsFound: number;
    plotHooksFound: number;
  };
}

export const mockDigestSummary: MockDigestSummary = {
  id: 'digest-1',
  uploadedFile: 'The-Chronicles-of-Shadowmere.md',
  summary: `**Campaign Digest Created Successfully**

*Document Analysis Complete:*
- **Setting:** The Kingdom of Shadowmere (Dark Fantasy)
- **Core Conflict:** A curse causing shadows to act independently
- **Tone:** Gothic horror with political intrigue
- **Power Level:** Mid-tier (levels 5-10 recommended)

*Key Elements Indexed:*
- 3 Major Regions identified and mapped
- 9 Important NPCs catalogued with motivations
- 3 Major Factions with conflicting goals
- 5 Campaign Secrets flagged for DM reference
- 15 potential plot hooks extracted

*Unique Mechanics Detected:*
- Shadow separation occurs nightly at 13th bell
- Shadows can manipulate objects but not harm directly
- Silver mirrors and running water provide protection
- Children born post-curse have shadow control abilities

*Token Usage:* 4,326 tokens indexed (well within 8k active context limit)

*Ready for Session:* Your campaign digest is ready. You can now:
- Flag specific scenes for tonight's session
- Generate content consistent with Shadowmere's lore
- Access quick references during gameplay

*Suggested First Session:* "The Night of No Shadows" - A mysterious event causes all shadows to vanish for one night, creating panic and revealing hidden truths.`,
  statistics: {
    totalTokens: 4326,
    npcsFound: 9,
    locationsFound: 6,
    factionsFound: 3,
    plotHooksFound: 15,
  },
};

export function getMockDigest(
  filename: string,
  withDelay?: boolean
): MockDigestSummary | Promise<MockDigestSummary> {
  const digest = {
    ...mockDigestSummary,
    uploadedFile: filename,
  };

  if (withDelay) {
    // Simulate processing delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(digest), 3000);
    });
  }

  return digest;
}
