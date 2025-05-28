
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
      
      const demoResponse = `🎯 **AI Data Analysis Demo**

Let me show you how AI transforms raw fundraising data into actionable insights!

**Step 1: Data Processing**
===FUNDRAISING_DATA_EXPORT===
Donor Name,Last Gift,Gift Amount,Contact Frequency,Engagement Score
Patricia Martinez,$2,500,Monthly,High
James Chen,$1,000,Quarterly,Medium  
Sarah Williams,$500,Annually,Low
Michael Rodriguez,$5,000,Bi-annually,High
Lisa Thompson,$750,Monthly,Medium
===END_DATA===

**Step 2: AI Pattern Recognition**
🔍 AI Analysis in Progress...
Processing donor patterns...
Cross-referencing giving history...
Identifying relationship opportunities...
Calculating lifetime value predictions...

**Step 3: Key Insights Discovered**
💡 **PATTERNS DISCOVERED**

**Hidden Revenue Opportunities:**
• Patricia Martinez: Ready for major gift ask ($10K+ potential)
• Michael Rodriguez: Lapsed major donor, re-engagement priority
• Monthly donors show 3x higher lifetime value

**Revenue Optimization Targets:**
• Target quarterly donors for monthly upgrades (+40% revenue)
• Focus on high-engagement, low-amount donors for increases
• Implement appreciation campaigns for $1K+ donors

**Step 4: Actionable Recommendations**
✅ **This Week's Action Items:**

1. **Call Patricia Martinez** - Schedule major gift meeting (Est. $10,000 ask)
2. **Send personalized note** to Michael Rodriguez about impact
3. **Launch monthly upgrade campaign** for quarterly donors
4. **Create donor appreciation event** for $1K+ contributors

This is how AI transforms hours of manual analysis into immediate, actionable insights that drive results!`;

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
