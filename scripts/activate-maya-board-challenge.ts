import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function activateMayaBoardChallenge() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🎯 ACTIVATING MAYA\'S BOARD CHAIR CHALLENGE')
  console.log('=' * 42)
  
  // Find the specific element
  const { data: element } = await supabase
    .from('interactive_elements')
    .select('id, title, is_active, order_index, lesson_id')
    .eq('lesson_id', 5)
    .ilike('title', '%Board Chair Challenge%')
    .single()
  
  if (!element) {
    console.log('❌ Maya\'s Board Chair Challenge element not found')
    return
  }
  
  console.log('📋 Current Element Status:')
  console.log(`   ID: ${element.id}`)
  console.log(`   Title: "${element.title}"`)
  console.log(`   Lesson: ${element.lesson_id}`)
  console.log(`   Active: ${element.is_active}`)
  console.log(`   Order: ${element.order_index}`)
  
  if (element.is_active) {
    console.log('✅ Element is already active!')
    return
  }
  
  console.log('\n🔄 Activating element and setting priority order...')
  
  // Direct update to activate and set proper order
  const { error: updateError } = await supabase
    .from('interactive_elements')
    .update({ 
      is_active: true,
      order_index: 20 
    })
    .eq('id', element.id)
  
  if (updateError) {
    console.error('❌ Error updating element:', updateError.message)
    
    // Try via Edge Function as backup
    console.log('🔄 Trying via Edge Function...')
    const { data, error: edgeError } = await supabase.functions.invoke('chapter-content-manager', {
      body: {
        action: 'fix-element-visibility',
        data: {
          reactivateElements: [{ element_id: element.id, reason: 'Activate Maya Board Challenge' }],
          reorderElements: [{ element_id: element.id, new_order_index: 20, reason: 'Set proper priority' }],
          deactivateElements: []
        }
      }
    })
    
    if (edgeError) {
      console.error('❌ Edge Function also failed:', edgeError)
      return
    } else {
      console.log('✅ Edge Function succeeded!')
    }
  } else {
    console.log('✅ Element activated directly!')
  }
  
  // Verification
  console.log('\n🔍 Verification:')
  const { data: verifyElement } = await supabase
    .from('interactive_elements')
    .select('id, title, is_active, order_index')
    .eq('id', element.id)
    .single()
  
  if (verifyElement) {
    console.log(`   ✅ "${verifyElement.title}"`)
    console.log(`   Active: ${verifyElement.is_active}`)
    console.log(`   Order: ${verifyElement.order_index}`)
  }
  
  // Check all active Maya elements in Lesson 5
  console.log('\n📖 All Active Maya Elements in Lesson 5:')
  const { data: lesson5Maya } = await supabase
    .from('interactive_elements')
    .select('id, title, order_index')
    .eq('lesson_id', 5)
    .ilike('title', '%maya%')
    .eq('is_active', true)
    .order('order_index')
  
  if (lesson5Maya && lesson5Maya.length > 0) {
    lesson5Maya.forEach(el => {
      console.log(`   ✅ [${el.order_index}] "${el.title}"`)
    })
    console.log(`\n🎉 SUCCESS: ${lesson5Maya.length} Maya elements now active in Lesson 5!`)
  } else {
    console.log('   ❌ No active Maya elements found')
  }
  
  // Also fix the order of the main email element
  console.log('\n🔧 Setting proper priority for main email element...')
  const { error: emailUpdateError } = await supabase
    .from('interactive_elements')
    .update({ order_index: 10 })
    .eq('lesson_id', 5)
    .ilike('title', '%Email Anxiety%')
  
  if (emailUpdateError) {
    console.error('❌ Error updating email element order:', emailUpdateError.message)
  } else {
    console.log('✅ Main email element set to priority order 10')
  }
  
  console.log('\n🎉 MAYA BOARD CHALLENGE ACTIVATION COMPLETE!')
  console.log('📝 Lesson 5 should now show:')
  console.log('   1. Turn Maya\'s Email Anxiety into Connection (order 10)')
  console.log('   2. Maya\'s Board Chair Challenge (order 20)')
}

activateMayaBoardChallenge().catch(console.error)