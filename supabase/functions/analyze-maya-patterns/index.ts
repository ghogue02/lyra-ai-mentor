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

    const { analysisType, dateRange, conversationIds } = await req.json();

    console.log('Starting Maya pattern analysis:', { analysisType, dateRange, conversationIds });

    // Fetch Maya Chapter 2 interaction data
    let query = supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_messages:chat_messages(*)
      `)
      .eq('chapter_id', 2);

    if (conversationIds && conversationIds.length > 0) {
      query = query.in('id', conversationIds);
    }

    if (dateRange) {
      query = query.gte('created_at', dateRange.start).lte('created_at', dateRange.end);
    }

    const { data: conversations, error } = await query;

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    console.log(`Found ${conversations?.length || 0} conversations to analyze`);

    // Prepare data for OpenAI analysis
    const conversationData = conversations?.map(conv => ({
      id: conv.id,
      title: conv.title,
      messageCount: conv.message_count,
      duration: new Date(conv.last_message_at).getTime() - new Date(conv.started_at).getTime(),
      messages: conv.chat_messages.map((msg: any) => ({
        isUser: msg.is_user_message,
        content: msg.content,
        timestamp: msg.created_at
      }))
    })) || [];

    // Analyze with OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert educational content analyst. Analyze Maya Chapter 2 conversation data to identify:
            1. Common interaction patterns that led to successful learning outcomes
            2. Key engagement strategies that worked well
            3. Conversation flow frameworks that can be replicated
            4. Learning preference patterns
            5. Successful challenge resolution approaches
            
            Focus on extracting actionable patterns that can be applied to other characters and chapters.`
          },
          {
            role: 'user',
            content: `Analyze these Maya Chapter 2 conversations for ${analysisType} patterns:\n\n${JSON.stringify(conversationData, null, 2)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    const aiData = await openAIResponse.json();
    
    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', aiData);
      throw new Error(`OpenAI API error: ${aiData.error?.message || 'Unknown error'}`);
    }

    const analysisResults = aiData.choices[0].message.content;

    // Generate recommendations based on analysis
    const recommendationsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Based on the Maya pattern analysis, provide specific, actionable recommendations for scaling successful patterns to other characters and chapters. Format as structured JSON with categories and specific implementation steps.'
          },
          {
            role: 'user',
            content: `Based on this analysis, generate specific recommendations:\n\n${analysisResults}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      }),
    });

    const recData = await recommendationsResponse.json();
    const recommendations = recData.choices[0].message.content;

    // Calculate confidence score based on data quality
    const confidenceScore = Math.min(
      (conversationData.length / 10) * 0.4 + // Data volume
      (conversationData.reduce((sum, conv) => sum + conv.messages.length, 0) / conversationData.length / 20) * 0.3 + // Message depth
      0.3, // Base confidence
      1.0
    );

    // Store results in database
    const { data: result, error: insertError } = await supabase
      .from('maya_analysis_results')
      .insert({
        user_id: req.headers.get('x-user-id') || 'anonymous',
        analysis_type: analysisType,
        source_data: conversationData,
        analysis_results: { analysis: analysisResults, patterns: analysisResults },
        recommendations: { recommendations },
        confidence_score: confidenceScore
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing analysis results:', insertError);
      throw insertError;
    }

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      analysisId: result.id,
      analysis: analysisResults,
      recommendations,
      confidenceScore,
      dataPoints: conversationData.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-maya-patterns:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Analysis failed',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});