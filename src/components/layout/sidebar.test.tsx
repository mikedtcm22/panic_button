import { render, screen } from '@testing-library/react';
import { Sidebar } from './sidebar';

describe('Sidebar Component', () => {
  it('should render navigation links', () => {
    render(<Sidebar />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
  
  it('should highlight active route', () => {
    render(<Sidebar activeRoute="/campaigns" />);
    
    const campaignsLink = screen.getByText('Campaigns').parentElement;
    expect(campaignsLink).toHaveClass('bg-gray-100');
  });
});