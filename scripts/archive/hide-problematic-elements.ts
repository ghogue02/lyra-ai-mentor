import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function hideProblematicElements() {
  console.log('🔧 Hiding problematic element types...\n')

  try {
    // Hide all problematic element types
    const problematicTypes = [
      'difficult_conversation_helper',
      'interactive_element_auditor', 
      'automated_element_enhancer',
      'database_debugger',
      'database_content_viewer',
      'element_workflow_coordinator',
      'chapter_builder_agent',
      'content_audit_agent',
      'storytelling_agent'
    ]

    for (const elementType of problematicTypes) {
      const { data, error } = await supabase
        .from('interactive_elements')
        .update({ is_visible: false })
        .eq('type', elementType)
        .select('id')

      if (error) {
        console.error(`Error hiding ${elementType}:`, error)
      } else {
        console.log(`✅ Hidden ${data?.length || 0} ${elementType} elements`)
      }
    }

    // Check all lessons for visible element counts
    console.log('\n📊 Visible elements per lesson:')
    
    for (let lessonId = 1; lessonId <= 25; lessonId++) {
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('id')
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
      
      const { data: interactiveElements } = await supabase
        .from('interactive_elements')
        .select('id')
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
      
      const total = (contentBlocks?.length || 0) + (interactiveElements?.length || 0)
      
      if (total > 0) {
        console.log(`Lesson ${lessonId}: ${contentBlocks?.length || 0} content + ${interactiveElements?.length || 0} interactive = ${total} total`)
      }
    }

    // Check lesson 5 specifically
    console.log('\n📋 Lesson 5 visible elements:')
    
    const { data: lesson5Visible } = await supabase
      .from('interactive_elements')
      .select('title, type, order_index')
      .eq('lesson_id', 5)
      .eq('is_visible', true)
      .order('order_index')

    lesson5Visible?.forEach(elem => {
      console.log(`[${elem.order_index}] ${elem.title} (${elem.type})`)
    })

    console.log('\n✅ Elements hidden successfully!')
    console.log('\n🔄 Please refresh your browser to see the changes')

  } catch (error) {
    console.error('Error:', error)
  }
}

hideProblematicElements()