'use client';

import React from 'react';

interface UploadProgressProps {
  fileName: string;
  progress: number;
}

export function UploadProgress({ fileName, progress }: UploadProgressProps) {
  const isComplete = progress === 100;

  return (
    <div className="rounded border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span>{fileName}</span>
        <span>{progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full rounded bg-gray-200"
      >
        <div
          className="h-full rounded bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {isComplete && (
        <div className="mt-2 flex items-center text-green-600">
          <span data-testid="success-icon">✓</span>
          <span className="ml-2">Upload complete</span>
        </div>
      )}
    </div>
  );
}
