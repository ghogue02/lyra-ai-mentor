
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from './cors.ts';
import { fetchUserProfile } from './user-profile.ts';
import { buildNaturalSystemMessage } from './system-message.ts';
import { generateStagedDemoResponse } from './demo-responses.ts';
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
      demoStage
    }: ChatRequest = await req.json();

    console.log('Received chat request:', { 
      messagesCount: messages.length, 
      lessonContext, 
      conversationId,
      userId,
      lessonId,
      isDummyDataRequest,
      demoStage
    });

    // Fetch user profile data
    const userProfile = await fetchUserProfile(userId);

    // Handle staged demo requests - check for specific demo stage messages
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    if (isDummyDataRequest || demoStage || lastMessage.includes('DEMO_STAGE_') || 
        lastMessage.includes('Show me how AI transforms messy data into actionable insights')) {
      let stageName = 'intro';
      
      if (lastMessage.includes('DEMO_STAGE_LOADING')) {
        stageName = 'loading';
      } else if (lastMessage.includes('DEMO_STAGE_ANALYSIS')) {
        stageName = 'analysis';
      } else if (lastMessage.includes('DEMO_STAGE_INSIGHTS')) {
        stageName = 'insights';
      } else if (lastMessage.includes('DEMO_STAGE_RECOMMENDATIONS')) {
        stageName = 'recommendations';
      } else if (lastMessage.includes('Show me how AI transforms messy data into actionable insights')) {
        stageName = 'intro';
      } else if (demoStage) {
        stageName = demoStage;
      }
      
      const demoResponse = generateStagedDemoResponse(userProfile, stageName);
      return new Response(JSON.stringify({ generatedText: demoResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build system message and create OpenAI request
    const systemMessage = {
      role: 'system',
      content: buildNaturalSystemMessage(userProfile, lessonContext)
    };

    console.log('Generated natural system message for user:', {
      hasProfile: !!userProfile,
      role: userProfile?.role,
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
