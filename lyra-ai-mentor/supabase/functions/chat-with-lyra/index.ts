
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from './cors.ts';
import { fetchUserProfile } from './user-profile.ts';
import { buildNaturalSystemMessage } from './system-message.ts';
import { createOpenAIStreamingResponse } from './openai-client.ts';
import type { ChatRequest } from './types.ts';

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

    // Fetch user profile data
    const userProfile = await fetchUserProfile(userId);

    // Build system message with Data Insights formatting if needed
    const systemMessage = {
      role: 'system',
      content: buildNaturalSystemMessage(userProfile, lessonContext, isDataInsights, useCleanFormatting)
    };

    console.log('Generated system message for user:', {
      hasProfile: !!userProfile,
      role: userProfile?.role,
      isDataInsights,
      useCleanFormatting,
      messageLength: systemMessage.content.length
    });

    return await createOpenAIStreamingResponse([systemMessage, ...messages]);

  } catch (error) {
    console.error('Error in chat-with-lyra function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
