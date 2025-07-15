import { createClient } from '@supabase/supabase-js'
import { writeFileSync, readFileSync } from 'fs'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function cleanupChapters3to6() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🧹 Cleaning Up Chapters 3-6: Archive Lyra Chat & Deactivate Admin Tools\n')
  console.log('=' .repeat(80))
  
  // Read the audit results to get exact elements to clean up
  const auditData = JSON.parse(readFileSync('audits/chapters-3-6-audit.json', 'utf8'))
  
  const allElementsToArchive: any[] = []
  const allElementsToDeactivate: any[] = []
  
  auditData.auditResults.forEach((chapter: any) => {
    allElementsToArchive.push(...chapter.elementsToArchive)
    allElementsToDeactivate.push(...chapter.elementsToDeactivate)
  })
  
  console.log(`📦 Step 1: Archiving ${allElementsToArchive.length} Lyra Chat Elements...`)
  
  // Archive Lyra chat elements
  if (allElementsToArchive.length > 0) {
    const archiveData = {
      timestamp: new Date().toISOString(),
      reason: 'Chapters 3-6 cleanup - Lyra chat elements removal',
      totalElements: allElementsToArchive.length,
      elementsByChapter: {
        chapter3: allElementsToArchive.filter(e => [11, 12, 13, 14].includes(e.lessonId)),
        chapter4: allElementsToArchive.filter(e => [15, 16, 17, 18].includes(e.lessonId)),
        chapter5: allElementsToArchive.filter(e => [19, 20, 21, 22].includes(e.lessonId)),
        chapter6: allElementsToArchive.filter(e => [23, 24, 25, 26].includes(e.lessonId))
      },
      elements: allElementsToArchive
    }
    
    writeFileSync('archive/lyra-chat-elements/chapters-3-6-lyra-elements.json', JSON.stringify(archiveData, null, 2))
    console.log('✅ Lyra chat elements archived to archive/lyra-chat-elements/')
    
    // Deactivate via Edge Function
    const elementIds = allElementsToArchive.map(e => e.id)
    const { error: archiveError } = await supabase.functions.invoke('chapter-content-manager', {
      body: {
        action: 'fix-element-visibility',
        data: {
          deactivateElements: elementIds,
          reorderElements: []
        }
      }
    })
    
    if (archiveError) {
      console.error('❌ Error archiving Lyra elements:', archiveError)
    } else {
      console.log(`✅ ${elementIds.length} Lyra chat elements deactivated`)
    }
  }
  
  console.log(`\n🚫 Step 2: Deactivating ${allElementsToDeactivate.length} Admin Tools...`)
  
  // Deactivate admin tools
  if (allElementsToDeactivate.length > 0) {
    const adminElementIds = allElementsToDeactivate.map(e => e.id)
    const { error: adminError } = await supabase.functions.invoke('chapter-content-manager', {
      body: {
        action: 'fix-element-visibility',
        data: {
          deactivateElements: adminElementIds,
          reorderElements: []
        }
      }
    })
    
    if (adminError) {
      console.error('❌ Error deactivating admin tools:', adminError)
    } else {
      console.log(`✅ ${adminElementIds.length} admin tools deactivated`)
    }
  }
  
  console.log('\n🔍 Step 3: Verification - Current Element State...')
  
  // Verify cleanup for each chapter
  for (const chapterId of [3, 4, 5, 6]) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('chapter_id', chapterId)
    
    const lessonIds = lessons?.map(l => l.id) || []
    
    const { data: activeElements } = await supabase
      .from('interactive_elements')
      .select('id, title, type, lesson_id, order_index')
      .in('lesson_id', lessonIds)
      .eq('is_active', true)
      .order('lesson_id')
      .order('order_index')
    
    console.log(`\n📚 Chapter ${chapterId}:`)
    if (activeElements && activeElements.length > 0) {
      activeElements.forEach((element, index) => {
        const isLyra = element.type === 'lyra_chat' || element.title?.toLowerCase().includes('lyra')
        const isAdmin = ['interactive_element_auditor', 'automated_element_enhancer', 'database_debugger',
                         'interactive_element_builder', 'element_workflow_coordinator', 'chapter_builder_agent',
                         'content_audit_agent', 'database_content_viewer', 'difficult_conversation_helper'].includes(element.type)
        
        const status = isLyra ? '⚠️  LYRA' : isAdmin ? '⚠️  ADMIN' : '✅ OK'
        console.log(`   L${element.lesson_id}: "${element.title}" (${element.type}) ${status}`)
      })
    } else {
      console.log('   ❌ No active elements found')
    }
  }
  
  console.log('\n🎉 Chapters 3-6 Cleanup Complete!')
  console.log('\nSummary:')
  console.log(`✅ Archived ${allElementsToArchive.length} Lyra chat elements`)
  console.log(`✅ Deactivated ${allElementsToDeactivate.length} admin tools`)
  console.log('✅ Ready for character-specific component creation')
}

cleanupChapters3to6().catch(console.error)