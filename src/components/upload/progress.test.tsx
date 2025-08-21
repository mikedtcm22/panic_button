import React from 'react';
import { render, screen } from '@testing-library/react';
import { UploadProgress } from './progress';

describe('Upload Progress', () => {
  it('should display upload progress percentage', () => {
    render(<UploadProgress fileName="test.pdf" progress={45} />);
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
  });
  
  it('should show success state when complete', () => {
    render(<UploadProgress fileName="test.pdf" progress={100} />);
    
    expect(screen.getByText(/upload complete/i)).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
  });
});