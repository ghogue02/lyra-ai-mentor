import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

interface ChapterAudit {
  chapterId: number
  title: string
  character: string
  lessons: LessonAudit[]
  elementsToArchive: ElementInfo[]
  elementsToDeactivate: ElementInfo[]
  storyArc: StoryPhase[]
}

interface LessonAudit {
  lessonId: number
  title: string
  description: string
  contentBlocks: number
  activeElements: ElementInfo[]
  characterMentions: { [key: string]: number }
  needsUpdate: boolean
}

interface ElementInfo {
  id: number
  title: string
  type: string
  lessonId: number
  isActive: boolean
  orderIndex: number
  shouldArchive?: boolean
  shouldDeactivate?: boolean
}

interface StoryPhase {
  lesson: number
  phase: 'Problem' | 'Discovery' | 'Practice' | 'Mastery'
  challenge: string
  solution: string
  component: string
}

async function comprehensiveChaptersAudit() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Comprehensive Chapters 3-6 Audit & Transformation Plan\n')
  console.log('=' .repeat(80))
  
  const characterMap = {
    3: { name: 'Sofia Martinez', role: 'Development Director', focus: 'Communication & Storytelling' },
    4: { name: 'David Chen', role: 'Data Analyst', focus: 'Data & Decision Making' },
    5: { name: 'Rachel Thompson', role: 'Operations Manager', focus: 'Automation & Efficiency' },
    6: { name: 'Alex Rivera', role: 'Executive Director', focus: 'Organizational Transformation' }
  }
  
  const adminToolTypes = [
    'interactive_element_auditor', 'automated_element_enhancer', 'database_debugger',
    'interactive_element_builder', 'element_workflow_coordinator', 'chapter_builder_agent',
    'content_audit_agent', 'database_content_viewer', 'difficult_conversation_helper'
  ]
  
  const auditResults: ChapterAudit[] = []
  
  for (const chapterId of [3, 4, 5, 6]) {
    console.log(`\n📚 CHAPTER ${chapterId} AUDIT`)
    console.log('-'.repeat(40))
    
    // Get chapter info
    const { data: chapter } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single()
    
    if (!chapter) continue
    
    // Get lessons
    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order_index')
    
    if (!lessons) continue
    
    const character = characterMap[chapterId as keyof typeof characterMap]
    console.log(`Character: ${character.name} (${character.role})`)
    console.log(`Focus: ${character.focus}`)
    
    const lessonAudits: LessonAudit[] = []
    const elementsToArchive: ElementInfo[] = []
    const elementsToDeactivate: ElementInfo[] = []
    
    for (const lesson of lessons) {
      // Get content blocks
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('lesson_id', lesson.id)
      
      // Get interactive elements
      const { data: elements } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', lesson.id)
      
      // Analyze character mentions in content
      const characterMentions: { [key: string]: number } = {}
      const allCharacters = ['Maya', 'Sofia', 'David', 'Rachel', 'Alex', 'James', 'Marcus']
      
      if (contentBlocks) {
        allCharacters.forEach(char => {
          characterMentions[char] = contentBlocks.reduce((count, block) => {
            const regex = new RegExp(char, 'gi')
            return count + (block.content?.match(regex)?.length || 0) + (block.title?.match(regex)?.length || 0)
          }, 0)
        })
      }
      
      // Analyze elements
      const activeElements: ElementInfo[] = []
      if (elements) {
        elements.forEach(element => {
          const elementInfo: ElementInfo = {
            id: element.id,
            title: element.title,
            type: element.type,
            lessonId: element.lesson_id,
            isActive: element.is_active,
            orderIndex: element.order_index
          }
          
          if (element.is_active) {
            activeElements.push(elementInfo)
            
            // Check if should be archived (Lyra chat)
            if (element.type === 'lyra_chat' || element.title?.toLowerCase().includes('lyra')) {
              elementInfo.shouldArchive = true
              elementsToArchive.push(elementInfo)
            }
            
            // Check if should be deactivated (admin tools)
            if (adminToolTypes.includes(element.type)) {
              elementInfo.shouldDeactivate = true
              elementsToDeactivate.push(elementInfo)
            }
          }
        })
      }
      
      // Determine if lesson needs update
      const primaryCharacter = character.name.split(' ')[0] // First name
      const hasWrongCharacter = Object.entries(characterMentions)
        .some(([char, count]) => char !== primaryCharacter && count > 0)
      
      const needsUpdate = hasWrongCharacter || activeElements.some(e => e.shouldArchive || e.shouldDeactivate)
      
      lessonAudits.push({
        lessonId: lesson.id,
        title: lesson.title,
        description: lesson.description,
        contentBlocks: contentBlocks?.length || 0,
        activeElements,
        characterMentions,
        needsUpdate
      })
      
      console.log(`  Lesson ${lesson.id}: ${lesson.title}`)
      console.log(`    Content blocks: ${contentBlocks?.length || 0}`)
      console.log(`    Active elements: ${activeElements.length}`)
      console.log(`    Character mentions: ${Object.entries(characterMentions).filter(([_, count]) => count > 0).map(([char, count]) => `${char}(${count})`).join(', ')}`)
      console.log(`    Needs update: ${needsUpdate ? '⚠️  YES' : '✅ NO'}`)
    }
    
    // Define story arc for this character
    const storyArcs = {
      3: [ // Sofia - Communication & Storytelling
        { lesson: 11, phase: 'Problem' as const, challenge: 'Silent crisis - mission invisible', solution: 'AI storytelling discovery', component: 'SofiaMissionStoryCreator' },
        { lesson: 12, phase: 'Discovery' as const, challenge: 'Finding authentic voice', solution: 'AI narrative tools', component: 'SofiaVoiceDiscovery' },
        { lesson: 13, phase: 'Practice' as const, challenge: 'Breakthrough story creation', solution: 'AI story enhancement', component: 'SofiaStoryBreakthrough' },
        { lesson: 14, phase: 'Mastery' as const, challenge: 'Scaling impact storytelling', solution: 'AI content strategy', component: 'SofiaImpactScaling' }
      ],
      4: [ // David - Data & Decision Making
        { lesson: 15, phase: 'Problem' as const, challenge: 'Data graveyard - insights lost', solution: 'AI data analysis discovery', component: 'DavidDataRevival' },
        { lesson: 16, phase: 'Discovery' as const, challenge: 'Finding story in numbers', solution: 'AI data storytelling', component: 'DavidDataStoryFinder' },
        { lesson: 17, phase: 'Practice' as const, challenge: 'Million-dollar presentation', solution: 'AI presentation builder', component: 'DavidPresentationMaster' },
        { lesson: 18, phase: 'Mastery' as const, challenge: 'Data storytelling system', solution: 'AI dashboard creation', component: 'DavidSystemBuilder' }
      ],
      5: [ // Rachel - Automation & Efficiency  
        { lesson: 19, phase: 'Problem' as const, challenge: 'Misunderstood systems builder', solution: 'AI automation discovery', component: 'RachelAutomationVision' },
        { lesson: 20, phase: 'Discovery' as const, challenge: 'Human-centered automation', solution: 'AI workflow design', component: 'RachelWorkflowDesigner' },
        { lesson: 21, phase: 'Practice' as const, challenge: 'Transformation story proof', solution: 'AI process optimization', component: 'RachelProcessTransformer' },
        { lesson: 22, phase: 'Mastery' as const, challenge: 'Automation ecosystem build', solution: 'AI integration strategy', component: 'RachelEcosystemBuilder' }
      ],
      6: [ // Alex - Organizational Transformation
        { lesson: 23, phase: 'Problem' as const, challenge: 'The great divide - resistance', solution: 'AI change strategy', component: 'AlexChangeStrategy' },
        { lesson: 24, phase: 'Discovery' as const, challenge: 'Building unified vision', solution: 'AI vision alignment', component: 'AlexVisionBuilder' },
        { lesson: 25, phase: 'Practice' as const, challenge: 'Transformation strategy', solution: 'AI roadmap creation', component: 'AlexRoadmapCreator' },
        { lesson: 26, phase: 'Mastery' as const, challenge: 'Leading the future', solution: 'AI leadership framework', component: 'AlexLeadershipFramework' }
      ]
    }
    
    auditResults.push({
      chapterId,
      title: chapter.title,
      character: character.name,
      lessons: lessonAudits,
      elementsToArchive,
      elementsToDeactivate,
      storyArc: storyArcs[chapterId as keyof typeof storyArcs]
    })
  }
  
  // Generate comprehensive transformation plan
  console.log('\n\n📋 COMPREHENSIVE TRANSFORMATION PLAN')
  console.log('=' .repeat(80))
  
  let totalElementsToArchive = 0
  let totalElementsToDeactivate = 0
  let totalComponentsToCreate = 0
  
  auditResults.forEach(chapter => {
    console.log(`\n📚 Chapter ${chapter.chapterId}: ${chapter.character}`)
    console.log(`Elements to archive: ${chapter.elementsToArchive.length}`)
    console.log(`Elements to deactivate: ${chapter.elementsToDeactivate.length}`)
    console.log(`Components to create: ${chapter.storyArc.length}`)
    
    totalElementsToArchive += chapter.elementsToArchive.length
    totalElementsToDeactivate += chapter.elementsToDeactivate.length
    totalComponentsToCreate += chapter.storyArc.length
    
    console.log('\nStory Arc:')
    chapter.storyArc.forEach(arc => {
      console.log(`  L${arc.lesson}: ${arc.phase} - ${arc.challenge} → ${arc.component}`)
    })
  })
  
  console.log(`\n📊 TRANSFORMATION SUMMARY`)
  console.log(`Total elements to archive: ${totalElementsToArchive}`)
  console.log(`Total elements to deactivate: ${totalElementsToDeactivate}`)
  console.log(`Total components to create: ${totalComponentsToCreate}`)
  
  // Save audit results
  const fullReport = {
    timestamp: new Date().toISOString(),
    summary: {
      chaptersAudited: auditResults.length,
      totalElementsToArchive,
      totalElementsToDeactivate,
      totalComponentsToCreate
    },
    auditResults
  }
  
  writeFileSync('audits/chapters-3-6-audit.json', JSON.stringify(fullReport, null, 2))
  console.log('\n📝 Full audit saved to: audits/chapters-3-6-audit.json')
  
  return fullReport
}

comprehensiveChaptersAudit().catch(console.error)