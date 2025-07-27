import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from './cors.ts';
import { fetchUserProfile } from './user-profile.ts';
import { buildNaturalSystemMessage } from './system-message.ts';
import { createOpenAIStreamingResponse } from './openai-client.ts';
import type { ChatRequest } from './types.ts';

function detectCharacterFromMessages(messages: any[]): string {
  const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';
  const userMessages = messages.filter(msg => msg.role === 'user').map(msg => msg.content).join(' ').toLowerCase();
  
  if (systemMessage.toLowerCase().includes('lyra') || userMessages.includes('lyra')) return 'lyra';
  if (systemMessage.toLowerCase().includes('sofia') || userMessages.includes('sofia')) return 'sofia';
  if (systemMessage.toLowerCase().includes('david') || userMessages.includes('david')) return 'david';
  if (systemMessage.toLowerCase().includes('rachel') || userMessages.includes('rachel')) return 'rachel';
  if (systemMessage.toLowerCase().includes('alex') || userMessages.includes('alex')) return 'alex';
  
  return 'default';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const {
      messages,
      lessonContext,
      conversationId,
      userId,
      lessonId,
      isDummyDataRequest,
      isDataInsights,
      useCleanFormatting
    }: ChatRequest = await req.json();

    console.log('Received chat request:', { 
      messagesCount: messages.length, 
      lessonContext, 
      conversationId,
      userId,
      lessonId,
      isDummyDataRequest,
      isDataInsights,
      useCleanFormatting
    });

    // Detect character first for model comparison
    const character = detectCharacterFromMessages(messages);
    console.log('Detected character:', character);

    // Fetch user profile data
    const userProfile = await fetchUserProfile(userId);

    // Get original system message content for model comparison
    const originalSystemMessage = messages.find(msg => msg.role === 'system')?.content;

    // Build system message with Data Insights formatting if needed
    const systemMessage = {
      role: 'system',
      content: buildNaturalSystemMessage(
        userProfile, 
        lessonContext, 
        isDataInsights, 
        useCleanFormatting, 
        character, 
        originalSystemMessage
      )
    };

    console.log('Generated system message for user:', {
      hasProfile: !!userProfile,
      role: userProfile?.role,
      character,
      isDataInsights,
      useCleanFormatting,
      messageLength: systemMessage.content.length
    });

    return await createOpenAIStreamingResponse([systemMessage, ...messages], character);

  } catch (error) {
    console.error('Error in chat-with-lyra function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});