import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Adding parent context to Maya\'s lesson...')
    
    // First, shift existing blocks with order_index >= 45
    await supabase
      .from('content_blocks')
      .update({ order_index: 999 }) // Temporary high number
      .eq('lesson_id', 5)
      .gte('order_index', 45)
    
    // Insert the new context block
    const contextBlock = {
      lesson_id: 5,
      title: "Maya's First Test: The Concerned Parent Email",
      content: `Just as Maya finishes reading about the AI Email Composer's capabilities, her phone buzzes with an urgent notification. Sarah Chen, a parent whose daughter Emma attends the after-school program, has sent a concerned email about the new pickup schedule that was announced last week.

Sarah's message is polite but clearly worried: "I just saw the notice about the new 5:30 PM pickup time. As a single parent working until 6 PM downtown, I'm really concerned about how this will work for Emma and me. Is there any flexibility? I don't want her to lose her spot in the program..."

This is exactly the kind of email that usually takes Maya 30 minutes to craft - she needs to balance empathy for Sarah's situation, clearly explain the reasons for the change, offer practical solutions, and maintain professional boundaries while keeping that warm, personal touch parents appreciate.

In the past, Maya would have stared at the blank screen, typed and deleted several openings, worried about sounding too rigid or too casual, and probably put it off until after lunch. But now, with AI assistance, she can respond thoughtfully and effectively in just minutes. Let's help Maya craft the perfect response...`,
      order_index: 45,
      type: 'text'
    }
    
    const { error: insertError } = await supabase
      .from('content_blocks')
      .insert(contextBlock)
    
    if (insertError) {
      console.error('Insert error:', insertError)
      // Try upsert instead
      const { error: upsertError } = await supabase
        .from('content_blocks')
        .upsert(contextBlock, { onConflict: 'lesson_id,title' })
      
      if (upsertError) throw upsertError
    }
    
    // Fix the order indices for shifted blocks
    await supabase
      .rpc('increment_order_indices', {
        p_lesson_id: 5,
        p_min_order: 46,
        p_increment: 5
      })
      .then(() => {
        // If RPC doesn't exist, do it manually
        return supabase
          .from('content_blocks')
          .update({ order_index: 50 })
          .eq('lesson_id', 5)
          .eq('order_index', 999)
      })
    
    // Update the interactive element description
    const { data: element } = await supabase
      .from('interactive_elements')
      .select('id')
      .eq('lesson_id', 5)
      .eq('title', 'Help Maya Write the Parent Response')
      .single()
    
    if (element) {
      await supabase
        .from('interactive_elements')
        .update({
          description: "Sarah Chen is worried about the new 5:30 PM pickup time. Help Maya craft a response that acknowledges Sarah's concerns, explains the reasons for the change, and offers practical solutions while maintaining warmth and professionalism.",
          prompt: "I need to respond to a concerned parent email. Sarah Chen is worried about our new 5:30 PM pickup time (moved from 6:00 PM) because she works until 6 PM downtown. She's afraid her daughter Emma will lose her spot in our after-school program. I need to acknowledge her concerns, explain that the change was necessary due to staff scheduling and safety protocols, offer solutions (like our extended care option until 6:30 PM for a small fee, or connecting her with other parents for carpooling), and maintain a warm, understanding tone while being professional. The response should be empathetic but also clear about our policies."
        })
        .eq('id', element.id)
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Parent context added successfully',
        changes: [
          'Added context block introducing Sarah Chen\'s email',
          'Updated interactive element description',
          'Added detailed prompt for AI assistance'
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})