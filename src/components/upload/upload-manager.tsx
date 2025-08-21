'use client';

import React, { useState } from 'react';
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
    setUploads((prev) => {
      const updated = new Map(prev);
      updated.set(id, { ...updated.get(id)!, status: 'uploading', progress: 0 });
      return updated;
    });

    try {
      // Track progress
      const progressInterval = setInterval(() => {
        setUploads((prev) => {
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

      setUploads((prev) => {
        const updated = new Map(prev);
        updated.set(id, { ...updated.get(id)!, status: 'complete', progress: 100 });
        return updated;
      });
    } catch (error) {
      setUploads((prev) => {
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
                <button onClick={() => handleRetry(id)} className="ml-2 underline">
                  Retry
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
