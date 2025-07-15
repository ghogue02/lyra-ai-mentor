import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

interface AuditReport {
  timestamp: string
  chapters: ChapterAudit[]
  issues: string[]
  recommendations: string[]
}

interface ChapterAudit {
  id: number
  title: string
  description?: string
  lessons: LessonAudit[]
  totalDuration: number
  characterConsistency: boolean
  narrativeFlow: 'complete' | 'partial' | 'missing'
}

interface LessonAudit {
  id: number
  chapterId: number
  title: string
  orderIndex: number
  contentBlocks: {
    total: number
    characterMentions: { [key: string]: number }
    averageLength: number
    hasProperFlow: boolean
  }
  interactiveElements: {
    total: number
    visible: number
    hidden: number
    types: string[]
    adminTools: string[]
  }
  issues: string[]
}

async function auditContent() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Starting Comprehensive Content Audit...\n')
  
  const auditReport: AuditReport = {
    timestamp: new Date().toISOString(),
    chapters: [],
    issues: [],
    recommendations: []
  }
  
  // Get all chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .order('id')
  
  for (const chapter of chapters || []) {
    const chapterAudit: ChapterAudit = {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      lessons: [],
      totalDuration: 0,
      characterConsistency: true,
      narrativeFlow: 'missing'
    }
    
    // Get lessons for this chapter
    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', chapter.id)
      .order('order_index')
    
    const charactersInChapter = new Set<string>()
    
    for (const lesson of lessons || []) {
      const lessonAudit: LessonAudit = {
        id: lesson.id,
        chapterId: chapter.id,
        title: lesson.title,
        orderIndex: lesson.order_index,
        contentBlocks: {
          total: 0,
          characterMentions: {},
          averageLength: 0,
          hasProperFlow: false
        },
        interactiveElements: {
          total: 0,
          visible: 0,
          hidden: 0,
          types: [],
          adminTools: []
        },
        issues: []
      }
      
      // Analyze content blocks
      const { data: blocks } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('order_index')
      
      if (blocks) {
        lessonAudit.contentBlocks.total = blocks.length
        let totalLength = 0
        
        // Character detection
        const characters = ['Maya', 'James', 'Sofia', 'David', 'Rachel', 'Alex', 'Marcus', 'Elena']
        
        blocks.forEach(block => {
          totalLength += block.content.length
          
          characters.forEach(char => {
            const mentions = (block.content.match(new RegExp(char, 'g')) || []).length
            if (mentions > 0) {
              lessonAudit.contentBlocks.characterMentions[char] = 
                (lessonAudit.contentBlocks.characterMentions[char] || 0) + mentions
              charactersInChapter.add(char)
            }
          })
        })
        
        lessonAudit.contentBlocks.averageLength = Math.round(totalLength / blocks.length)
        
        // Check flow (simplified - looking for problem->solution structure)
        const hasProlem = blocks.some(b => b.content.toLowerCase().includes('challenge') || 
                                          b.content.toLowerCase().includes('struggle') ||
                                          b.content.toLowerCase().includes('problem'))
        const hasSolution = blocks.some(b => b.content.toLowerCase().includes('discover') ||
                                           b.content.toLowerCase().includes('solution') ||
                                           b.content.toLowerCase().includes('transform'))
        lessonAudit.contentBlocks.hasProperFlow = hasProlem && hasSolution
      }
      
      // Analyze interactive elements
      const { data: elements } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', lesson.id)
      
      const adminTypes = [
        'interactive_element_auditor',
        'automated_element_enhancer',
        'database_debugger',
        'interactive_element_builder',
        'element_workflow_coordinator',
        'chapter_builder_agent',
        'content_audit_agent',
        'database_content_viewer'
      ]
      
      if (elements) {
        lessonAudit.interactiveElements.total = elements.length
        lessonAudit.interactiveElements.visible = elements.filter(e => e.is_visible).length
        lessonAudit.interactiveElements.hidden = elements.filter(e => !e.is_visible).length
        
        elements.forEach(element => {
          if (!lessonAudit.interactiveElements.types.includes(element.type)) {
            lessonAudit.interactiveElements.types.push(element.type)
          }
          
          if (adminTypes.includes(element.type)) {
            lessonAudit.interactiveElements.adminTools.push(element.title)
          }
        })
      }
      
      // Identify issues
      if (lessonAudit.contentBlocks.total === 0) {
        lessonAudit.issues.push('No content blocks')
      }
      if (lessonAudit.interactiveElements.total === 0) {
        lessonAudit.issues.push('No interactive elements')
      }
      if (lessonAudit.interactiveElements.adminTools.length > 0) {
        lessonAudit.issues.push(`${lessonAudit.interactiveElements.adminTools.length} admin tools visible`)
      }
      if (!lessonAudit.contentBlocks.hasProperFlow && lessonAudit.contentBlocks.total > 0) {
        lessonAudit.issues.push('Missing problem->solution narrative flow')
      }
      
      chapterAudit.lessons.push(lessonAudit)
      chapterAudit.totalDuration += lesson.duration || 0
    }
    
    // Check chapter-level consistency
    if (charactersInChapter.size > 1) {
      chapterAudit.characterConsistency = false
      auditReport.issues.push(`Chapter ${chapter.id} has multiple characters: ${Array.from(charactersInChapter).join(', ')}`)
    }
    
    // Determine narrative flow
    const lessonsWithContent = chapterAudit.lessons.filter(l => l.contentBlocks.total > 0).length
    const lessonsWithFlow = chapterAudit.lessons.filter(l => l.contentBlocks.hasProperFlow).length
    
    if (lessonsWithFlow === chapterAudit.lessons.length && chapterAudit.lessons.length > 0) {
      chapterAudit.narrativeFlow = 'complete'
    } else if (lessonsWithFlow > 0) {
      chapterAudit.narrativeFlow = 'partial'
    }
    
    auditReport.chapters.push(chapterAudit)
  }
  
  // Generate recommendations
  auditReport.recommendations = generateRecommendations(auditReport)
  
  // Save audit report
  const auditDir = path.join(process.cwd(), 'audits')
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir)
  }
  
  const filename = `content-audit-${new Date().toISOString().split('T')[0]}.json`
  const filepath = path.join(auditDir, filename)
  
  fs.writeFileSync(filepath, JSON.stringify(auditReport, null, 2))
  
  // Print summary
  console.log('\n📊 AUDIT SUMMARY')
  console.log('=' .repeat(60))
  
  auditReport.chapters.forEach(chapter => {
    console.log(`\n📚 ${chapter.title}`)
    console.log(`   Lessons: ${chapter.lessons.length}`)
    console.log(`   Character Consistency: ${chapter.characterConsistency ? '✅' : '❌'}`)
    console.log(`   Narrative Flow: ${chapter.narrativeFlow}`)
    
    chapter.lessons.forEach(lesson => {
      console.log(`\n   📖 Lesson ${lesson.id}: ${lesson.title}`)
      console.log(`      Content Blocks: ${lesson.contentBlocks.total}`)
      console.log(`      Interactive Elements: ${lesson.interactiveElements.visible} visible, ${lesson.interactiveElements.hidden} hidden`)
      
      if (Object.keys(lesson.contentBlocks.characterMentions).length > 0) {
        console.log(`      Characters: ${Object.entries(lesson.contentBlocks.characterMentions)
          .map(([char, count]) => `${char} (${count})`).join(', ')}`)
      }
      
      if (lesson.issues.length > 0) {
        console.log(`      ⚠️  Issues: ${lesson.issues.join(', ')}`)
      }
    })
  })
  
  if (auditReport.issues.length > 0) {
    console.log('\n\n🚨 GLOBAL ISSUES:')
    auditReport.issues.forEach(issue => console.log(`   - ${issue}`))
  }
  
  console.log('\n\n💡 TOP RECOMMENDATIONS:')
  auditReport.recommendations.slice(0, 5).forEach(rec => console.log(`   - ${rec}`))
  
  console.log(`\n\n💾 Full audit saved to: ${filepath}`)
  
  return auditReport
}

