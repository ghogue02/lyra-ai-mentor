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
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, data } = await req.json()

    switch (action) {
      case 'update-content-block': {
        const { lessonId, title, content } = data
        const { error } = await supabase
          .from('content_blocks')
          .update({ content })
          .eq('lesson_id', lessonId)
          .eq('title', title)

        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, message: 'Content block updated' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-interactive-element': {
        const { elementId, updates } = data
        
        // Map field names to actual schema
        const mappedUpdates: any = {}
        if (updates.title) mappedUpdates.title = updates.title
        if (updates.description) mappedUpdates.content = updates.description
        if (updates.content) mappedUpdates.content = updates.content
        if (updates.config) mappedUpdates.configuration = updates.config
        if (updates.configuration) mappedUpdates.configuration = updates.configuration
        if (updates.prompt) {
          // If there's a prompt, include it in the content
          mappedUpdates.content = updates.prompt
        }
        
        const { error } = await supabase
          .from('interactive_elements')
          .update(mappedUpdates)
          .eq('id', elementId)

        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, message: 'Interactive element updated' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'hide-admin-elements': {
        const { lessonIds, elementTypes } = data
        const { error } = await supabase
          .from('interactive_elements')
          .update({ is_visible: false, is_active: false })
          .in('lesson_id', lessonIds)
          .in('type', elementTypes)

        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, message: 'Admin elements hidden' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'create-interactive-element': {
        const { element } = data
        
        // Remove any fields that might not exist in the schema
        const cleanElement = {
          lesson_id: element.lesson_id,
          title: element.title,
          type: element.type,
          description: element.description,
          order_index: element.order_index,
          is_visible: element.is_visible !== false,
          is_active: element.is_active !== false,
          is_required: element.is_required || false
        }
        
        const { error } = await supabase
          .from('interactive_elements')
          .insert(cleanElement)

        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, message: 'Interactive element created' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'batch-update': {
        const { updates } = data
        const results = []

        for (const update of updates) {
          try {
            if (update.table === 'content_blocks') {
              // Use upsert to handle both insert and update
              await supabase
                .from('content_blocks')
                .upsert(update.data, { onConflict: 'lesson_id,title' })
            } else if (update.table === 'interactive_elements') {
              await supabase
                .from('interactive_elements')
                .update(update.data)
                .match(update.match)
            }
            results.push({ success: true, update })
          } catch (error) {
            results.push({ success: false, update, error: error.message })
          }
        }

        return new Response(
          JSON.stringify({ success: true, results }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})