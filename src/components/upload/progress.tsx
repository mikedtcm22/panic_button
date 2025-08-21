'use client';

import React from 'react';

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