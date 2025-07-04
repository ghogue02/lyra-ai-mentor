import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function verifyRestructure() {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('\n✅ CHAPTER 2 RESTRUCTURE VERIFICATION\n' + '='.repeat(60))
  
  // Get all content blocks
  const { data: blocks } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', 5)
    .order('order_index')
  
  // Get visible interactive elements
  const { data: elements } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')
  
  // Merge and sort
  const allItems = [
    ...(blocks || []).map(b => ({ ...b, itemType: 'content' as const })),
    ...(elements || []).map(e => ({ ...e, itemType: 'interactive' as const }))
  ].sort((a, b) => a.order_index - b.order_index)
  
  console.log(`\n📊 Structure Summary:`)
  console.log(`  - Content Blocks: ${blocks?.length || 0}`)
  console.log(`  - Interactive Elements: ${elements?.length || 0}`)
  console.log(`  - Total Items: ${allItems.length}`)
  
  console.log('\n📜 NEW CHAPTER FLOW:\n')
  
  // Track story arc phases
  let currentPhase = ''
  const phases: { [key: number]: string } = {
    10: '=== PROBLEM PHASE ===',
    40: '=== DISCOVERY PHASE ===',
    70: '=== FIRST PRACTICE ===',
    100: '=== ADVANCED DISCOVERY ===',
    130: '=== SECOND PRACTICE ===',
    160: '=== LYRA DISCOVERY ===',
    180: '=== MASTERY PHASE ==='
  }
  
  allItems.forEach(item => {
    // Check for phase change
    if (phases[item.order_index]) {
      console.log(`\n${phases[item.order_index]}\n`)
      currentPhase = phases[item.order_index]
    }
    
    if (item.itemType === 'content') {
      const block = item as any
      console.log(`📄 ${block.order_index}. ${block.title}`)
      console.log(`   "${block.content.substring(0, 120)}..."`)
    } else {
      const element = item as any
      console.log(`\n🎯 ${element.order_index}. ${element.title}`)
      console.log(`   Type: ${element.type}`)
      if (element.description) {
        console.log(`   Context: "${element.description.substring(0, 100)}..."`)
      }
    }
    console.log()
  })
  
  // Verify story arc completeness
  console.log('\n🎯 STORY ARC VERIFICATION:')
  
  const checks = {
    problemIntroduced: allItems.some(i => i.order_index <= 30 && i.title.includes('Crisis')),
    discoveryMoment: allItems.some(i => i.title.includes('Discovers') || i.title.includes('AI Email')),
    firstPractice: elements?.some(e => e.order_index < 100),
    reflection: allItems.some(i => i.title.includes('Success') || i.title.includes('First AI')),
    advancedFeatures: allItems.some(i => i.title.includes('Advanced') || i.title.includes('Mastering')),
    secondPractice: elements?.some(e => e.order_index >= 100 && e.order_index < 160),
    lyraIntroduction: allItems.some(i => i.title.includes('Lyra')),
    mastery: allItems.some(i => i.title.includes('Transformation') && i.order_index >= 180),
    callToAction: allItems.some(i => i.title.includes('Your') && i.title.includes('Starts Now'))
  }
  
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${check.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  })
  
  // Check for common issues
  console.log('\n🔍 QUALITY CHECKS:')
  
  let lastWasInteractive = false
  let interactiveWithoutSetup = 0
  let backToBackInteractive = 0
  
  allItems.forEach((item, index) => {
    if (item.itemType === 'interactive') {
      if (index === 0 || allItems[index - 1].itemType === 'interactive') {
        interactiveWithoutSetup++
      }
      if (lastWasInteractive) {
        backToBackInteractive++
      }
      lastWasInteractive = true
    } else {
      lastWasInteractive = false
    }
  })
  
  console.log(`  ${interactiveWithoutSetup === 0 ? '✅' : '❌'} All interactive elements have content setup`)
  console.log(`  ${backToBackInteractive === 0 ? '✅' : '❌'} No back-to-back interactive elements`)
  
  // Check content promises match reality
  const fourToolsMentions = blocks?.filter(b => 
    b.content.includes('four game-changing tools') || 
    b.content.includes('four tools')
  ).length || 0
  
  console.log(`  ${fourToolsMentions === 0 ? '✅' : '❌'} Content accurately describes available tools`)
  
  // Character consistency
  const unauthorizedCharacters = blocks?.filter(b => 
    b.lesson_id === 5 && (
      b.content.includes('Sofia') ||
      b.content.includes('David') ||
      b.content.includes('Rachel') ||
      b.content.includes('Alex')
    )
  ).length || 0
  
  console.log(`  ${unauthorizedCharacters === 0 ? '✅' : '❌'} No premature character introductions`)
  
  console.log('\n🎉 Restructure verification complete!')
}

verifyRestructure().catch(console.error)