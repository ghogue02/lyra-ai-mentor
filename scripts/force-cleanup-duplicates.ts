import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function forceCleanup() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🧹 Force cleaning duplicates via Edge Function...\n')
  
  // Create a new Edge Function specifically for cleanup
  const cleanupCode = `
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
    
    // Delete duplicates, keeping only the first one (ID: 54)
    const duplicateIds = [134, 73, 57, 65, 55, 64, 56]
    
    for (const id of duplicateIds) {
      await supabase
        .from('content_blocks')
        .delete()
        .eq('id', id)
    }
    
    // Also fix the missing parent context block if needed
    const { data: parentBlock } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .eq('title', "Maya's First Test: The Concerned Parent Email")
      .single()
    
    if (parentBlock && parentBlock.order_index === 999) {
      await supabase
        .from('content_blocks')
        .update({ order_index: 70 })
        .eq('id', parentBlock.id)
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Duplicates cleaned and order fixed',
        deletedCount: duplicateIds.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
`

  // For now, let's use a simpler approach with existing Edge Function
  // We'll delete the duplicates one by one
  const duplicateIds = [134, 73, 57, 65, 55, 64, 56]
  
  console.log(`Deleting ${duplicateIds.length} duplicate blocks...`)
  
  for (const id of duplicateIds) {
    try {
      await supabase
        .from('content_blocks')
        .delete()
        .eq('id', id)
      console.log(`Deleted block ID: ${id}`)
    } catch (error) {
      // Try via Edge Function if direct delete fails
      console.log(`Direct delete failed for ID ${id}, trying Edge Function...`)
      
      const { error: funcError } = await supabase.functions.invoke('content-manager', {
        body: {
          action: 'batch-update',
          data: {
            updates: [{
              table: 'content_blocks',
              data: { order_index: 999 },  // Move to 999 instead of delete
              match: { id: id }
            }]
          }
        }
      })
      
      if (!funcError) {
        console.log(`Moved block ID ${id} to order 999`)
      }
    }
  }
  
  console.log('\n✅ Cleanup complete!')
}

forceCleanup().catch(console.error)