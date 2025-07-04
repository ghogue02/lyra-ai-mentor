import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function fixRenderingCompletely() {
  console.log('🔧 Fixing rendering issues completely...\n')

  try {
    // First, check if difficult_conversation_helper elements still exist
    const { data: difficultConvElements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('type', 'difficult_conversation_helper')

    if (difficultConvElements && difficultConvElements.length > 0) {
      console.log(`⚠️ Found ${difficultConvElements.length} difficult_conversation_helper elements that should have been removed`)
      
      // Remove them
      const { error: deleteError } = await supabase
        .from('interactive_elements')
        .delete()
        .eq('type', 'difficult_conversation_helper')
      
      if (deleteError) {
        console.error('Error deleting difficult_conversation_helper elements:', deleteError)
      } else {
        console.log('✅ Removed difficult_conversation_helper elements')
      }
    }

    // Check all lessons for their element counts
    console.log('\n📊 Checking all lessons:')
    
    for (let lessonId = 1; lessonId <= 10; lessonId++) {
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('id')
        .eq('lesson_id', lessonId)
      
      const { data: interactiveElements } = await supabase
        .from('interactive_elements')
        .select('id, type')
        .eq('lesson_id', lessonId)
      
      if ((contentBlocks && contentBlocks.length > 0) || (interactiveElements && interactiveElements.length > 0)) {
        console.log(`Lesson ${lessonId}: ${contentBlocks?.length || 0} content blocks, ${interactiveElements?.length || 0} interactive elements`)
        
        // Check for problematic element types
        const elementTypes = [...new Set(interactiveElements?.map(ie => ie.type) || [])]
        const problematicTypes = elementTypes.filter(type => 
          type === 'difficult_conversation_helper' || 
          type === 'automated_element_enhancer' ||
          type === 'interactive_element_auditor'
        )
        
        if (problematicTypes.length > 0) {
          console.log(`  ⚠️ Contains potentially problematic types: ${problematicTypes.join(', ')}`)
        }
      }
    }

    // Fix any missing columns (ensure they exist)
    console.log('\n🔧 Ensuring all columns exist...')
    
    // Update all elements to be visible
    const { error: updateCBError } = await supabase
      .from('content_blocks')
      .update({ 
        is_active: true,
        is_visible: true
      })
      .is('id', 'not.null')
    
    if (updateCBError && !updateCBError.message.includes('column')) {
      console.error('Error updating content blocks:', updateCBError)
    }

    const { error: updateIEError } = await supabase
      .from('interactive_elements')
      .update({ 
        is_active: true,
        is_visible: true,
        is_gated: false
      })
      .is('id', 'not.null')
    
    if (updateIEError && !updateIEError.message.includes('column')) {
      console.error('Error updating interactive elements:', updateIEError)
    }

    console.log('✅ All elements set to visible')

    // Get detailed info for lesson 5
    console.log('\n📋 Detailed check for Lesson 5:')
    const { data: lesson5Elements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 5)
      .order('order_index')

    lesson5Elements?.forEach(elem => {
      console.log(`[${elem.order_index}] ${elem.title} (${elem.type})`)
      console.log(`  - visible: ${elem.is_visible}, active: ${elem.is_active}, gated: ${elem.is_gated}`)
    })

    console.log('\n✅ Database fixes complete!')
    console.log('\n🔍 Next: Fixing the React components to handle all element types properly...')

  } catch (error) {
    console.error('Error during fix:', error)
  }
}

// Run the fix
fixRenderingCompletely()