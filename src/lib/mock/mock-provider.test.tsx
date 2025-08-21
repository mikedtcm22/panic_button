import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider, useMockAuth, useMockStorage } from './mock-provider';

describe('Mock Mode Provider', () => {
  describe('Mock Authentication', () => {
    it('should provide mock authentication when in mock mode', () => {
      process.env.NEXT_PUBLIC_MOCK_MODE = 'true';
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockProvider>{children}</MockProvider>
      );
      
      const { result } = renderHook(() => useMockAuth(), { wrapper });
      
      expect(result.current.user).toEqual({
        id: 'mock-user-1',
        email: 'dm@example.com',
        name: 'Test DM'
      });
    });
    
    it('should provide signIn and signOut functions', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockProvider>{children}</MockProvider>
      );
      
      const { result } = renderHook(() => useMockAuth(), { wrapper });
      
      expect(result.current.signIn).toBeDefined();
      expect(result.current.signOut).toBeDefined();
      
      // Should not throw when called
      await act(async () => {
        await result.current.signIn();
        await result.current.signOut();
      });
    });
  });
  
  describe('Mock Storage', () => {
    it('should simulate file upload in mock mode', async () => {
      const { result } = renderHook(() => useMockStorage());
      
      const mockFile = {
        name: 'campaign.pdf',
        size: 1024,
        type: 'application/pdf'
      };
      
      const uploadResult = await act(async () => {
        return await result.current.uploadFile(mockFile);
      });
      
      expect(uploadResult.success).toBe(true);
      expect(uploadResult.url).toContain('mock://');
      expect(uploadResult.id).toContain('mock-file-');
    });
    
    it('should handle different file types', async () => {
      const { result } = renderHook(() => useMockStorage());
      
      const files = [
        { name: 'rules.docx', size: 2048, type: 'application/docx' },
        { name: 'notes.md', size: 512, type: 'text/markdown' },
        { name: 'map.jpg', size: 4096, type: 'image/jpeg' }
      ];
      
      for (const file of files) {
        const uploadResult = await act(async () => {
          return await result.current.uploadFile(file);
        });
        
        expect(uploadResult.success).toBe(true);
        expect(uploadResult.url).toContain(file.name);
      }
    });
  });
  
  it('should throw error when useMockAuth is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      renderHook(() => useMockAuth());
    }).toThrow('useMockAuth must be used within MockProvider');
    
    console.error = originalError;
  });
});