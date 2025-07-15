import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

/**
 * Chapter Element Validator
 * 
 * Prevents the issues we encountered in Chapter 2:
 * 1. Multiple character elements in single-character chapters
 * 2. Admin tools visible to users  
 * 3. Elements with wrong order_index
 * 4. Missing story-driven components
 */

interface ValidationResult {
  chapterId: number
  chapterTitle: string
  character: string
  issues: string[]
  recommendations: string[]
  elementCount: {
    total: number
    active: number
    characterSpecific: number
    adminTools: number
  }
}

async function validateChapterElements(chapterId: number): Promise<ValidationResult> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  // Get chapter info
  const { data: chapter } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single()
  
  if (!chapter) {
    throw new Error(`Chapter ${chapterId} not found`)
  }
  
  // Get lessons for this chapter
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('chapter_id', chapterId)
  
  const lessonIds = lessons?.map(l => l.id) || []
  
  // Get all interactive elements for this chapter
  const { data: elements } = await supabase
    .from('interactive_elements')
    .select('*')
    .in('lesson_id', lessonIds)
    .order('lesson_id', { ascending: true })
    .order('order_index', { ascending: true })
  
  const issues: string[] = []
  const recommendations: string[] = []
  
  // Determine chapter character (based on title or ID)
  const characterMap: { [key: number]: string } = {
    2: 'Maya',
    3: 'Sofia', 
    4: 'David',
    5: 'Rachel',
    6: 'Alex'
  }
  
  const expectedCharacter = characterMap[chapterId] || 'Unknown'
  
  // Admin tool types that should never be visible
  const adminToolTypes = [
    'interactive_element_auditor',
    'automated_element_enhancer', 
    'database_debugger',
    'interactive_element_builder',
    'element_workflow_coordinator',
    'chapter_builder_agent',
    'content_audit_agent',
    'database_content_viewer',
    'difficult_conversation_helper'
  ]
  
  let characterSpecificCount = 0
  let adminToolsVisible = 0
  let activeElements = 0
  
  if (elements) {
    // Check each element
    elements.forEach(element => {
      if (element.is_active) {
        activeElements++
        
        // Check for admin tools
        if (adminToolTypes.includes(element.type)) {
          adminToolsVisible++
          issues.push(`Admin tool visible: "${element.title}" in Lesson ${element.lesson_id}`)
        }
        
        // Check for character consistency
        if (element.title?.includes(expectedCharacter)) {
          characterSpecificCount++
        } else if (element.title && /Maya|Sofia|David|Rachel|Alex|James/.test(element.title)) {
          const foundCharacter = element.title.match(/Maya|Sofia|David|Rachel|Alex|James/)?.[0]
          if (foundCharacter !== expectedCharacter) {
            issues.push(`Wrong character element: "${element.title}" (found ${foundCharacter}, expected ${expectedCharacter}) in Lesson ${element.lesson_id}`)
          }
        }
        
        // Check for Lyra chat elements
        if (element.type === 'lyra_chat' || element.title?.toLowerCase().includes('lyra')) {
          issues.push(`Lyra chat element found: "${element.title}" in Lesson ${element.lesson_id} - should be archived`)
        }
        
        // Check order index patterns
        if (element.order_index > 500) {
          issues.push(`Suspiciously high order_index: "${element.title}" (${element.order_index}) in Lesson ${element.lesson_id}`)
        }
      }
    })
    
    // Group by lesson to check for proper story-driven elements
    const elementsByLesson = elements.reduce((acc, element) => {
      if (!acc[element.lesson_id]) acc[element.lesson_id] = []
      acc[element.lesson_id].push(element)
      return acc
    }, {} as Record<number, any[]>)
    
    Object.keys(elementsByLesson).forEach(lessonIdStr => {
      const lessonId = parseInt(lessonIdStr)
      const lessonElements = elementsByLesson[lessonId].filter(e => e.is_active)
      
      if (lessonElements.length === 0) {
        issues.push(`Lesson ${lessonId} has no active interactive elements`)
      } else if (lessonElements.length === 1) {
        // Good - single primary element per lesson
      } else {
        // Multiple elements - check if they're properly ordered
        const characterElements = lessonElements.filter(e => e.title?.includes(expectedCharacter))
        const genericElements = lessonElements.filter(e => !e.title?.includes(expectedCharacter))
        
        if (characterElements.length > 0 && genericElements.length > 0) {
          issues.push(`Lesson ${lessonId} has both character-specific and generic elements - character elements should be primary`)
        }
      }
    })
  }
  
  // Generate recommendations
  if (adminToolsVisible > 0) {
    recommendations.push(`Archive ${adminToolsVisible} admin tools to prevent user confusion`)
  }
  
  if (characterSpecificCount === 0) {
    recommendations.push(`Create character-specific interactive elements for ${expectedCharacter}`)
  }
  
  if (issues.length === 0) {
    recommendations.push('Chapter looks good! Ready for user testing')
  }
  
  return {
    chapterId,
    chapterTitle: chapter.title,
    character: expectedCharacter,
    issues,
    recommendations,
    elementCount: {
      total: elements?.length || 0,
      active: activeElements,
      characterSpecific: characterSpecificCount,
      adminTools: adminToolsVisible
    }
  }
}