function generateRecommendations(audit: AuditReport): string[] {
  const recommendations: string[] = []
  
  // Chapter 2 specific recommendations
  const chapter2 = audit.chapters.find(c => c.id === 2)
  if (chapter2) {
    if (!chapter2.characterConsistency) {
      recommendations.push('Chapter 2: Consolidate to single character (Maya) or clearly separate character stories')
    }
    
    const emptyLessons = chapter2.lessons.filter(l => l.contentBlocks.total === 0)
    if (emptyLessons.length > 0) {
      recommendations.push(`Chapter 2: Develop content for ${emptyLessons.length} empty lessons or remove them`)
    }
    
    const adminToolCount = chapter2.lessons.reduce((sum, l) => sum + l.interactiveElements.adminTools.length, 0)
    if (adminToolCount > 0) {
      recommendations.push(`Chapter 2: Hide ${adminToolCount} admin tools from user view`)
    }
  }
  
  // General recommendations
  audit.chapters.forEach(chapter => {
    const lessonsNeedingElements = chapter.lessons.filter(l => l.interactiveElements.visible === 0)
    if (lessonsNeedingElements.length > 0) {
      recommendations.push(`${chapter.title}: Add interactive elements to ${lessonsNeedingElements.length} lessons`)
    }
  })
  
  return recommendations
}

// Export for use in other scripts
export { auditContent, AuditReport, ChapterAudit, LessonAudit }

// Run the audit
auditContent().catch(console.error)