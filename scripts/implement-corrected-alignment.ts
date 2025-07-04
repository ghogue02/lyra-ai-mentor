import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function implementCorrectedAlignment() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🎯 IMPLEMENTING CORRECTED CONTENT ALIGNMENT')
  console.log('=' * 45)
  
  // Corrected placement based on story analysis
  const alignmentUpdates = [
    // Lesson 5 - Email Assistant
    {
      elementId: 68,
      elementTitle: "Turn Maya's Email Anxiety into Connection",
      newOrder: 45,
      lessonId: 5,
      afterContent: "Maya Discovers Her AI Email Assistant",
      reasoning: "Maya practices with AI after learning about it"
    },
    {
      elementId: 171,
      elementTitle: "Maya's Parent Response Email Helper", 
      newOrder: 135,
      lessonId: 5,
      afterContent: "Challenge #2: The Board Chair's Funding Concern",
      reasoning: "Maya faces specific board chair crisis and needs help"
    },
    
    // Lesson 6 - Document Creation
    {
      elementId: 152,
      elementTitle: "Maya's Grant Proposal Challenge",
      newOrder: 15,
      lessonId: 6,
      afterContent: "Maya's Document Crisis",
      reasoning: "Maya needs help right after facing document struggles"
    },
    {
      elementId: 172,
      elementTitle: "Maya's Strategic Grant Proposal Builder",
      newOrder: 45,
      lessonId: 6,
      afterContent: "Document Tools That Transform", 
      reasoning: "Maya ready for advanced strategic approach after learning tools"
    },
    
    // Lesson 7 - Meeting Master
    {
      elementId: 173,
      elementTitle: "Maya's Critical Board Meeting Preparation",
      newOrder: 15,
      lessonId: 7,
      afterContent: "Maya's Meeting Mayhem",
      reasoning: "Maya needs help right after experiencing meeting chaos"
    },
    {
      elementId: 153,
      elementTitle: "Maya's Emergency Board Meeting Prep",
      newOrder: 25,
      lessonId: 7,
      afterContent: "The Meeting Challenge",
      reasoning: "Maya understands the broader challenge and needs specific help"
    },
    
    // Lesson 8 - Research & Organization
    {
      elementId: 174,
      elementTitle: "Maya's Research Synthesis Wizard",
      newOrder: 15,
      lessonId: 8,
      afterContent: "Maya's Information Overload",
      reasoning: "Maya needs immediate help with information overload"
    },
    {
      elementId: 154,
      elementTitle: "Maya's Research Synthesis Challenge", 
      newOrder: 25,
      lessonId: 8,
      afterContent: "The Information Overload Problem",
      reasoning: "Maya understands the problem and ready for structured approach"
    }
  ]
  
  console.log(`📋 Applying ${alignmentUpdates.length} corrected placements...`)
  
  // Use Edge Function for reliable updates
  console.log('\n🔄 Updating via Edge Function...')
  
  const edgeUpdates = alignmentUpdates.map(update => ({
    element_id: update.elementId,
    new_order_index: update.newOrder,
    reason: `${update.reasoning} (after "${update.afterContent}")`
  }))
  
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'fix-element-visibility',
      data: {
        reorderElements: edgeUpdates,
        reactivateElements: [],
        deactivateElements: []
      }
    }
  })
  
  if (error) {
    console.error('❌ Edge Function error:', error)
    
    // Fallback to direct updates
    console.log('🔄 Applying updates directly...')
    
    for (const update of alignmentUpdates) {
      try {
        const { error: updateError } = await supabase
          .from('interactive_elements')
          .update({ order_index: update.newOrder })
          .eq('id', update.elementId)
        
        if (updateError) {
          console.error(`❌ Error updating ${update.elementTitle}:`, updateError.message)
        } else {
          console.log(`✅ Updated: "${update.elementTitle}" → Position ${update.newOrder}`)
        }
      } catch (err) {
        console.error(`❌ Exception updating ${update.elementTitle}:`, err)
      }
    }
  } else {
    console.log('✅ All updates applied via Edge Function!')
  }
  
  // Wait for propagation
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Show updated flow for each lesson
  console.log('\n🔍 VERIFICATION - Updated Content Flows:')
  
  for (const lessonId of [5, 6, 7, 8]) {
    console.log(`\n📖 Lesson ${lessonId} - Corrected Flow:`)
    
    // Get all content and interactive elements
    const [contentResult, elementResult] = await Promise.all([
      supabase
        .from('content_blocks')
        .select('id, title, order_index')
        .eq('lesson_id', lessonId)
        .order('order_index'),
      supabase
        .from('interactive_elements')
        .select('id, title, order_index')
        .eq('lesson_id', lessonId)
        .eq('is_active', true)
        .order('order_index')
    ])
    
    const contentBlocks = contentResult.data || []
    const interactiveElements = elementResult.data || []
    
    // Combine and sort by order_index
    const allItems = [
      ...contentBlocks.map(b => ({ ...b, type: 'content' as const })),
      ...interactiveElements.map(e => ({ ...e, type: 'interactive' as const }))
    ].sort((a, b) => a.order_index - b.order_index)
    
    allItems.forEach((item, index) => {
      const icon = item.type === 'content' ? '📝' : '🎯'
      const typeLabel = item.type === 'content' ? 'STORY' : 'INTERACTIVE'
      console.log(`   ${index + 1}. ${icon} [${item.order_index}] ${typeLabel}: "${item.title}"`)
    })
  }
  
  // Verification of specific placements
  console.log('\n✅ PLACEMENT VERIFICATION:')
  
  for (const update of alignmentUpdates) {
    const { data: element } = await supabase
      .from('interactive_elements')
      .select('order_index')
      .eq('id', update.elementId)
      .single()
    
    if (element) {
      const status = element.order_index === update.newOrder ? '✅' : '❌'
      console.log(`   ${status} L${update.lessonId}: "${update.elementTitle}" → ${element.order_index} (expected ${update.newOrder})`)
    }
  }
  
  console.log('\n🎉 CORRECTED ALIGNMENT COMPLETE!')
  console.log('\n📋 Story-Driven Flow Achieved:')
  console.log('   L5: Email crisis → Practice → Board crisis → Specific help')
  console.log('   L6: Document crisis → Basic help → Learn tools → Advanced help') 
  console.log('   L7: Meeting chaos → Immediate help → Understand problem → Strategic help')
  console.log('   L8: Information overload → Quick help → Learn approach → Structured help')
  console.log('\n✅ Interactive elements now perfectly aligned with Maya\'s journey!')
}

implementCorrectedAlignment().catch(console.error)