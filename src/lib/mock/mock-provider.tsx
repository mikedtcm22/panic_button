'use client';

import { createContext, useContext, ReactNode } from 'react';

interface MockUser {
  id: string;
  email: string;
  name: string;
}

interface MockAuthContext {
  user: MockUser | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const MockContext = createContext<MockAuthContext | undefined>(undefined);

export function MockProvider({ children }: { children: ReactNode }) {
  const mockUser: MockUser = {
    id: 'mock-user-1',
    email: 'dm@example.com',
    name: 'Test DM',
  };

  const signIn = async () => {
    console.log('Mock sign in');
  };

  const signOut = async () => {
    console.log('Mock sign out');
  };

  return (
    <MockContext.Provider value={{ user: mockUser, signIn, signOut }}>
      {children}
    </MockContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMockAuth must be used within MockProvider');
  }
  return context;
}

interface UploadResult {
  success: boolean;
  url: string;
  id: string;
}

export function useMockStorage() {
  return {
    uploadFile: async (file: {
      name: string;
      size: number;
      type: string;
    }): Promise<UploadResult> => {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        url: `mock://storage/${file.name}`,
        id: `mock-file-${Date.now()}`,
      };
    },
  };
}
