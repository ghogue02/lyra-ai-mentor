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
    const { journey_key, content, phase, scoring_criteria } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Generate scoring prompt based on journey type
    const scoringPrompt = generateScoringPrompt(journey_key, content, scoring_criteria);

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
            content: 'You are an expert learning assessment AI. You evaluate learning content and provide detailed, constructive scoring with specific feedback. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: scoringPrompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    
    // Parse the JSON response
    let scoreData;
    try {
      scoreData = JSON.parse(result);
    } catch (parseError) {
      console.error('Failed to parse AI response:', result);
      throw new Error('Invalid scoring response format');
    }

    return new Response(JSON.stringify(scoreData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in score-journey-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateScoringPrompt(journeyKey: string, content: any, criteria: any): string {
  const basePrompt = `
Please evaluate the following content for the "${journeyKey}" learning journey.

Scoring Criteria: ${JSON.stringify(criteria)}

Content to Evaluate: ${JSON.stringify(content)}

Please provide a score as JSON in this exact format:
{
  "overall_score": [number from 0-100],
  "breakdown": {
    "criteria1": [score 0-100],
    "criteria2": [score 0-100],
    ...
  },
  "feedback": "[detailed constructive feedback explaining the scores and how to improve]"
}

`;

  // Journey-specific prompts
  if (journeyKey === 'maya-pace-framework') {
    return basePrompt + `
Focus on evaluating the PACE framework implementation:
- Purpose: Is the purpose clear and well-defined?
- Audience: Is the target audience clearly identified and appropriate?
- Context: Is sufficient context provided for understanding?
- Execution: Are the execution steps clear, actionable, and well-structured?

Consider clarity, specificity, completeness, and actionability in your scoring.
`;
  }

  if (journeyKey === 'maya-tone-mastery') {
    return basePrompt + `
Focus on evaluating tone adaptation quality:
- Audience Understanding: How well does the content demonstrate understanding of the target audience?
- Tone Appropriateness: How well does the tone match the intended audience and context?
- Message Clarity: How clear and understandable is the message?
- Engagement: How engaging and compelling is the content for the target audience?

Consider professional appropriateness, audience alignment, and communication effectiveness.
`;
  }

  return basePrompt + `
Evaluate based on the provided criteria. Focus on learning objectives achievement, content quality, and practical applicability.
`;
}