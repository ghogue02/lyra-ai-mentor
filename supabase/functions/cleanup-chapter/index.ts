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
    
    console.log('Starting comprehensive chapter cleanup...')
    
    // 1. Delete duplicate "Maya Discovers" blocks (keep only ID 54)
    const duplicateIds = [134, 73, 57, 65, 55, 64, 56]
    let deletedCount = 0
    
    for (const id of duplicateIds) {
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', id)
      
      if (!error) deletedCount++
    }
    
    // 2. Fix missing Sarah's Schedule Concern block (should be at order 70)
    const { data: parentBlock } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .eq('title', "Maya's First Test: The Concerned Parent Email")
      .single()
    
    if (parentBlock) {
      await supabase
        .from('content_blocks')
        .update({ order_index: 70 })
        .eq('id', parentBlock.id)
    }
    
    // 3. Update interactive element titles and ensure board element exists
    await supabase
      .from('interactive_elements')
      .update({ 
        title: "Help Maya Respond to Sarah",
        description: "Sarah Chen is worried about the new 5:30 PM pickup time. Help Maya craft a response that balances empathy, explanation, and solutions."
      })
      .eq('lesson_id', 5)
      .eq('type', 'ai_email_composer')
      .eq('order_index', 80)
    
    await supabase
      .from('interactive_elements')
      .update({ 
        title: "Coffee Chat with Lyra: Your Challenges",
        description: "Join Maya in exploring how Lyra can help with your specific nonprofit challenges."
      })
      .eq('lesson_id', 5)
      .eq('type', 'lyra_chat')
    
    // 4. Create board communication element if missing
    const { data: boardExists } = await supabase
      .from('interactive_elements')
      .select('id')
      .eq('lesson_id', 5)
      .eq('order_index', 140)
      .single()
    
    if (!boardExists) {
      await supabase
        .from('interactive_elements')
        .insert({
          lesson_id: 5,
          title: "Maya's Board Communication Challenge",
          type: 'ai_email_composer',
          description: "Help Maya respond to Board Chair Patricia Williams' urgent concerns about program funding.",
          order_index: 140,
          is_visible: true,
          is_active: true,
          is_required: false
        })
    }
    
    // 5. Final verification
    const { data: finalBlocks } = await supabase
      .from('content_blocks')
      .select('id, title, order_index')
      .eq('lesson_id', 5)
      .lte('order_index', 200)
      .order('order_index')
    
    const { data: finalElements } = await supabase
      .from('interactive_elements')
      .select('id, title, order_index')
      .eq('lesson_id', 5)
      .eq('is_visible', true)
      .order('order_index')
    
    return new Response(
      JSON.stringify({ 
        success: true,
        results: {
          deletedDuplicates: deletedCount,
          totalContentBlocks: finalBlocks?.length || 0,
          totalInteractiveElements: finalElements?.length || 0,
          structure: {
            contentBlocks: finalBlocks?.map(b => `${b.order_index}. ${b.title}`),
            interactiveElements: finalElements?.map(e => `${e.order_index}. ${e.title}`)
          }
        }
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