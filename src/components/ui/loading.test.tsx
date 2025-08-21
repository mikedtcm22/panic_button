import { render, screen } from '@testing-library/react';
import { LoadingSpinner, Skeleton } from './loading';

describe('Loading Components', () => {
  it('should render spinner with loading text', () => {
    render(<LoadingSpinner text="Loading campaigns..." />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Check for visible text (not the sr-only one)
    const visibleText = screen.getByText('Loading campaigns...', { selector: 'p' });
    expect(visibleText).toBeInTheDocument();
  });
  
  it('should render skeleton loader with correct dimensions', () => {
    render(<Skeleton className="h-10 w-32" />);
    
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-10', 'w-32');
  });
});