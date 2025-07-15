import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function checkLesson5Ids() {
  console.log('🔍 Checking lesson 5 element IDs and visibility...\n')

  // Get ALL elements from lesson 5 with their current state
  const { data: allElements } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .order('order_index')

  console.log('All interactive elements in lesson 5:')
  allElements?.forEach(e => {
    console.log(`ID: ${e.id} | Type: ${e.type} | Title: ${e.title}`)
    console.log(`  Visible: ${e.is_visible} | Active: ${e.is_active} | Gated: ${e.is_gated}`)
    console.log('')
  })

  // Check if the problematic types exist
  const problematicInLesson5 = allElements?.filter(e => 
    ['difficult_conversation_helper', 'interactive_element_auditor', 'automated_element_enhancer'].includes(e.type)
  )

  if (problematicInLesson5 && problematicInLesson5.length > 0) {
    console.log('⚠️ Problematic elements found in lesson 5:')
    problematicInLesson5.forEach(e => {
      console.log(`- ID ${e.id}: ${e.type}`)
    })
    
    // Try to update them directly
    console.log('\n🔧 Attempting direct update...')
    
    for (const elem of problematicInLesson5) {
      const { data, error } = await supabase
        .from('interactive_elements')
        .update({ 
          is_visible: false,
          is_active: false
        })
        .eq('id', elem.id)
        .select()
      
      if (error) {
        console.log(`❌ Failed to update ID ${elem.id}: ${error.message}`)
      } else if (data && data.length > 0) {
        console.log(`✅ Updated ID ${elem.id} - is_visible: ${data[0].is_visible}`)
      }
    }
  }

  // Final verification
  console.log('\n📊 Final verification:')
  const { data: finalCheck } = await supabase
    .from('interactive_elements')
    .select('id, type, is_visible, is_active')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    
  console.log('Elements still marked as visible:')
  finalCheck?.forEach(e => {
    console.log(`- ID ${e.id}: ${e.type}`)
  })
}

checkLesson5Ids().catch(console.error)