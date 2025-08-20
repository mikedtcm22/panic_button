# Phase 1: File Upload Infrastructure - TDD Implementation Plan

## Overview
This document provides a detailed TDD-driven implementation plan for the file upload system with Cloudflare R2 storage, following the RED/GREEN/REFACTOR cycle for each feature.

## Prerequisites
- Database foundation implemented (Prisma schema)
- Authentication system in place
- Cloudflare account with R2 access
- AWS SDK for S3-compatible operations

## Implementation Steps

### Step 1: Cloudflare R2 Configuration

#### 🟥 RED Phase - Test 1.1: R2 Client Configuration
```typescript
// src/lib/storage/r2-client.test.ts
describe('R2 Storage Client', () => {
  it('should validate required R2 environment variables', () => {
    const config = getR2Config();
    expect(config.accountId).toBeDefined();
    expect(config.accessKeyId).toBeDefined();
    expect(config.secretAccessKey).toBeDefined();
    expect(config.bucketName).toBeDefined();
  });
});
```
**Purpose**: Ensures R2 storage is properly configured with required credentials.

#### 🟩 GREEN Phase - Implementation 1.1
```typescript
// src/lib/storage/r2-client.ts
export function getR2Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error('Missing Cloudflare R2 environment variables');
  }
  
  return { accountId, accessKeyId, secretAccessKey, bucketName };
}
```

#### 🟥 RED Phase - Test 1.2: S3 Client Initialization
```typescript
// src/lib/storage/r2-client.test.ts
describe('R2 S3 Client', () => {
  it('should create S3 client with R2 endpoint', () => {
    const client = createR2Client();
    expect(client).toBeDefined();
    expect(client.config.endpoint).toContain('r2.cloudflarestorage.com');
  });
});
```

#### 🟩 GREEN Phase - Implementation 1.2
```typescript
// src/lib/storage/r2-client.ts
import { S3Client } from '@aws-sdk/client-s3';

export function createR2Client() {
  const config = getR2Config();
  
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}
```

### Step 2: File Upload Component

