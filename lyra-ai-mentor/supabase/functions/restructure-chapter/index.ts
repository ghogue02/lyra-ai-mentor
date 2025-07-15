import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RestructureItem {
  id?: number
  type: 'content' | 'interactive' | 'delete' | 'hide'
  order_index: number
  title: string
  action: 'keep' | 'edit' | 'merge' | 'create' | 'delete' | 'hide'
  newContent?: string
  purpose?: string
  elementType?: string
  description?: string
  prompt?: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { plan, lessonId = 5 }: { plan: RestructureItem[], lessonId?: number } = await req.json()
    
    console.log(`Restructuring lesson ${lessonId} with ${plan.length} operations`)
    
    const results = {
      hidden: 0,
      deleted: 0,
      updated: 0,
      created: 0,
      errors: [] as string[]
    }
    
    // First, reset all order indices to high numbers to avoid conflicts
    await supabase
      .from('content_blocks')
      .update({ order_index: 999 })
      .eq('lesson_id', lessonId)
    
    await supabase
      .from('interactive_elements')
      .update({ order_index: 999 })
      .eq('lesson_id', lessonId)
    
    // Process each item in the plan
    for (const item of plan) {
      try {
        switch (item.action) {
          case 'hide': {
            // Hide interactive elements
            const { error } = await supabase
              .from('interactive_elements')
              .update({ is_visible: false, is_active: false })
              .eq('lesson_id', lessonId)
              .eq('title', item.title)
            
            if (!error) results.hidden++
            else results.errors.push(`Failed to hide ${item.title}: ${error.message}`)
            break
          }
          
          case 'delete': {
            // Delete content blocks
            const { error } = await supabase
              .from('content_blocks')
              .delete()
              .eq('lesson_id', lessonId)
              .eq('title', item.title)
            
            if (!error) results.deleted++
            else results.errors.push(`Failed to delete ${item.title}: ${error.message}`)
            break
          }
          
          case 'keep': {
            // Just update order index
            if (item.type === 'content') {
              await supabase
                .from('content_blocks')
                .update({ order_index: item.order_index })
                .eq('lesson_id', lessonId)
                .eq('title', item.title)
            }
            break
          }
          
          case 'edit': {
            if (item.type === 'content' && item.newContent) {
              // Update content block
              const { error } = await supabase
                .from('content_blocks')
                .update({ 
                  content: item.newContent,
                  order_index: item.order_index,
                  title: item.title // Update title too if changed
                })
                .eq('lesson_id', lessonId)
                .eq('order_index', item.id || 999) // Use old order_index to find it
              
              if (!error) results.updated++
              else results.errors.push(`Failed to update ${item.title}: ${error.message}`)
            } else if (item.type === 'interactive') {
              // Update interactive element
              const updates: any = {
                order_index: item.order_index,
                title: item.title
              }
              if (item.description) updates.description = item.description
              if (item.prompt) updates.prompt = item.prompt
              
              await supabase
                .from('interactive_elements')
                .update(updates)
                .eq('lesson_id', lessonId)
                .eq('type', item.elementType!)
                .eq('is_visible', true)
              
              results.updated++
            }
            break
          }
          
          case 'merge': {
            // For merge, we'll update an existing block with combined content
            if (item.newContent) {
              const { error } = await supabase
                .from('content_blocks')
                .update({
                  title: item.title,
                  content: item.newContent,
                  order_index: item.order_index
                })
                .eq('lesson_id', lessonId)
                .ilike('title', '%Hidden Cost%') // Find the first block to merge
              
              if (!error) {
                // Delete the other block
                await supabase
                  .from('content_blocks')
                  .delete()
                  .eq('lesson_id', lessonId)
                  .eq('title', 'The Nonprofit Email Crisis')
                
                results.updated++
              }
            }
            break
          }
          
          case 'create': {
            if (item.type === 'content' && item.newContent) {
              // Create new content block
              const { error } = await supabase
                .from('content_blocks')
                .insert({
                  lesson_id: lessonId,
                  title: item.title,
                  content: item.newContent,
                  order_index: item.order_index,
                  type: 'text'
                })
              
              if (!error) results.created++
              else results.errors.push(`Failed to create ${item.title}: ${error.message}`)
            } else if (item.type === 'interactive') {
              // Create new interactive element
              const elementData: any = {
                lesson_id: lessonId,
                title: item.title,
                type: item.elementType!,
                description: item.description,
                order_index: item.order_index,
                is_visible: true,
                is_active: true,
                is_required: false
              }
              
              // Only add prompt if it exists (some elements may not have it)
              if (item.prompt) {
                elementData.prompt = item.prompt
              }
              
              const { error } = await supabase
                .from('interactive_elements')
                .insert(elementData)
              
              if (!error) results.created++
              else results.errors.push(`Failed to create ${item.title}: ${error.message}`)
            }
            break
          }
        }
      } catch (error) {
        results.errors.push(`Error processing ${item.title}: ${error.message}`)
      }
    }
    
    // Final cleanup: Ensure no duplicate order indices
    const { data: allContent } = await supabase
      .from('content_blocks')
      .select('id, title, order_index')
      .eq('lesson_id', lessonId)
      .order('order_index')
    
    const { data: allElements } = await supabase
      .from('interactive_elements')
      .select('id, title, order_index')
      .eq('lesson_id', lessonId)
      .eq('is_visible', true)
      .order('order_index')
    
    console.log('Restructuring complete:', results)
    console.log('Final content blocks:', allContent?.length)
    console.log('Final interactive elements:', allElements?.length)
    
    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        summary: {
          totalContentBlocks: allContent?.length || 0,
          totalInteractiveElements: allElements?.length || 0,
          operations: {
            hidden: results.hidden,
            deleted: results.deleted,
            updated: results.updated,
            created: results.created
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