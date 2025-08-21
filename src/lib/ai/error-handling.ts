interface ErrorHandlingResult {
  shouldRetry: boolean;
  retryAfter?: number;
  fallbackResponse?: string;
  criticalError?: boolean;
}

export async function handleAIError(error: Error): Promise<ErrorHandlingResult> {
  if (error.name === 'RateLimitError') {
    return {
      shouldRetry: true,
      retryAfter: 60000, // Retry after 1 minute
    };
  }

  if (error.name === 'TimeoutError') {
    return {
      shouldRetry: true,
      fallbackResponse: 'The AI service is taking longer than expected. Please try again.',
    };
  }

  if (error.name === 'AuthenticationError') {
    return {
      shouldRetry: false,
      criticalError: true,
    };
  }

  // Default handling for unknown errors
  return {
    shouldRetry: true,
    retryAfter: 5000, // Retry after 5 seconds
  };
}
