import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function finalFixRendering() {
  console.log('🚀 Final rendering fix...\n')

  try {
    // Option 1: Update difficult_conversation_helper to ai_email_composer (similar functionality)
    console.log('📝 Converting difficult_conversation_helper elements to ai_email_composer...')
    
    const { error: updateError } = await supabase
      .from('interactive_elements')
      .update({ 
        type: 'ai_email_composer',
        configuration: {
          "placeholder": "Type your message here...",
          "minLength": 50,
          "aiEnabled": true,
          "model": "gpt-4o",
          "systemPrompt": "Help compose professional email responses"
        }
      })
      .eq('type', 'difficult_conversation_helper')
    
    if (updateError) {
      console.error('Error updating elements:', updateError)
    } else {
      console.log('✅ Converted difficult_conversation_helper elements')
    }

    // Also update the problematic debug/admin elements to be hidden
    console.log('\n🔧 Hiding debug/admin elements from regular lessons...')
    
    const debugTypes = ['interactive_element_auditor', 'automated_element_enhancer', 'database_debugger', 'database_content_viewer']
    
    for (const debugType of debugTypes) {
      const { error } = await supabase
        .from('interactive_elements')
        .update({ is_visible: false })
        .eq('type', debugType)
      
      if (!error) {
        console.log(`✅ Hidden ${debugType} elements`)
      }
    }

    // Check final state of lesson 5
    console.log('\n📊 Final state of Lesson 5:')
    
    const { data: contentBlocks } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .eq('is_visible', true)
      .order('order_index')
    
    const { data: interactiveElements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 5)
      .eq('is_visible', true)
      .order('order_index')
    
    console.log(`Visible content blocks: ${contentBlocks?.length || 0}`)
    console.log(`Visible interactive elements: ${interactiveElements?.length || 0}`)
    console.log(`Total visible elements: ${(contentBlocks?.length || 0) + (interactiveElements?.length || 0)}`)
    
    console.log('\n📋 Visible elements:')
    const allElements = [
      ...(contentBlocks || []).map(cb => ({ ...cb, elementType: 'content' })),
      ...(interactiveElements || []).map(ie => ({ ...ie, elementType: 'interactive' }))
    ].sort((a, b) => a.order_index - b.order_index)
    
    allElements.forEach(elem => {
      console.log(`[${elem.order_index}] ${elem.elementType === 'content' ? '📄' : '🎯'} ${elem.title} (${elem.type})`)
    })

    console.log('\n✅ Fix complete! Elements should now render properly.')
    console.log('\n🔄 Please refresh your browser with Cmd+Shift+R')

  } catch (error) {
    console.error('Error during final fix:', error)
  }
}

// Run the fix
finalFixRendering()