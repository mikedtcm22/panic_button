import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Radix UI Components', () => {
  it('should render Radix UI button component', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should apply custom styling to Radix components', () => {
    render(<Button className="bg-panic-red">Panic!</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-panic-red');
  });
});
