import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DemoPage from './page';

// Mock the modules
jest.mock('@/lib/config/env-check', () => ({
  checkEnvironment: jest.fn(() => ({
    mockMode: true,
    clerk: { configured: false, message: 'Clerk authentication not configured' },
    openai: { configured: false, message: 'OpenAI API key not configured' },
    r2: { configured: false, message: 'Cloudflare R2 not configured' },
    database: { configured: true, message: 'Database configured' },
  })),
}));

jest.mock('@/lib/mock/mock-ai', () => ({
  generateMockResponse: jest.fn((type) =>
    Promise.resolve({
      content: `Mock ${type} response`,
      tokens: 100,
      cost: 0,
    })
  ),
}));

// No need to mock useToast anymore as it's been removed from the component

describe('Demo Dashboard', () => {
  it('should display all UI components showcase', () => {
    render(<DemoPage />);

    expect(screen.getByText('Demo Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Component Showcase')).toBeInTheDocument();
    expect(screen.getByText('Buttons')).toBeInTheDocument();
    expect(screen.getByText('Loading States')).toBeInTheDocument();
  });

  it('should show configuration status', () => {
    render(<DemoPage />);

    expect(screen.getByText('Environment Status')).toBeInTheDocument();
    expect(screen.getByText(/Mock Mode/)).toBeInTheDocument();
    expect(screen.getByText(/Enabled/)).toBeInTheDocument();
  });

  it('should display service status indicators', () => {
    render(<DemoPage />);

    expect(screen.getByText('Clerk Auth:')).toBeInTheDocument();
    expect(screen.getByText('OpenAI:')).toBeInTheDocument();
    expect(screen.getByText('Storage:')).toBeInTheDocument();
    expect(screen.getByText('Database:')).toBeInTheDocument();
  });

  it('should provide interactive panic button demo', async () => {
    const user = userEvent.setup();
    render(<DemoPage />);

    const npcButton = screen.getByText('Generate NPC');
    expect(npcButton).toBeInTheDocument();

    await user.click(npcButton);

    await waitFor(() => {
      expect(screen.getByText(/Mock npc response/)).toBeInTheDocument();
    });
  });

  it('should show multiple panic button types', () => {
    render(<DemoPage />);

    expect(screen.getByText('Panic Button Demo')).toBeInTheDocument();
    expect(screen.getByText('Generate NPC')).toBeInTheDocument();
    expect(screen.getByText('Create Encounter')).toBeInTheDocument();
    expect(screen.getByText('Redirect Plot')).toBeInTheDocument();
  });

  it('should display button variants', () => {
    render(<DemoPage />);

    const defaultButton = screen.getByRole('button', { name: 'Default' });
    const panicButton = screen.getByRole('button', { name: 'Panic' });
    const ghostButton = screen.getByRole('button', { name: 'Ghost' });

    expect(defaultButton).toBeInTheDocument();
    expect(panicButton).toBeInTheDocument();
    expect(ghostButton).toBeInTheDocument();
  });
});
