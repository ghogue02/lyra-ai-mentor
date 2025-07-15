import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function auditMayaElements() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Auditing Maya\'s Interactive Elements in Chapter 2...\n')
  
  // Check lessons 5, 6, 7, 8 for all interactive elements
  for (const lessonId of [5, 6, 7, 8]) {
    console.log(`\n📚 LESSON ${lessonId}:`)
    
    // Get all interactive elements for this lesson
    const { data: elements, error } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index')
    
    if (error) {
      console.error(`❌ Error fetching elements for lesson ${lessonId}:`, error)
      continue
    }
    
    if (!elements || elements.length === 0) {
      console.log(`   ❌ No interactive elements found`)
      continue
    }
    
    console.log(`   ✅ Found ${elements.length} interactive elements:`)
    elements.forEach((element, index) => {
      console.log(`   ${index + 1}. "${element.title}" (${element.type})`)
      console.log(`      - ID: ${element.id}`)
      console.log(`      - Active: ${element.is_active}`)
      console.log(`      - Order: ${element.order_index}`)
      if (element.title?.includes('Maya')) {
        console.log(`      - 🎯 MAYA ELEMENT FOUND!`)
      }
      if (element.title?.toLowerCase().includes('lyra') || element.type === 'lyra_chat') {
        console.log(`      - 💬 LYRA CHAT ELEMENT (should be archived)`)
      }
      console.log('')
    })
  }
  
  // Check specifically for Maya elements across all lessons
  console.log('\n\n🎯 MAYA ELEMENTS SEARCH:')
  const { data: mayaElements } = await supabase
    .from('interactive_elements')
    .select('*')
    .ilike('title', '%Maya%')
    .order('lesson_id', { ascending: true })
  
  if (mayaElements && mayaElements.length > 0) {
    console.log(`✅ Found ${mayaElements.length} Maya elements total:`)
    mayaElements.forEach(element => {
      console.log(`   - Lesson ${element.lesson_id}: "${element.title}" (${element.type}) - Active: ${element.is_active}`)
    })
  } else {
    console.log('❌ No Maya elements found in database!')
  }
  
  // Check for Lyra chat elements that need archiving
  console.log('\n\n💬 LYRA CHAT ELEMENTS TO ARCHIVE:')
  const { data: lyraChatElements } = await supabase
    .from('interactive_elements')
    .select('*')
    .or('type.eq.lyra_chat,title.ilike.%lyra%')
    .in('lesson_id', [5, 6, 7, 8])
    .order('lesson_id')
  
  if (lyraChatElements && lyraChatElements.length > 0) {
    console.log(`⚠️  Found ${lyraChatElements.length} Lyra chat elements to archive:`)
    lyraChatElements.forEach(element => {
      console.log(`   - Lesson ${element.lesson_id}: "${element.title}" (${element.type}) - Active: ${element.is_active}`)
    })
  } else {
    console.log('✅ No Lyra chat elements found in Chapter 2')
  }
  
  // Check the routing conditions in our components
  console.log('\n\n🔀 ROUTING ANALYSIS:')
  console.log('Current routing conditions in InteractiveElementRenderer:')
  console.log('- Lesson 5: Maya Parent Response checks for title containing "Maya" or specific titles')
  console.log('- Lesson 6: document_generator checks for lessonId === 6 && title?.includes("Maya")')
  console.log('- Lesson 7: meeting_prep_assistant checks for lessonId === 7 && title?.includes("Maya")')
  console.log('- Lesson 8: research_assistant checks for lessonId === 8 && title?.includes("Maya")')
  
  console.log('\n🔍 Audit complete. Check findings above for missing elements.')
}

auditMayaElements().catch(console.error)