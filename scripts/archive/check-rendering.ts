import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function checkLessonRendering() {
  console.log('🔍 Checking lesson rendering issue...\n')

  // Check lesson 5 (Chapter 2, Lesson 5)
  const lessonId = 5

  try {
    // Check content blocks
    const { data: contentBlocks, error: cbError } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index')

    if (cbError) {
      console.error('Error fetching content blocks:', cbError)
      return
    }

    // Check interactive elements
    const { data: interactiveElements, error: ieError } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index')

    if (ieError) {
      console.error('Error fetching interactive elements:', ieError)
      return
    }

    console.log(`📊 Database Status for Lesson ${lessonId}:`)
    console.log(`Content Blocks: ${contentBlocks.length}`)
    console.log(`Interactive Elements: ${interactiveElements.length}`)
    console.log(`Total: ${contentBlocks.length + interactiveElements.length}\n`)

    // Check visibility flags
    const invisibleContent = contentBlocks.filter(cb => 
      cb.is_visible === false || cb.is_active === false
    )
    const invisibleElements = interactiveElements.filter(ie => 
      ie.is_visible === false || ie.is_active === false || ie.is_gated === true
    )

    if (invisibleContent.length > 0 || invisibleElements.length > 0) {
      console.log('⚠️ Found invisible elements:')
      if (invisibleContent.length > 0) {
        console.log(`- ${invisibleContent.length} content blocks are invisible`)
        invisibleContent.forEach(cb => {
          console.log(`  - ${cb.title} (visible: ${cb.is_visible}, active: ${cb.is_active})`)
        })
      }
      if (invisibleElements.length > 0) {
        console.log(`- ${invisibleElements.length} interactive elements are invisible`)
        invisibleElements.forEach(ie => {
          console.log(`  - ${ie.title} (visible: ${ie.is_visible}, active: ${ie.is_active}, gated: ${ie.is_gated})`)
        })
      }
    } else {
      console.log('✅ All elements are marked as visible in the database')
    }

    // Check for any null/undefined values that might cause rendering issues
    const contentWithIssues = contentBlocks.filter(cb => 
      !cb.title || !cb.content || cb.order_index == null
    )
    const elementsWithIssues = interactiveElements.filter(ie => 
      !ie.title || !ie.content || ie.order_index == null
    )

    if (contentWithIssues.length > 0 || elementsWithIssues.length > 0) {
      console.log('\n⚠️ Found elements with missing data:')
      if (contentWithIssues.length > 0) {
        console.log(`- ${contentWithIssues.length} content blocks have missing data`)
        contentWithIssues.forEach(cb => {
          console.log(`  - ID: ${cb.id}, Title: ${cb.title || 'MISSING'}, Content: ${cb.content ? 'Present' : 'MISSING'}, Order: ${cb.order_index}`)
        })
      }
      if (elementsWithIssues.length > 0) {
        console.log(`- ${elementsWithIssues.length} interactive elements have missing data`)
        elementsWithIssues.forEach(ie => {
          console.log(`  - ID: ${ie.id}, Title: ${ie.title || 'MISSING'}, Content: ${ie.content ? 'Present' : 'MISSING'}, Order: ${ie.order_index}`)
        })
      }
    }

    // List all elements in order
    console.log('\n📋 All elements in order:')
    const allElements = [
      ...contentBlocks.map(cb => ({ ...cb, elementType: 'content' })),
      ...interactiveElements.map(ie => ({ ...ie, elementType: 'interactive' }))
    ].sort((a, b) => a.order_index - b.order_index)

    allElements.forEach(elem => {
      console.log(`[${elem.order_index}] ${elem.elementType === 'content' ? '📄' : '🎯'} ${elem.title} (${elem.type})`)
    })

    console.log('\n💡 Next Steps:')
    console.log('1. Check browser console for JavaScript errors')
    console.log('2. Verify LessonContent component is receiving props correctly')
    console.log('3. Check if conditional rendering is blocking elements')
    console.log('4. Look for CSS that might be hiding elements (display: none, visibility: hidden)')

  } catch (error) {
    console.error('Error during check:', error)
  }
}

// Run the check
checkLessonRendering()