import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './use-auth';
import { useAuthStore } from '@/stores/auth-store';

const mockSignOut = jest.fn();
const mockClerkAuth = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => mockClerkAuth(),
}));

jest.mock('@/stores/auth-store');

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockClear();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      setUser: jest.fn(),
      clearUser: jest.fn(),
    });
  });

  it('should sync Clerk user with Zustand store', async () => {
    const mockSetUser = jest.fn();
    const mockClearUser = jest.fn();

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      setUser: mockSetUser,
      clearUser: mockClearUser,
    });

    mockClerkAuth.mockReturnValue({
      userId: 'user_123',
      signOut: mockSignOut,
      user: {
        primaryEmailAddress: { emailAddress: 'test@example.com' },
      },
    });

    renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        id: 'user_123',
        email: 'test@example.com',
      });
    });
  });

  it('should provide logout function that clears both Clerk and store', async () => {
    const mockClearUser = jest.fn();

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: 'user_123', email: 'test@example.com' },
      setUser: jest.fn(),
      clearUser: mockClearUser,
    });

    mockClerkAuth.mockReturnValue({
      userId: 'user_123',
      signOut: mockSignOut,
      user: {
        primaryEmailAddress: { emailAddress: 'test@example.com' },
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockClearUser).toHaveBeenCalled();
  });

  it('should clear user when not authenticated', async () => {
    const mockClearUser = jest.fn();

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      setUser: jest.fn(),
      clearUser: mockClearUser,
    });

    mockClerkAuth.mockReturnValue({
      userId: null,
      signOut: mockSignOut,
      user: null,
    });

    renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockClearUser).toHaveBeenCalled();
    });
  });

  it('should return current user from store', () => {
    const testUser = { id: 'user_123', email: 'test@example.com' };

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: testUser,
      setUser: jest.fn(),
      clearUser: jest.fn(),
    });

    mockClerkAuth.mockReturnValue({
      userId: 'user_123',
      signOut: mockSignOut,
      user: {
        primaryEmailAddress: { emailAddress: 'test@example.com' },
      },
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(testUser);
  });
});
