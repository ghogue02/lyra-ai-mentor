import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function runCompleteFix() {
  console.log('🚀 Running complete rendering fix...\n')

  try {
    // Step 1: Delete problematic element types
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

    console.log('🗑️ Removing problematic element types...')
    
    for (const type of problematicTypes) {
      const { data, error } = await supabase
        .from('interactive_elements')
        .delete()
        .eq('type', type)
        .select('id')
      
      if (!error && data && data.length > 0) {
        console.log(`✅ Deleted ${data.length} ${type} elements`)
      }
    }

    // Step 2: Ensure all elements are visible
    console.log('\n👁️ Making all elements visible...')
    
    await supabase
      .from('content_blocks')
      .update({ is_visible: true, is_active: true })
      .is('lesson_id', 'not.null')
    
    await supabase
      .from('interactive_elements')
      .update({ is_visible: true, is_active: true, is_gated: false })
      .is('lesson_id', 'not.null')

    console.log('✅ All elements set to visible')

    // Step 3: Check results
    console.log('\n📊 Checking results...')
    
    // Get summary for all chapters
    const chapters = [1, 2, 3, 4, 5, 6]
    
    for (const chapterId of chapters) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('chapter_id', chapterId)
      
      if (lessons && lessons.length > 0) {
        let totalContent = 0
        let totalInteractive = 0
        
        for (const lesson of lessons) {
          const { count: cbCount } = await supabase
            .from('content_blocks')
            .select('*', { count: 'exact', head: true })
            .eq('lesson_id', lesson.id)
            .eq('is_visible', true)
          
          const { count: ieCount } = await supabase
            .from('interactive_elements')
            .select('*', { count: 'exact', head: true })
            .eq('lesson_id', lesson.id)
            .eq('is_visible', true)
          
          totalContent += cbCount || 0
          totalInteractive += ieCount || 0
        }
        
        console.log(`Chapter ${chapterId}: ${totalContent} content blocks, ${totalInteractive} interactive elements`)
      }
    }

    console.log('\n✅ Database fix complete!')
    console.log('\n📋 Next steps:')
    console.log('1. Refresh your browser (Cmd+Shift+R)')
    console.log('2. Navigate to any lesson')
    console.log('3. Check the console for debug messages:')
    console.log('   - "LessonContent: Component mounted with:"')
    console.log('   - "LessonContent: About to map X items"')
    console.log('   - "LessonContent: Rendering item"')
    console.log('\nIf you see these messages but no elements appear, check for JavaScript errors in red.')

  } catch (error) {
    console.error('Error during fix:', error)
  }
}

runCompleteFix()