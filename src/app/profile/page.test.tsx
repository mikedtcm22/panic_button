import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  clerkClient: jest.fn(),
}));

import ProfilePage from './page';
import { auth, clerkClient } from '@clerk/nextjs/server';

const mockAuth = auth as unknown as jest.Mock;
const mockClerkClient = clerkClient as unknown as jest.Mock;

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display user email and name', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' });
    mockClerkClient.mockResolvedValue({
      users: {
        getUser: jest.fn().mockResolvedValue({
          emailAddresses: [{ emailAddress: 'test@example.com' }],
          firstName: 'John',
        }),
      },
    });

    const Component = await ProfilePage();
    const { container } = render(Component);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should display profile heading', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' });
    mockClerkClient.mockResolvedValue({
      users: {
        getUser: jest.fn().mockResolvedValue({
          emailAddresses: [{ emailAddress: 'test@example.com' }],
          firstName: 'John',
        }),
      },
    });

    const Component = await ProfilePage();
    render(Component);

    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should handle user without first name', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' });
    mockClerkClient.mockResolvedValue({
      users: {
        getUser: jest.fn().mockResolvedValue({
          emailAddresses: [{ emailAddress: 'test@example.com' }],
          firstName: null,
        }),
      },
    });

    const Component = await ProfilePage();
    render(Component);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.queryByText('null')).not.toBeInTheDocument();
  });

  it('should display not authenticated message when no user', async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const Component = await ProfilePage();
    render(Component);

    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });
});
