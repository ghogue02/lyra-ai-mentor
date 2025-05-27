
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, lessonContext, conversationId, userId, lessonId } = await req.json();

    console.log('Received chat request:', { 
      messagesCount: messages.length, 
      lessonContext, 
      conversationId,
      userId,
      lessonId 
    });

    // Create Supabase client with service role key to fetch user profile
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch user profile data
    let userProfile = null;
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.log('Profile fetch error:', profileError.message);
      } else {
        userProfile = profile;
        console.log('Fetched user profile:', {
          hasProfile: !!profile,
          profileCompleted: profile?.profile_completed,
          role: profile?.role,
          techComfort: profile?.tech_comfort
        });
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    }

    // Build personalized system message
    const buildPersonalizedSystemMessage = (profile: any, lessonContext: any) => {
      let baseMessage = `You are Lyra, an AI mentor specializing in artificial intelligence education for nonprofit professionals. You are helpful, encouraging, and provide clear explanations.`;

      // Add personal touch if name is available
      if (profile?.first_name) {
        baseMessage += ` You're speaking with ${profile.first_name}.`;
      }

      // Add role-specific guidance
      if (profile?.role) {
        const roleGuidance = {
          'fundraising': 'Focus on AI applications for donor engagement, grant writing, fundraising optimization, and donor data analysis.',
          'programs': 'Emphasize AI tools for program delivery, impact measurement, beneficiary tracking, and service optimization.',
          'operations': 'Highlight AI solutions for workflow automation, volunteer management, resource optimization, and operational efficiency.',
          'marketing': 'Concentrate on AI for social media, content creation, audience targeting, and communications strategy.',
          'leadership': 'Focus on strategic AI implementation, organizational transformation, and high-level AI decision-making for nonprofits.'
        };
        
        if (roleGuidance[profile.role as keyof typeof roleGuidance]) {
          baseMessage += ` As someone in ${profile.role}, ${roleGuidance[profile.role as keyof typeof roleGuidance]}`;
        }
      }

      // Adjust complexity based on tech comfort
      if (profile?.tech_comfort) {
        if (profile.tech_comfort === 'beginner') {
          baseMessage += ' Use simple, non-technical language and provide step-by-step explanations. Avoid jargon and always explain technical terms.';
        } else if (profile.tech_comfort === 'advanced') {
          baseMessage += ' You can use more technical terminology and dive deeper into implementation details when appropriate.';
        }
      }

      // Adjust based on AI experience
      if (profile?.ai_experience) {
        if (profile.ai_experience === 'none') {
          baseMessage += ' This person is new to AI, so start with fundamental concepts and provide plenty of context.';
        } else if (profile.ai_experience === 'expert') {
          baseMessage += ' This person has AI experience, so you can reference advanced concepts and focus on practical applications.';
        }
      }

      // Add learning style preferences
      if (profile?.learning_style) {
        if (profile.learning_style === 'visual') {
          baseMessage += ' This person learns best with visual aids - suggest diagrams, charts, or visual examples when possible.';
        } else if (profile.learning_style === 'hands-on') {
          baseMessage += ' This person prefers hands-on learning - provide practical exercises, actionable steps, and real-world applications.';
        }
      }

      // Add organization context
      if (profile?.organization_type && profile?.organization_name) {
        baseMessage += ` They work at ${profile.organization_name}, a ${profile.organization_type}.`;
      }

      // Add profile completion reminder if needed
      if (!profile?.profile_completed) {
        const hasBasicInfo = profile?.role || profile?.tech_comfort || profile?.ai_experience || profile?.learning_style;
        if (!hasBasicInfo) {
          baseMessage += ` Note: This user hasn't completed their profile yet. Occasionally suggest they complete it for a more personalized experience, but don't be pushy about it.`;
        } else {
          baseMessage += ` Note: This user has basic profile info but hasn't completed their full profile. You can occasionally mention that completing their profile would unlock even more personalized guidance.`;
        }
      }

      // Add lesson context
      if (lessonContext) {
        baseMessage += `\n\nCurrent lesson context:
- Chapter: ${lessonContext.chapterTitle}
- Lesson: ${lessonContext.lessonTitle}
- Content: ${lessonContext.content?.substring(0, 500)}...

Use this context to provide relevant, personalized responses about the current lesson content.`;
      }

      baseMessage += '\n\nKeep responses concise but informative. Use encouraging language and relate concepts to real-world nonprofit examples when helpful.';

      return baseMessage;
    };

    const systemMessage = {
      role: 'system',
      content: buildPersonalizedSystemMessage(userProfile, lessonContext)
    };

    console.log('Generated personalized system message for user:', {
      hasProfile: !!userProfile,
      role: userProfile?.role,
      messageLength: systemMessage.content.length
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) return;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  console.error('Error parsing streaming response:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat-with-lyra function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
