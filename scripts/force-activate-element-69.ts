import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function forceActivateElement69() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('⚡ FORCE ACTIVATING ELEMENT 69 VIA EDGE FUNCTION')
  console.log('=' * 48)
  
  // Use the same edge function pattern that worked for previous fixes
  const elementUpdates = [
    {
      element_id: 69,
      new_is_active: true,
      new_order_index: 20,
      reason: 'Force activate Maya Board Chair Challenge'
    }
  ]
  
  console.log('🚀 Using Edge Function with service role permissions...')
  
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'force-update-elements',
      data: {
        elementUpdates: elementUpdates
      }
    }
  })
  
  if (error) {
    console.error('❌ Edge Function error:', error)
    console.log('\n🔄 Trying direct SQL update through functions...')
    
    // Try a different approach using a custom SQL action
    const { data: sqlData, error: sqlError } = await supabase.functions.invoke('chapter-content-manager', {
      body: {
        action: 'execute-sql',
        data: {
          query: `
            UPDATE interactive_elements 
            SET is_active = true, order_index = 20 
            WHERE id = 69;
          `,
          reason: 'Force activate Maya Board Chair Challenge element'
        }
      }
    })
    
    if (sqlError) {
      console.error('❌ SQL execution also failed:', sqlError)
    } else {
      console.log('✅ SQL execution succeeded!')
    }
  } else {
    console.log('✅ Edge Function executed successfully!')
    console.log('Response:', data)
  }
  
  // Wait a moment for propagation
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Final verification 
  console.log('\n🔍 Final Verification:')
  const { data: finalCheck } = await supabase
    .from('interactive_elements')
    .select('id, title, is_active, order_index, lesson_id')
    .eq('id', 69)
    .single()
  
  if (finalCheck) {
    console.log(`   Element 69: "${finalCheck.title}"`)
    console.log(`   Lesson: ${finalCheck.lesson_id}`)
    console.log(`   Active: ${finalCheck.is_active ? '✅ TRUE' : '❌ FALSE'}`)
    console.log(`   Order: ${finalCheck.order_index}`)
  }
  
  // Check all Lesson 5 Maya elements
  console.log('\n📖 All Maya Elements in Lesson 5:')
  const { data: allMaya } = await supabase
    .from('interactive_elements')
    .select('id, title, is_active, order_index')
    .eq('lesson_id', 5)
    .ilike('title', '%maya%')
    .order('order_index')
  
  if (allMaya) {
    allMaya.forEach(element => {
      const status = element.is_active ? '✅ ACTIVE' : '❌ INACTIVE'
      console.log(`   ${status} [${element.order_index}] "${element.title}"`)
    })
    
    const activeCount = allMaya.filter(e => e.is_active).length
    console.log(`\n📊 Result: ${activeCount}/${allMaya.length} Maya elements active in Lesson 5`)
    
    if (activeCount >= 2) {
      console.log('🎉 SUCCESS: Multiple Maya elements now visible!')
    } else {
      console.log('⚠️ Still need to fix element activation')
    }
  }
}

forceActivateElement69().catch(console.error)