'use client';

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
        setUploadProgress((prev) => {
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
