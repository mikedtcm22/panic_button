'use client';

import { isInMockMode } from '@/lib/ai/mock-mode';

export function DemoIndicator() {
  if (!isInMockMode()) return null;

  return (
    <div className="fixed top-4 right-4 z-50 rounded-lg bg-yellow-100 px-4 py-2 text-yellow-800 shadow-md">
      <span className="font-semibold">Demo Mode</span>
      <span className="ml-2 text-sm">Using mock AI responses</span>
    </div>
  );
}
