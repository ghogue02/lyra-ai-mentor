import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MayaRequest {
  action: 'start_session' | 'coaching' | 'prompt_analysis' | 'generate_toolkit';
  userChallenge?: string;
  currentPrompt?: string;
  sessionId?: string;
  userId?: string;
  iterationData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, userChallenge, currentPrompt, sessionId, userId, iterationData }: MayaRequest = await req.json();

    switch (action) {
      case 'start_session':
        return await startSession(supabase, userChallenge!, userId!);
      
      case 'coaching':
        return await provideCoaching(supabase, currentPrompt!, sessionId!, userId!);
      
      case 'prompt_analysis':
        return await analyzePrompt(supabase, currentPrompt!, sessionId!, userId!);
      
      case 'generate_toolkit':
        return await generateToolkit(supabase, sessionId!, userId!);
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in maya-ai-mentor:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function startSession(supabase: any, userChallenge: string, userId: string) {
  // Create new session
  const { data: session, error } = await supabase
    .from('user_prompt_sessions')
    .insert({
      user_id: userId,
      challenge_context: userChallenge,
      session_type: 'maya_hybrid',
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;

  // Generate Maya's adapted story
  const adaptedStory = await generateAdaptedStory(userChallenge);

  // Create first coaching interaction
  await supabase
    .from('coaching_interactions')
    .insert({
      session_id: session.id,
      user_id: userId,
      interaction_type: 'story_adaptation',
      elena_response: adaptedStory,
      metadata: { challenge_context: userChallenge }
    });

  return new Response(JSON.stringify({ 
    sessionId: session.id, 
    adaptedStory,
    message: 'Session started successfully' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function provideCoaching(supabase: any, currentPrompt: string, sessionId: string, userId: string) {
  const coachingPrompt = `
    You are Elena Martinez, an expert AI prompt engineering coach. You're helping someone improve their communication prompt.

    Current prompt: "${currentPrompt}"
    
    Provide specific, actionable coaching feedback in Elena's encouraging but direct style. Focus on:
    1. What's working well
    2. What's missing or could be improved
    3. Specific suggestions for enhancement
    4. Connection to the PACE framework (Purpose, Audience, Connection, Engagement)
    
    Keep response conversational and under 150 words. Sound like a mentor, not a textbook.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: coachingPrompt },
        { role: 'user', content: currentPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    }),
  });

  const data = await response.json();
  const coachingResponse = data.choices[0].message.content;

  // Store coaching interaction
  await supabase
    .from('coaching_interactions')
    .insert({
      session_id: sessionId,
      user_id: userId,
      interaction_type: 'coaching',
      user_input: currentPrompt,
      elena_response: coachingResponse,
      metadata: { improvement_suggestions: true }
    });

  return new Response(JSON.stringify({ 
    coaching: coachingResponse,
    message: 'Coaching provided successfully' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzePrompt(supabase: any, currentPrompt: string, sessionId: string, userId: string) {
  const analysisPrompt = `
    Analyze this prompt for the PACE framework elements:
    "${currentPrompt}"
    
    Rate each element (1-10) and provide brief analysis:
    - Purpose: How clear is the intent?
    - Audience: How well-defined is the target audience?
    - Connection: How well does it create emotional connection?
    - Engagement: How likely is it to generate engaging content?
    
    Respond in JSON format:
    {
      "purpose": {"score": X, "analysis": "..."},
      "audience": {"score": X, "analysis": "..."},
      "connection": {"score": X, "analysis": "..."},
      "engagement": {"score": X, "analysis": "..."},
      "overall_score": X,
      "key_improvements": ["...", "..."]
    }
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: analysisPrompt },
        { role: 'user', content: currentPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500
    }),
  });

  const data = await response.json();
  const analysis = JSON.parse(data.choices[0].message.content);

  // Store analysis
  await supabase
    .from('prompt_iterations')
    .insert({
      session_id: sessionId,
      user_id: userId,
      prompt_text: currentPrompt,
      pace_analysis: analysis,
      iteration_number: 1 // This should be calculated based on existing iterations
    });

  return new Response(JSON.stringify({ 
    analysis,
    message: 'Prompt analyzed successfully' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateToolkit(supabase: any, sessionId: string, userId: string) {
  // Get session data
  const { data: session } = await supabase
    .from('user_prompt_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  // Get all iterations
  const { data: iterations } = await supabase
    .from('prompt_iterations')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  const toolkitPrompt = `
    Based on this user's prompt engineering journey, create a personalized toolkit.
    
    Challenge: ${session.challenge_context}
    Best iteration: ${iterations[0]?.prompt_text || 'N/A'}
    
    Create a JSON toolkit with:
    {
      "templates": [
        {
          "name": "...",
          "description": "...",
          "template": "...",
          "use_case": "..."
        }
      ],
      "quick_reference": {
        "purpose_starters": ["...", "..."],
        "audience_considerations": ["...", "..."],
        "connection_techniques": ["...", "..."],
        "engagement_boosters": ["...", "..."]
      },
      "success_metrics": ["...", "..."],
      "next_steps": ["...", "..."]
    }
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: toolkitPrompt }
      ],
      temperature: 0.5,
      max_tokens: 1000
    }),
  });

  const data = await response.json();
  const toolkit = JSON.parse(data.choices[0].message.content);

  // Store toolkit
  await supabase
    .from('personal_toolkits')
    .insert({
      session_id: sessionId,
      user_id: userId,
      toolkit_name: `${session.challenge_context} Toolkit`,
      toolkit_content: toolkit,
      is_active: true
    });

  return new Response(JSON.stringify({ 
    toolkit,
    message: 'Toolkit generated successfully' 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateAdaptedStory(userChallenge: string) {
  const storyPrompt = `
    Adapt Maya's story to reflect this user's challenge: "${userChallenge}"
    
    Keep Maya as the protagonist but adapt her scenario to match the user's context.
    Maya is still a Communications Director at Hope Valley Youth Center.
    
    Original: Maya needs to write a board email about summer program success.
    Adapt to: Maya faces a similar challenge as the user - "${userChallenge}"
    
    Create a brief, engaging story (100-150 words) that:
    1. Shows Maya facing the same type of challenge
    2. Captures the frustration and stakes
    3. Sets up Elena as the solution
    4. Creates emotional connection with the user
    
    Keep it personal, relatable, and focused on the struggle before the solution.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: storyPrompt }
      ],
      temperature: 0.7,
      max_tokens: 250
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}