#### 🟥 RED Phase - Test 2.1: Drag-and-Drop Zone
```typescript
// src/components/upload/dropzone.test.tsx
describe('File Dropzone', () => {
  it('should render drop zone with instructions', () => {
    render(<FileDropzone onFilesSelected={jest.fn()} />);
    expect(screen.getByText(/drag and drop files here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to select/i)).toBeInTheDocument();
  });
  
  it('should accept PDF, DOCX, MD, and TXT files', () => {
    render(<FileDropzone onFilesSelected={jest.fn()} />);
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    expect(input.accept).toBe('.pdf,.docx,.md,.txt');
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.1
```typescript
// src/components/upload/dropzone.tsx
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function FileDropzone({ onFilesSelected }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
    },
    onDrop: onFilesSelected,
  });
  
  return (
    <div {...getRootProps()} className="border-2 border-dashed p-8">
      <input {...getInputProps()} data-testid="file-input" />
      <p>Drag and drop files here</p>
      <p>Or click to select</p>
    </div>
  );
}
```

#### 🟥 RED Phase - Test 2.2: File Validation
```typescript
// src/components/upload/dropzone.test.tsx
describe('File Validation', () => {
  it('should reject files larger than 10MB', async () => {
    const onError = jest.fn();
    render(<FileDropzone onFilesSelected={jest.fn()} onError={onError} />);
    
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    });
    
    const dropzone = screen.getByTestId('dropzone');
    await userEvent.upload(dropzone, largeFile);
    
    expect(onError).toHaveBeenCalledWith('File size exceeds 10MB limit');
  });
  
  it('should reject unsupported file types', async () => {
    const onError = jest.fn();
    render(<FileDropzone onFilesSelected={jest.fn()} onError={onError} />);
    
    const invalidFile = new File(['content'], 'test.exe', {
      type: 'application/x-msdownload',
    });
    
    const dropzone = screen.getByTestId('dropzone');
    await userEvent.upload(dropzone, invalidFile);
    
    expect(onError).toHaveBeenCalledWith('File type not supported');
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.2
```typescript
// src/components/upload/dropzone.tsx
interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  onError?: (error: string) => void;
}

export function FileDropzone({ onFilesSelected, onError }: FileDropzoneProps) {
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  
  const validateFile = (file: File): boolean => {
    if (file.size > maxFileSize) {
      onError?.('File size exceeds 10MB limit');
      return false;
    }
    
    const supportedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown', 'text/plain'];
    if (!supportedTypes.includes(file.type)) {
      onError?.('File type not supported');
      return false;
    }
    
    return true;
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
    },
    maxSize: maxFileSize,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(rejection => {
          if (rejection.errors[0]?.code === 'file-too-large') {
            onError?.('File size exceeds 10MB limit');
          } else {
            onError?.('File type not supported');
          }
        });
        return;
      }
      
      const validFiles = acceptedFiles.filter(validateFile);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
  });
  
  return (
    <div {...getRootProps()} data-testid="dropzone" className="border-2 border-dashed p-8">
      <input {...getInputProps()} data-testid="file-input" />
      <p>Drag and drop files here</p>
      <p>Or click to select</p>
      <p className="text-sm text-gray-500">Supported: PDF, DOCX, MD, TXT (max 10MB)</p>
    </div>
  );
}
```

### Step 3: File Upload Processing

#### 🟥 RED Phase - Test 3.1: File Upload to R2
```typescript
// src/lib/storage/upload.test.ts
describe('File Upload to R2', () => {
  it('should upload file to R2 and return file key', async () => {
    const mockS3Client = {
      send: jest.fn().mockResolvedValue({ ETag: '"abc123"' })
    };
    jest.spyOn(r2Client, 'createR2Client').mockReturnValue(mockS3Client);
    
    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    
    const result = await uploadFileToR2(file, 'user_123');
    
    expect(result.key).toMatch(/^user_123\/campaigns\/.+\/test\.pdf$/);
    expect(result.url).toContain('r2.cloudflarestorage.com');
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.1
```typescript
// src/lib/storage/upload.ts
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createR2Client, getR2Config } from './r2-client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFileToR2(file: File, userId: string) {
  const client = createR2Client();
  const config = getR2Config();
  
  const fileKey = `${userId}/campaigns/${uuidv4()}/${file.name}`;
  
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: fileKey,
    Body: file,
    ContentType: file.type,
  });
  
  await client.send(command);
  
  return {
    key: fileKey,
    url: `https://${config.accountId}.r2.cloudflarestorage.com/${fileKey}`,
  };
}
```

#### 🟥 RED Phase - Test 3.2: File Metadata Storage
```typescript
// src/lib/storage/metadata.test.ts
describe('File Metadata Storage', () => {
  it('should save file metadata to database', async () => {
    const mockPrisma = {
      file: {
        create: jest.fn().mockResolvedValue({
          id: 'file_123',
          userId: 'user_123',
          fileName: 'test.pdf',
          fileType: 'application/pdf',
          fileSize: 1024,
          storageKey: 'user_123/campaigns/abc/test.pdf',
          createdAt: new Date(),
        })
      }
    };
    
    const metadata = await saveFileMetadata({
      userId: 'user_123',
      fileName: 'test.pdf',
      fileType: 'application/pdf',
      fileSize: 1024,
      storageKey: 'user_123/campaigns/abc/test.pdf',
    });
    
    expect(metadata.id).toBe('file_123');
    expect(mockPrisma.file.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user_123',
        fileName: 'test.pdf',
      })
    });
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.2
```typescript
// src/lib/storage/metadata.ts
import { prisma } from '@/lib/database';

interface FileMetadata {
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
}

export async function saveFileMetadata(metadata: FileMetadata) {
  return await prisma.file.create({
    data: {
      userId: metadata.userId,
      fileName: metadata.fileName,
      fileType: metadata.fileType,
      fileSize: metadata.fileSize,
      storageKey: metadata.storageKey,
    },
  });
}
```

### Step 4: Upload Progress Tracking

#### 🟥 RED Phase - Test 4.1: Upload Progress Component
```typescript
// src/components/upload/progress.test.tsx
describe('Upload Progress', () => {
  it('should display upload progress percentage', () => {
    render(<UploadProgress fileName="test.pdf" progress={45} />);
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
  });
  
  it('should show success state when complete', () => {
    render(<UploadProgress fileName="test.pdf" progress={100} />);
    
    expect(screen.getByText(/upload complete/i)).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.1
```typescript
// src/components/upload/progress.tsx
interface UploadProgressProps {
  fileName: string;
  progress: number;
}

export function UploadProgress({ fileName, progress }: UploadProgressProps) {
  const isComplete = progress === 100;
  
  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-center mb-2">
        <span>{fileName}</span>
        <span>{progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full bg-gray-200 rounded h-2"
      >
        <div
          className="bg-blue-500 h-full rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {isComplete && (
        <div className="flex items-center mt-2 text-green-600">
          <span data-testid="success-icon">✓</span>
          <span className="ml-2">Upload complete</span>
        </div>
      )}
    </div>
  );
}
```

#### 🟥 RED Phase - Test 4.2: Upload Hook with Progress
```typescript
// src/hooks/use-file-upload.test.ts
describe('useFileUpload Hook', () => {
  it('should track upload progress', async () => {
    const { result } = renderHook(() => useFileUpload());
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    act(() => {
      result.current.uploadFile(file);
    });
    
    expect(result.current.uploadProgress).toBe(0);
    
    await waitFor(() => {
      expect(result.current.uploadProgress).toBeGreaterThan(0);
    });
    
    await waitFor(() => {
      expect(result.current.uploadProgress).toBe(100);
    });
  });
  
  it('should handle upload errors', async () => {
    const mockError = new Error('Upload failed');
    jest.spyOn(uploadModule, 'uploadFileToR2').mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useFileUpload());
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    await act(async () => {
      await result.current.uploadFile(file);
    });
    
    expect(result.current.error).toBe('Upload failed');
    expect(result.current.isUploading).toBe(false);
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.2
```typescript
// src/hooks/use-file-upload.ts
import { useState } from 'react';
import { uploadFileToR2 } from '@/lib/storage/upload';
import { saveFileMetadata } from '@/lib/storage/metadata';
import { useAuth } from '@/hooks/use-auth';

export function useFileUpload() {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const uploadFile = async (file: File) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Simulate progress for demo (in production, use XMLHttpRequest or fetch with progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      const { key, url } = await uploadFileToR2(file, user.id);
      
      clearInterval(progressInterval);
      setUploadProgress(95);
      
      await saveFileMetadata({
        userId: user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageKey: key,
      });
      
      setUploadProgress(100);
      
      return { key, url };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadFile,
    uploadProgress,
    isUploading,
    error,
  };
}
```

### Step 5: Complete Upload Flow Integration

#### 🟥 RED Phase - Test 5.1: Upload Manager Component
```typescript
// src/components/upload/upload-manager.test.tsx
describe('Upload Manager', () => {
  it('should handle multiple file uploads', async () => {
    const { container } = render(<UploadManager />);
    
    const files = [
      new File(['content1'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['content2'], 'file2.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
    ];
    
    const dropzone = screen.getByTestId('dropzone');
    await userEvent.upload(dropzone, files);
    
    expect(screen.getByText('file1.pdf')).toBeInTheDocument();
    expect(screen.getByText('file2.docx')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getAllByText(/upload complete/i)).toHaveLength(2);
    });
  });
  
  it('should allow retry for failed uploads', async () => {
    jest.spyOn(uploadModule, 'uploadFileToR2')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ key: 'test-key', url: 'test-url' });
    
    render(<UploadManager />);
    
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByTestId('dropzone');
    await userEvent.upload(dropzone, [file]);
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    await userEvent.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByText(/upload complete/i)).toBeInTheDocument();
    });
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.1
```typescript
// src/components/upload/upload-manager.tsx
import { useState } from 'react';
import { FileDropzone } from './dropzone';
import { UploadProgress } from './progress';
import { useFileUpload } from '@/hooks/use-file-upload';

interface UploadItem {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export function UploadManager() {
  const [uploads, setUploads] = useState<Map<string, UploadItem>>(new Map());
  const { uploadFile } = useFileUpload();
  
  const handleFilesSelected = async (files: File[]) => {
    const newUploads = new Map(uploads);
    
    for (const file of files) {
      const id = `${file.name}-${Date.now()}`;
      newUploads.set(id, {
        file,
        progress: 0,
        status: 'pending',
      });
    }
    
    setUploads(newUploads);
    
    // Process uploads
    for (const [id, item] of newUploads) {
      if (item.status === 'pending') {
        await processUpload(id, item.file);
      }
    }
  };
  
  const processUpload = async (id: string, file: File) => {
    setUploads(prev => {
      const updated = new Map(prev);
      updated.set(id, { ...updated.get(id)!, status: 'uploading', progress: 0 });
      return updated;
    });
    
    try {
      // Track progress
      const progressInterval = setInterval(() => {
        setUploads(prev => {
          const updated = new Map(prev);
          const item = updated.get(id);
          if (item && item.progress < 90) {
            updated.set(id, { ...item, progress: item.progress + 10 });
          } else {
            clearInterval(progressInterval);
          }
          return updated;
        });
      }, 200);
      
      await uploadFile(file);
      
      clearInterval(progressInterval);
      
      setUploads(prev => {
        const updated = new Map(prev);
        updated.set(id, { ...updated.get(id)!, status: 'complete', progress: 100 });
        return updated;
      });
    } catch (error) {
      setUploads(prev => {
        const updated = new Map(prev);
        updated.set(id, {
          ...updated.get(id)!,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        });
        return updated;
      });
    }
  };
  
  const handleRetry = (id: string) => {
    const item = uploads.get(id);
    if (item) {
      processUpload(id, item.file);
    }
  };
  
  return (
    <div>
      <FileDropzone onFilesSelected={handleFilesSelected} />
      
      <div className="mt-4 space-y-2">
        {Array.from(uploads.entries()).map(([id, item]) => (
          <div key={id}>
            <UploadProgress fileName={item.file.name} progress={item.progress} />
            {item.status === 'error' && (
              <div className="mt-2 text-red-600">
                <span>{item.error}</span>
                <button
                  onClick={() => handleRetry(id)}
                  className="ml-2 underline"
                >
                  Retry
                </button>
              </div>
            )}
            {item.status === 'complete' && (
              <div className="mt-2 text-green-600">Upload complete</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Testing Checklist

### Unit Tests
- [ ] R2 configuration validation
- [ ] S3 client initialization
- [ ] Dropzone component rendering
- [ ] File type validation
- [ ] File size validation
- [ ] Upload progress tracking
- [ ] File metadata storage
- [ ] Upload retry functionality

### Integration Tests
- [ ] Complete file upload flow
- [ ] Multiple file uploads
- [ ] Error handling and recovery
- [ ] Progress tracking accuracy
- [ ] Database metadata persistence
- [ ] R2 storage verification

### E2E Tests
- [ ] User can drag and drop files
- [ ] User can select files via dialog
- [ ] Invalid files are rejected with error message
- [ ] Upload progress is displayed accurately
- [ ] Files are stored in R2
- [ ] File metadata is saved to database
- [ ] Failed uploads can be retried

## Success Metrics
- All unit tests passing (100% of upload components)
- File validation working correctly
- Upload success rate > 95%
- Average upload time < 10 seconds for 10MB file
- Zero data loss during uploads
- Proper error messages for all failure cases

## Next Steps
After completing all tests and implementations:
1. Run full test suite: `npm run test`
2. Check coverage: `npm run test:coverage`
3. Commit with message: `feat: implement file upload system with Cloudflare R2`
4. Document R2 configuration in `.env.example`
5. Update README with file upload documentation