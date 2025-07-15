import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function forceDeleteProblematic() {
  console.log('🔨 Force deleting problematic elements...\n')

  // First, delete any related records that might be preventing deletion
  const problematicIds = [69, 132, 142] // The IDs we found

  console.log('Cleaning up related records...')
  
  // Delete from lesson_progress_detailed first
  for (const id of problematicIds) {
    await supabase
      .from('lesson_progress_detailed')
      .delete()
      .eq('interactive_element_id', id)
  }

  // Delete from ai_chat_conversations
  for (const id of problematicIds) {
    await supabase
      .from('ai_chat_conversations')
      .delete()
      .eq('element_id', id)
  }

  // Now try to delete the elements again
  console.log('\nDeleting interactive elements...')
  
  // Method 1: Delete by ID
  for (const id of problematicIds) {
    const { data, error } = await supabase
      .from('interactive_elements')
      .delete()
      .eq('id', id)
      .select()
    
    if (error) {
      console.log(`❌ Error deleting ID ${id}: ${error.message}`)
    } else {
      console.log(`✅ Deleted ID ${id}`)
    }
  }

  // Method 2: Delete by type
  const problematicTypes = ['difficult_conversation_helper', 'interactive_element_auditor', 'automated_element_enhancer']
  
  for (const type of problematicTypes) {
    const { data, error } = await supabase
      .from('interactive_elements')
      .delete()
      .eq('type', type)
      .select()
    
    if (!error && data && data.length > 0) {
      console.log(`✅ Deleted ${data.length} ${type} elements`)
    }
  }

  // Verify they're gone
  console.log('\n🔍 Verifying deletion...')
  
  const { data: remaining } = await supabase
    .from('interactive_elements')
    .select('id, type, title')
    .in('type', problematicTypes)

  if (remaining && remaining.length > 0) {
    console.log(`❌ Still found ${remaining.length} problematic elements:`)
    remaining.forEach(e => {
      console.log(`  - ID: ${e.id}, Type: ${e.type}, Title: ${e.title}`)
    })
    
    // If they still exist, try setting them to invisible as a workaround
    console.log('\n🔧 Setting remaining elements to invisible...')
    
    for (const elem of remaining) {
      await supabase
        .from('interactive_elements')
        .update({ is_visible: false })
        .eq('id', elem.id)
    }
  } else {
    console.log('✅ All problematic elements successfully deleted!')
  }

  // Final check of lesson 5
  const { data: lesson5Final } = await supabase
    .from('interactive_elements')
    .select('id, type, title, is_visible')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')

  console.log('\n📋 Final visible interactive elements in lesson 5:')
  lesson5Final?.forEach(e => {
    console.log(`- ${e.title} (${e.type})`)
  })
  
  console.log(`\nTotal visible: ${lesson5Final?.length || 0}`)
}

forceDeleteProblematic().catch(console.error)