import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key (automatically available in Edge Functions)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action } = await req.json()

    if (action === 'fix-maya-lesson') {
      console.log('Fixing Maya lesson content...')
      
      // Fix 1: Enter the AI Email Revolution
      const revolutionContent = `What Maya discovers today will transform not just her Monday mornings, but her entire approach to communication. AI isn't about replacing the human touch that makes her messages meaningful—it's about amplifying her natural empathy and expertise while eliminating the time-consuming struggle with tone, structure, and wording.

In the next 20 minutes, Maya will master practical AI tools that will revolutionize her email communication: the AI Email Composer that helps her craft professional, personalized messages in any tone or situation, and personalized AI guidance through Lyra Chat to navigate her specific communication challenges. These tools preserve Maya's authentic voice while dramatically improving her efficiency and confidence.

By the end of this lesson, you'll have the same capabilities Maya gains - turning email anxiety into email mastery, one message at a time.`

      const { error: error1 } = await supabase
        .from('content_blocks')
        .update({ content: revolutionContent })
        .eq('lesson_id', 5)
        .eq('title', 'Enter the AI Email Revolution')

      // Fix 2: Your Email Pain Points - remove James reference
      const { data: painPointsBlock } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('lesson_id', 5)
        .eq('title', 'Your Email Pain Points')
        .single()

      if (painPointsBlock && painPointsBlock.content.includes('James')) {
        const fixedReflection = painPointsBlock.content.replace(
          'Or perhaps you\'re like James (our development associate), who worries about striking the right tone with major donors?',
          'Or perhaps you worry about striking the right tone with major donors and key stakeholders?'
        )
        
        await supabase
          .from('content_blocks')
          .update({ content: fixedReflection })
          .eq('id', painPointsBlock.id)
      }

      // Fix 3: Maya's Transformation Begins
      const transformContent = `Ready to transform your Monday mornings—and every email interaction—just like Maya? Let's discover how AI can turn your communication challenges into your greatest strengths. Your journey to email mastery begins right now.`

      await supabase
        .from('content_blocks')
        .update({ content: transformContent })
        .eq('lesson_id', 5)
        .eq('title', 'Maya\'s Transformation Begins')

      // Fix 4: Meet Your Nonprofit Heroes
      const heroesContent = `Throughout this course, you'll follow the journeys of nonprofit professionals facing real challenges just like yours. 

Today, you're meeting **Maya Rodriguez**, Program Manager at Hope Gardens Community Center. Maya's story will guide you through mastering AI-powered email communication - from handling concerned parents to managing board communications with confidence.

In the next lesson, you'll meet **James Chen**, who will show you how to conquer document creation challenges. Each character's story teaches practical AI skills you can apply immediately in your own nonprofit work.`

      await supabase
        .from('content_blocks')
        .update({ content: heroesContent })
        .eq('lesson_id', 5)
        .eq('title', 'Meet Your Nonprofit Heroes')

      // Fix 5: Character Transformation Outcomes
      const outcomesContent = `By the end of this lesson, here's what you'll achieve alongside Maya:

**Maya Rodriguez (Email Communication Master)**
- Transform from spending 2+ hours on email to handling her inbox in 30 minutes
- Write compelling program updates that inspire parents and board members
- Handle difficult conversations with confidence and empathy
- Build templates that make future communications effortless

Your transformation starts with mastering email communication - the foundation of nonprofit relationship building. Ready to begin?`

      await supabase
        .from('content_blocks')
        .update({ content: outcomesContent })
        .eq('lesson_id', 5)
        .eq('title', 'Character Transformation Outcomes')

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Maya lesson content fixed successfully',
          fixes: [
            'Removed "four tools" promise - now accurately describes 2 tools',
            'Removed James reference from reflection',
            'Removed character list from transformation section',
            'Focused hero introduction on Maya with James preview',
            'Limited outcomes to Maya only'
          ]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})