import { uploadFileToR2 } from './upload';

// Mock the r2-client module
jest.mock('./r2-client', () => ({
  createR2Client: jest.fn(),
  getR2Config: jest.fn(),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('File Upload to R2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload file to R2 and return file key', async () => {
    const mockSend = jest.fn().mockResolvedValue({ ETag: '"abc123"' });
    const mockS3Client = {
      send: mockSend,
      config: {},
    };

    const r2Client = require('./r2-client');
    r2Client.createR2Client.mockReturnValue(mockS3Client);
    r2Client.getR2Config.mockReturnValue({
      accountId: 'test-account',
      accessKeyId: 'test-key',
      secretAccessKey: 'test-secret',
      bucketName: 'test-bucket',
    });

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });

    const result = await uploadFileToR2(file, 'user_123');

    expect(result.key).toBe('user_123/campaigns/mock-uuid/test.pdf');
    expect(result.url).toBe(
      'https://test-account.r2.cloudflarestorage.com/user_123/campaigns/mock-uuid/test.pdf'
    );
    expect(mockSend).toHaveBeenCalled();
  });
});
