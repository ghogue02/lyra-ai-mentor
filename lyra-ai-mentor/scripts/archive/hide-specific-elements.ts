import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function hideSpecificElements() {
  console.log('🎯 Hiding specific problematic elements...\n')

  // Specific IDs we found that are problematic
  const problematicIds = [69, 77, 91, 105, 119, 132, 142]
  
  console.log('Hiding elements by ID...')
  for (const id of problematicIds) {
    const { error } = await supabase
      .from('interactive_elements')
      .update({ 
        is_visible: false,
        is_active: false
      })
      .eq('id', id)
    
    if (!error) {
      console.log(`✅ Hidden element ID ${id}`)
    } else {
      console.log(`❌ Failed to hide ID ${id}: ${error.message}`)
    }
  }

  // Also hide by type just to be sure
  const problematicTypes = [
    'difficult_conversation_helper',
    'interactive_element_auditor',
    'automated_element_enhancer'
  ]

  console.log('\nHiding elements by type...')
  for (const type of problematicTypes) {
    const { data, error } = await supabase
      .from('interactive_elements')
      .update({ 
        is_visible: false,
        is_active: false
      })
      .eq('type', type)
      .select('id')
    
    if (!error && data) {
      console.log(`✅ Hidden ${data.length} ${type} elements`)
    }
  }

  // Final check for lesson 5
  console.log('\n📋 Final check for lesson 5:')
  
  const { data: visibleElements } = await supabase
    .from('interactive_elements')
    .select('id, title, type')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .eq('is_active', true)
    .order('order_index')
  
  console.log('Visible interactive elements:')
  visibleElements?.forEach(e => {
    console.log(`- ${e.title} (${e.type})`)
  })
  
  console.log(`\nTotal visible: ${visibleElements?.length || 0}`)
  
  // Count content blocks too
  const { count: cbCount } = await supabase
    .from('content_blocks')
    .select('*', { count: 'exact', head: true })
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .eq('is_active', true)
  
  console.log(`Content blocks: ${cbCount || 0}`)
  console.log(`Expected total elements: ${(cbCount || 0) + (visibleElements?.length || 0)}`)
}

hideSpecificElements().catch(console.error)