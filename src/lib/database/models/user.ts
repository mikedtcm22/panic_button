import { prisma } from '@/lib/database';

interface CreateUserData {
  id?: string;
  email: string;
  clerkId: string;
}

export async function createUser(data: CreateUserData) {
  return await prisma.user.create({
    data: {
      id: data.id,
      email: data.email,
      clerkId: data.clerkId,
    },
  });
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserByClerkId(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
