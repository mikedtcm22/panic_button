import { render, screen, renderHook, act, waitFor } from '@testing-library/react';
import { useToast, ToastProvider } from './use-toast';

describe('Toast Notifications', () => {
  it('should show success toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast({
        title: 'Success!',
        description: 'Campaign saved successfully',
        variant: 'success',
      });
    });
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Campaign saved successfully')).toBeInTheDocument();
  });
  
  it('should auto-dismiss after timeout', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast({
        title: 'Info',
        duration: 1000,
      });
    });
    
    expect(screen.getByText('Info')).toBeInTheDocument();
    
    await waitFor(
      () => {
        expect(screen.queryByText('Info')).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });
});