async function validateAllChapters() {
  console.log('🔍 Chapter Element Validation System\n')
  console.log('Prevents issues like:\n')
  console.log('• Multiple character elements in single-character chapters')
  console.log('• Admin tools visible to users')
  console.log('• Wrong element ordering')
  console.log('• Missing story-driven components\n')
  console.log('=' .repeat(60))
  
  const chapters = [2, 3, 4, 5, 6] // Skip chapter 1 (general intro)
  const results: ValidationResult[] = []
  
  for (const chapterId of chapters) {
    try {
      console.log(`\n📚 CHAPTER ${chapterId} VALIDATION`)
      console.log('-'.repeat(30))
      
      const result = await validateChapterElements(chapterId)
      results.push(result)
      
      console.log(`Title: ${result.chapterTitle}`)
      console.log(`Character: ${result.character}`)
      console.log(`Elements: ${result.elementCount.active} active, ${result.elementCount.characterSpecific} character-specific`)
      
      if (result.issues.length === 0) {
        console.log('✅ No issues found!')
      } else {
        console.log(`⚠️  ${result.issues.length} issues found:`)
        result.issues.forEach(issue => {
          console.log(`   • ${issue}`)
        })
      }
      
      if (result.recommendations.length > 0) {
        console.log('\n💡 Recommendations:')
        result.recommendations.forEach(rec => {
          console.log(`   → ${rec}`)
        })
      }
      
    } catch (error) {
      console.log(`❌ Error validating Chapter ${chapterId}: ${error}`)
    }
  }
  
  // Summary
  console.log('\n\n📊 VALIDATION SUMMARY')
  console.log('=' .repeat(60))
  
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  const chaptersWithIssues = results.filter(r => r.issues.length > 0).length
  
  console.log(`Chapters validated: ${results.length}`)
  console.log(`Total issues found: ${totalIssues}`)
  console.log(`Chapters with issues: ${chaptersWithIssues}`)
  
  if (totalIssues === 0) {
    console.log('\n🎉 All chapters are ready for users!')
  } else {
    console.log(`\n⚠️  ${chaptersWithIssues} chapters need attention before user testing`)
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalChapters: results.length,
      totalIssues,
      chaptersWithIssues
    },
    results
  }
  
  writeFileSync('audits/chapter-validation-report.json', JSON.stringify(report, null, 2))
  console.log('\n📝 Detailed report saved to: audits/chapter-validation-report.json')
}

// If called directly, validate all chapters
validateAllChapters().catch(console.error)

export { validateChapterElements, validateAllChapters }