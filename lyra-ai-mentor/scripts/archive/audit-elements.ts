import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

// Use hardcoded values from client.ts
const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function auditElements() {
  console.log('=== DEEP AUDIT OF INTERACTIVE ELEMENTS ===\n')

  // 1. Search for any element with "board" in the title
  console.log('1. Elements with "board" in the title:')
  const { data: boardElements, error: boardError } = await supabase
    .from('interactive_elements')
    .select('*')
    .ilike('title', '%board%')
    .order('lesson_id', { ascending: true })
    .order('order_index', { ascending: true })

  if (boardError) {
    console.error('Error searching for board elements:', boardError)
  } else {
    console.log(JSON.stringify(boardElements, null, 2))
  }

  // 2. Count elements per lesson_id with their titles
  console.log('\n2. Elements count per lesson_id:')
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, chapter_id')
    .order('id', { ascending: true })

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError)
  } else {
    for (const lesson of lessons || []) {
      const { data: elements, error: elementsError } = await supabase
        .from('interactive_elements')
        .select('id, title, type, order_index')
        .eq('lesson_id', lesson.id)
        .order('order_index', { ascending: true })

      if (!elementsError) {
        console.log(`\nLesson ${lesson.id} (Chapter ${lesson.chapter_id}): "${lesson.title}"`)
        console.log(`Total elements: ${elements?.length || 0}`)
        elements?.forEach(el => {
          console.log(`  - [${el.order_index}] ${el.type}: "${el.title}"`)
        })
      }
    }
  }

  // 3. Check for duplicate order_index within same lesson
  console.log('\n\n3. Checking for duplicate order_index values:')
  const { data: allElements, error: allError } = await supabase
    .from('interactive_elements')
    .select('lesson_id, order_index, title')
    .order('lesson_id', { ascending: true })
    .order('order_index', { ascending: true })

  if (!allError && allElements) {
    const lessonGroups = allElements.reduce((acc, el) => {
      if (!acc[el.lesson_id]) acc[el.lesson_id] = []
      acc[el.lesson_id].push(el)
      return acc
    }, {} as Record<number, typeof allElements>)

    for (const [lessonId, elements] of Object.entries(lessonGroups)) {
      const orderIndexes = elements.map(el => el.order_index)
      const duplicates = orderIndexes.filter((item, index) => orderIndexes.indexOf(item) !== index)
      if (duplicates.length > 0) {
        console.log(`Lesson ${lessonId} has duplicate order_index values: ${duplicates}`)
        elements.forEach(el => {
          if (duplicates.includes(el.order_index)) {
            console.log(`  - order_index ${el.order_index}: "${el.title}"`)
          }
        })
      }
    }
  }

  // 4. Look for unusual order_index values
  console.log('\n4. Elements with unusual order_index values:')
  const { data: unusualElements, error: unusualError } = await supabase
    .from('interactive_elements')
    .select('*')
    .or('order_index.lte.0,order_index.gte.1000')
    .order('lesson_id', { ascending: true })

  if (!unusualError && unusualElements) {
    if (unusualElements.length === 0) {
      console.log('No elements with unusual order_index values found')
    } else {
      unusualElements.forEach(el => {
        console.log(`Lesson ${el.lesson_id}, order_index ${el.order_index}: "${el.title}"`)
      })
    }
  }

  // 5. Show exactly what elements exist for lesson_id = 5
  console.log('\n5. All elements for lesson_id = 5 (first lesson of Chapter 2):')
  
  // First, check if lesson 5 exists
  const { data: lesson5, error: lesson5Error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', 5)
    .single()

  if (lesson5Error) {
    console.log('Lesson 5 not found:', lesson5Error)
  } else {
    console.log(`Lesson 5: "${lesson5.title}" (Chapter ${lesson5.chapter_id})`)
    
    // Get all content blocks for lesson 5
    const { data: contentBlocks, error: cbError } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .order('order_index', { ascending: true })

    console.log(`\nContent Blocks (${contentBlocks?.length || 0}):`)
    contentBlocks?.forEach(cb => {
      console.log(`  [${cb.order_index}] ${cb.type}: "${cb.title}"`)
    })

    // Get all interactive elements for lesson 5
    const { data: interactiveElements, error: ieError } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 5)
      .order('order_index', { ascending: true })

    console.log(`\nInteractive Elements (${interactiveElements?.length || 0}):`)
    interactiveElements?.forEach(ie => {
      console.log(`  [${ie.order_index}] ${ie.type}: "${ie.title}"`)
      console.log(`    Content: ${ie.content?.substring(0, 100)}...`)
    })
  }

  // Additional: Check total element counts across all lessons
  console.log('\n\n=== SUMMARY: Total Elements by Chapter ===')
  const chapters = [1, 2, 3, 4, 5]
  
  for (const chapterId of chapters) {
    const { data: chapterLessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('chapter_id', chapterId)

    if (chapterLessons && chapterLessons.length > 0) {
      const lessonIds = chapterLessons.map(l => l.id)
      
      const { data: cbCount } = await supabase
        .from('content_blocks')
        .select('id', { count: 'exact' })
        .in('lesson_id', lessonIds)

      const { data: ieCount } = await supabase
        .from('interactive_elements')
        .select('id', { count: 'exact' })
        .in('lesson_id', lessonIds)

      console.log(`Chapter ${chapterId}: ${cbCount?.length || 0} content blocks, ${ieCount?.length || 0} interactive elements`)
    }
  }
}

// Run the audit
auditElements().catch(console.error)