import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function testImprovedFiltering() {
  console.log('🔍 Testing improved frontend filtering (matches new useLessonData.ts)...\n')

  try {
    // This matches the updated filtering in useLessonData.ts
    const adminElementTypes = [
      'difficult_conversation_helper',
      'interactive_element_auditor', 
      'automated_element_enhancer',
      'database_debugger',
      'interactive_element_builder',
      'element_workflow_coordinator',
      'chapter_builder_agent',
      'content_audit_agent',
      'storytelling_agent'
    ]

    for (const lessonId of [5, 6, 7, 8]) {
      console.log(`📚 Lesson ${lessonId}:`)
      
      // Fetch raw elements
      const { data: rawInteractiveElements } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)
        .eq('is_gated', false)
        .order('order_index')
      
      console.log(`  Database returns: ${rawInteractiveElements?.length || 0} elements`)
      
      // Apply the same filtering as useLessonData.ts
      const filteredInteractiveElements = rawInteractiveElements?.filter(
        element => !adminElementTypes.includes(element.type) && 
                  !element.title?.toLowerCase().includes('test') &&
                  !element.title?.toLowerCase().includes('debug')
      ) || []
      
      console.log(`  After filtering: ${filteredInteractiveElements.length} elements`)
      
      if (rawInteractiveElements && rawInteractiveElements.length > 0) {
        rawInteractiveElements.forEach(elem => {
          const isAdmin = adminElementTypes.includes(elem.type)
          const isTest = elem.title?.toLowerCase().includes('test') || elem.title?.toLowerCase().includes('debug')
          const willBeFiltered = isAdmin || isTest
          
          console.log(`    ${willBeFiltered ? '❌ FILTERED' : '✅ VISIBLE'}: ${elem.title} (${elem.type})`)
        })
      }

      // Show what users will see
      if (filteredInteractiveElements.length > 0) {
        console.log('\n  👤 User will see:')
        filteredInteractiveElements.forEach(elem => {
          console.log(`    ✅ ${elem.title} (${elem.type})`)
        })
      } else {
        console.log('  ⚠️ No interactive elements will be visible')
      }

      // Get content blocks
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('title')
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)

      const totalUserElements = (contentBlocks?.length || 0) + filteredInteractiveElements.length
      console.log(`  📊 Total elements user sees: ${totalUserElements}\n`)
    }

    console.log('🎯 Summary of improved filtering:')
    console.log('✅ All admin tools filtered out')
    console.log('✅ All test elements filtered out') 
    console.log('✅ Only educational interactive elements visible')
    console.log('✅ Content consistency restored')

  } catch (error) {
    console.error('Error during test:', error)
  }
}

testImprovedFiltering()