import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

interface Chapter {
  id: number
  character: string
  lessons: number[]
  theme: string
}

const chapters: Chapter[] = [
  { id: 3, character: 'Sofia', lessons: [9, 10, 11], theme: 'Storytelling & Donor Communication' },
  { id: 4, character: 'David', lessons: [12, 13, 14], theme: 'Data Visualization & Insights' },
  { id: 5, character: 'Rachel', lessons: [15, 16, 17], theme: 'Process Automation & Efficiency' },
  { id: 6, character: 'Alex', lessons: [18, 19, 20], theme: 'Leadership & Transformation' }
]

async function auditChapters() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('📊 COMPREHENSIVE AUDIT: CHAPTERS 3-6')
  console.log('=' * 50)
  
  const issues = {
    elementsAtTop: [] as any[],
    elementsBeforeContext: [] as any[],
    formattingIssues: [] as any[],
    missingComponents: [] as any[],
    orderingIssues: [] as any[]
  }
  
  for (const chapter of chapters) {
    console.log(`\n\n🎯 CHAPTER ${chapter.id}: ${chapter.character.toUpperCase()}`)
    console.log(`Theme: ${chapter.theme}`)
    console.log('-' * 50)
    
    for (const lessonId of chapter.lessons) {
      console.log(`\n📚 Lesson ${lessonId}:`)
      
      // Get lesson info
      const { data: lesson } = await supabase
        .from('lessons')
        .select('title')
        .eq('id', lessonId)
        .single()
      
      console.log(`   Title: ${lesson?.title || 'Unknown'}`)
      
      // Get content blocks
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('id, title, content, order_index')
        .eq('lesson_id', lessonId)
        .order('order_index')
      
      // Get interactive elements
      const { data: interactiveElements } = await supabase
        .from('interactive_elements')
        .select('id, title, type, order_index, is_active')
        .eq('lesson_id', lessonId)
        .eq('is_active', true)
        .order('order_index')
      
      // Check for issues
      console.log(`   Content Blocks: ${contentBlocks?.length || 0}`)
      console.log(`   Interactive Elements: ${interactiveElements?.length || 0}`)
      
      // Issue 1: Interactive elements at the very beginning
      const firstElement = interactiveElements?.[0]
      const firstContent = contentBlocks?.[0]
      
      if (firstElement && firstContent && firstElement.order_index < firstContent.order_index) {
        console.log(`   ❌ Interactive element before first content block!`)
        issues.elementsAtTop.push({
          chapter: chapter.id,
          lesson: lessonId,
          element: firstElement.title,
          order: firstElement.order_index
        })
      }
      
      // Issue 2: Check for elements that should come after specific content
      interactiveElements?.forEach(element => {
        // Check if element title contains character name
        if (element.title.includes(chapter.character)) {
          // Find related content blocks
          const relatedContent = contentBlocks?.find(block => {
            const blockLower = block.content.toLowerCase()
            const titleLower = block.title.toLowerCase()
            
            // Check for story/context indicators
            return blockLower.includes(chapter.character.toLowerCase()) ||
                   titleLower.includes('story') ||
                   titleLower.includes('challenge') ||
                   titleLower.includes('journey')
          })
          
          if (relatedContent && element.order_index < relatedContent.order_index) {
            console.log(`   ⚠️  "${element.title}" appears before related context`)
            issues.elementsBeforeContext.push({
              chapter: chapter.id,
              lesson: lessonId,
              element: element.title,
              elementOrder: element.order_index,
              contextBlock: relatedContent.title,
              contextOrder: relatedContent.order_index
            })
          }
        }
      })
      
      // Issue 3: Check for formatting issues (asterisks, hashtags)
      contentBlocks?.forEach(block => {
        if (block.content.includes('**') || block.content.includes('##')) {
          issues.formattingIssues.push({
            chapter: chapter.id,
            lesson: lessonId,
            block: block.title,
            hasAsterisks: block.content.includes('**'),
            hasHashtags: block.content.includes('##')
          })
        }
      })
      
      // Issue 4: Check for proper component routing
      interactiveElements?.forEach(element => {
        if (element.title.includes(chapter.character) && !element.title.includes('Lyra')) {
          // These should have character-specific components
          const expectedComponent = `${chapter.character}${element.type}`
          console.log(`   🔍 Element "${element.title}" should use character component`)
          issues.missingComponents.push({
            chapter: chapter.id,
            lesson: lessonId,
            element: element.title,
            currentType: element.type,
            shouldHaveComponent: expectedComponent
          })
        }
      })
    }
  }
  
  // Summary Report
  console.log('\n\n📋 AUDIT SUMMARY')
  console.log('=' * 50)
  
  console.log(`\n❌ Elements at Top of Lessons: ${issues.elementsAtTop.length}`)
  issues.elementsAtTop.forEach(issue => {
    console.log(`   - Ch${issue.chapter} L${issue.lesson}: "${issue.element}" at position ${issue.order}`)
  })
  
  console.log(`\n⚠️  Elements Before Context: ${issues.elementsBeforeContext.length}`)
  issues.elementsBeforeContext.forEach(issue => {
    console.log(`   - Ch${issue.chapter} L${issue.lesson}: "${issue.element}" (${issue.elementOrder}) before "${issue.contextBlock}" (${issue.contextOrder})`)
  })
  
  console.log(`\n📝 Formatting Issues: ${issues.formattingIssues.length}`)
  const uniqueBlocks = new Set(issues.formattingIssues.map(i => `Ch${i.chapter} L${i.lesson}: ${i.block}`))
  uniqueBlocks.forEach(block => {
    console.log(`   - ${block}`)
  })
  
  console.log(`\n🔧 Missing Character Components: ${issues.missingComponents.length}`)
  issues.missingComponents.forEach(issue => {
    console.log(`   - Ch${issue.chapter} L${issue.lesson}: "${issue.element}"`)
  })
  
  // Save audit results
  const fs = await import('fs')
  await fs.promises.writeFile(
    'chapters-3-6-audit-results.json',
    JSON.stringify(issues, null, 2)
  )
  
  console.log('\n\n💾 Full audit results saved to: chapters-3-6-audit-results.json')
  
  return issues
}

auditChapters().catch(console.error)