import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadManager } from './upload-manager';

// Mock the useFileUpload hook
jest.mock('@/hooks/use-file-upload', () => ({
  useFileUpload: () => ({
    uploadFile: jest.fn().mockResolvedValue({ key: 'test-key', url: 'test-url' }),
    uploadProgress: 0,
    isUploading: false,
    error: null,
  }),
}));

describe('Upload Manager', () => {
  it('should render file dropzone', () => {
    render(<UploadManager />);
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
  });

  it('should display upload items when files are selected', async () => {
    render(<UploadManager />);

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });
});
