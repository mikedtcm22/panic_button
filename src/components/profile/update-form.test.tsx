import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileUpdateForm } from './update-form';

const mockUpdate = jest.fn();
const mockUser = {
  firstName: 'John',
};

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: mockUser,
    update: mockUpdate,
  }),
}));

describe('Profile Update Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display current user first name', () => {
    render(<ProfileUpdateForm />);

    const input = screen.getByLabelText(/first name/i) as HTMLInputElement;
    expect(input.value).toBe('John');
  });

  it('should update user profile on form submission', async () => {
    const user = userEvent.setup();
    render(<ProfileUpdateForm />);

    const nameInput = screen.getByLabelText(/first name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Jane');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        firstName: 'Jane',
      });
    });
  });

  it('should handle empty first name', async () => {
    const user = userEvent.setup();
    render(<ProfileUpdateForm />);

    const nameInput = screen.getByLabelText(/first name/i);
    await user.clear(nameInput);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        firstName: '',
      });
    });
  });

  it('should maintain form state during input', async () => {
    const user = userEvent.setup();
    render(<ProfileUpdateForm />);

    const nameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Alice');

    expect(nameInput.value).toBe('Alice');
  });

  it('should show save button', () => {
    render(<ProfileUpdateForm />);

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
