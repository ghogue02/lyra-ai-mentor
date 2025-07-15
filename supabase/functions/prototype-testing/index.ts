import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { sessionId, action, configuration, testResults } = await req.json();

    console.log('Prototype testing request:', { sessionId, action, configuration });

    if (action === 'create') {
      // Create new prototype session
      const { data: session, error } = await supabase
        .from('prototype_sessions')
        .insert({
          user_id: req.headers.get('x-user-id') || 'anonymous',
          session_name: configuration.name || 'Untitled Prototype',
          configuration: configuration,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        sessionId: session.id,
        session
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'analyze') {
      // Analyze prototype with AI
      const prototypeData = {
        configuration,
        testResults: testResults || {}
      };

      const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert educational experience designer and UX researcher. 
              Analyze interactive learning prototypes for:
              1. User engagement and learning effectiveness
              2. Clarity of instructions and objectives
              3. Appropriate difficulty progression
              4. Motivational elements and feedback systems
              5. Accessibility and usability issues
              6. Alignment with learning objectives
              
              Provide specific, actionable recommendations for improvement.`
            },
            {
              role: 'user',
              content: `Analyze this learning prototype:
              
              Configuration: ${JSON.stringify(configuration, null, 2)}
              
              Test Results: ${JSON.stringify(testResults, null, 2)}
              
              Provide detailed feedback on effectiveness, engagement, and recommendations for improvement.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        }),
      });

      const aiData = await analysisResponse.json();
      
      if (!analysisResponse.ok) {
        console.error('OpenAI API error:', aiData);
        throw new Error(`OpenAI API error: ${aiData.error?.message || 'Unknown error'}`);
      }

      const aiFeedback = aiData.choices[0].message.content;

      // Generate scoring based on key metrics
      const scoringResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Based on the prototype analysis, provide numerical scores (0-100) for:
              - Engagement Level
              - Learning Effectiveness
              - Usability
              - Clarity
              - Motivation
              - Overall Score
              
              Return as JSON format with explanations for each score.`
            },
            {
              role: 'user',
              content: `Score this prototype based on the analysis: ${aiFeedback}`
            }
          ],
          temperature: 0.2,
          max_tokens: 500
        }),
      });

      const scoringData = await scoringResponse.json();
      const scores = scoringData.choices[0].message.content;

      // Update session with AI feedback
      const { data: updatedSession, error: updateError } = await supabase
        .from('prototype_sessions')
        .update({
          ai_feedback: {
            analysis: aiFeedback,
            scores: scores,
            timestamp: new Date().toISOString()
          },
          test_results: testResults,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(JSON.stringify({
        success: true,
        feedback: aiFeedback,
        scores: scores,
        session: updatedSession
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'load') {
      // Load existing session
      const { data: session, error } = await supabase
        .from('prototype_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        session
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'list') {
      // List user's sessions
      const { data: sessions, error } = await supabase
        .from('prototype_sessions')
        .select('*')
        .eq('user_id', req.headers.get('x-user-id') || 'anonymous')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        sessions
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error('Error in prototype-testing:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Prototype testing failed',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});