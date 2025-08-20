'use client';

import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';

export function useAuth() {
  const { userId, signOut, user: clerkUser } = useClerkAuth();
  const { user, setUser, clearUser } = useAuthStore();
  
  useEffect(() => {
    if (userId && clerkUser) {
      setUser({
        id: userId,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
      });
    } else {
      clearUser();
    }
  }, [userId, clerkUser, setUser, clearUser]);
  
  const logout = async () => {
    await signOut();
    clearUser();
  };
  
  return { user, logout };
}