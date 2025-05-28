
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from './cors.ts';
import { fetchUserProfile } from './user-profile.ts';
import { buildNaturalSystemMessage } from './system-message.ts';
import { createOpenAIStreamingResponse } from './openai-client.ts';
import type { ChatRequest } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const {
      messages,
      lessonContext,
      conversationId,
      userId,
      lessonId,
      isDummyDataRequest
    }: ChatRequest = await req.json();

    console.log('Received chat request:', { 
      messagesCount: messages.length, 
      lessonContext, 
      conversationId,
      userId,
      lessonId,
      isDummyDataRequest
    });

    // Fetch user profile data
    const userProfile = await fetchUserProfile(userId);

    // Handle AI Magic Demo requests with simple detection
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    const isDemoRequest = isDummyDataRequest || 
      lastMessage.toLowerCase().includes('ai transforms') ||
      lastMessage.toLowerCase().includes('ai magic') ||
      lastMessage.toLowerCase().includes('show me how ai') ||
      lastMessage.toLowerCase().includes('fundraising data');
    
    if (isDemoRequest) {
      console.log('Processing demo request');
      
      const demoResponse = `**AI Data Analysis Demo**

Let me show you how AI transforms raw fundraising data into actionable insights!

**Step 1: Data Processing**
===FUNDRAISING_DATA_EXPORT===

| Donor Name          | Type      | Last Gift | Date     | Engagement | Lifetime Value | Status   | Trend |
|---------------------|-----------|-----------|----------|------------|----------------|----------|-------|
| Patricia Martinez   | Major     | $2,500    | 12/15/24 | 95%        | $24,000        | VIP      | UP    |
| James Chen          | Mid-level | $1,000    | 11/22/24 | 78%        | $8,000         | Active   | STABLE|
| Sarah Williams      | Regular   | $500      | 10/30/24 | 45%        | $3,500         | At-Risk  | DOWN  |
| Michael Rodriguez   | Major     | $5,000    | 09/18/24 | 62%        | $45,000        | At-Risk  | DOWN  |
| Lisa Thompson       | Mid-level | $750      | 12/12/24 | 88%        | $12,600        | Active   | UP    |
| David Kim           | Regular   | $150      | 12/01/24 | 72%        | $150           | New      | UP    |
| Jennifer Walsh      | Major     | $3,200    | 11/28/24 | 92%        | $78,000        | VIP      | STABLE|
| Robert Jackson      | Regular   | $425      | 11/15/24 | 68%        | $6,800         | Active   | STABLE|
| Amanda Foster       | Mid-level | $1,800    | 12/05/24 | 84%        | $5,400         | Active   | UP    |
| Thomas Brown        | Regular   | $95       | 08/20/24 | 38%        | $1,200         | At-Risk  | DOWN  |
| Emily Carter        | Major     | $2,800    | 12/18/24 | 89%        | $18,400        | VIP      | UP    |
| Carlos Mendez       | Mid-level | $650      | 11/30/24 | 75%        | $9,200         | Active   | STABLE|
| Rachel Green        | Regular   | $180      | 12/22/24 | 82%        | $820           | New      | UP    |
| Daniel Wright       | Major     | $4,500    | 10/15/24 | 67%        | $89,000        | At-Risk  | DOWN  |
| Maria Gonzalez      | Regular   | $320      | 12/14/24 | 91%        | $2,850         | Active   | UP    |
| Kevin O'Brien       | Mid-level | $1,200    | 11/08/24 | 86%        | $7,800         | Active   | UP    |
| Susan Lee           | Regular   | $75       | 07/12/24 | 42%        | $2,100         | At-Risk  | DOWN  |
| Jonathan Davis      | Major     | $3,750    | 12/20/24 | 94%        | $28,500        | VIP      | UP    |
| Angela White        | Mid-level | $890      | 11/25/24 | 79%        | $11,200        | Active   | STABLE|
| Brian Miller        | Regular   | $245      | 12/02/24 | 76%        | $395           | New      | UP    |

===END_DATA===

**Step 2: AI Pattern Recognition**
AI Analysis in Progress...
- Processing 20 donor records
- Cross-referencing giving history patterns
- Analyzing engagement correlation with gift amounts
- Identifying relationship opportunities
- Calculating lifetime value predictions
- Detecting at-risk donor patterns

**Step 3: Key Insights Discovered**

**CRITICAL PATTERNS IDENTIFIED:**

**Major Donor Opportunities:**
- Patricia Martinez (95% engagement): Ready for $10K+ major gift ask
- Jonathan Davis (94% engagement): Consistent major donor, cultivation priority
- Jennifer Walsh (92% engagement): Board member, potential planned giving prospect

**Revenue Optimization Targets:**
- Monthly donors show 67% higher lifetime value than annual donors
- High-engagement mid-level donors (Kevin O'Brien, Amanda Foster) prime for upgrade campaigns
- 30% of donors have engagement scores above 80% - focus cultivation here

**At-Risk Donor Alert:**
- Michael Rodriguez: $45K lifetime donor, declining engagement (62%)
- Daniel Wright: $89K lifetime donor, contact lapsed since October
- Susan Lee: 9-year donor showing significant decline pattern

**Step 4: Actionable Recommendations**

**THIS WEEK'S PRIORITY ACTIONS:**

1. **IMMEDIATE MAJOR GIFT OPPORTUNITIES**
   - Call Patricia Martinez: Schedule face-to-face meeting (Potential: $10,000)
   - Reach out to Jonathan Davis: Year-end giving conversation (Potential: $5,000+)

2. **AT-RISK DONOR INTERVENTION**
   - Personal outreach to Michael Rodriguez: Impact report + phone call
   - Schedule coffee meeting with Daniel Wright: Re-engagement strategy
   - Send personalized thank you note to Susan Lee: Show appreciation

3. **ENGAGEMENT OPTIMIZATION**
   - Launch monthly giving upgrade campaign for quarterly donors
   - Create VIP appreciation event for 95%+ engagement donors
   - Implement stewardship sequence for new donors (David Kim, Rachel Green, Brian Miller)

4. **DATA-DRIVEN INSIGHTS**
   - Focus cultivation efforts on 80%+ engagement donors (6 identified)
   - Develop retention strategy for 60-79% engagement group
   - Create re-engagement campaign for sub-60% engagement donors

**PROJECTED IMPACT:**
- Potential additional revenue: $25,000-$40,000 in next 90 days
- Donor retention improvement: 15-20% through targeted interventions
- Major gift pipeline: 3 qualified prospects identified for cultivation

This is how AI transforms hours of manual analysis into immediate, actionable insights that drive measurable fundraising results!`;

      return new Response(JSON.stringify({ generatedText: demoResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build system message and create OpenAI request for regular chat
    const systemMessage = {
      role: 'system',
      content: buildNaturalSystemMessage(userProfile, lessonContext)
    };

    console.log('Generated natural system message for user:', {
      hasProfile: !!userProfile,
      role: userProfile?.role,
      messageLength: systemMessage.content.length
    });

    return await createOpenAIStreamingResponse([systemMessage, ...messages]);

  } catch (error) {
    console.error('Error in chat-with-lyra function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
