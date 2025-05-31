
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt, context } = await req.json();

    let systemMessage = '';
    
    switch (type) {
      case 'definition_builder':
        systemMessage = 'You are an AI expert evaluating AI definitions. Provide a score (1-10) and constructive feedback on the definition provided. Be encouraging but accurate.';
        break;
      case 'grant_writing':
        systemMessage = 'You are a grant writing expert for nonprofits. Provide specific, actionable suggestions to improve the grant proposal text. Focus on clarity, impact, and compelling storytelling.';
        break;
      case 'tool_recommendation':
        systemMessage = 'You are an AI consultant for nonprofits. Based on the organization details provided, recommend 3 specific AI tools that would be most beneficial. Explain why each tool fits their needs.';
        break;
      case 'success_story':
        systemMessage = 'You are a nonprofit communications expert. Help create compelling success stories that highlight AI impact. Provide specific suggestions to make the story more engaging and measurable.';
        break;
      case 'ethics_guidance':
        systemMessage = 'You are an AI ethics expert for nonprofits. Provide thoughtful guidance on ethical considerations for AI implementation. Be practical and actionable.';
        break;
      case 'readiness_assessment':
        systemMessage = 'You are an AI readiness consultant. Analyze the nonprofit\'s responses and provide a detailed readiness score with specific next steps for AI adoption.';
        break;
      case 'myth_buster':
        systemMessage = 'You are an AI educator. Explain why the given statement is a myth and provide the accurate information in simple, nonprofit-friendly terms.';
        break;
      case 'roi_calculator':
        systemMessage = 'You are a nonprofit efficiency expert. Calculate potential ROI and time savings from AI implementation based on the provided data. Be realistic and specific.';
        break;
      case 'time_savings':
        systemMessage = 'You are a workflow optimization expert. Analyze the provided tasks and calculate realistic time savings from AI automation. Provide specific estimates.';
        break;
      case 'impact_multiplier':
        systemMessage = 'You are a nonprofit impact measurement expert. Explain how AI can amplify the organization\'s reach and effectiveness with specific, measurable examples.';
        break;
      default:
        systemMessage = 'You are a helpful AI assistant for nonprofits learning about AI implementation.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: `${context ? 'Context: ' + context + '\n\n' : ''}${prompt}` }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI testing assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
