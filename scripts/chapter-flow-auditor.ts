import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

interface ContentBlock {
  id: number
  lesson_id: number
  title: string
  content: string
  order_index: number
  type: string
}

interface InteractiveElement {
  id: number
  lesson_id: number
  title: string
  type: string
  description?: string
  order_index: number
  is_visible: boolean
}

interface ChapterAudit {
  currentStructure: Array<{
    order: number
    type: 'content' | 'interactive'
    title: string
    issues: string[]
  }>
  narrativeGaps: string[]
  flowIssues: string[]
  recommendations: string[]
  proposedStructure: Array<{
    order: number
    type: 'content' | 'interactive'
    title: string
    purpose: string
    edits?: string
  }>
}

async function auditChapterFlow(chapterId: number = 2): Promise<ChapterAudit> {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log(`\n🔍 COMPREHENSIVE CHAPTER ${chapterId} AUDIT\n${'='.repeat(60)}\n`)
  
  // Get lessons for this chapter
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, description')
    .eq('chapter_id', chapterId)
    .order('order_index')
  
  console.log(`Found ${lessons?.length} lessons in Chapter ${chapterId}`)
  
  const audit: ChapterAudit = {
    currentStructure: [],
    narrativeGaps: [],
    flowIssues: [],
    recommendations: [],
    proposedStructure: []
  }
  
  // For each lesson, analyze the flow
  for (const lesson of lessons || []) {
    console.log(`\n📚 Analyzing Lesson ${lesson.id}: ${lesson.title}`)
    console.log('-'.repeat(50))
    
    // Get all content blocks
    const { data: blocks } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', lesson.id)
      .order('order_index')
    
    // Get visible interactive elements
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', lesson.id)
      .eq('is_visible', true)
      .order('order_index')
    
    // Merge and sort by order_index
    const allItems = [
      ...(blocks || []).map(b => ({ ...b, itemType: 'content' as const })),
      ...(elements || []).map(e => ({ ...e, itemType: 'interactive' as const }))
    ].sort((a, b) => a.order_index - b.order_index)
    
    console.log(`\n📋 Current Structure:`)
    
    // Track story elements
    let hasProblemmIntroduced = false
    let hasToolIntroduced = false
    let hasPracticeOpportunity = false
    let hasOutcome = false
    let lastWasInteractive = false
    
    allItems.forEach((item, index) => {
      const issues: string[] = []
      
      if (item.itemType === 'content') {
        const block = item as ContentBlock
        
        // Check for story arc elements
        if (block.content.toLowerCase().includes('struggle') || 
            block.content.toLowerCase().includes('problem') ||
            block.content.toLowerCase().includes('challenge')) {
          hasProblemmIntroduced = true
        }
        
        if (block.content.toLowerCase().includes('ai email composer') ||
            block.content.toLowerCase().includes('lyra chat')) {
          hasToolIntroduced = true
        }
        
        // Check for issues
        if (block.content.includes('four game-changing tools') && elements?.length === 2) {
          issues.push('Content promises more tools than available')
        }
        
        if (lastWasInteractive) {
          // Good - content after interactive could be reflection
        }
        
        console.log(`  ${block.order_index}. [CONTENT] ${block.title}`)
        if (issues.length > 0) {
          console.log(`     ⚠️  Issues: ${issues.join(', ')}`)
        }
        
        audit.currentStructure.push({
          order: block.order_index,
          type: 'content',
          title: block.title,
          issues
        })
        
        lastWasInteractive = false
      } else {
        const element = item as InteractiveElement
        
        // Check for issues
        if (!hasProblemmIntroduced) {
          issues.push('Interactive appears before problem is introduced')
        }
        
        if (!hasToolIntroduced && element.type === 'ai_email_composer') {
          issues.push('Tool used before being introduced')
        }
        
        if (!element.description) {
          issues.push('Missing description/context')
        }
        
        if (lastWasInteractive) {
          issues.push('Back-to-back interactive elements without reflection')
        }
        
        console.log(`  ${element.order_index}. [INTERACTIVE] ${element.title} (${element.type})`)
        if (issues.length > 0) {
          console.log(`     ⚠️  Issues: ${issues.join(', ')}`)
        }
        
        audit.currentStructure.push({
          order: element.order_index,
          type: 'interactive',
          title: element.title,
          issues
        })
        
        hasPracticeOpportunity = true
        lastWasInteractive = true
      }
    })
    
    // Analyze narrative gaps
    if (!hasProblemmIntroduced) {
      audit.narrativeGaps.push('No clear problem/challenge introduced')
    }
    if (!hasToolIntroduced && elements && elements.length > 0) {
      audit.narrativeGaps.push('Tools used without introduction')
    }
    if (!hasPracticeOpportunity) {
      audit.narrativeGaps.push('No hands-on practice opportunities')
    }
    
    // Analyze flow issues
    const contentBeforeFirstInteractive = allItems.findIndex(i => i.itemType === 'interactive')
    if (contentBeforeFirstInteractive > 5) {
      audit.flowIssues.push('Too much content before first interactive element')
    }
    
    // Check for character consistency
    const mayaContent = blocks?.filter(b => b.content.includes('Maya'))
    const otherCharacters = blocks?.filter(b => 
      b.content.includes('James') || 
      b.content.includes('Sofia') || 
      b.content.includes('David') ||
      b.content.includes('Rachel') ||
      b.content.includes('Alex')
    )
    
    if (lesson.id === 5 && otherCharacters && otherCharacters.length > 0) {
      audit.flowIssues.push('Characters mentioned before being introduced')
    }
  }
  
  // Generate recommendations
  console.log(`\n💡 Recommendations for Story Arc:`)
  console.log('1. PROBLEM: Introduce Maya\'s email overwhelm vividly')
  console.log('2. DISCOVERY: Show Maya discovering AI tools with "aha" moment')
  console.log('3. PRACTICE: Hands-on with increasing complexity')
  console.log('4. MASTERY: Maya transforms her workflow')
  
  // Create proposed structure for Lesson 5 (Maya's Email Journey)
  audit.proposedStructure = [
    {
      order: 10,
      type: 'content',
      title: 'Maya\'s Monday Morning Crisis',
      purpose: 'PROBLEM - Establish emotional connection',
      edits: 'Keep vivid description of email overwhelm'
    },
    {
      order: 20,
      type: 'content',
      title: 'The Cost of Communication Chaos',
      purpose: 'PROBLEM - Show impact on mission',
      edits: 'Merge "Hidden Cost" and "Nonprofit Crisis" blocks'
    },
    {
      order: 30,
      type: 'content',
      title: 'Maya Discovers AI Email Tools',
      purpose: 'DISCOVERY - Introduction to solution',
      edits: 'Show Maya learning about AI Email Composer with examples'
    },
    {
      order: 40,
      type: 'content',
      title: 'Sarah\'s Urgent Concern',
      purpose: 'PRACTICE SETUP - Real scenario',
      edits: 'Introduce parent email situation'
    },
    {
      order: 50,
      type: 'interactive',
      title: 'Help Maya Respond to Sarah',
      purpose: 'PRACTICE - First hands-on with guidance'
    },
    {
      order: 60,
      type: 'content',
      title: 'Maya\'s First Success',
      purpose: 'REFLECTION - Show immediate impact',
      edits: 'Maya sends email in 5 minutes vs usual 30'
    },
    {
      order: 70,
      type: 'content',
      title: 'Mastering Tone and Context',
      purpose: 'DISCOVERY - Advanced features',
      edits: 'Introduce tone adjustment, templates'
    },
    {
      order: 80,
      type: 'content',
      title: 'Board Chair Emergency',
      purpose: 'PRACTICE SETUP - Higher stakes',
      edits: 'Urgent funding question from board chair'
    },
    {
      order: 90,
      type: 'interactive',
      title: 'Maya\'s Board Communication',
      purpose: 'PRACTICE - More complex scenario'
    },
    {
      order: 100,
      type: 'content',
      title: 'The Power of AI Guidance',
      purpose: 'DISCOVERY - Introduce Lyra Chat',
      edits: 'Maya discovers she can get personalized help'
    },
    {
      order: 110,
      type: 'interactive',
      title: 'Explore Communication Strategies with Lyra',
      purpose: 'PRACTICE - Open-ended exploration'
    },
    {
      order: 120,
      type: 'content',
      title: 'Maya\'s Transformation Complete',
      purpose: 'MASTERY - Show full impact',
      edits: 'Monday is now her most productive day'
    },
    {
      order: 130,
      type: 'content',
      title: 'Your Journey Begins',
      purpose: 'CALL TO ACTION - Transition to user',
      edits: 'Inspire user to transform their communication'
    }
  ]
  
  return audit
}

