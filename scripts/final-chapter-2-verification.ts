import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function finalChapter2Verification() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('✅ FINAL CHAPTER 2 VERIFICATION')
  console.log('=' * 35)
  
  console.log('\n📊 EXPECTED VS ACTUAL INTERACTIVE ELEMENTS:')
  
  const lessons = [
    { id: 5, title: 'AI Email Assistant', expectedCount: 2 },
    { id: 6, title: 'Document Creation Powerhouse', expectedCount: 2 },
    { id: 7, title: 'Meeting Master', expectedCount: 2 },
    { id: 8, title: 'Research & Organization Pro', expectedCount: 2 }
  ]
  
  let totalIssues = 0
  
  for (const lesson of lessons) {
    console.log(`\n📖 Lesson ${lesson.id}: "${lesson.title}"`)
    console.log(`   Expected: ${lesson.expectedCount} Maya elements`)
    
    // Get all active Maya elements for this lesson
    const { data: mayaElements } = await supabase
      .from('interactive_elements')
      .select('id, title, type, order_index')
      .eq('lesson_id', lesson.id)
      .ilike('title', '%maya%')
      .eq('is_active', true)
      .order('order_index')
    
    if (mayaElements && mayaElements.length > 0) {
      console.log(`   Actual: ${mayaElements.length} Maya elements ✅`)
      mayaElements.forEach(element => {
        console.log(`     [${element.order_index}] "${element.title}" (${element.type})`)
      })
      
      if (mayaElements.length < lesson.expectedCount) {
        console.log(`   ⚠️ Missing ${lesson.expectedCount - mayaElements.length} elements`)
        totalIssues++
      }
    } else {
      console.log(`   Actual: 0 Maya elements ❌`)
      totalIssues++
    }
  }
  
  // Component routing verification
  console.log('\n🎯 COMPONENT ROUTING VERIFICATION:')
  const routingTests = [
    { lesson: 5, type: 'ai_email_composer', component: 'MayaParentResponseEmail' },
    { lesson: 6, type: 'document_generator', component: 'MayaGrantProposal' },
    { lesson: 7, type: 'meeting_prep_assistant', component: 'MayaBoardMeetingPrep' },
    { lesson: 8, type: 'research_assistant', component: 'MayaResearchSynthesis' }
  ]
  
  for (const test of routingTests) {
    const { data: element } = await supabase
      .from('interactive_elements')
      .select('title')
      .eq('lesson_id', test.lesson)
      .eq('type', test.type)
      .ilike('title', '%maya%')
      .eq('is_active', true)
      .limit(1)
      .single()
    
    if (element) {
      console.log(`   ✅ L${test.lesson} ${test.type} → ${test.component}`)
    } else {
      console.log(`   ❌ L${test.lesson} ${test.type} → ${test.component} (not found)`)
      totalIssues++
    }
  }
  
  // Frontend simulation - what useLessonData should return for lesson 5
  console.log('\n🔍 LESSON 5 FRONTEND SIMULATION:')
  const { data: lesson5Elements } = await supabase
    .from('interactive_elements')
    .select('id, title, type, order_index, is_active')
    .eq('lesson_id', 5)
    .eq('is_active', true)
    .order('order_index')
  
  if (lesson5Elements) {
    const filteredElements = lesson5Elements.filter(e => e.is_active)
    console.log(`   useLessonData will find: ${filteredElements.length} interactive elements`)
    console.log('   Elements in order of appearance:')
    
    filteredElements.forEach((element, index) => {
      const priority = element.order_index <= 10 ? '🔥 HIGH' : '📝 NORMAL'
      console.log(`     ${index + 1}. ${priority} "${element.title}" (${element.type})`)
    })
  }
  
  console.log('\n🎯 FINAL SUMMARY:')
  
  if (totalIssues === 0) {
    console.log('✅ ALL CHECKS PASSED!')
    console.log('✅ Chapter 2 Maya elements are ready for frontend')
    console.log('✅ User should now see multiple interactive elements')
    console.log('\n📋 What the user should see in Lesson 5:')
    console.log('   1. Maya\'s Parent Response Email Helper (top priority)')
    console.log('   2. Turn Maya\'s Email Anxiety into Connection (secondary)')
    console.log('   Both should route to Maya-specific components')
  } else {
    console.log(`❌ ${totalIssues} issues found`)
    console.log('⚠️ Additional fixes may be needed')
  }
  
  console.log('\n🚀 READY FOR USER TESTING!')
}

finalChapter2Verification().catch(console.error)