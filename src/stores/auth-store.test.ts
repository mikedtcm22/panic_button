import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './auth-store';

describe('Auth Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.clearUser();
    });
  });

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
  });
  
  it('should set user on login', () => {
    const { result } = renderHook(() => useAuthStore());
    const testUser = { id: 'user_123', email: 'test@example.com' };
    
    act(() => {
      result.current.setUser(testUser);
    });
    
    expect(result.current.user).toEqual(testUser);
  });
  
  it('should clear user on logout', () => {
    const { result } = renderHook(() => useAuthStore());
    const testUser = { id: 'user_123', email: 'test@example.com' };
    
    act(() => {
      result.current.setUser(testUser);
    });
    
    expect(result.current.user).toEqual(testUser);
    
    act(() => {
      result.current.clearUser();
    });
    
    expect(result.current.user).toBeNull();
  });

  it('should persist state between hook instances', () => {
    const { result: result1 } = renderHook(() => useAuthStore());
    const testUser = { id: 'user_456', email: 'another@example.com' };
    
    act(() => {
      result1.current.setUser(testUser);
    });
    
    const { result: result2 } = renderHook(() => useAuthStore());
    expect(result2.current.user).toEqual(testUser);
  });

  it('should update user data correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    const initialUser = { id: 'user_123', email: 'test@example.com' };
    const updatedUser = { id: 'user_123', email: 'updated@example.com' };
    
    act(() => {
      result.current.setUser(initialUser);
    });
    
    expect(result.current.user).toEqual(initialUser);
    
    act(() => {
      result.current.setUser(updatedUser);
    });
    
    expect(result.current.user).toEqual(updatedUser);
  });
});