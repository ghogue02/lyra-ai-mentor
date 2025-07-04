import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function checkElementVisibilityStatus() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 ELEMENT VISIBILITY STATUS CHECK')
  console.log('=' * 40)
  
  // 1. Check for active Lyra elements (should be archived)
  console.log('\n📊 1. Active Lyra Elements (should be 0):')
  const { data: lyraElements } = await supabase
    .from('interactive_elements')
    .select('id, title, type, lesson_id, is_active')
    .ilike('title', '%lyra%')
    .eq('is_active', true)
  
  if (lyraElements && lyraElements.length > 0) {
    console.log(`   ❌ Found ${lyraElements.length} active Lyra elements:`)
    lyraElements.slice(0, 5).forEach(element => {
      console.log(`     - L${element.lesson_id}: "${element.title}" (${element.type})`)
    })
  } else {
    console.log('   ✅ No active Lyra elements found')
  }
  
  // 2. Check character elements in chapters 3-6
  console.log('\n📊 2. Character Elements in Chapters 3-6:')
  const chapters = [
    { number: 3, lessons: [11, 12, 13, 14], expectedChar: 'Sofia' },
    { number: 4, lessons: [15, 16, 17, 18], expectedChar: 'David' },
    { number: 5, lessons: [19, 20, 21, 22], expectedChar: 'Rachel' },
    { number: 6, lessons: [23, 24, 25, 26], expectedChar: 'Alex' }
  ]
  
  for (const chapter of chapters) {
    console.log(`\n   Chapter ${chapter.number} (${chapter.expectedChar}):`)
    
    for (const lessonId of chapter.lessons) {
      const { data: elements } = await supabase
        .from('interactive_elements')
        .select('id, title, type, order_index, is_active')
        .eq('lesson_id', lessonId)
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      if (elements && elements.length > 0) {
        console.log(`     L${lessonId}: ${elements.length} active elements`)
        
        // Show character elements with priority
        const characterElements = elements.filter(e => 
          e.title?.toLowerCase().includes(chapter.expectedChar.toLowerCase())
        )
        
        if (characterElements.length > 0) {
          characterElements.forEach(element => {
            const priority = element.order_index <= 10 ? '🔥 HIGH' : '⬇️ LOW'
            console.log(`       ✅ ${priority}: "${element.title}" (order: ${element.order_index})`)
          })
        } else {
          console.log(`       ❌ No ${chapter.expectedChar} elements found`)
        }
        
        // Show conflicting elements with higher priority
        const conflictingElements = elements.filter(e => 
          e.order_index < 10 && !e.title?.toLowerCase().includes(chapter.expectedChar.toLowerCase())
        )
        
        if (conflictingElements.length > 0) {
          console.log(`       🚨 ${conflictingElements.length} elements blocking visibility:`)
          conflictingElements.forEach(element => {
            console.log(`         - "${element.title}" (order: ${element.order_index})`)
          })
        }
      }
    }
  }
  
  // 3. Check archived elements
  console.log('\n📊 3. Archived Elements:')
  const { data: archivedElements } = await supabase
    .from('interactive_elements')
    .select('id, title, lesson_id')
    .eq('is_active', false)
    .ilike('title', '%lyra%')
  
  if (archivedElements && archivedElements.length > 0) {
    console.log(`   ✅ ${archivedElements.length} Lyra elements properly archived`)
  } else {
    console.log('   ⚠️  No archived Lyra elements found')
  }
  
  // 4. Summary
  console.log('\n🎯 SUMMARY & RECOMMENDATIONS:')
  
  const activeLyraCount = lyraElements?.length || 0
  if (activeLyraCount > 0) {
    console.log(`   ❌ Archive ${activeLyraCount} active Lyra elements`)
  }
  
  // Check if we need to fix priorities
  let needsPriorityFix = false
  for (const chapter of chapters) {
    for (const lessonId of chapter.lessons) {
      const { data: elements } = await supabase
        .from('interactive_elements')
        .select('id, title, order_index')
        .eq('lesson_id', lessonId)
        .eq('is_active', true)
        .lt('order_index', 10)
      
      const conflictingElements = elements?.filter(e => 
        !e.title?.toLowerCase().includes(chapter.expectedChar.toLowerCase())
      ) || []
      
      if (conflictingElements.length > 0) {
        needsPriorityFix = true
        break
      }
    }
    if (needsPriorityFix) break
  }
  
  if (needsPriorityFix) {
    console.log('   ❌ Fix element order priorities (character elements need order_index < 10)')
  }
  
  if (activeLyraCount === 0 && !needsPriorityFix) {
    console.log('   ✅ All visibility issues resolved!')
  }
  
  return { activeLyraCount, needsPriorityFix }
}

checkElementVisibilityStatus().catch(console.error)