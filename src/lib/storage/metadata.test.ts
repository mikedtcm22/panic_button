import { saveFileMetadata } from './metadata';

// Mock the database module
jest.mock('@/lib/database', () => ({
  prisma: {
    file: {
      create: jest.fn(),
    },
  },
}));

describe('File Metadata Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should save file metadata to database', async () => {
    const mockFile = {
      id: 'file_123',
      userId: 'user_123',
      fileName: 'test.pdf',
      fileType: 'application/pdf',
      fileSize: 1024,
      storageKey: 'user_123/campaigns/abc/test.pdf',
      createdAt: new Date(),
    };
    
    const database = require('@/lib/database');
    database.prisma.file.create.mockResolvedValue(mockFile);
    
    const metadata = await saveFileMetadata({
      userId: 'user_123',
      fileName: 'test.pdf',
      fileType: 'application/pdf',
      fileSize: 1024,
      storageKey: 'user_123/campaigns/abc/test.pdf',
    });
    
    expect(metadata.id).toBe('file_123');
    expect(database.prisma.file.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user_123',
        fileName: 'test.pdf',
      })
    });
  });
});