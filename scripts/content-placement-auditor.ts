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

interface PlacementIssue {
  type: 'misplaced' | 'duplicate_functionality' | 'missing_context' | 'poor_ordering';
  severity: 'high' | 'medium' | 'low';
  description: string;
  lessonId: number;
  elementId?: number;
  suggestion: string;
}

async function auditContentPlacement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 CONTENT PLACEMENT AUDIT')
  console.log('=' * 30)
  
  const issues: PlacementIssue[] = []
  const lessons = [5, 6, 7, 8] // Chapter 2 lessons
  
  for (const lessonId of lessons) {
    console.log(`\n📖 AUDITING LESSON ${lessonId}`)
    console.log('-' * 25)
    
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
    
    if (!contentBlocks || !interactiveElements) {
      console.log('   ❌ Failed to fetch lesson data')
      continue
    }
    
    console.log(`   📊 ${contentBlocks.length} content blocks, ${interactiveElements.length} interactive elements`)
    
    // 1. Check for elements appearing before any context
    const firstContentBlock = contentBlocks[0]
    const elementsBeforeContext = interactiveElements.filter(e => 
      e.order_index < (firstContentBlock?.order_index || 999)
    )
    
    if (elementsBeforeContext.length > 0) {
      elementsBeforeContext.forEach(element => {
        issues.push({
          type: 'misplaced',
          severity: 'high',
          description: `Interactive element "${element.title}" appears before any story context`,
          lessonId,
          elementId: element.id,
          suggestion: 'Move element to appear after related content block'
        })
        console.log(`   🚨 HIGH: Element "${element.title}" appears before story context`)
      })
    }
    
    // 2. Check for duplicate functionality (same type + similar titles)
    const duplicateGroups = findDuplicateFunctionality(interactiveElements)
    duplicateGroups.forEach(group => {
      if (group.length > 1) {
        issues.push({
          type: 'duplicate_functionality',
          severity: 'medium',
          description: `Multiple elements with similar functionality: ${group.map(e => e.title).join(', ')}`,
          lessonId,
          suggestion: 'Create distinct experiences or merge into one adaptive component'
        })
        console.log(`   ⚠️ MEDIUM: Duplicate functionality - ${group.map(e => e.title).join(', ')}`)
      }
    })
    
    // 3. Check for context matching
    const contextIssues = analyzeContextMatching(contentBlocks, interactiveElements)
    contextIssues.forEach(issue => {
      issues.push({
        ...issue,
        lessonId
      })
      console.log(`   ⚠️ ${issue.severity.toUpperCase()}: ${issue.description}`)
    })
    
    // 4. Check ordering logic
    const orderingIssues = analyzeOrdering(contentBlocks, interactiveElements)
    orderingIssues.forEach(issue => {
      issues.push({
        ...issue,
        lessonId
      })
      console.log(`   ⚠️ ${issue.severity.toUpperCase()}: ${issue.description}`)
    })
    
    // Show current placement
    console.log('\n   📋 Current Content Flow:')
    const allItems = [
      ...contentBlocks.map(b => ({ ...b, itemType: 'content' as const })),
      ...interactiveElements.map(e => ({ ...e, itemType: 'interactive' as const }))
    ].sort((a, b) => a.order_index - b.order_index)
    
    allItems.forEach((item, index) => {
      const icon = item.itemType === 'content' ? '📝' : '🎯'
      const type = item.itemType === 'content' ? 'CONTENT' : 'INTERACTIVE'
      console.log(`     ${index + 1}. ${icon} [${item.order_index}] ${type}: "${item.title}"`)
    })
  }
  
  // Summary report
  console.log('\n🎯 AUDIT SUMMARY')
  console.log('=' * 20)
  
  const highIssues = issues.filter(i => i.severity === 'high')
  const mediumIssues = issues.filter(i => i.severity === 'medium')
  const lowIssues = issues.filter(i => i.severity === 'low')
  
  console.log(`📊 Issues Found:`)
  console.log(`   🚨 High Priority: ${highIssues.length}`)
  console.log(`   ⚠️ Medium Priority: ${mediumIssues.length}`)
  console.log(`   💡 Low Priority: ${lowIssues.length}`)
  
  if (issues.length === 0) {
    console.log('\n✅ No placement issues found!')
  } else {
    console.log('\n🔧 RECOMMENDED FIXES:')
    
    highIssues.forEach((issue, index) => {
      console.log(`\n${index + 1}. 🚨 ${issue.description}`)
      console.log(`   💡 Solution: ${issue.suggestion}`)
    })
    
    mediumIssues.forEach((issue, index) => {
      console.log(`\n${index + 1}. ⚠️ ${issue.description}`)
      console.log(`   💡 Solution: ${issue.suggestion}`)
    })
  }
  
  return issues
}

