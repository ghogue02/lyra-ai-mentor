import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function checkExistingChapters() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 CHECKING ALL CHAPTERS AND LESSONS')
  console.log('=' * 50)
  
  // Get all chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .order('id')
  
  console.log('\n📚 ALL CHAPTERS:')
  chapters?.forEach(ch => {
    console.log(`   Chapter ${ch.id}: ${ch.title}`)
  })
  
  // Get all lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, chapter_id, order_index')
    .order('id')
  
  console.log('\n\n📖 ALL LESSONS:')
  
  // Group by chapter
  const lessonsByChapter: Record<number, any[]> = {}
  lessons?.forEach(lesson => {
    if (!lessonsByChapter[lesson.chapter_id]) {
      lessonsByChapter[lesson.chapter_id] = []
    }
    lessonsByChapter[lesson.chapter_id].push(lesson)
  })
  
  Object.entries(lessonsByChapter).forEach(([chapterId, chapterLessons]) => {
    console.log(`\n   Chapter ${chapterId}:`)
    chapterLessons.forEach(lesson => {
      console.log(`      Lesson ${lesson.id}: ${lesson.title}`)
    })
  })
  
  // Check lessons 9-20 specifically
  console.log('\n\n🎯 LESSONS 9-20 (Expected for Chapters 3-6):')
  for (let i = 9; i <= 20; i++) {
    const { data: lesson } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', i)
      .single()
    
    if (lesson) {
      console.log(`   ✅ Lesson ${i}: ${lesson.title} (Chapter ${lesson.chapter_id})`)
    } else {
      console.log(`   ❌ Lesson ${i}: NOT FOUND`)
    }
  }
  
  // Check character-specific elements
  console.log('\n\n👥 CHARACTER-SPECIFIC ELEMENTS:')
  const characters = ['Sofia', 'David', 'Rachel', 'Alex']
  
  for (const character of characters) {
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('id, title, lesson_id')
      .ilike('title', `%${character}%`)
      .eq('is_active', true)
    
    console.log(`\n   ${character}: ${elements?.length || 0} elements`)
    elements?.slice(0, 3).forEach(el => {
      console.log(`      - "${el.title}" (Lesson ${el.lesson_id})`)
    })
  }
}

checkExistingChapters().catch(console.error)