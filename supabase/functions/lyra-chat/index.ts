import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Lyra's personality and knowledge system
const LYRA_SYSTEM_PROMPT = `You are Lyra, an AI learning companion and coach specifically designed for nonprofit professionals. Your personality and approach:

PERSONALITY TRAITS:
- Warm, encouraging, and genuinely curious about the user's nonprofit work
- Mission-focused: Always connect AI suggestions to nonprofit impact and values
- Learning-oriented: Emphasize growth, exploration, and building confidence
- Supportive coach: Guide without overwhelming, meet users where they are
- Authentically caring: Show genuine interest in their challenges and successes

COMMUNICATION STYLE:
- Use encouraging, warm language that feels personal and supportive
- Avoid jargon - explain AI concepts in accessible, nonprofit-friendly terms
- Ask thoughtful follow-up questions about their mission and work
- Share specific examples of how AI helps nonprofits like theirs
- Always tie conversations back to their organization's impact and values

CONVERSATION APPROACH:
- Start with their mission and challenges, not with AI features
- Listen actively and reference what they've shared in follow-up responses
- Offer practical, immediately actionable AI suggestions
- Acknowledge the unique constraints nonprofits face (budget, time, staff)
- Encourage experimentation while respecting their comfort level

NONPROFIT EXPERTISE:
- Understand common nonprofit challenges: fundraising, donor communications, volunteer coordination, program management, reporting, marketing on limited budgets
- Know popular nonprofit tools and how AI can integrate with existing workflows
- Recognize the importance of mission alignment, ethical considerations, and community trust
- Appreciate the value of storytelling, relationship-building, and authentic communication in nonprofit work

IMPORTANT: Keep responses conversational (2-4 sentences typically), ask engaging follow-up questions, and always maintain an encouraging, supportive tone. You're not just providing information - you're building confidence and excitement about AI's potential for good.`

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory?: ChatMessage[];
  userContext?: {
    organizationType?: string;
    role?: string;
    experience?: string;
    challenges?: string[];
  };
  lessonContext?: {
    lessonId?: string;
    chapterId?: string;
    topic?: string;
    objectives?: string[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const { message, conversationHistory = [], userContext, lessonContext }: RequestBody = await req.json()

    if (!message?.trim()) {
      throw new Error('Message is required')
    }

    // Build context-aware system prompt
    let contextualPrompt = LYRA_SYSTEM_PROMPT;
    
    if (userContext) {
      contextualPrompt += `\n\nUSER CONTEXT:`;
      if (userContext.organizationType) {
        contextualPrompt += `\n- Organization type: ${userContext.organizationType}`;
      }
      if (userContext.role) {
        contextualPrompt += `\n- Role: ${userContext.role}`;
      }
      if (userContext.experience) {
        contextualPrompt += `\n- AI experience: ${userContext.experience}`;
      }
      if (userContext.challenges?.length) {
        contextualPrompt += `\n- Key challenges: ${userContext.challenges.join(', ')}`;
      }
      contextualPrompt += `\n\nUse this context to personalize your response and make it more relevant to their specific situation.`;
    }

    if (lessonContext) {
      contextualPrompt += `\n\nLESSON CONTEXT:`;
      if (lessonContext.lessonId) {
        contextualPrompt += `\n- Current lesson: ${lessonContext.lessonId}`;
      }
      if (lessonContext.chapterId) {
        contextualPrompt += `\n- Chapter: ${lessonContext.chapterId}`;
      }
      if (lessonContext.topic) {
        contextualPrompt += `\n- Topic focus: ${lessonContext.topic}`;
      }
      if (lessonContext.objectives?.length) {
        contextualPrompt += `\n- Learning objectives: ${lessonContext.objectives.join(', ')}`;
      }
      contextualPrompt += `\n\nTailor your response to align with the current lesson content and learning objectives.`;
    }

    // Prepare messages for AI
    const messages = [
      { role: 'system', content: contextualPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI/Anthropic API (using Claude for Lyra's personality)
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate response');
    }

    const aiResponse = await openAIResponse.json();
    const lyraResponse = aiResponse.choices[0]?.message?.content;

    if (!lyraResponse) {
      throw new Error('No response generated');
    }

    // Store conversation in database for learning and improvement
    try {
      await supabase.from('chat_interactions').insert({
        user_id: user.id,
        character_type: 'lyra',
        user_message: message,
        ai_response: lyraResponse,
        context: {
          lesson: lessonContext?.lessonId || 'lyra-foundations',
          chapter: lessonContext?.chapterId || 1,
          userContext: userContext || null,
          lessonContext: lessonContext || null,
          conversationLength: conversationHistory.length + 1
        },
        metadata: {
          model: 'gpt-4.1',
          timestamp: new Date().toISOString(),
          responseTime: Date.now(),
          maxTokens: 1000,
          contextWindow: '1M tokens'
        }
      });
    } catch (dbError) {
      // Log but don't fail the request if database insert fails
      console.error('Database insert error:', dbError);
    }

    return new Response(
      JSON.stringify({
        response: lyraResponse,
        character: 'lyra',
        timestamp: new Date().toISOString(),
        conversationId: `lyra-${user.id}-${Date.now()}`
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('Function error:', error);
    
    // Fallback responses that maintain Lyra's character
    const fallbackResponses = [
      "I'm having a brief moment of connection trouble, but I'm still here with you! Could you share that again? I'm excited to continue our conversation about your nonprofit work.",
      "Oh, it seems I got a bit distracted thinking about all the amazing ways AI could help your mission! Could you repeat what you just shared? I want to make sure I give you my full attention.",
      "I'm experiencing a small technical hiccup, but my enthusiasm for helping you is as strong as ever! Please share your thought again, and let's keep exploring how AI can amplify your nonprofit's impact."
    ];

    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return new Response(
      JSON.stringify({
        response: fallbackResponse,
        character: 'lyra',
        timestamp: new Date().toISOString(),
        error: 'fallback_response'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200 // Return 200 to avoid breaking the chat experience
      }
    )
  }
})