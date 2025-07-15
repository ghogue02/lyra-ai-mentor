import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function deepAuditChapters() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 DEEP AUDIT: CHAPTERS 3-6')
  console.log('=' * 50)
  
  // First, get the actual chapter and lesson structure
  const { data: chapters } = await supabase
    .from('chapters')
    .select(`
      id,
      title,
      description,
      lessons (
        id,
        title,
        description,
        order_index
      )
    `)
    .in('id', [3, 4, 5, 6])
    .order('id')
  
  if (!chapters || chapters.length === 0) {
    console.log('❌ No chapters found!')
    return
  }
  
  const characterMap: Record<number, string> = {
    3: 'Sofia',
    4: 'David', 
    5: 'Rachel',
    6: 'Alex'
  }
  
  const auditResults: any = {
    chapters: [],
    totalIssues: 0,
    placementIssues: [],
    formattingIssues: [],
    componentIssues: [],
    recommendations: []
  }
  
  for (const chapter of chapters) {
    const character = characterMap[chapter.id]
    console.log(`\n\n🎭 CHAPTER ${chapter.id}: ${character?.toUpperCase() || 'Unknown'}`)
    console.log(`Title: ${chapter.title}`)
    console.log(`Description: ${chapter.description?.substring(0, 100)}...`)
    console.log('-' * 50)
    
    const chapterAudit = {
      id: chapter.id,
      character,
      title: chapter.title,
      lessons: [] as any[]
    }
    
    if (!chapter.lessons || chapter.lessons.length === 0) {
      console.log('⚠️  No lessons found for this chapter')
      continue
    }
    
    for (const lesson of chapter.lessons) {
      console.log(`\n📖 Lesson ${lesson.id}: ${lesson.title}`)
      
      // Get all content and elements
      const [contentResult, elementsResult] = await Promise.all([
        supabase
          .from('content_blocks')
          .select('*')
          .eq('lesson_id', lesson.id)
          .order('order_index'),
        supabase
          .from('interactive_elements')
          .select('*')
          .eq('lesson_id', lesson.id)
          .eq('is_active', true)
          .order('order_index')
      ])
      
      const contentBlocks = contentResult.data || []
      const interactiveElements = elementsResult.data || []
      
      console.log(`   📄 Content Blocks: ${contentBlocks.length}`)
      console.log(`   🎯 Interactive Elements: ${interactiveElements.length}`)
      
      const lessonAudit = {
        id: lesson.id,
        title: lesson.title,
        contentCount: contentBlocks.length,
        elementCount: interactiveElements.length,
        issues: [] as any[]
      }
      
      // Create combined flow
      const flow = [
        ...contentBlocks.map(b => ({ ...b, flowType: 'content' })),
        ...interactiveElements.map(e => ({ ...e, flowType: 'interactive' }))
      ].sort((a, b) => a.order_index - b.order_index)
      
      // Check Issue 1: Interactive elements at the very start
      if (flow.length > 0 && flow[0].flowType === 'interactive') {
        const issue = {
          type: 'element_at_start',
          element: flow[0].title,
          order: flow[0].order_index
        }
        lessonAudit.issues.push(issue)
        auditResults.placementIssues.push({ ...issue, lesson: lesson.id, chapter: chapter.id })
        console.log(`   ❌ Interactive element at start: "${flow[0].title}"`)
      }
      
      // Check Issue 2: Story/context flow
      const storyBlocks = contentBlocks.filter(b => 
        b.title.toLowerCase().includes('story') ||
        b.title.toLowerCase().includes('journey') ||
        b.title.toLowerCase().includes('challenge') ||
        b.content.toLowerCase().includes(character.toLowerCase())
      )
      
      interactiveElements.forEach(element => {
        // Check if this is a character-specific element
        if (element.title.includes(character)) {
          const relatedStory = storyBlocks.find(story => story.order_index < element.order_index)
          if (!relatedStory && storyBlocks.length > 0) {
            const issue = {
              type: 'element_before_story',
              element: element.title,
              elementOrder: element.order_index,
              firstStoryOrder: storyBlocks[0].order_index
            }
            lessonAudit.issues.push(issue)
            auditResults.placementIssues.push({ ...issue, lesson: lesson.id, chapter: chapter.id })
            console.log(`   ⚠️  "${element.title}" appears before story context`)
          }
        }
      })
      
      // Check Issue 3: Formatting
      contentBlocks.forEach(block => {
        const hasAsterisks = block.content.includes('**')
        const hasHashtags = block.content.includes('##')
        if (hasAsterisks || hasHashtags) {
          const issue = {
            type: 'formatting',
            block: block.title,
            blockId: block.id,
            hasAsterisks,
            hasHashtags
          }
          lessonAudit.issues.push(issue)
          auditResults.formattingIssues.push({ ...issue, lesson: lesson.id, chapter: chapter.id })
        }
      })
      
      // Check Issue 4: Component routing
      interactiveElements.forEach(element => {
        if (element.title.includes(character) && !element.configuration?.component?.includes(character)) {
          const issue = {
            type: 'missing_character_component',
            element: element.title,
            elementId: element.id,
            currentType: element.type,
            currentComponent: element.configuration?.component
          }
          lessonAudit.issues.push(issue)
          auditResults.componentIssues.push({ ...issue, lesson: lesson.id, chapter: chapter.id })
          console.log(`   🔧 Missing ${character} component: "${element.title}"`)
        }
      })
      
      // Show lesson flow
      if (flow.length > 0) {
        console.log('\n   📊 Lesson Flow:')
        flow.slice(0, 5).forEach(item => {
          const icon = item.flowType === 'content' ? '📄' : '🎯'
          console.log(`      [${item.order_index}] ${icon} ${item.title}`)
        })
        if (flow.length > 5) {
          console.log(`      ... and ${flow.length - 5} more items`)
        }
      }
      
      chapterAudit.lessons.push(lessonAudit)
      auditResults.totalIssues += lessonAudit.issues.length
    }
    
    auditResults.chapters.push(chapterAudit)
  }
  
  // Generate recommendations
  auditResults.recommendations = [
    {
      priority: 'HIGH',
      action: 'Fix placement issues',
      count: auditResults.placementIssues.length,
      description: 'Move interactive elements after their related story/context blocks'
    },
    {
      priority: 'MEDIUM',
      action: 'Update formatting',
      count: auditResults.formattingIssues.length,
      description: 'Replace asterisks and hashtags with proper formatting components'
    },
    {
      priority: 'HIGH',
      action: 'Add character components',
      count: auditResults.componentIssues.length,
      description: 'Create character-specific interactive components'
    },
    {
      priority: 'MEDIUM',
      action: 'Add chapter sidebars',
      count: 4,
      description: 'Create Chapter3Sidebar, Chapter4Sidebar, Chapter5Sidebar, Chapter6Sidebar'
    }
  ]
  
  // Summary
  console.log('\n\n📊 AUDIT SUMMARY')
  console.log('=' * 50)
  console.log(`Total Issues Found: ${auditResults.totalIssues}`)
  console.log(`\nPlacement Issues: ${auditResults.placementIssues.length}`)
  console.log(`Formatting Issues: ${auditResults.formattingIssues.length}`)
  console.log(`Component Issues: ${auditResults.componentIssues.length}`)
  
  console.log('\n🎯 RECOMMENDATIONS:')
  auditResults.recommendations.forEach(rec => {
    console.log(`\n[${rec.priority}] ${rec.action} (${rec.count} items)`)
    console.log(`   ${rec.description}`)
  })
  
  // Save detailed results
  const fs = await import('fs')
  await fs.promises.writeFile(
    'deep-audit-results.json',
    JSON.stringify(auditResults, null, 2)
  )
  
  console.log('\n💾 Detailed results saved to: deep-audit-results.json')
  
  return auditResults
}

deepAuditChapters().catch(console.error)