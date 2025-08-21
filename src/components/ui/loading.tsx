import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = 'Loading...', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-4', className)}>
      <div role="status" className="relative">
        <div className="border-t-dm-purple h-10 w-10 animate-spin rounded-full border-4 border-gray-200" />
        <span className="sr-only">{text}</span>
      </div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div data-testid="skeleton" className={cn('animate-pulse rounded-md bg-gray-200', className)} />
  );
}
