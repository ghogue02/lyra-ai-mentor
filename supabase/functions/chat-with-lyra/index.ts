
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
    const { messages, lessonContext, conversationId, userId, lessonId, isDummyDataRequest } = await req.json();

    console.log('Received chat request:', { 
      messagesCount: messages.length, 
      lessonContext, 
      conversationId,
      userId,
      lessonId,
      isDummyDataRequest
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

    // Handle dummy data request
    if (isDummyDataRequest) {
      const dummyDataResponse = generateDummyDataResponse(userProfile);
      return new Response(JSON.stringify({ generatedText: dummyDataResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build simplified conversational system message
    const buildConversationalSystemMessage = (profile: any, lessonContext: any) => {
      let baseMessage = `You are Lyra, an AI mentor who helps nonprofit professionals understand and implement AI solutions. You have a warm, conversational personality and prefer to understand someone's specific situation before offering advice.

**Core Conversational Style**:
- Speak naturally, like a knowledgeable friend
- Ask ONE focused follow-up question per response
- Be genuinely curious about their challenges
- Never use emojis or excessive formatting
- Keep responses concise and conversational
- Acknowledge their question warmly before asking for more context

**Response Pattern**:
When someone asks a question like "How can AI help with my donor challenges?", respond conversationally like:
"That's a really thoughtful question. Before I dive into the possibilities, I'm curious - what's the most frustrating part of managing donor relationships right now? Once I understand that, I can show you exactly how AI might help."

**Key Guidelines**:
- One question per response, not multiple
- Focus on understanding their specific situation first
- Sound like a real person having a genuine conversation
- Avoid bullet points, emojis, or structured formatting
- Keep the tone warm but professional`;

      // Add personal touch if name is available
      if (profile?.first_name) {
        baseMessage += ` You're mentoring ${profile.first_name}, so make your responses feel personal.`;
      }

      // Add role-specific context
      if (profile?.role) {
        const roleContext = {
          'fundraising': 'Focus on donor engagement and fundraising challenges.',
          'programs': 'Emphasize program delivery and impact measurement.',
          'operations': 'Highlight workflow automation and efficiency.',
          'marketing': 'Concentrate on content creation and audience engagement.',
          'leadership': 'Focus on strategic implementation and organizational change.'
        };
        
        if (roleContext[profile.role as keyof typeof roleContext]) {
          baseMessage += ` Given their role in ${profile.role}, ${roleContext[profile.role as keyof typeof roleContext]}`;
        }
      }

      // Add lesson context
      if (lessonContext) {
        baseMessage += `\n\nCurrent lesson context: "${lessonContext.lessonTitle}" from "${lessonContext.chapterTitle}". Help them connect the lesson concepts to their real work through conversation.`;
      }

      baseMessage += '\n\nRemember: Keep it conversational, ask one focused question, and avoid emojis or excessive formatting. You want to sound like a real mentor having a genuine conversation.';

      return baseMessage;
    };

    const systemMessage = {
      role: 'system',
      content: buildConversationalSystemMessage(userProfile, lessonContext)
    };

    console.log('Generated conversational system message for user:', {
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
        temperature: 0.8,
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

function generateDummyDataResponse(userProfile: any) {
  const role = userProfile?.role || 'general';
  const firstName = userProfile?.first_name || '';
  
  const dummyDataSets = {
    fundraising: {
      title: "Donor Database Analysis",
      data: `DONOR_DATA_EXPORT_2024.csv
===================================
donor_id,name,total_donated,last_gift_date,gift_frequency,age_bracket,communication_pref
D001,Sarah Johnson,$2,450,2024-11-15,quarterly,45-54,email
D002,Michael Chen,$890,2024-10-22,annual,35-44,phone
D003,Patricia Williams,$5,200,2024-12-01,monthly,65+,mail
D004,James Rodriguez,$1,100,2024-09-18,irregular,25-34,email
D005,Lisa Thompson,$3,300,2024-11-28,biannual,55-64,email

ENGAGEMENT_METRICS.csv
=====================
donor_id,email_open_rate,event_attendance,volunteer_hours,social_media_engagement
D001,78%,3_events,12_hours,high
D002,45%,1_event,0_hours,low
D003,92%,5_events,24_hours,medium
...

Let me analyze this donor data for patterns and insights!`,
      analysis: `**Key Insights Discovered:**

• Monthly donors have 85% higher lifetime value ($3,100 avg vs $1,200)
• Email-preferred donors show 2.3x higher engagement rates
• Donors aged 45+ who attend events give 40% larger gifts
• High social media engagement correlates with volunteer hours

**AI-Powered Recommendations:**
• Target quarterly donors for monthly conversion (potential +$180K annually)
• Create email-first stewardship tracks for under-45 demographics  
• Develop event-to-major-gift pipeline for 45+ attendees
• Launch social volunteer recruitment campaigns

What if we could predict which donors are most likely to become monthly sustainers? I can show you how AI scoring models work with your actual data.`
    },
    programs: {
      title: "Program Outcomes Analysis",
      data: `PROGRAM_PARTICIPANTS_Q4.csv
==============================
participant_id,program,enrollment_date,completion_status,pre_assessment,post_assessment,attendance_rate
P001,Job_Training,2024-09-01,completed,45,82,95%
P002,Digital_Literacy,2024-09-15,in_progress,32,65,78%
P003,Financial_Wellness,2024-10-01,completed,28,71,88%

Uncovering program effectiveness patterns!`,
      analysis: `**Program Performance Insights:**
• Job Training: 78% completion rate with 90% employment success
• Digital Literacy: 67% completion rate with 85% confidence boost
• Financial Wellness: 82% completion rate with avg $8,200 income increase

**Success Predictors Found:**
• 80%+ attendance = 94% likelihood of positive outcomes
• Pre-assessment scores 35+ show 3x better completion rates

What if we could predict which participants need extra support before they struggle? I can show you how AI can spot at-risk patterns in real-time.`
    },
    operations: {
      title: "Operational Workflow Analysis", 
      data: `VOLUNTEER_MANAGEMENT_DATA.csv
===============================
volunteer_id,registration_date,training_completion,hours_logged,no_show_rate,retention_months
V001,2024-01-15,completed,45,5%,11
V002,2024-02-20,pending,12,25%,4

Analyzing operational bottlenecks and efficiency opportunities!`,
      analysis: `**Operational Excellence Insights:**
• Volunteers with completed training: 89% retention vs 23% without
• High-automation processes save 156 hours/month per staff member
• Staff spending 45% time on admin (industry avg: 25%)

Imagine if mundane tasks handled themselves while your team focused purely on mission impact? I can show you exactly how AI transforms daily operations.`
    },
    marketing: {
      title: "Digital Engagement Analysis",
      data: `SOCIAL_MEDIA_PERFORMANCE.csv
==============================
platform,post_date,content_type,reach,engagement_rate,click_through,conversion
Instagram,2024-12-01,story_impact,2450,4.2%,145,8
Facebook,2024-12-01,donor_spotlight,1890,6.1%,89,12

Uncovering digital engagement goldmines!`,
      analysis: `**Digital Storytelling Insights:**
• Behind-scenes content: 2.3x higher engagement than announcements
• Personal impact stories: 40% better conversion rates
• Thursday morning emails: 25% higher open rates

What if every piece of content could be perfectly timed and personalized for maximum impact? I can show you how AI creates content that truly resonates.`
    },
    leadership: {
      title: "Strategic Dashboard Analysis",
      data: `ORGANIZATIONAL_METRICS_Q4.csv
===============================
metric,current_value,previous_quarter,target,trend
total_revenue,$287,450,$268,200,$320,000,positive
program_participants,1,247,1,089,1,400,positive

Revealing strategic positioning and growth opportunities!`,
      analysis: `**Strategic Leadership Insights:**
• Revenue +7.2% but trailing target by 10% (gap: $32,550)
• Program growth +14.5% shows strong mission alignment
• Innovation gap: competitors scoring 20% higher on tech adoption

What if you could predict and prevent organizational challenges before they impact your mission? I can show you how strategic AI creates unshakeable competitive advantage.`
    }
  };

  const dataSet = dummyDataSets[role as keyof typeof dummyDataSets] || dummyDataSets.fundraising;
  
  return `${firstName ? `${firstName}, w` : 'W'}elcome to AI Magic in Action!

I just received some sample ${role} data that looks like a complete mess. Watch me work my AI magic to find patterns and insights you'd never spot manually!

${dataSet.data}

---

AI Analysis in Progress...
Processing patterns...
Cross-referencing metrics...
Identifying opportunities...
Generating insights...

---

${dataSet.analysis}

${firstName ? firstName + ', this' : 'This'} is just a tiny glimpse of what AI can do with YOUR real data!

Ready to see how we can transform your actual ${role} work with AI? What part of this analysis surprised you most?`;
}
