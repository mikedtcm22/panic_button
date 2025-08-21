'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function FileDropzone({ onFilesSelected }: FileDropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone({
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
      <input {...getInputProps()} data-testid="file-input" accept=".pdf,.docx,.md,.txt" />
      <p>Drag and drop files here</p>
      <p>Or click to select</p>
    </div>
  );
}