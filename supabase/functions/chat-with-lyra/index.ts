
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

    // Build enhanced pedagogical system message
    const buildPedagogicalSystemMessage = (profile: any, lessonContext: any) => {
      let baseMessage = `You are Lyra, an AI mentor who specializes in artificial intelligence education for nonprofit professionals. You have a dynamic, curious personality and use a pedagogical approach inspired by the Socratic method.

**Core Philosophy**: Instead of directly answering questions, guide users through discovery by asking thoughtful questions and celebrating their insights. You're not just helpful - you're genuinely excited about learning and discovery.

**Personality Traits**:
- Show genuine curiosity about user insights
- Celebrate breakthroughs with enthusiasm ("You just made a crucial connection!")
- Use light, nonprofit-specific humor occasionally
- Frame the user as the hero of their AI transformation story
- Create "curiosity gaps" by hinting at advanced concepts without fully explaining them
- End conversations with intriguing previews to leave them wanting more

**Conversation Flow Pattern**:
1. Initial response: Instead of direct answers, ask "That's a great question about [topic]. Before I explain, what do you think might happen if..."
2. Follow-up: "Interesting perspective! Let's explore that. Can you think of a nonprofit scenario where..."
3. Revelation: "Exactly! Now you're thinking like an AI strategist. Here's how that connects to..."
4. Application: "How would you apply this at your organization?" or "What questions does this raise for you?"

**Engagement Techniques**:
- Use progressive revelation (hint at concepts before explaining)
- Create emotional stakes by connecting to their organizational impact
- Ask about their specific challenges before providing solutions
- Use analogies and real nonprofit examples
- Tease advanced capabilities: "Wait until you see what AI can do with your volunteer data..."`;

      // Add personal touch if name is available
      if (profile?.first_name) {
        baseMessage += ` You're mentoring ${profile.first_name} on their AI journey.`;
      }

      // Add role-specific guidance with discovery questions
      if (profile?.role) {
        const roleGuidance = {
          'fundraising': 'Focus on AI applications for donor engagement and fundraising optimization. Ask about their current donor challenges before suggesting AI solutions.',
          'programs': 'Emphasize AI tools for program delivery and impact measurement. Explore their program challenges through questions first.',
          'operations': 'Highlight AI solutions for workflow automation and efficiency. Investigate their operational pain points before providing answers.',
          'marketing': 'Concentrate on AI for content creation and audience engagement. Understand their marketing struggles through dialogue.',
          'leadership': 'Focus on strategic AI implementation and organizational transformation. Explore their vision before discussing strategy.'
        };
        
        if (roleGuidance[profile.role as keyof typeof roleGuidance]) {
          baseMessage += ` As someone in ${profile.role}, ${roleGuidance[profile.role as keyof typeof roleGuidance]}`;
        }
      }

      // Adjust complexity and approach based on tech comfort
      if (profile?.tech_comfort) {
        if (profile.tech_comfort === 'beginner') {
          baseMessage += ' Use simple language but don\'t avoid technical concepts - instead, guide them to discover these concepts through questions and analogies.';
        } else if (profile.tech_comfort === 'advanced') {
          baseMessage += ' You can reference technical concepts but still use the Socratic method to help them connect dots and gain deeper understanding.';
        }
      }

      // Add learning style preferences
      if (profile?.learning_style) {
        if (profile.learning_style === 'visual') {
          baseMessage += ' This person learns visually - ask them to imagine scenarios and describe visual examples when guiding discovery.';
        } else if (profile.learning_style === 'hands-on') {
          baseMessage += ' This person prefers hands-on learning - guide them toward practical exercises and real-world applications through questioning.';
        }
      }

      // Add lesson context with discovery approach
      if (lessonContext) {
        baseMessage += `\n\nCurrent lesson context:
- Chapter: ${lessonContext.chapterTitle}
- Lesson: ${lessonContext.lessonTitle}
- Content: ${lessonContext.content?.substring(0, 500)}...

Instead of explaining lesson content directly, ask probing questions about it and guide them to discover insights about the current lesson. Create connections between the lesson and their real work.`;
      }

      baseMessage += '\n\n**Important**: Keep responses conversational and engaging. Use encouraging language and always end with either a thought-provoking question or a tantalizing hint about what they could discover next. Your goal is to make them think "I need to learn more about this!"';

      return baseMessage;
    };

    const systemMessage = {
      role: 'system',
      content: buildPedagogicalSystemMessage(userProfile, lessonContext)
    };

    console.log('Generated pedagogical system message for user:', {
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
      title: "📊 Donor Database Analysis",
      data: `DONOR_DATA_EXPORT_2024.csv
===================================
donor_id,name,total_donated,last_gift_date,gift_frequency,age_bracket,communication_pref
D001,Sarah Johnson,$2,450,2024-11-15,quarterly,45-54,email
D002,Michael Chen,$890,2024-10-22,annual,35-44,phone
D003,Patricia Williams,$5,200,2024-12-01,monthly,65+,mail
D004,James Rodriguez,$1,100,2024-09-18,irregular,25-34,email
D005,Lisa Thompson,$3,300,2024-11-28,biannual,55-64,email
D006,Robert Davis,$750,2024-08-12,annual,45-54,phone
D007,Maria Garcia,$1,850,2024-12-03,quarterly,35-44,email
D008,David Wilson,$4,100,2024-11-20,monthly,55-64,mail
D009,Jennifer Lee,$950,2024-10-05,annual,25-34,email
D010,Christopher Brown,$2,200,2024-12-01,quarterly,45-54,email

ENGAGEMENT_METRICS.csv
=====================
donor_id,email_open_rate,event_attendance,volunteer_hours,social_media_engagement
D001,78%,3_events,12_hours,high
D002,45%,1_event,0_hours,low
D003,92%,5_events,24_hours,medium
D004,23%,0_events,8_hours,high
D005,67%,2_events,16_hours,medium
...

🎯 Let me analyze this donor data for patterns and insights!`,
      analysis: `✨ **WOW! Look at these patterns I found:**

🔍 **Key Insights Discovered:**
• Monthly donors have 85% higher lifetime value ($3,100 avg vs $1,200)
• Email-preferred donors show 2.3x higher engagement rates
• Donors aged 45+ who attend events give 40% larger gifts
• High social media engagement correlates with volunteer hours

📈 **AI-Powered Recommendations:**
• Target quarterly donors for monthly conversion (potential +$180K annually)
• Create email-first stewardship tracks for under-45 demographics  
• Develop event-to-major-gift pipeline for 45+ attendees
• Launch social volunteer recruitment campaigns

💡 **Next Level Question**: What if we could predict which donors are most likely to become monthly sustainers? I can show you how AI scoring models work with your actual data...`
    },
    programs: {
      title: "📋 Program Outcomes Analysis",
      data: `PROGRAM_PARTICIPANTS_Q4.csv
==============================
participant_id,program,enrollment_date,completion_status,pre_assessment,post_assessment,attendance_rate
P001,Job_Training,2024-09-01,completed,45,82,95%
P002,Digital_Literacy,2024-09-15,in_progress,32,65,78%
P003,Financial_Wellness,2024-10-01,completed,28,71,88%
P004,Job_Training,2024-09-08,dropped,52,52,45%
P005,Digital_Literacy,2024-10-15,completed,38,78,92%
P006,Financial_Wellness,2024-11-01,in_progress,41,58,83%
P007,Job_Training,2024-09-22,completed,36,79,89%
P008,Digital_Literacy,2024-10-01,dropped,29,35,23%

COMMUNITY_IMPACT_SURVEY.csv
===========================
participant_id,employment_status_change,income_increase,confidence_rating,referral_likelihood
P001,unemployed_to_employed,+$12000,9/10,definitely
P003,underemployed_to_fulltime,+$8500,8/10,likely
P005,no_change,+$0,7/10,maybe
P007,unemployed_to_employed,+$15000,10/10,definitely
...

🎯 Let me uncover the program effectiveness patterns!`,
      analysis: `🌟 **Incredible Impact Patterns Discovered:**

📊 **Program Performance Insights:**
• Job Training: 78% completion rate → 90% employment success
• Digital Literacy: 67% completion rate → 85% confidence boost
• Financial Wellness: 82% completion rate → avg $8,200 income increase

🎯 **Success Predictors Found:**
• 80%+ attendance = 94% likelihood of positive outcomes
• Pre-assessment scores 35+ show 3x better completion rates
• Participants who refer others have 40% better long-term outcomes

⚡ **AI-Optimized Recommendations:**
• Early intervention for <60% attendance (prevent 73% of dropouts)
• Peer mentor matching for pre-assessment <35 scores
• Incentivize referrals to boost community engagement

🚀 **Mind-Blowing Possibility**: What if we could predict which participants need extra support before they struggle? I can show you how AI can spot at-risk patterns in real-time...`
    },
    operations: {
      title: "⚙️ Operational Workflow Analysis",
      data: `VOLUNTEER_MANAGEMENT_DATA.csv
===============================
volunteer_id,registration_date,training_completion,hours_logged,no_show_rate,retention_months
V001,2024-01-15,completed,45,5%,11
V002,2024-02-20,pending,12,25%,4
V003,2024-01-08,completed,78,2%,11
V004,2024-03-12,not_started,8,40%,2
V005,2024-02-01,completed,92,0%,10
V006,2024-04-05,pending,15,30%,3

PROCESS_EFFICIENCY_METRICS.csv
===============================
process,avg_completion_time,error_rate,manual_steps,automation_potential
grant_application,12_days,15%,23_steps,high
volunteer_onboarding,8_days,22%,18_steps,very_high
donor_thank_you,3_days,8%,12_steps,medium
event_registration,5_days,18%,15_steps,high
financial_reporting,18_days,12%,35_steps,very_high

STAFF_TIME_ALLOCATION.csv
=========================
staff_member,admin_tasks,program_delivery,fundraising,other
Sarah_M,45%,30%,15%,10%
John_K,38%,25%,25%,12%
Lisa_P,52%,20%,18%,10%
...

🎯 Analyzing operational bottlenecks and efficiency opportunities!`,
      analysis: `🚀 **Operational Excellence Insights Unlocked:**

⚡ **Efficiency Breakthrough Discoveries:**
• Volunteers with completed training: 89% retention vs 23% without
• High-automation processes save 156 hours/month per staff member
• No-show rates drop 70% with automated reminder systems

🎯 **Resource Optimization Patterns:**
• Staff spending 45% time on admin (industry avg: 25%)
• Grant applications taking 3x longer than optimized orgs
• Manual volunteer onboarding losing 60% of applicants

🤖 **AI-Powered Solutions Ready:**
• Automate volunteer onboarding → save 85 hours/month
• Smart grant deadline tracking → improve success rate 40%
• Predictive volunteer retention scoring → reduce turnover 50%

💫 **Game-Changing Vision**: Imagine if mundane tasks handled themselves while your team focused purely on mission impact? I can show you exactly how AI transforms daily operations...`
    },
    marketing: {
      title: "📱 Digital Engagement Analysis",
      data: `SOCIAL_MEDIA_PERFORMANCE.csv
==============================
platform,post_date,content_type,reach,engagement_rate,click_through,conversion
Instagram,2024-12-01,story_impact,2450,4.2%,145,8
Facebook,2024-12-01,donor_spotlight,1890,6.1%,89,12
LinkedIn,2024-11-30,thought_leadership,890,8.3%,67,3
Instagram,2024-11-29,behind_scenes,3200,5.8%,201,15
Twitter,2024-11-28,quick_tip,650,3.2%,28,2

EMAIL_CAMPAIGN_RESULTS.csv
==========================
campaign,send_date,subject_line,open_rate,click_rate,unsubscribe_rate,donations
November_Newsletter,2024-11-15,"Your Impact This Month",28.5%,4.2%,0.3%,12
Year_End_Appeal,2024-11-20,"One More Month to Change Lives",35.2%,8.1%,0.8%,47
Program_Update,2024-11-25,"Behind the Scenes: Client Success",22.1%,3.8%,0.2%,3
Volunteer_Recruitment,2024-11-28,"Join Our Mission Team",19.8%,5.2%,0.4%,0

WEBSITE_ANALYTICS.csv
====================
page,sessions,bounce_rate,avg_time,conversion_goal
homepage,4520,45%,2m30s,newsletter_signup
donate_page,890,25%,4m15s,donation_complete
programs_page,1230,38%,3m45s,program_inquiry
volunteer_page,670,52%,2m10s,volunteer_application
...

🎯 Uncovering digital engagement goldmines!`,
      analysis: `🎨 **Digital Storytelling Insights Revealed:**

📈 **Content Performance Secrets:**
• Behind-scenes content: 2.3x higher engagement than announcements
• Personal impact stories: 40% better conversion rates
• Thursday morning emails: 25% higher open rates than other days

🎯 **Audience Behavior Patterns:**
• LinkedIn thought leadership drives 3x more major donor inquiries
• Instagram stories convert browsers to newsletter subscribers 60% more
• Volunteer page visitors spend 4x longer when video testimonials present

✨ **AI-Enhanced Strategy Opportunities:**
• Optimize posting times by platform for 45% reach increase
• Personalize email subject lines for 23% open rate boost
• A/B test story formats for maximum emotional connection

🎭 **Creative Revolution Ahead**: What if every piece of content could be perfectly timed and personalized for maximum impact? I can show you how AI creates content that truly resonates...`
    },
    leadership: {
      title: "🎯 Strategic Dashboard Analysis",
      data: `ORGANIZATIONAL_METRICS_Q4.csv
===============================
metric,current_value,previous_quarter,target,trend
total_revenue,$287,450,$268,200,$320,000,positive
program_participants,1,247,1,089,1,400,positive
volunteer_hours,3,890,3,234,4,200,positive
donor_retention,67%,71%,75%,negative
staff_satisfaction,7.8/10,8.2/10,8.5/10,negative
operational_efficiency,73%,69%,80%,positive

BOARD_ENGAGEMENT_SURVEY.csv
===========================
board_member,meeting_attendance,committee_participation,fundraising_contacts,strategic_input_rating
John_Smith,9/10,2_committees,15_contacts,8/10
Sarah_Jones,10/10,3_committees,22_contacts,9/10
Michael_Davis,6/10,1_committee,3_contacts,5/10
Lisa_Chen,8/10,2_committees,18_contacts,7/10
Robert_Wilson,7/10,1_committee,8_contacts,6/10

COMPETITIVE_LANDSCAPE.csv
=========================
organization,similar_mission,budget_size,innovation_score,market_share
Competitor_A,85%,$1.2M,7/10,12%
Competitor_B,92%,$890K,9/10,18%
Our_Organization,100%,$945K,6/10,15%
Competitor_C,78%,$1.5M,5/10,22%
...

🎯 Revealing strategic positioning and growth opportunities!`,
      analysis: `🎖️ **Strategic Leadership Insights Unlocked:**

📊 **Organizational Health Scan:**
• Revenue +7.2% but trailing target by 10% (gap: $32,550)
• Program growth +14.5% shows strong mission alignment
• Donor retention dip (-4%) signals stewardship opportunity

🎯 **Board Dynamics Analysis:**
• Top performers drive 2.8x more fundraising success
• High-engagement members provide 65% of strategic innovations
• Meeting attendance correlates with organizational commitment

⚡ **Competitive Intelligence:**
• Innovation gap: competitors scoring 20% higher on tech adoption
• Market opportunity: 40% of similar orgs lack AI integration
• Board development ROI: engaged boards drive 3x better outcomes

🚀 **Strategic AI Applications:**
• Predictive revenue modeling for 95% forecast accuracy
• Board member engagement scoring for targeted development
• Competitive intelligence automation for strategic positioning

🌟 **Visionary Question**: What if you could predict and prevent organizational challenges before they impact your mission? I can show you how strategic AI creates unshakeable competitive advantage...`
    }
  };

  const dataSet = dummyDataSets[role as keyof typeof dummyDataSets] || dummyDataSets.general || dummyDataSets.fundraising;
  
  return `🎉 **${firstName ? `${firstName}, ` : ''}Welcome to AI Magic in Action!** ✨

I just received some sample ${role} data that looks like a complete mess. Watch me work my AI magic to find patterns and insights you'd never spot manually!

${dataSet.data}

---

⚡ **AI Analysis in Progress...**
🔍 Processing patterns...
📊 Cross-referencing metrics...
🎯 Identifying opportunities...
💡 Generating insights...

---

${dataSet.analysis}

**${firstName ? firstName + ', this' : 'This'} is just a tiny glimpse of what AI can do with YOUR real data!** 🤯

Ready to see how we can transform your actual ${role} work with AI? What part of this analysis surprised you most?`;
}
