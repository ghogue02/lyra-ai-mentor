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

    const { action, jobType, inputData, jobId } = await req.json();

    console.log('Content scaling request:', { action, jobType, inputData, jobId });

    if (action === 'start') {
      // Create new scaling job
      const { data: job, error } = await supabase
        .from('content_scaling_jobs')
        .insert({
          user_id: req.headers.get('x-user-id') || 'anonymous',
          job_type: jobType,
          input_data: inputData,
          status: 'processing'
        })
        .select()
        .single();

      if (error) throw error;

      // Process the scaling job
      EdgeRuntime.waitUntil(processScalingJob(job.id, jobType, inputData));

      return new Response(JSON.stringify({
        success: true,
        jobId: job.id,
        status: 'processing'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'status') {
      // Get job status
      const { data: job, error } = await supabase
        .from('content_scaling_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        job
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'list') {
      // List user's jobs
      const { data: jobs, error } = await supabase
        .from('content_scaling_jobs')
        .select('*')
        .eq('user_id', req.headers.get('x-user-id') || 'anonymous')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        jobs
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error('Error in content-scaling:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Content scaling failed',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processScalingJob(jobId: string, jobType: string, inputData: any) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  try {
    console.log(`Processing scaling job ${jobId} of type ${jobType}`);

    let scalingResults: any = {};

    if (jobType === 'pattern-application') {
      // Apply successful patterns to multiple chapters/characters
      const { patterns, targetChapters, targetCharacters } = inputData;
      
      scalingResults = await applyPatternsToTargets(patterns, targetChapters, targetCharacters);
    } else if (jobType === 'content-generation') {
      // Generate content for multiple scenarios
      const { baseContent, variations } = inputData;
      
      scalingResults = await generateContentVariations(baseContent, variations);
    } else if (jobType === 'assessment-creation') {
      // Create assessments based on successful patterns
      const { patterns, assessmentTypes } = inputData;
      
      scalingResults = await createAssessments(patterns, assessmentTypes);
    }

    // Update job with results
    await supabase
      .from('content_scaling_jobs')
      .update({
        status: 'completed',
        output_data: scalingResults,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    console.log(`Scaling job ${jobId} completed successfully`);

  } catch (error) {
    console.error(`Error processing scaling job ${jobId}:`, error);
    
    await supabase
      .from('content_scaling_jobs')
      .update({
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }
}

async function applyPatternsToTargets(patterns: any, targetChapters: any[], targetCharacters: any[]) {
  const results = [];
  
  for (const chapter of targetChapters) {
    for (const character of targetCharacters) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `Apply successful Maya patterns to create engaging content for ${character.name} in Chapter ${chapter.title}. 
              Maintain the character's unique personality while leveraging proven engagement strategies.`
            },
            {
              role: 'user',
              content: `Apply these successful patterns: ${JSON.stringify(patterns)} 
              to create content for ${character.name} in "${chapter.title}"`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      const data = await response.json();
      results.push({
        chapter: chapter.title,
        character: character.name,
        adaptedContent: data.choices[0].message.content,
        timestamp: new Date().toISOString()
      });
    }
  }

  return { appliedPatterns: results, totalVariations: results.length };
}

async function generateContentVariations(baseContent: any, variations: any[]) {
  const results = [];
  
  for (const variation of variations) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `Create a variation of the base content with these modifications: ${JSON.stringify(variation)}`
          },
          {
            role: 'user',
            content: `Base content: ${JSON.stringify(baseContent)}`
          }
        ],
        temperature: 0.6,
        max_tokens: 1200
      }),
    });

    const data = await response.json();
    results.push({
      variationType: variation.type,
      generatedContent: data.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  }

  return { contentVariations: results, totalVariations: results.length };
}

async function createAssessments(patterns: any, assessmentTypes: any[]) {
  const results = [];
  
  for (const assessmentType of assessmentTypes) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `Create a ${assessmentType.type} assessment based on successful learning patterns. 
            Include clear objectives, engaging questions, and effective feedback mechanisms.`
          },
          {
            role: 'user',
            content: `Create assessment based on these patterns: ${JSON.stringify(patterns)}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      }),
    });

    const data = await response.json();
    results.push({
      assessmentType: assessmentType.type,
      assessment: data.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  }

  return { assessments: results, totalAssessments: results.length };
}