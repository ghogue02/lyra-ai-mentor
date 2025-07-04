import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function fixChapter2ElementVisibility() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔧 Fixing Chapter 2 Element Visibility Issues...\n')
  
  // Step 1: Archive Lyra Chat Elements
  console.log('📦 Step 1: Archiving Lyra Chat Elements...')
  
  const { data: lyraChatElements } = await supabase
    .from('interactive_elements')
    .select('*')
    .or('type.eq.lyra_chat,title.ilike.%lyra%')
    .in('lesson_id', [5, 6, 7, 8])
  
  if (lyraChatElements && lyraChatElements.length > 0) {
    // Save to archive file
    const archiveData = {
      timestamp: new Date().toISOString(),
      reason: 'Removed per user request - "try chatting with lyra" elements',
      elements: lyraChatElements
    }
    
    writeFileSync(
      'archive/lyra-chat-elements/chapter2-lyra-elements.json',
      JSON.stringify(archiveData, null, 2)
    )
    
    console.log(`✅ Archived ${lyraChatElements.length} Lyra chat elements`)
    
    // Deactivate them in database
    for (const element of lyraChatElements) {
      await supabase
        .from('interactive_elements')
        .update({ is_active: false, order_index: 9999 })
        .eq('id', element.id)
      
      console.log(`   - Deactivated: "${element.title}" (Lesson ${element.lesson_id})`)
    }
  } else {
    console.log('✅ No Lyra chat elements found to archive')
  }
  
  // Step 2: Fix Lesson 6 - Deactivate James Elements
  console.log('\n📚 Step 2: Fixing Lesson 6 Element Order...')
  
  const jamesElementTitles = [
    'Help James Complete His Grant Proposal',
    'Polish James\'s Executive Summary', 
    'Build James\'s Success Template',
    'James\'s Next Challenge: Build More Chapters'
  ]
  
  for (const title of jamesElementTitles) {
    const { error } = await supabase
      .from('interactive_elements')
      .update({ is_active: false, order_index: 9999 })
      .eq('lesson_id', 6)
      .eq('title', title)
    
    if (!error) {
      console.log(`   ✅ Deactivated James element: "${title}"`)
    } else {
      console.log(`   ❌ Failed to deactivate: "${title}"`)
    }
  }
  
  // Step 3: Ensure Maya Elements Have Proper Order
  console.log('\n🎯 Step 3: Optimizing Maya Element Order...')
  
  const mayaElementUpdates = [
    // Lesson 5: Keep Maya parent response as primary element
    { lesson_id: 5, title: "Turn Maya's Email Anxiety into Connection", order_index: 50 },
    
    // Lesson 6: Make Maya grant proposal the primary element
    { lesson_id: 6, title: "Maya's Grant Proposal Challenge", order_index: 20 },
    
    // Lesson 7: Maya meeting prep as primary element  
    { lesson_id: 7, title: "Maya's Emergency Board Meeting Prep", order_index: 20 },
    
    // Lesson 8: Maya research synthesis as primary element
    { lesson_id: 8, title: "Maya's Research Synthesis Challenge", order_index: 20 }
  ]
  
  for (const update of mayaElementUpdates) {
    const { error } = await supabase
      .from('interactive_elements')
      .update({ 
        is_active: true, 
        order_index: update.order_index 
      })
      .eq('lesson_id', update.lesson_id)
      .eq('title', update.title)
    
    if (!error) {
      console.log(`   ✅ Updated order for: "${update.title}" (Lesson ${update.lesson_id})`)
    } else {
      console.log(`   ❌ Failed to update: "${update.title}"`)
    }
  }
  
  // Step 4: Verification - Show current state
  console.log('\n🔍 Step 4: Verification - Current Element Order...')
  
  for (const lessonId of [5, 6, 7, 8]) {
    console.log(`\n📚 Lesson ${lessonId}:`)
    
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('id, title, type, is_active, order_index')
      .eq('lesson_id', lessonId)
      .eq('is_active', true)
      .order('order_index')
    
    if (elements && elements.length > 0) {
      elements.forEach((element, index) => {
        const isMaya = element.title?.includes('Maya') ? '🎯 ' : '   '
        console.log(`   ${index + 1}. ${isMaya}"${element.title}" (${element.type}) - Order: ${element.order_index}`)
      })
    } else {
      console.log('   ❌ No active elements found')
    }
  }
  
  console.log('\n🎉 Chapter 2 Element Visibility Fix Complete!')
  console.log('\nChanges made:')
  console.log('✅ Archived Lyra chat elements')
  console.log('✅ Deactivated James elements in Lesson 6')
  console.log('✅ Reordered Maya elements to show first')
  console.log('✅ Ensured all Maya elements are active')
}

fixChapter2ElementVisibility().catch(console.error)