'use client';

import { isInMockMode } from '@/lib/ai/mock-mode';

export function DemoIndicator() {
  if (!isInMockMode()) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-md z-50">
      <span className="font-semibold">Demo Mode</span>
      <span className="text-sm ml-2">Using mock AI responses</span>
    </div>
  );
}