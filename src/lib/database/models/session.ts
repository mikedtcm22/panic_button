import { prisma } from '@/lib/database';

interface CreateSessionData {
  userId: string;
  campaignId: string;
  startTime?: Date;
  isActive?: boolean;
}

export async function createSession(data: CreateSessionData) {
  return await prisma.session.create({
    data: {
      userId: data.userId,
      campaignId: data.campaignId,
      startTime: data.startTime,
      isActive: data.isActive ?? false,
    },
  });
}

interface CreatePanicCallData {
  sessionId: string;
  promptType: string;
  context?: string;
  response: string;
  tokens?: number;
}

export async function createPanicCall(data: CreatePanicCallData) {
  return await prisma.panicCall.create({
    data,
  });
}
