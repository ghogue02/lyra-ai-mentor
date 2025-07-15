import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function mapChapterStructure() {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('\n📊 CHAPTER 2 DETAILED STRUCTURE MAP\n' + '='.repeat(60) + '\n')
  
  // First, let's find the specific lesson we're working with (Maya's Email lesson)
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .order('id')
  
  console.log('Available Chapters:')
  chapters?.forEach(ch => console.log(`  Chapter ${ch.id}: ${ch.title}`))
  
  // Get lessons for Chapter 2
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('chapter_id', 2)
    .order('order_index')
  
  console.log('\n\nChapter 2 Lessons:')
  lessons?.forEach(lesson => {
    console.log(`  Lesson ${lesson.id} (order: ${lesson.order_index}): ${lesson.title}`)
  })
  
  // Focus on Lesson 5 - Maya's Email Journey
  const targetLesson = 5
  console.log(`\n\n📚 DETAILED ANALYSIS: Lesson ${targetLesson}\n` + '-'.repeat(60))
  
  // Get all content blocks
  const { data: blocks } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', targetLesson)
    .order('order_index')
  
  // Get ALL interactive elements (including hidden ones for complete picture)
  const { data: allElements } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', targetLesson)
    .order('order_index')
  
  const visibleElements = allElements?.filter(e => e.is_visible)
  const hiddenElements = allElements?.filter(e => !e.is_visible)
  
  console.log(`\nContent Blocks: ${blocks?.length || 0}`)
  console.log(`Visible Interactive Elements: ${visibleElements?.length || 0}`)
  console.log(`Hidden Admin Elements: ${hiddenElements?.length || 0}`)
  
  // Create combined timeline
  const timeline: any[] = []
  
  blocks?.forEach(block => {
    timeline.push({
      order: block.order_index,
      type: 'CONTENT',
      title: block.title,
      preview: block.content.substring(0, 150).replace(/\n/g, ' ') + '...',
      issues: []
    })
  })
  
  visibleElements?.forEach(element => {
    timeline.push({
      order: element.order_index,
      type: 'INTERACTIVE',
      title: element.title,
      elementType: element.type,
      hasDescription: !!element.description,
      issues: []
    })
  })
  
  // Sort by order
  timeline.sort((a, b) => a.order - b.order)
  
  console.log('\n📜 CURRENT FLOW:\n')
  
  let lastType = ''
  let problemIntroduced = false
  let toolsIntroduced: string[] = []
  let charactersIntroduced: string[] = ['Maya']
  
  timeline.forEach((item, index) => {
    const prefix = item.type === 'CONTENT' ? '📄' : '🎯'
    console.log(`${prefix} ${item.order}. ${item.title}`)
    
    if (item.type === 'CONTENT') {
      console.log(`     "${item.preview}"`)
      
      // Check for story elements
      if (item.preview.toLowerCase().includes('struggle') || 
          item.preview.toLowerCase().includes('47 unread emails') ||
          item.preview.toLowerCase().includes('crisis')) {
        problemIntroduced = true
        console.log('     ✓ Introduces problem')
      }
      
      if (item.preview.includes('AI Email Composer')) {
        toolsIntroduced.push('AI Email Composer')
        console.log('     ✓ Introduces AI Email Composer')
      }
      
      if (item.preview.includes('Lyra Chat')) {
        toolsIntroduced.push('Lyra Chat')
        console.log('     ✓ Introduces Lyra Chat')
      }
      
      // Check for premature character mentions
      const unauthorizedChars = ['James', 'Sofia', 'David', 'Rachel', 'Alex']
      unauthorizedChars.forEach(char => {
        if (item.preview.includes(char) && !charactersIntroduced.includes(char)) {
          item.issues.push(`Mentions ${char} before introduction`)
        }
      })
    } else {
      console.log(`     Type: ${item.elementType}`)
      console.log(`     Has context: ${item.hasDescription ? 'Yes' : 'No'}`)
      
      // Check if tool was introduced
      if (item.elementType === 'ai_email_composer' && !toolsIntroduced.includes('AI Email Composer')) {
        item.issues.push('Uses tool before introduction')
      }
      
      if (!problemIntroduced) {
        item.issues.push('Appears before problem is established')
      }
      
      if (lastType === 'INTERACTIVE') {
        item.issues.push('Back-to-back interactive without reflection')
      }
    }
    
    if (item.issues.length > 0) {
      console.log(`     ⚠️  ISSUES: ${item.issues.join(', ')}`)
    }
    
    lastType = item.type
    console.log()
  })
  
  // Analyze gaps
  console.log('\n🔍 STRUCTURAL ANALYSIS:\n')
  
  const contentCount = timeline.filter(i => i.type === 'CONTENT').length
  const interactiveCount = timeline.filter(i => i.type === 'INTERACTIVE').length
  const issueCount = timeline.reduce((sum, item) => sum + item.issues.length, 0)
  
  console.log(`Total Items: ${timeline.length}`)
  console.log(`Content Blocks: ${contentCount}`)
  console.log(`Interactive Elements: ${interactiveCount}`)
  console.log(`Issues Found: ${issueCount}`)
  
  console.log('\n📋 NARRATIVE GAPS:')
  
  // Check story arc completeness
  const hasSetup = timeline.some(i => i.order <= 30 && i.title.includes('Crisis'))
  const hasDiscovery = timeline.some(i => i.title.includes('Discover') || i.title.includes('Revolution'))
  const hasPractice = interactiveCount >= 2
  const hasMastery = timeline.some(i => i.title.includes('Transformation') || i.title.includes('Transform'))
  
  console.log(`- Problem Setup: ${hasSetup ? '✅' : '❌ Missing clear problem introduction'}`)
  console.log(`- Discovery Phase: ${hasDiscovery ? '✅' : '❌ Missing tool discovery moment'}`)
  console.log(`- Practice Opportunities: ${hasPractice ? '✅' : '❌ Insufficient hands-on practice'}`)
  console.log(`- Mastery/Outcome: ${hasMastery ? '✅' : '❌ Missing transformation outcome'}`)
  
  console.log('\n🚨 CRITICAL ISSUES:')
  
  const criticalIssues = [
    'Content jumps between concepts without smooth transitions',
    'Interactive elements appear without sufficient context',
    'No reflection or success moments after practice',
    'Character mentions before proper introduction',
    'Tool features discussed before basic introduction'
  ]
  
  criticalIssues.forEach(issue => console.log(`- ${issue}`))
  
  // Save detailed map
  const detailedMap = {
    lesson: targetLesson,
    currentTimeline: timeline,
    statistics: {
      contentBlocks: contentCount,
      interactiveElements: interactiveCount,
      totalIssues: issueCount
    },
    narrativeCompleteness: {
      problemSetup: hasSetup,
      discovery: hasDiscovery,
      practice: hasPractice,
      mastery: hasMastery
    },
    criticalIssues,
    hiddenElements: hiddenElements?.map(e => ({
      title: e.title,
      type: e.type,
      order: e.order_index
    }))
  }
  
  const fs = await import('fs')
  await fs.promises.writeFile(
    'chapter-2-detailed-map.json',
    JSON.stringify(detailedMap, null, 2)
  )
  
  console.log('\n💾 Detailed map saved to chapter-2-detailed-map.json')
  console.log('\n🎯 Next Step: Create restructuring plan based on these findings')
}

mapChapterStructure().catch(console.error)