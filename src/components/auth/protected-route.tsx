'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return null;
  
  return <>{children}</>;
}