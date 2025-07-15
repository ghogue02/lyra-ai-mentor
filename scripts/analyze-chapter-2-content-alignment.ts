import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

interface ContentBlock {
  id: number;
  title: string;
  content: string;
  order_index: number;
  lesson_id: number;
}

interface InteractiveElement {
  id: number;
  title: string;
  type: string;
  order_index: number;
  lesson_id: number;
}

async function analyzeContentAlignment() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('📚 CHAPTER 2 CONTENT & ELEMENT ALIGNMENT ANALYSIS')
  console.log('=' * 55)
  
  const lessons = [5, 6, 7, 8]
  const alignmentPlan: any[] = []
  
  for (const lessonId of lessons) {
    console.log(`\n📖 LESSON ${lessonId} ANALYSIS`)
    console.log('-' * 30)
    
    // Get content blocks
    const { data: contentBlocks } = await supabase
      .from('content_blocks')
      .select('id, title, content, order_index')
      .eq('lesson_id', lessonId)
      .order('order_index')
    
    // Get interactive elements
    const { data: interactiveElements } = await supabase
      .from('interactive_elements')
      .select('id, title, type, order_index')
      .eq('lesson_id', lessonId)
      .eq('is_active', true)
      .order('order_index')
    
    if (!contentBlocks || !interactiveElements) continue
    
    console.log(`\n📋 CONTENT STORY FLOW:`)
    contentBlocks.forEach((block, index) => {
      // Extract key themes from content
      const content = block.content.toLowerCase()
      const title = block.title.toLowerCase()
      
      let themes = []
      if (title.includes('crisis') || content.includes('crisis')) themes.push('🚨 Crisis')
      if (title.includes('email') || content.includes('email')) themes.push('📧 Email')
      if (title.includes('parent') || content.includes('parent')) themes.push('👥 Parent')
      if (title.includes('board') || content.includes('board')) themes.push('🏛️ Board')
      if (title.includes('grant') || content.includes('grant')) themes.push('💰 Grant')
      if (title.includes('proposal') || content.includes('proposal')) themes.push('📄 Proposal')
      if (title.includes('meeting') || content.includes('meeting')) themes.push('🤝 Meeting')
      if (title.includes('research') || content.includes('research')) themes.push('🔍 Research')
      if (title.includes('document') || content.includes('document')) themes.push('📝 Document')
      if (title.includes('ai') || content.includes('ai')) themes.push('🤖 AI Tools')
      if (title.includes('discover') || content.includes('discover')) themes.push('💡 Discovery')
      if (title.includes('success') || content.includes('success')) themes.push('🎉 Success')
      if (title.includes('transform') || content.includes('transform')) themes.push('✨ Transform')
      if (title.includes('overload') || content.includes('overload')) themes.push('📊 Overload')
      
      const themeStr = themes.length > 0 ? ` ${themes.join(' ')}` : ''
      console.log(`   ${index + 1}. [${block.order_index}] "${block.title}"${themeStr}`)
      
      // Show content snippet for context
      if (block.content) {
        const snippet = block.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
        console.log(`      💭 "${snippet}"`)
      }
    })
    
    console.log(`\n🎯 INTERACTIVE ELEMENTS:`)
    interactiveElements.forEach(element => {
      console.log(`   • [${element.order_index}] "${element.title}" (${element.type})`)
    })
    
    console.log(`\n🧩 ALIGNMENT ANALYSIS:`)
    
    // Analyze each interactive element
    interactiveElements.forEach(element => {
      const elementTitle = element.title.toLowerCase()
      let recommendedPlacement = null
      let reasoning = ''
      
      // Maya's Parent Response Email Helper
      if (elementTitle.includes('parent response')) {
        // Should come after Maya encounters a specific parent concern/email
        const parentBlock = contentBlocks.find(block => 
          block.title.toLowerCase().includes('parent') ||
          block.content.toLowerCase().includes('parent concern') ||
          block.content.toLowerCase().includes('parent email') ||
          block.title.toLowerCase().includes('board chair') ||
          block.content.toLowerCase().includes('board chair')
        )
        recommendedPlacement = parentBlock
        reasoning = 'Should appear after Maya encounters specific parent concern or board chair issue'
      }
      
      // Maya's Email Anxiety/Connection
      if (elementTitle.includes('email anxiety') || elementTitle.includes('connection')) {
        // Should come after Maya learns about AI email tools
        const aiToolsBlock = contentBlocks.find(block => 
          block.title.toLowerCase().includes('ai email') ||
          block.title.toLowerCase().includes('email composer') ||
          block.content.toLowerCase().includes('ai email') ||
          block.content.toLowerCase().includes('email composer')
        )
        recommendedPlacement = aiToolsBlock
        reasoning = 'Should appear after Maya discovers AI email tools and feels ready to practice'
      }
      
      // Grant Proposal elements
      if (elementTitle.includes('grant') || elementTitle.includes('proposal')) {
        if (elementTitle.includes('strategic')) {
          // Strategic version should come after understanding the strategic opportunity
          const strategicBlock = contentBlocks.find(block => 
            block.content.toLowerCase().includes('strategic') ||
            block.content.toLowerCase().includes('foundation') ||
            block.content.toLowerCase().includes('funding')
          )
          recommendedPlacement = strategicBlock
          reasoning = 'Should appear after Maya realizes the strategic funding opportunity'
        } else {
          // Basic version should come after Maya's document struggles
          const documentCrisisBlock = contentBlocks.find(block => 
            block.title.toLowerCase().includes('document crisis') ||
            block.title.toLowerCase().includes('document struggle') ||
            block.content.toLowerCase().includes('document struggle')
          )
          recommendedPlacement = documentCrisisBlock
          reasoning = 'Should appear after Maya faces document creation challenges'
        }
      }
      
      // Meeting elements
      if (elementTitle.includes('meeting') || elementTitle.includes('board meeting')) {
        if (elementTitle.includes('critical') || elementTitle.includes('emergency')) {
          // Should come after specific meeting crisis
          const meetingCrisisBlock = contentBlocks.find(block => 
            block.title.toLowerCase().includes('meeting mayhem') ||
            block.title.toLowerCase().includes('meeting crisis') ||
            block.content.toLowerCase().includes('meeting chaos') ||
            block.content.toLowerCase().includes('meeting struggle')
          )
          recommendedPlacement = meetingCrisisBlock
          reasoning = 'Should appear after Maya experiences meeting chaos/struggles'
        } else {
          // General meeting prep after learning about meeting challenges
          const meetingChallengeBlock = contentBlocks.find(block => 
            block.title.toLowerCase().includes('meeting challenge') ||
            block.title.toLowerCase().includes('meeting productivity') ||
            block.content.toLowerCase().includes('meeting challenge')
          )
          recommendedPlacement = meetingChallengeBlock
          reasoning = 'Should appear after understanding meeting productivity challenges'
        }
      }
      
      // Research elements
      if (elementTitle.includes('research') || elementTitle.includes('synthesis')) {
        if (elementTitle.includes('wizard')) {
          // Should come after information overload crisis
          const overloadBlock = contentBlocks.find(block => 
            block.title.toLowerCase().includes('information overload') ||
            block.content.toLowerCase().includes('information overload') ||
            block.content.toLowerCase().includes('overwhelm')
          )
          recommendedPlacement = overloadBlock
          reasoning = 'Should appear after Maya faces information overload crisis'
        } else {
          // General research challenge after understanding the problem
          const researchProblemBlock = contentBlocks.find(block => 
            block.title.toLowerCase().includes('research revolution') ||
            block.title.toLowerCase().includes('information overload problem') ||
            block.content.toLowerCase().includes('research problem')
          )
          recommendedPlacement = researchProblemBlock
          reasoning = 'Should appear after understanding research management challenges'
        }
      }
      
      if (recommendedPlacement) {
        console.log(`   ✅ "${element.title}"`)
        console.log(`      → Should be placed after: "${recommendedPlacement.title}"`)
        console.log(`      → Reasoning: ${reasoning}`)
        console.log(`      → Recommended order: ${recommendedPlacement.order_index + 5}`)
        
        alignmentPlan.push({
          lessonId,
          elementId: element.id,
          elementTitle: element.title,
          currentOrder: element.order_index,
          recommendedOrder: recommendedPlacement.order_index + 5,
          afterContentBlock: recommendedPlacement.title,
          reasoning
        })
      } else {
        console.log(`   ❌ "${element.title}"`)
        console.log(`      → No clear content alignment found`)
        console.log(`      → Needs manual review`)
      }
    })
  }
  
  // Generate final alignment plan
  console.log('\n🎯 COMPREHENSIVE ALIGNMENT PLAN')
  console.log('=' * 40)
  
  if (alignmentPlan.length > 0) {
    console.log('\n📋 Recommended Element Placements:')
    
    alignmentPlan.forEach((item, index) => {
      console.log(`\n${index + 1}. Lesson ${item.lessonId}: "${item.elementTitle}"`)
      console.log(`   Current Position: ${item.currentOrder}`)
      console.log(`   Recommended Position: ${item.recommendedOrder}`)
      console.log(`   Place After: "${item.afterContentBlock}"`)
      console.log(`   Reasoning: ${item.reasoning}`)
    })
    
    console.log('\n🔧 Implementation Script:')
    console.log('```typescript')
    console.log('const placementUpdates = [')
    alignmentPlan.forEach(item => {
      console.log(`  { elementId: ${item.elementId}, newOrder: ${item.recommendedOrder}, reason: "${item.reasoning}" },`)
    })
    console.log('];')
    console.log('```')
  }
  
  return alignmentPlan
}

analyzeContentAlignment().catch(console.error)