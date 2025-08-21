import { prisma } from '@/lib/database';

interface CreateCampaignData {
  title: string;
  description?: string;
  userId: string;
}

export async function createCampaign(data: CreateCampaignData) {
  return await prisma.campaign.create({
    data: {
      title: data.title,
      description: data.description,
      userId: data.userId,
    },
  });
}

export async function getCampaign(id: string) {
  return await prisma.campaign.findUnique({
    where: { id },
  });
}

export async function listUserCampaigns(userId: string) {
  return await prisma.campaign.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function updateCampaignDigest(id: string, digest: any) {
  return await prisma.campaign.update({
    where: { id },
    data: { digest: JSON.stringify(digest) },
  });
}

export async function deleteCampaign(id: string) {
  return await prisma.campaign.delete({
    where: { id },
  });
}