import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileUpload } from './use-file-upload';
import * as uploadModule from '@/lib/storage/upload';
import * as metadataModule from '@/lib/storage/metadata';

// Mock dependencies
jest.mock('@/lib/storage/upload');
jest.mock('@/lib/storage/metadata');
jest.mock('./use-auth', () => ({
  useAuth: () => ({ user: { id: 'user_123' } }),
}));

describe('useFileUpload Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should track upload progress', async () => {
    const mockUpload = jest.fn().mockResolvedValue({
      key: 'test-key',
      url: 'test-url',
    });
    const mockSaveMetadata = jest.fn().mockResolvedValue({});

    (uploadModule.uploadFileToR2 as jest.Mock) = mockUpload;
    (metadataModule.saveFileMetadata as jest.Mock) = mockSaveMetadata;

    const { result } = renderHook(() => useFileUpload());

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    expect(result.current.uploadProgress).toBe(0);

    await act(async () => {
      await result.current.uploadFile(file);
    });

    expect(result.current.uploadProgress).toBe(100);
    expect(mockUpload).toHaveBeenCalledWith(file, 'user_123');
  });

  it('should handle upload errors', async () => {
    const mockError = new Error('Upload failed');
    const mockUpload = jest.fn().mockRejectedValue(mockError);

    (uploadModule.uploadFileToR2 as jest.Mock) = mockUpload;

    const { result } = renderHook(() => useFileUpload());
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    await act(async () => {
      try {
        await result.current.uploadFile(file);
      } catch (e) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Upload failed');
    expect(result.current.isUploading).toBe(false);
  });
});
