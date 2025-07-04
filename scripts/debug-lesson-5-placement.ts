import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function debugLesson5Placement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 DEBUGGING LESSON 5 PLACEMENT ISSUE')
  console.log('=' * 40)
  
  // Check current database state
  console.log('\n📊 Current Database Order (Lesson 5):')
  
  const { data: contentBlocks } = await supabase
    .from('content_blocks')
    .select('id, title, order_index')
    .eq('lesson_id', 5)
    .order('order_index')
  
  const { data: interactiveElements } = await supabase
    .from('interactive_elements')
    .select('id, title, order_index, is_active')
    .eq('lesson_id', 5)
    .eq('is_active', true)
    .order('order_index')
  
  console.log('\n📝 Content Blocks:')
  contentBlocks?.forEach(block => {
    console.log(`   [${block.order_index}] "${block.title}"`)
  })
  
  console.log('\n🎯 Interactive Elements:')
  interactiveElements?.forEach(element => {
    console.log(`   [${element.order_index}] "${element.title}"`)
  })
  
  // Check what ContentPlacementSystem would do
  console.log('\n🧩 ContentPlacementSystem Logic Analysis:')
  
  if (interactiveElements && contentBlocks) {
    interactiveElements.forEach(element => {
      console.log(`\n🔍 Element: "${element.title}"`)
      console.log(`   Database order_index: ${element.order_index}`)
      
      // Simulate the smart matching logic from ContentPlacementSystem
      const elementTitle = element.title.toLowerCase()
      
      let simulatedMatch = null
      
      if (elementTitle.includes('parent response') || elementTitle.includes('email helper')) {
        simulatedMatch = contentBlocks.find(block => 
          block.title.toLowerCase().includes('email') ||
          block.title.toLowerCase().includes('parent') ||
          block.title.toLowerCase().includes('board chair')
        )
        console.log(`   Smart match (parent/email): "${simulatedMatch?.title}" [${simulatedMatch?.order_index}]`)
      }
      
      if (elementTitle.includes('email anxiety') || elementTitle.includes('connection')) {
        simulatedMatch = contentBlocks.find(block => 
          block.title.toLowerCase().includes('email') ||
          block.title.toLowerCase().includes('crisis')
        )
        console.log(`   Smart match (anxiety/email): "${simulatedMatch?.title}" [${simulatedMatch?.order_index}]`)
      }
      
      if (simulatedMatch) {
        const smartOrder = simulatedMatch.order_index + 0.5
        console.log(`   Smart placement would be: ${smartOrder}`)
        console.log(`   This ${smartOrder === 10.5 ? 'IS' : 'IS NOT'} the problem - both elements would go after first block!`)
      }
    })
  }
  
  // Show the combined order as ContentPlacementSystem would render it
  console.log('\n📋 How ContentPlacementSystem Currently Orders Items:')
  
  if (contentBlocks && interactiveElements) {
    // Simulate ContentPlacementSystem's createContentSequence logic
    const sequence: any[] = []
    
    // Add content blocks
    contentBlocks.forEach(block => {
      sequence.push({
        type: 'content',
        item: block,
        order: block.order_index
      })
    })
    
    // Add interactive elements with smart placement
    interactiveElements.forEach(element => {
      let placementOrder = element.order_index
      
      // This is the problematic logic from ContentPlacementSystem
      const elementTitle = element.title.toLowerCase()
      
      if (elementTitle.includes('email')) {
        // Both elements include 'email' so both get matched to first email block!
        const emailBlock = contentBlocks.find(block => 
          block.title.toLowerCase().includes('email')
        )
        if (emailBlock) {
          placementOrder = emailBlock.order_index + 0.5 // Both go to 10.5!
        }
      }
      
      sequence.push({
        type: 'interactive',
        item: element,
        order: placementOrder
      })
    })
    
    // Sort by order (this is what user sees)
    const sortedSequence = sequence.sort((a, b) => a.order - b.order)
    
    console.log('\nWhat user actually sees:')
    sortedSequence.forEach((item, index) => {
      const icon = item.type === 'content' ? '📝' : '🎯'
      const type = item.type === 'content' ? 'STORY' : 'INTERACTIVE'
      console.log(`   ${index + 1}. ${icon} [${item.order}] ${type}: "${item.item.title}"`)
    })
  }
  
  console.log('\n💡 ROOT CAUSE IDENTIFIED:')
  console.log('   ContentPlacementSystem\'s smart matching logic overrides database order_index')
  console.log('   Both email elements match the first email block (Maya\'s Monday Morning Email Crisis)')
  console.log('   Both get placed at order 10.5, ignoring our careful 45 and 135 positioning')
  
  console.log('\n🔧 SOLUTION:')
  console.log('   1. Disable smart placement logic and use database order_index directly')
  console.log('   2. OR: Fix smart matching to be more specific')
  console.log('   3. OR: Use traditional LessonContent component for Chapter 2')
}

debugLesson5Placement().catch(console.error)