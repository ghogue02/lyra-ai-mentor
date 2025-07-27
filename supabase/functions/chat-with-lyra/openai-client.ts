import { corsHeaders } from './cors.ts';
import type { StreamChunk } from './types.ts';

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

// Character-specific model mapping for cost optimization
const CHARACTER_MODELS = {
  'lyra': 'anthropic/claude-sonnet-4',
  'rachel': 'anthropic/claude-sonnet-4',
  'sofia': 'google/gemini-2.5-flash-lite',
  'david': 'google/gemini-2.5-flash-lite',
  'alex': 'google/gemini-2.5-flash-lite',
  'default': 'openai/gpt-4o-mini' // Cost-effective fallback
};

export async function createOpenAIStreamingResponse(messages: any[], character?: string): Promise<Response> {
  const detectedCharacter = character || 'default';
  const model = CHARACTER_MODELS[detectedCharacter];
  
  console.log(`Using model ${model} for character ${detectedCharacter}`);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openRouterApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://lovable.dev',
      'X-Title': 'Lovable AI Learning Platform'
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 500,
      temperature: 0.8,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenRouter API error for model ${model}: ${response.status} - ${errorText}`);
    console.error('Request details:', { character, model, messagesCount: messages.length });
    throw new Error(`OpenRouter API error: ${response.status} - Model: ${model}`);
  }

  return createStreamingResponse(response);
}

function createStreamingResponse(openAIResponse: Response): Response {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = openAIResponse.body?.getReader();
      if (!reader) return;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch (e) {
                console.error('Error parsing streaming response:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Streaming error:', error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}