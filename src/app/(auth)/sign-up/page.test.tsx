import React from 'react';
import { render, screen } from '@testing-library/react';
import SignUpPage from './page';

jest.mock('@clerk/nextjs', () => ({
  SignUp: () => (
    <div data-testid="clerk-signup">
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
      <button type="submit">Sign Up</button>
    </div>
  ),
}));

describe('Sign Up Page', () => {
  it('should render email and password input fields', () => {
    render(<SignUpPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should render SignUp component from Clerk', () => {
    render(<SignUpPage />);

    expect(screen.getByTestId('clerk-signup')).toBeInTheDocument();
  });

  it('should center the sign-up form on the page', () => {
    const { container } = render(<SignUpPage />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('justify-center');
    expect(wrapper.className).toContain('items-center');
    expect(wrapper.className).toContain('min-h-screen');
  });
});
