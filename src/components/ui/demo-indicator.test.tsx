import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DemoIndicator } from './demo-indicator';

// Mock the isInMockMode function
jest.mock('@/lib/ai/mock-mode', () => ({
  isInMockMode: jest.fn()
}));

import { isInMockMode } from '@/lib/ai/mock-mode';

describe('Demo Indicator Component', () => {
  it('should display demo indicator when in mock mode', () => {
    (isInMockMode as jest.Mock).mockReturnValue(true);
    
    render(<DemoIndicator />);
    
    expect(screen.getByText('Demo Mode')).toBeInTheDocument();
    expect(screen.getByText('Using mock AI responses')).toBeInTheDocument();
  });

  it('should not display anything when not in mock mode', () => {
    (isInMockMode as jest.Mock).mockReturnValue(false);
    
    const { container } = render(<DemoIndicator />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should have proper styling classes', () => {
    (isInMockMode as jest.Mock).mockReturnValue(true);
    
    render(<DemoIndicator />);
    
    const indicator = screen.getByText('Demo Mode').parentElement;
    expect(indicator).toHaveClass('bg-yellow-100');
    expect(indicator).toHaveClass('text-yellow-800');
    expect(indicator).toHaveClass('fixed');
  });
});