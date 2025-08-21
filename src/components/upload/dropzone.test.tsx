import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileDropzone } from './dropzone';

describe('File Dropzone', () => {
  it('should render drop zone with instructions', () => {
    render(<FileDropzone onFilesSelected={jest.fn()} />);
    expect(screen.getByText(/drag and drop files here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to select/i)).toBeInTheDocument();
  });
  
  it('should accept PDF, DOCX, MD, and TXT files', () => {
    render(<FileDropzone onFilesSelected={jest.fn()} />);
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    expect(input.accept).toBe('.pdf,.docx,.md,.txt');
  });
});