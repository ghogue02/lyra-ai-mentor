import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { purpose, audience, selectedConsiderations, promptType } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create basic vs comprehensive prompts
    const basicPrompt = "Write a board email about summer program";
    
    const comprehensivePrompt = `You are Maya Rodriguez, Communications Director at Hope Valley Youth Center. Write a compelling board email about our summer program success.

CONTEXT:
- Purpose: ${purpose}
- Audience: ${audience}
- Key motivations: ${selectedConsiderations.join(', ')}
- Organization: Hope Valley Youth Center
- Your role: Communications Director
- The program: Summer youth program with 127 participants

SPECIFIC DETAILS TO INCLUDE:
- Jordan's transformation story (shy 12-year-old who finally smiled)
- 127 kids participated this summer
- Measurable outcomes and impact
- Personal connection to the work
- Clear call to action for continued support

TONE: Professional yet personal, data-driven but story-centered, inspiring and confident

STRUCTURE:
1. Personal hook that connects to your motivation
2. Concrete program results
3. Specific success story (Jordan)
4. Future vision
5. Clear next steps for the board

Write this email as Maya would - passionate about the mission, knowledgeable about the data, and skilled at connecting hearts to the cause.`;

    const promptToUse = promptType === 'basic' ? basicPrompt : comprehensivePrompt;

    console.log('Generating email with prompt type:', promptType);
    console.log('Prompt:', promptToUse);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email writer helping Maya Rodriguez communicate effectively with her board.'
          },
          {
            role: 'user',
            content: promptToUse
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const generatedEmail = data.choices[0].message.content;

    return new Response(JSON.stringify({
      email: generatedEmail,
      promptUsed: promptToUse,
      promptType: promptType
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in maya-prompt-builder function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});