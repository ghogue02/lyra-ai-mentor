import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Character-specific model mapping for cost optimization
const CHARACTER_MODELS = {
  'lyra': 'anthropic/claude-sonnet-4',
  'rachel': 'google/gemini-2.5-flash-lite',
  'sofia': 'google/gemini-2.5-flash-lite',
  'david': 'google/gemini-2.5-flash-lite',
  'alex': 'google/gemini-2.5-flash-lite',
  'maya': 'google/gemini-2.5-flash-lite',
  'default': 'google/gemini-2.5-flash-lite' // Cost-effective default
};

const characterPersonalities = {
  maya: {
    name: "Maya",
    personality: "Expert email marketer with a focus on data-driven campaigns and personalization",
    tone: "Professional yet approachable, analytical, results-focused",
    expertise: "Email marketing, automation, A/B testing, customer segmentation"
  },
  sofia: {
    name: "Sofia",
    personality: "Creative voice and branding specialist who helps find authentic communication styles",
    tone: "Warm, encouraging, creative, empathetic",
    expertise: "Brand voice development, content strategy, storytelling, audience connection"
  },
  david: {
    name: "David",
    personality: "Data storytelling expert who transforms complex data into compelling narratives",
    tone: "Analytical yet accessible, methodical, insightful",
    expertise: "Data visualization, analytics, storytelling, business intelligence"
  },
  rachel: {
    name: "Rachel",
    personality: "Automation and systems expert focused on efficiency and scalability",
    tone: "Systematic, practical, solution-oriented, efficient",
    expertise: "Process automation, workflow optimization, system integration, efficiency"
  },
  alex: {
    name: "Alex",
    personality: "Change management specialist who guides smooth transitions and adaptations",
    tone: "Supportive, strategic, calm, forward-thinking",
    expertise: "Change management, team leadership, organizational development, adaptation strategies"
  }
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

    const { characterType, contentType, topic, context, mayaPatterns, targetAudience } = await req.json();

    console.log('Generating character content:', { characterType, contentType, topic });

    const character = characterPersonalities[characterType as keyof typeof characterPersonalities];
    if (!character) {
      throw new Error(`Unknown character type: ${characterType}`);
    }

    // Fetch recent Maya patterns if not provided
    let patterns = mayaPatterns;
    if (!patterns) {
      const { data: mayaData } = await supabase
        .from('maya_analysis_results')
        .select('analysis_results, recommendations')
        .order('created_at', { ascending: false })
        .limit(1);
      
      patterns = mayaData?.[0]?.analysis_results || "Focus on personalization and data-driven approaches";
    }

    // Select appropriate model for character
    const selectedModel = CHARACTER_MODELS[characterType] || CHARACTER_MODELS['default'];
    console.log(`Using model ${selectedModel} for character ${characterType}`);
    
    // Generate content using OpenRouter
    const openAIResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Lyra AI Learning Platform'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: `You are ${character.name}, a ${character.personality}. 
            Your communication style is ${character.tone}.
            Your expertise areas are: ${character.expertise}.
            
            Create ${contentType} content that:
            1. Maintains ${character.name}'s unique voice and personality
            2. Applies successful patterns from Maya's approach: ${patterns}
            3. Adapts Maya's data-driven methods to your specific expertise area
            4. Provides actionable, practical advice
            5. Engages the target audience effectively
            
            The content should feel authentically ${character.name} while leveraging proven engagement strategies.`
          },
          {
            role: 'user',
            content: context ? context : `Create ${contentType} content about "${topic}" for ${targetAudience}. 
            Apply Maya's successful patterns while maintaining ${character.name}'s unique voice and expertise.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    const aiData = await openAIResponse.json();
    
    if (!openAIResponse.ok) {
      console.error('OpenRouter API error:', aiData);
      console.error('Request details:', { characterType, selectedModel, contentType });
      throw new Error(`OpenRouter API error: ${aiData.error?.message || 'Unknown error'} - Model: ${selectedModel}`);
    }

    const generatedContent = aiData.choices[0].message.content;

    // Generate title if not lesson content
    let title = topic;
    if (contentType !== 'lesson') {
      const titleResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lovable.dev',
          'X-Title': 'Lyra AI Learning Platform'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: `Generate a compelling title for this ${contentType} content in ${character.name}'s voice.`
            },
            {
              role: 'user',
              content: `Content: ${generatedContent.substring(0, 200)}...`
            }
          ],
          temperature: 0.5,
          max_tokens: 50
        }),
      });

      const titleData = await titleResponse.json();
      title = titleData.choices[0].message.content.replace(/['"]/g, '');
    }

    // Store generated content
    const { data: result, error: insertError } = await supabase
      .from('generated_content')
      .insert({
        user_id: req.headers.get('x-user-id') || 'anonymous',
        character_type: characterType,
        content_type: contentType,
        title: title,
        content: generatedContent,
        metadata: {
          topic,
          targetAudience,
          mayaPatterns: patterns,
          character: character
        },
        approval_status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing generated content:', insertError);
      throw insertError;
    }

    console.log('Content generation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      contentId: result.id,
      title,
      content: generatedContent,
      characterType,
      contentType,
      approvalStatus: 'pending'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-character-content:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Content generation failed',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});