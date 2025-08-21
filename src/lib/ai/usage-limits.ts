const sessionUsageMap = new Map<string, number>();

export async function checkTokenLimit(
  userId: string,
  requestedTokens: number,
  dailyLimit: number
): Promise<boolean> {
  const currentUsage = await getDailyUsage(userId);
  return currentUsage + requestedTokens <= dailyLimit;
}

export async function getDailyUsage(userId: string): Promise<number> {
  // In production, query from database
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  //
  // const usage = await prisma.tokenUsage.aggregate({
  //   where: {
  //     userId,
  //     timestamp: { gte: today },
  //   },
  //   _sum: { totalTokens: true },
  // });
  //
  // return usage._sum.totalTokens || 0;

  return 0; // Mock implementation
}

export async function addSessionUsage(sessionId: string, tokens: number): Promise<void> {
  const current = sessionUsageMap.get(sessionId) || 0;
  sessionUsageMap.set(sessionId, current + tokens);
}

export async function getSessionUsage(sessionId: string): Promise<number> {
  return sessionUsageMap.get(sessionId) || 0;
}
