import { render, screen } from '@testing-library/react';
import { Header } from './header';

describe('Header Component', () => {
  it('should render site title and navigation', () => {
    render(<Header />);

    expect(screen.getByText('Improv Panic Button')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should show auth buttons when not logged in', () => {
    render(<Header isAuthenticated={false} />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should show user menu when logged in', () => {
    render(<Header isAuthenticated={true} userName="DM John" />);

    expect(screen.getByText('DM John')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });
});
