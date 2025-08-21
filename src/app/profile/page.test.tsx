import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@clerk/nextjs', () => ({
  currentUser: jest.fn(),
}));

import ProfilePage from './page';
import { currentUser } from '@clerk/nextjs';

const mockCurrentUser = currentUser as jest.Mock;

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display user email and name', async () => {
    mockCurrentUser.mockResolvedValue({
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'John',
    });

    const Component = await ProfilePage();
    const { container } = render(Component);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should display profile heading', async () => {
    mockCurrentUser.mockResolvedValue({
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'John',
    });

    const Component = await ProfilePage();
    render(Component);

    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should handle user without first name', async () => {
    mockCurrentUser.mockResolvedValue({
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: null,
    });

    const Component = await ProfilePage();
    render(Component);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.queryByText('null')).not.toBeInTheDocument();
  });

  it('should display not authenticated message when no user', async () => {
    mockCurrentUser.mockResolvedValue(null);

    const Component = await ProfilePage();
    render(Component);

    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });
});
