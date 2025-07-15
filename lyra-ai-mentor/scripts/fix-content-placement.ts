import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function fixContentPlacement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔧 FIXING CONTENT PLACEMENT ISSUES')
  console.log('=' * 35)
  
  // Define the proper placement mapping: element title → content block context → new order_index
  const placementFixes = [
    // Lesson 5
    {
      elementTitle: "Maya's Parent Response Email Helper",
      lessonId: 5,
      afterContentTitle: "Maya's Monday Morning Email Crisis",
      newOrderIndex: 15, // Place after crisis (10) but before next block (20)
      reasoning: "Should appear after Maya encounters email crisis"
    },
    {
      elementTitle: "Turn Maya's Email Anxiety into Connection", 
      lessonId: 5,
      afterContentTitle: "The AI Email Composer: Your New Best Friend",
      newOrderIndex: 55, // Place after introduction to AI tools (50)
      reasoning: "Should appear after learning about AI email tools"
    },
    
    // Lesson 6
    {
      elementTitle: "Maya's Strategic Grant Proposal Builder",
      lessonId: 6,
      afterContentTitle: "Maya's Document Crisis",
      newOrderIndex: 15, // Place after crisis (10) but before challenge (20)
      reasoning: "Should appear after Maya realizes document struggles"
    },
    {
      elementTitle: "Maya's Grant Proposal Challenge",
      lessonId: 6,
      afterContentTitle: "Maya Discovers Document AI", 
      newOrderIndex: 35, // Place after discovery (30) but before tools (40)
      reasoning: "Should appear after Maya learns about document AI"
    },
    
    // Lesson 7
    {
      elementTitle: "Maya's Critical Board Meeting Preparation",
      lessonId: 7,
      afterContentTitle: "Maya's Meeting Mayhem",
      newOrderIndex: 15, // Place after mayhem (10) but before crisis (20)
      reasoning: "Should appear after Maya's meeting struggles"
    },
    {
      elementTitle: "Maya's Emergency Board Meeting Prep",
      lessonId: 7,
      afterContentTitle: "The Meeting Challenge",
      newOrderIndex: 25, // Place after challenge (20) but before impact (30)
      reasoning: "Should appear after understanding meeting challenges"
    },
    
    // Lesson 8
    {
      elementTitle: "Maya's Research Synthesis Wizard",
      lessonId: 8,
      afterContentTitle: "Maya's Information Overload", 
      newOrderIndex: 15, // Place after overload (10) but before revolution (20)
      reasoning: "Should appear after Maya faces information overload"
    },
    {
      elementTitle: "Maya's Research Synthesis Challenge",
      lessonId: 8,
      afterContentTitle: "The Information Overload Problem",
      newOrderIndex: 25, // Place after problem (20) but before efficiency (30)
      reasoning: "Should appear after understanding the research problem"
    }
  ]
  
  console.log(`📋 Applying ${placementFixes.length} placement fixes...`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const fix of placementFixes) {
    try {
      console.log(`\n🔧 L${fix.lessonId}: "${fix.elementTitle}"`)
      console.log(`   Moving to order ${fix.newOrderIndex} (after "${fix.afterContentTitle}")`)
      console.log(`   Reason: ${fix.reasoning}`)
      
      // First, verify the element exists
      const { data: element } = await supabase
        .from('interactive_elements')
        .select('id, title, order_index')
        .eq('lesson_id', fix.lessonId)
        .eq('title', fix.elementTitle)
        .single()
      
      if (!element) {
        console.log(`   ❌ Element not found`)
        errorCount++
        continue
      }
      
      console.log(`   📍 Current order: ${element.order_index} → New order: ${fix.newOrderIndex}`)
      
      // Update the order_index
      const { error: updateError } = await supabase
        .from('interactive_elements')
        .update({ order_index: fix.newOrderIndex })
        .eq('id', element.id)
      
      if (updateError) {
        console.log(`   ❌ Update failed: ${updateError.message}`)
        errorCount++
      } else {
        console.log(`   ✅ Updated successfully`)
        successCount++
      }
      
    } catch (error) {
      console.log(`   ❌ Exception: ${error}`)
      errorCount++
    }
  }
  
  // Verification - show new content flow for each lesson
  console.log('\n🔍 VERIFICATION - New Content Flow:')
  
  for (const lessonId of [5, 6, 7, 8]) {
    console.log(`\n📖 Lesson ${lessonId} - Updated Flow:`)
    
    // Get all content blocks and interactive elements
    const { data: contentBlocks } = await supabase
      .from('content_blocks')
      .select('id, title, order_index')
      .eq('lesson_id', lessonId)
      .order('order_index')
    
    const { data: interactiveElements } = await supabase
      .from('interactive_elements')
      .select('id, title, order_index')
      .eq('lesson_id', lessonId)
      .eq('is_active', true)
      .order('order_index')
    
    if (contentBlocks && interactiveElements) {
      const allItems = [
        ...contentBlocks.map(b => ({ ...b, itemType: 'content' as const })),
        ...interactiveElements.map(e => ({ ...e, itemType: 'interactive' as const }))
      ].sort((a, b) => a.order_index - b.order_index)
      
      allItems.forEach((item, index) => {
        const icon = item.itemType === 'content' ? '📝' : '🎯'
        const type = item.itemType === 'content' ? 'CONTENT' : 'INTERACTIVE'
        console.log(`   ${index + 1}. ${icon} [${item.order_index}] ${type}: "${item.title}"`)
      })
    }
  }
  
  // Final summary
  console.log('\n🎯 PLACEMENT FIX SUMMARY')
  console.log('=' * 25)
  console.log(`✅ Successfully updated: ${successCount} elements`)
  console.log(`❌ Failed to update: ${errorCount} elements`)
  
  if (errorCount === 0) {
    console.log('\n🎉 All placement issues fixed!')
    console.log('📋 Interactive elements now appear after their story context')
    console.log('✅ Ready for improved user experience')
  } else {
    console.log('\n⚠️ Some issues remain - manual review required')
  }
  
  return { successCount, errorCount }
}

fixContentPlacement().catch(console.error)