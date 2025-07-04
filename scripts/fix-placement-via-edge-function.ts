import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function fixPlacementViaEdgeFunction() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🚀 FIXING PLACEMENT VIA EDGE FUNCTION')
  console.log('=' * 40)
  
  // First get the element IDs
  const elementUpdates = []
  
  const elementsToFix = [
    { lessonId: 5, title: "Maya's Parent Response Email Helper", newOrder: 15 },
    { lessonId: 5, title: "Turn Maya's Email Anxiety into Connection", newOrder: 55 },
    { lessonId: 6, title: "Maya's Strategic Grant Proposal Builder", newOrder: 15 },
    { lessonId: 6, title: "Maya's Grant Proposal Challenge", newOrder: 35 },
    { lessonId: 7, title: "Maya's Critical Board Meeting Preparation", newOrder: 15 },
    { lessonId: 7, title: "Maya's Emergency Board Meeting Prep", newOrder: 25 },
    { lessonId: 8, title: "Maya's Research Synthesis Wizard", newOrder: 15 },
    { lessonId: 8, title: "Maya's Research Synthesis Challenge", newOrder: 25 }
  ]
  
  console.log('📋 Collecting element IDs...')
  
  for (const element of elementsToFix) {
    const { data } = await supabase
      .from('interactive_elements')
      .select('id')
      .eq('lesson_id', element.lessonId)
      .eq('title', element.title)
      .single()
    
    if (data) {
      elementUpdates.push({
        element_id: data.id,
        new_order_index: element.newOrder,
        reason: `Fix placement for "${element.title}" in L${element.lessonId}`
      })
      console.log(`   ✅ Found ${element.title}: ID ${data.id} → Order ${element.newOrder}`)
    } else {
      console.log(`   ❌ Not found: ${element.title}`)
    }
  }
  
  console.log(`\n🔄 Updating ${elementUpdates.length} elements via Edge Function...`)
  
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'fix-element-visibility',
      data: {
        reorderElements: elementUpdates,
        reactivateElements: [],
        deactivateElements: []
      }
    }
  })
  
  if (error) {
    console.error('❌ Edge Function error:', error)
    return
  }
  
  console.log('✅ Edge Function executed successfully!')
  
  // Wait for propagation
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Verification
  console.log('\n🔍 Verification - Updated Element Orders:')
  
  for (const element of elementsToFix) {
    const { data } = await supabase
      .from('interactive_elements')
      .select('id, title, order_index')
      .eq('lesson_id', element.lessonId)
      .eq('title', element.title)
      .single()
    
    if (data) {
      const status = data.order_index === element.newOrder ? '✅' : '❌'
      console.log(`   ${status} L${element.lessonId}: "${element.title}" → Order ${data.order_index} (expected ${element.newOrder})`)
    }
  }
  
  console.log('\n🎉 PLACEMENT FIX COMPLETE!')
  console.log('📝 Please refresh the frontend to see updated element positioning')
}

fixPlacementViaEdgeFunction().catch(console.error)