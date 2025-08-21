interface GenerateRequest {
  prompt?: string;
  type?: string;
  context?: any;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateGenerateRequest(request: GenerateRequest): ValidationResult {
  const validTypes = ['npc', 'encounter', 'plot', 'flavor', 'foreshadow'];

  if (request.type && !validTypes.includes(request.type)) {
    return {
      valid: false,
      error: 'Invalid panic type',
    };
  }

  if (request.prompt && request.prompt.length > 10000) {
    return {
      valid: false,
      error: 'Prompt exceeds maximum length of 10000 characters',
    };
  }

  if (!request.prompt && !request.type) {
    return {
      valid: false,
      error: 'Either prompt or type must be provided',
    };
  }

  return { valid: true };
}