// Run the audit
async function main() {
  const audit = await auditChapterFlow(2)
  
  console.log('\n\n📊 AUDIT SUMMARY')
  console.log('='.repeat(60))
  console.log(`\n🚨 Narrative Gaps Found: ${audit.narrativeGaps.length}`)
  audit.narrativeGaps.forEach(gap => console.log(`  - ${gap}`))
  
  console.log(`\n⚠️  Flow Issues Found: ${audit.flowIssues.length}`)
  audit.flowIssues.forEach(issue => console.log(`  - ${issue}`))
  
  console.log('\n✅ PROPOSED NEW STRUCTURE:')
  console.log('Following Problem → Discovery → Practice → Mastery arc\n')
  
  audit.proposedStructure.forEach(item => {
    const icon = item.type === 'content' ? '📄' : '🎯'
    console.log(`${icon} ${item.order}. ${item.title}`)
    console.log(`   Purpose: ${item.purpose}`)
    if (item.edits) {
      console.log(`   Edits: ${item.edits}`)
    }
    console.log()
  })
  
  // Save audit results
  const fs = await import('fs')
  await fs.promises.writeFile(
    'chapter-2-audit-results.json',
    JSON.stringify(audit, null, 2)
  )
  console.log('\n💾 Full audit saved to chapter-2-audit-results.json')
}

main().catch(console.error)