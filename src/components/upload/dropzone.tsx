'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  onError?: (error: string) => void;
}

export function FileDropzone({ onFilesSelected, onError }: FileDropzoneProps) {
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  
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
      
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
  });
  
  return (
    <div {...getRootProps()} data-testid="dropzone" className="border-2 border-dashed p-8">
      <input {...getInputProps()} data-testid="file-input" accept=".pdf,.docx,.md,.txt" />
      <p>Drag and drop files here</p>
      <p>Or click to select</p>
      <p className="text-sm text-gray-500">Supported: PDF, DOCX, MD, TXT (max 10MB)</p>
    </div>
  );
}