function findDuplicateFunctionality(elements: InteractiveElement[]): InteractiveElement[][] {
  const groups: InteractiveElement[][] = []
  const processed = new Set<number>()
  
  elements.forEach(element => {
    if (processed.has(element.id)) return
    
    const similar = elements.filter(other => 
      other.id !== element.id && 
      !processed.has(other.id) &&
      (
        other.type === element.type ||
        areTitlesSimilar(element.title, other.title)
      )
    )
    
    if (similar.length > 0) {
      const group = [element, ...similar]
      groups.push(group)
      group.forEach(item => processed.add(item.id))
    }
  })
  
  return groups
}

function areTitlesSimilar(title1: string, title2: string): boolean {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, ' ').trim()
  const words1 = normalize(title1).split(/\s+/)
  const words2 = normalize(title2).split(/\s+/)
  
  const commonWords = words1.filter(word => words2.includes(word))
  return commonWords.length >= 2 // At least 2 words in common
}

function analyzeContextMatching(
  contentBlocks: ContentBlock[], 
  elements: InteractiveElement[]
): Omit<PlacementIssue, 'lessonId'>[] {
  const issues: Omit<PlacementIssue, 'lessonId'>[] = []
  
  elements.forEach(element => {
    // Check if element has obvious context relationship
    const relatedBlock = findRelatedContentBlock(element, contentBlocks)
    
    if (!relatedBlock) {
      issues.push({
        type: 'missing_context',
        severity: 'medium',
        description: `Element "${element.title}" has no clear story context`,
        elementId: element.id,
        suggestion: 'Add content block that sets up this interactive element'
      })
    } else {
      // Check if element appears reasonably close to its context
      const contextIndex = relatedBlock.order_index
      const elementIndex = element.order_index
      
      if (elementIndex < contextIndex) {
        issues.push({
          type: 'misplaced',
          severity: 'high',
          description: `Element "${element.title}" appears before its context "${relatedBlock.title}"`,
          elementId: element.id,
          suggestion: `Move element to appear after content block "${relatedBlock.title}"`
        })
      }
    }
  })
  
  return issues
}

function findRelatedContentBlock(element: InteractiveElement, blocks: ContentBlock[]): ContentBlock | null {
  const elementTitle = element.title.toLowerCase()
  
  // Maya-specific matching logic
  if (elementTitle.includes('email')) {
    return blocks.find(block => 
      block.title.toLowerCase().includes('email') ||
      block.content.toLowerCase().includes('email')
    ) || null
  }
  
  if (elementTitle.includes('grant') || elementTitle.includes('proposal')) {
    return blocks.find(block => 
      block.title.toLowerCase().includes('grant') ||
      block.title.toLowerCase().includes('proposal') ||
      block.content.toLowerCase().includes('grant')
    ) || null
  }
  
  if (elementTitle.includes('meeting') || elementTitle.includes('board')) {
    return blocks.find(block => 
      block.title.toLowerCase().includes('meeting') ||
      block.title.toLowerCase().includes('board') ||
      block.content.toLowerCase().includes('board')
    ) || null
  }
  
  if (elementTitle.includes('research')) {
    return blocks.find(block => 
      block.title.toLowerCase().includes('research') ||
      block.content.toLowerCase().includes('research')
    ) || null
  }
  
  return null
}

function analyzeOrdering(
  contentBlocks: ContentBlock[], 
  elements: InteractiveElement[]
): Omit<PlacementIssue, 'lessonId'>[] {
  const issues: Omit<PlacementIssue, 'lessonId'>[] = []
  
  // Check for elements with very high order_index (likely placed at end by default)
  elements.forEach(element => {
    if (element.order_index > 1000) {
      issues.push({
        type: 'poor_ordering',
        severity: 'medium',
        description: `Element "${element.title}" has very high order_index (${element.order_index})`,
        elementId: element.id,
        suggestion: 'Assign proper order_index based on story flow'
      })
    }
  })
  
  return issues
}

auditContentPlacement().catch(console.error)