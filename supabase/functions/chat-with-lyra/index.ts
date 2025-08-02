import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from './cors.ts';
import { fetchUserProfile } from './user-profile.ts';
import { buildNaturalSystemMessage } from './system-message.ts';
import { createOpenAIStreamingResponse } from './openai-client.ts';
import type { ChatRequest } from './types.ts';

function detectCharacterFromMessages(messages: any[], character?: string): string {
  // Prioritize explicit character parameter
  if (character && character !== 'default') {
    return character;
  }
  
  // For main Lyra chat interface, default to 'lyra' 
  // Only check system message for explicit character declarations
  const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';
  
  if (systemMessage.toLowerCase().includes('i am sofia') || systemMessage.toLowerCase().includes('this is sofia')) return 'sofia';
  if (systemMessage.toLowerCase().includes('i am david') || systemMessage.toLowerCase().includes('this is david')) return 'david';  
  if (systemMessage.toLowerCase().includes('i am rachel') || systemMessage.toLowerCase().includes('this is rachel')) return 'rachel';
  if (systemMessage.toLowerCase().includes('i am alex') || systemMessage.toLowerCase().includes('this is alex')) return 'alex';
  
  // Default to lyra for main chat interface
  return 'lyra';
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