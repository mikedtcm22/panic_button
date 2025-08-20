import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from './sign-up-form';

const mockSignUp = {
  create: jest.fn(),
};

jest.mock('@clerk/nextjs', () => ({
  useSignUp: () => ({
    signUp: mockSignUp,
  }),
}));

describe('Sign Up Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(mockSignUp.create).not.toHaveBeenCalled();
  });
  
  it('should show validation error for weak password', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(mockSignUp.create).not.toHaveBeenCalled();
  });

  it('should accept valid email and password', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSignUp.create).toHaveBeenCalledWith({
        emailAddress: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show multiple validation errors at once', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await user.type(emailInput, 'invalid');
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(mockSignUp.create).not.toHaveBeenCalled();
  });
});