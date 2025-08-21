import { prisma } from '@/lib/database';

interface CreateFileData {
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
  userId: string;
  campaignId?: string;
}

export async function createFile(data: CreateFileData) {
  return await prisma.file.create({
    data,
  });
}

export async function listCampaignFiles(campaignId: string) {
  return await prisma.file.findMany({
    where: { campaignId },
  });
}

export async function deleteFile(id: string) {
  return await prisma.file.delete({
    where: { id },
  });
}
