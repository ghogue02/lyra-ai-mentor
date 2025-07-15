import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function investigateChapter2Elements() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 INVESTIGATING CHAPTER 2 INTERACTIVE ELEMENTS')
  console.log('=' * 50)
  
  // First, let's get the Chapter 2 structure
  console.log('\n📚 Chapter 2 Lesson Structure:')
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, chapter_id')
    .eq('chapter_id', 2)
    .order('id')
  
  if (lessons) {
    lessons.forEach(lesson => {
      console.log(`   Lesson ${lesson.id}: "${lesson.title}"`)
    })
  }
  
  console.log('\n🎯 Interactive Elements by Lesson in Chapter 2:')
  
  if (lessons) {
    for (const lesson of lessons) {
      console.log(`\n📖 Lesson ${lesson.id}: "${lesson.title}"`)
      
      // Get all interactive elements for this lesson
      const { data: elements } = await supabase
        .from('interactive_elements')
        .select('id, title, type, is_active, order_index, configuration')
        .eq('lesson_id', lesson.id)
        .order('order_index')
      
      if (elements && elements.length > 0) {
        console.log(`   Found ${elements.length} elements:`)
        elements.forEach(element => {
          const status = element.is_active ? '✅ ACTIVE' : '❌ INACTIVE'
          const maya = element.title?.toLowerCase().includes('maya') ? '👩 MAYA' : ''
          console.log(`     ${status} ${maya} [${element.order_index}] "${element.title}" (${element.type})`)
          
          // Check if this is a Maya element
          if (element.title?.toLowerCase().includes('maya')) {
            const config = element.configuration || {}
            console.log(`       Config: ${JSON.stringify(config)}`)
          }
        })
      } else {
        console.log('   📝 No interactive elements found')
      }
    }
  }
  
  // Check specifically for Maya elements across all Chapter 2
  console.log('\n👩 ALL MAYA ELEMENTS IN CHAPTER 2:')
  const { data: mayaElements } = await supabase
    .from('interactive_elements')
    .select('id, title, type, lesson_id, is_active, order_index')
    .in('lesson_id', lessons?.map(l => l.id) || [])
    .ilike('title', '%maya%')
    .order('lesson_id', { ascending: true })
    .order('order_index', { ascending: true })
  
  if (mayaElements && mayaElements.length > 0) {
    console.log(`   Found ${mayaElements.length} Maya elements:`)
    mayaElements.forEach(element => {
      const status = element.is_active ? '✅' : '❌'
      console.log(`     ${status} L${element.lesson_id}: [${element.order_index}] "${element.title}" (${element.type})`)
    })
  } else {
    console.log('   ❌ No Maya elements found in Chapter 2')
  }
  
  // Check for element visibility conflicts in Lesson 5 specifically
  console.log('\n🚨 LESSON 5 DETAILED ANALYSIS:')
  const lesson5 = lessons?.find(l => l.id === 5)
  if (lesson5) {
    const { data: lesson5Elements } = await supabase
      .from('interactive_elements')
      .select('id, title, type, is_active, order_index, configuration')
      .eq('lesson_id', 5)
      .order('order_index')
    
    console.log(`   Elements in Lesson 5 (should have Maya elements):`)
    if (lesson5Elements && lesson5Elements.length > 0) {
      lesson5Elements.forEach(element => {
        const status = element.is_active ? '✅ ACTIVE' : '❌ INACTIVE'
        const visible = element.is_active && element.order_index <= 50 ? '👀 VISIBLE' : '🙈 HIDDEN'
        console.log(`     ${status} ${visible} [${element.order_index}] "${element.title}" (${element.type})`)
      })
    } else {
      console.log('     ❌ No elements found in Lesson 5')
    }
  }
  
  // Check for other active elements that might be hiding Maya elements
  console.log('\n⚠️ POTENTIAL VISIBILITY BLOCKERS IN CHAPTER 2:')
  const { data: blockingElements } = await supabase
    .from('interactive_elements')
    .select('id, title, type, lesson_id, order_index')
    .in('lesson_id', lessons?.map(l => l.id) || [])
    .eq('is_active', true)
    .lt('order_index', 20)
    .not('title', 'ilike', '%maya%')
    .order('lesson_id')
    .order('order_index')
  
  if (blockingElements && blockingElements.length > 0) {
    console.log(`   Found ${blockingElements.length} high-priority non-Maya elements:`)
    blockingElements.forEach(element => {
      console.log(`     L${element.lesson_id}: [${element.order_index}] "${element.title}" (${element.type})`)
    })
  } else {
    console.log('   ✅ No blocking elements found')
  }
  
  console.log('\n🎯 SUMMARY & RECOMMENDATIONS:')
  
  const totalMayaInChapter2 = mayaElements?.length || 0
  const activeMayaInChapter2 = mayaElements?.filter(e => e.is_active).length || 0
  
  console.log(`   📊 Maya Elements: ${activeMayaInChapter2}/${totalMayaInChapter2} active`)
  
  if (activeMayaInChapter2 === 0) {
    console.log('   ❌ CRITICAL: No active Maya elements found in Chapter 2')
    console.log('   💡 SOLUTION: Activate Maya elements or create new ones')
  } else if (activeMayaInChapter2 < 3) {
    console.log(`   ⚠️ WARNING: Only ${activeMayaInChapter2} Maya elements active (expected 3-4)`)
    console.log('   💡 SOLUTION: Check element visibility and order_index priorities')
  } else {
    console.log('   ✅ Good: Multiple Maya elements found')
    console.log('   💡 CHECK: Verify order_index priorities for visibility')
  }
}

investigateChapter2Elements().catch(console.error)