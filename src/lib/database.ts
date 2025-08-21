// Stub database module - will be replaced with Prisma later
export const prisma = {
  file: {
    create: async (data: any) => {
      // This is a stub implementation for testing
      return {
        id: 'file_' + Date.now(),
        ...data.data,
        createdAt: new Date(),
      };
    },
  },
};