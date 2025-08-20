import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from './layout';

jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-clerk-provider>{children}</div>
  ),
}));

describe('Root Layout', () => {
  it('should wrap application with ClerkProvider', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    
    expect(container.querySelector('[data-clerk-provider]')).toBeInTheDocument();
  });

  it('should render children inside ClerkProvider', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );
    
    expect(getByText('Test Child Content')).toBeInTheDocument();
  });
});