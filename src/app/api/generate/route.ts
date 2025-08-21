import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/openai-client';
import { generatePanicPrompt } from '@/lib/ai/prompts/panic-prompts';
import { validateGenerateRequest } from '@/lib/ai/validation';
import { isInMockMode } from '@/lib/ai/mock-mode';
import { generateMockResponse } from '@/lib/ai/mock-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if we're in mock mode
    if (isInMockMode()) {
      const content = await generateMockResponse(body.type, body.context);
      return NextResponse.json({
        content,
        usage: {
          prompt_tokens: 100,
          completion_tokens: 150,
          total_tokens: 250
        },
        mock: true // Indicate this is mock data
      });
    }
    
    // Validate request for real API calls
    const validation = validateGenerateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { message: validation.error },
        { status: 400 }
      );
    }
    
    const prompt = body.prompt || generatePanicPrompt(body.type, body.context || {});
    const response = await generateText(prompt);
    
    return NextResponse.json({
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}