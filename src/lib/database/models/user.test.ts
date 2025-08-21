import { createUser } from './user';
import { prisma } from '@/lib/database';

// Mock Prisma
jest.mock('@/lib/database', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user with required fields', async () => {
    const userData = {
      id: 'user_123',
      email: 'test@example.com',
      clerkId: 'clerk_123',
    };

    const mockUser = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const user = await createUser(userData);

    expect(user.id).toBe(userData.id);
    expect(user.email).toBe(userData.email);
    expect(user.clerkId).toBe(userData.clerkId);
    expect(user.createdAt).toBeInstanceOf(Date);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: userData,
    });
  });
});
