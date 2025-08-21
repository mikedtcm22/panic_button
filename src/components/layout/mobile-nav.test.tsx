import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileNav } from './mobile-nav';

describe('Mobile Navigation', () => {
  it('should show hamburger menu on mobile', () => {
    render(<MobileNav />);

    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('should toggle menu visibility on click', async () => {
    render(<MobileNav />);

    const menuButton = screen.getByLabelText('Open menu');

    // Menu should be hidden initially
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

    // Click to open
    await userEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Click to close
    await userEvent.click(screen.getByLabelText('Close menu'));
    await waitFor(() => {
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
  });
});
