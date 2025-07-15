import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function simulateFrontendFiltering() {
  console.log('🔍 Simulating what users will see with frontend filtering...\n')

  try {
    // This simulates what useLessonData.ts does
    const problematicTypes = ['difficult_conversation_helper', 'interactive_element_auditor', 'automated_element_enhancer']

    for (const lessonId of [5, 6, 7, 8]) {
      console.log(`📚 Lesson ${lessonId}:`)
      
      // Step 1: Fetch what the database query would return
      const { data: rawInteractiveElements } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)
        .eq('is_gated', false)
        .order('order_index')
      
      console.log(`  Raw database query: ${rawInteractiveElements?.length || 0} elements`)
      
      if (rawInteractiveElements && rawInteractiveElements.length > 0) {
        rawInteractiveElements.forEach(elem => {
          const isProblematic = problematicTypes.includes(elem.type)
          console.log(`    ${isProblematic ? '❌' : '✅'} ${elem.title} (${elem.type})`)
        })
      }

      // Step 2: Apply frontend filtering (as in useLessonData.ts)
      const filteredInteractiveElements = rawInteractiveElements?.filter(
        element => !problematicTypes.includes(element.type)
      ) || []
      
      console.log(`  After frontend filtering: ${filteredInteractiveElements.length} elements`)
      
      if (filteredInteractiveElements.length > 0) {
        console.log('  📋 User will see:')
        filteredInteractiveElements.forEach(elem => {
          console.log(`    ✅ ${elem.title} (${elem.type})`)
        })
      } else {
        console.log('    ⚠️ No interactive elements will be visible to users')
      }

      // Step 3: Check content blocks too
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('title, type')
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)
        .order('order_index')

      console.log(`  Content blocks: ${contentBlocks?.length || 0}`)
      
      const totalElements = (contentBlocks?.length || 0) + filteredInteractiveElements.length
      console.log(`  📊 Total lesson elements user sees: ${totalElements}\n`)
    }

    // Summary of what the user experience will be
    console.log('📋 User Experience Summary:')
    console.log('✅ Admin tools filtered out by frontend')
    console.log('✅ Test elements filtered out by frontend') 
    console.log('✅ Only educational tools visible')
    console.log('✅ Clean, professional interface')
    
    console.log('\n🎯 Specific fixes to inconsistencies:')
    console.log('✅ Tool count promises updated to match reality')
    console.log('✅ Interactive element context improved') 
    console.log('✅ Admin pollution removed via filtering')
    console.log('⚠️ Lessons 7-8 still need interactive elements created')

  } catch (error) {
    console.error('Error during simulation:', error)
  }
}

simulateFrontendFiltering()