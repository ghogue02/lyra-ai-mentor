import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

// Use hardcoded values from client.ts
const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function checkChapterElements() {
  console.log('=== CHECKING ELEMENTS PER CHAPTER ===\n')

  // Get all chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, title')
    .order('id')

  if (chaptersError) {
    console.error('Error fetching chapters:', chaptersError)
    return
  }

  // For each chapter, count the total elements across all its lessons
  for (const chapter of chapters || []) {
    console.log(`\n📖 Chapter ${chapter.id}: ${chapter.title}`)
    console.log('=' + '='.repeat(50))

    // Get all lessons for this chapter
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title')
      .eq('chapter_id', chapter.id)
      .order('order_index')

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
      continue
    }

    let totalContentBlocks = 0
    let totalInteractiveElements = 0

    for (const lesson of lessons || []) {
      // Count content blocks
      const { count: cbCount } = await supabase
        .from('content_blocks')
        .select('*', { count: 'exact', head: true })
        .eq('lesson_id', lesson.id)

      // Count interactive elements
      const { count: ieCount } = await supabase
        .from('interactive_elements')
        .select('*', { count: 'exact', head: true })
        .eq('lesson_id', lesson.id)

      const lessonTotal = (cbCount || 0) + (ieCount || 0)
      totalContentBlocks += cbCount || 0
      totalInteractiveElements += ieCount || 0

      console.log(`  Lesson ${lesson.id} (${lesson.title}):`)
      console.log(`    - Content blocks: ${cbCount || 0}`)
      console.log(`    - Interactive elements: ${ieCount || 0}`)
      console.log(`    - Total elements: ${lessonTotal}`)
    }

    console.log(`\n  Chapter ${chapter.id} Summary:`)
    console.log(`    Total content blocks: ${totalContentBlocks}`)
    console.log(`    Total interactive elements: ${totalInteractiveElements}`)
    console.log(`    Total elements in chapter: ${totalContentBlocks + totalInteractiveElements}`)
  }

  // Check for any potential issues
  console.log('\n\n=== POTENTIAL ISSUES CHECK ===')
  
  // Check for elements with very high order_index
  const { data: highOrderElements } = await supabase
    .from('interactive_elements')
    .select('lesson_id, title, order_index')
    .gte('order_index', 100)
    .order('order_index', { ascending: false })

  if (highOrderElements && highOrderElements.length > 0) {
    console.log('\n⚠️  Elements with high order_index (might not display in expected order):')
    highOrderElements.forEach(el => {
      console.log(`  - Lesson ${el.lesson_id}: "${el.title}" (order_index: ${el.order_index})`)
    })
  }

  // Check for lessons with mixed content and interactive element order indexes
  console.log('\n\n=== ORDER INDEX ANALYSIS ===')
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, chapter_id')
    .order('chapter_id')
    .order('order_index')

  for (const lesson of allLessons || []) {
    const { data: cbData } = await supabase
      .from('content_blocks')
      .select('order_index')
      .eq('lesson_id', lesson.id)
      .order('order_index')

    const { data: ieData } = await supabase
      .from('interactive_elements')
      .select('order_index')
      .eq('lesson_id', lesson.id)
      .order('order_index')

    if (cbData && ieData && cbData.length > 0 && ieData.length > 0) {
      const cbIndexes = cbData.map(cb => cb.order_index)
      const ieIndexes = ieData.map(ie => ie.order_index)
      
      console.log(`\nLesson ${lesson.id} (Chapter ${lesson.chapter_id}): "${lesson.title}"`)
      console.log(`  Content block indexes: [${cbIndexes.join(', ')}]`)
      console.log(`  Interactive element indexes: [${ieIndexes.join(', ')}]`)
    }
  }
}

// Run the check
checkChapterElements().catch(console.error)