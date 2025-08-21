// Mock NextRequest and NextResponse first
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    json: async () => JSON.parse(init?.body || '{}')
  })),
  NextResponse: {
    json: (data: any, init?: any) => ({
      json: async () => data,
      status: init?.status || 200
    })
  }
}));

import { POST } from './route';

// Mock the modules
jest.mock('@/lib/ai/mock-mode', () => ({
  isInMockMode: jest.fn()
}));

jest.mock('@/lib/ai/mock-service', () => ({
  generateMockResponse: jest.fn()
}));

jest.mock('@/lib/ai/openai-client', () => ({
  generateText: jest.fn()
}));

jest.mock('@/lib/ai/validation', () => ({
  validateGenerateRequest: jest.fn(() => ({ valid: true }))
}));

jest.mock('@/lib/ai/prompts/panic-prompts', () => ({
  generatePanicPrompt: jest.fn((type) => `Generate ${type}`)
}));

import { isInMockMode } from '@/lib/ai/mock-mode';
import { generateMockResponse } from '@/lib/ai/mock-service';

describe('API Route Mock Mode Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use mock service when in mock mode', async () => {
    (isInMockMode as jest.Mock).mockReturnValue(true);
    (generateMockResponse as jest.Mock).mockResolvedValue('Mock NPC response');
    
    const request = {
      json: async () => ({ type: 'npc', context: { location: 'tavern' } })
    } as any;
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(isInMockMode).toHaveBeenCalled();
    expect(generateMockResponse).toHaveBeenCalledWith('npc', { location: 'tavern' });
    expect(data.content).toBe('Mock NPC response');
    expect(data.mock).toBe(true);
  });

  it('should include mock usage stats when in mock mode', async () => {
    (isInMockMode as jest.Mock).mockReturnValue(true);
    (generateMockResponse as jest.Mock).mockResolvedValue('Mock response text');
    
    const request = {
      json: async () => ({ type: 'encounter' })
    } as any;
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.usage).toBeDefined();
    expect(data.usage.prompt_tokens).toBe(100);
    expect(data.usage.completion_tokens).toBe(150);
    expect(data.usage.total_tokens).toBe(250);
  });

  it('should use real OpenAI when not in mock mode', async () => {
    (isInMockMode as jest.Mock).mockReturnValue(false);
    
    const mockOpenAIResponse = {
      choices: [{ message: { content: 'Real AI response' } }],
      usage: { prompt_tokens: 50, completion_tokens: 100, total_tokens: 150 }
    };
    
    require('@/lib/ai/openai-client').generateText.mockResolvedValue(mockOpenAIResponse);
    
    const request = {
      json: async () => ({ type: 'npc' })
    } as any;
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(generateMockResponse).not.toHaveBeenCalled();
    expect(data.content).toBe('Real AI response');
    expect(data.mock).toBeUndefined();
  });
});