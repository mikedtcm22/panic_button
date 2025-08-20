import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './protected-route';

const mockPush = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Protected Route Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ 
      userId: 'user_123',
      isLoaded: true 
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
  
  it('should redirect to sign-in when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ 
      userId: null,
      isLoaded: true 
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show loading state while auth is loading', () => {
    mockUseAuth.mockReturnValue({ 
      userId: null,
      isLoaded: false 
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not redirect when auth is still loading', () => {
    mockUseAuth.mockReturnValue({ 
      userId: null,
      isLoaded: false 
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(mockPush).not.toHaveBeenCalled();
  });
});