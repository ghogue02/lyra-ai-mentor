import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function cleanChapter2AdminElements() {
  console.log('🧹 Cleaning up admin and test elements from Chapter 2...\n')

  try {
    // Define admin/debug/test element types that should not be visible to learners
    const adminElementTypes = [
      'interactive_element_auditor',
      'automated_element_enhancer', 
      'database_debugger',
      'interactive_element_builder',
      'element_workflow_coordinator',
      'chapter_builder_agent',
      'content_audit_agent',
      'storytelling_agent'
    ]

    // Find all admin elements in Chapter 2 lessons
    console.log('1️⃣ Finding admin elements in Chapter 2...')
    
    const { data: adminElements } = await supabase
      .from('interactive_elements')
      .select('id, lesson_id, type, title')
      .in('lesson_id', [5, 6, 7, 8])
      .in('type', adminElementTypes)

    if (adminElements && adminElements.length > 0) {
      console.log(`Found ${adminElements.length} admin elements to hide:`)
      adminElements.forEach(elem => {
        console.log(`  - Lesson ${elem.lesson_id}: ${elem.title} (${elem.type})`)
      })

      // Hide all admin elements
      const { error } = await supabase
        .from('interactive_elements')
        .update({ 
          is_visible: false,
          is_active: false 
        })
        .in('type', adminElementTypes)
        .in('lesson_id', [5, 6, 7, 8])

      if (error) {
        console.error('Error hiding admin elements:', error)
      } else {
        console.log('✅ All admin elements hidden from learners')
      }
    } else {
      console.log('No admin elements found')
    }

    // Find and hide test elements
    console.log('\n2️⃣ Finding test elements...')
    
    const { data: testElements } = await supabase
      .from('interactive_elements')
      .select('id, lesson_id, title, type')
      .in('lesson_id', [5, 6, 7, 8])
      .or('title.ilike.%test%,title.ilike.%debug%,title.ilike.%can you see%')

    if (testElements && testElements.length > 0) {
      console.log(`Found ${testElements.length} test elements:`)
      testElements.forEach(elem => {
        console.log(`  - Lesson ${elem.lesson_id}: ${elem.title} (${elem.type})`)
      })

      // Hide test elements
      for (const elem of testElements) {
        const { error } = await supabase
          .from('interactive_elements')
          .update({ 
            is_visible: false,
            is_active: false 
          })
          .eq('id', elem.id)

        if (error) {
          console.error(`Error hiding test element ${elem.id}:`, error)
        } else {
          console.log(`✅ Hidden: ${elem.title}`)
        }
      }
    } else {
      console.log('No test elements found')
    }

    // Show what educational elements remain visible
    console.log('\n3️⃣ Educational elements remaining visible:')
    
    for (const lessonId of [5, 6, 7, 8]) {
      const { data: visibleElements } = await supabase
        .from('interactive_elements')
        .select('title, type')
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)
        .order('order_index')

      console.log(`\nLesson ${lessonId} (${visibleElements?.length || 0} elements):`)
      if (visibleElements && visibleElements.length > 0) {
        visibleElements.forEach(elem => {
          console.log(`  ✅ ${elem.title} (${elem.type})`)
        })
      } else {
        console.log('  ⚠️ No visible interactive elements')
      }
    }

    // Verify the filtering is working as expected
    console.log('\n4️⃣ Verifying Chapter 2 clean state...')
    
    // Check if any problematic elements are still visible
    const { data: remainingProblems } = await supabase
      .from('interactive_elements')
      .select('lesson_id, title, type')
      .in('lesson_id', [5, 6, 7, 8])
      .eq('is_visible', true)
      .in('type', [...adminElementTypes, 'test'])

    if (remainingProblems && remainingProblems.length > 0) {
      console.log('⚠️ Still visible problematic elements:')
      remainingProblems.forEach(elem => {
        console.log(`  - Lesson ${elem.lesson_id}: ${elem.title} (${elem.type})`)
      })
    } else {
      console.log('✅ No admin/test elements visible to learners')
    }

    // Final summary
    console.log('\n📊 Final Chapter 2 state:')
    
    for (const lessonId of [5, 6, 7, 8]) {
      const { count: visibleCount } = await supabase
        .from('interactive_elements')
        .select('*', { count: 'exact', head: true })
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)

      const { count: totalCount } = await supabase
        .from('interactive_elements')
        .select('*', { count: 'exact', head: true })
        .eq('lesson_id', lessonId)

      console.log(`Lesson ${lessonId}: ${visibleCount}/${totalCount} elements visible to learners`)
    }

    console.log('\n🎉 Chapter 2 cleanup complete!')
    console.log('\n✅ Benefits:')
    console.log('- Clean user experience without admin tool pollution')
    console.log('- Educational elements properly focused')
    console.log('- Test elements removed from production')
    console.log('- Consistent tool availability')

  } catch (error) {
    console.error('Error during cleanup:', error)
  }
}

cleanChapter2AdminElements()