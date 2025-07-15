import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function finalRenderingFix() {
  console.log('🚀 Final rendering fix - making elements visible selectively...\n')

  try {
    // Step 1: First make ALL content blocks visible
    console.log('✅ Making all content blocks visible...')
    const { error: cbError } = await supabase
      .from('content_blocks')
      .update({ 
        is_visible: true,
        is_active: true
      })
      .is('lesson_id', 'not.null')
    
    if (cbError) {
      console.error('Error updating content blocks:', cbError)
    }

    // Step 2: Make all SAFE interactive elements visible
    console.log('✅ Making safe interactive elements visible...')
    
    // List of element types that are known to work
    const safeTypes = [
      'knowledge_check',
      'reflection', 
      'lyra_chat',
      'callout_box',
      'sequence_sorter',
      'multiple_choice_scenarios',
      'ai_impact_story_creator',
      'ai_content_generator',
      'grant_writing_assistant_demo',
      'donor_persona_generator',
      'ai_email_composer',
      'document_generator',
      'document_improver',
      'template_creator',
      'agenda_creator',
      'meeting_prep_assistant',
      'summary_generator',
      'research_assistant',
      'information_summarizer',
      'task_prioritizer',
      'project_planner',
      'ai_social_media_generator',
      'social_media_generator',
      'hashtag_optimizer',
      'engagement_predictor',
      'ai_email_campaign_writer',
      'subject_line_tester',
      'content_calendar_builder',
      'content_repurposer',
      'data_analyzer',
      'impact_dashboard_creator',
      'survey_creator',
      'report_builder',
      'donor_insights_analyzer',
      'trend_identifier',
      'kpi_tracker',
      'data_storyteller',
      'workflow_automator',
      'task_scheduler',
      'email_automation_builder',
      'data_entry_automator',
      'process_optimizer',
      'integration_builder',
      'time_tracker',
      'ai_readiness_assessor',
      'team_ai_trainer',
      'change_leader',
      'ai_governance_builder',
      'impact_measurement',
      'innovation_roadmap'
    ]

    const { error: ieError } = await supabase
      .from('interactive_elements')
      .update({ 
        is_visible: true,
        is_active: true,
        is_gated: false
      })
      .in('type', safeTypes)
    
    if (ieError) {
      console.error('Error updating safe interactive elements:', ieError)
    }

    // Step 3: Hide problematic element types
    console.log('❌ Hiding problematic element types...')
    
    const problematicTypes = [
      'difficult_conversation_helper',
      'interactive_element_auditor',
      'automated_element_enhancer',
      'database_debugger',
      'database_content_viewer',
      'element_workflow_coordinator',
      'chapter_builder_agent',
      'content_audit_agent',
      'storytelling_agent'
    ]

    const { data: hidden, error: hideError } = await supabase
      .from('interactive_elements')
      .update({ 
        is_visible: false,
        is_active: false
      })
      .in('type', problematicTypes)
      .select('id, type')
    
    if (hideError) {
      console.error('Error hiding problematic elements:', hideError)
    } else if (hidden) {
      console.log(`Hidden ${hidden.length} problematic elements`)
    }

    // Step 4: Check final state for all lessons
    console.log('\n📊 Final element counts by lesson:')
    
    for (let lessonId = 1; lessonId <= 25; lessonId++) {
      const { count: cbCount } = await supabase
        .from('content_blocks')
        .select('*', { count: 'exact', head: true })
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)
      
      const { count: ieCount } = await supabase
        .from('interactive_elements')
        .select('*', { count: 'exact', head: true })
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)
        .eq('is_gated', false)
      
      const total = (cbCount || 0) + (ieCount || 0)
      
      if (total > 0) {
        console.log(`Lesson ${lessonId}: ${cbCount || 0} content + ${ieCount || 0} interactive = ${total} total`)
      }
    }

    // Step 5: Detailed check for lesson 5
    console.log('\n📋 Lesson 5 visible elements:')
    
    const { data: lesson5Content } = await supabase
      .from('content_blocks')
      .select('title, type, order_index')
      .eq('lesson_id', 5)
      .eq('is_visible', true)
      .eq('is_active', true)
      .order('order_index')
    
    const { data: lesson5Interactive } = await supabase
      .from('interactive_elements')
      .select('title, type, order_index')
      .eq('lesson_id', 5)
      .eq('is_visible', true)
      .eq('is_active', true)
      .eq('is_gated', false)
      .order('order_index')
    
    console.log('Content blocks:')
    lesson5Content?.forEach(c => {
      console.log(`  [${c.order_index}] ${c.title} (${c.type})`)
    })
    
    console.log('\nInteractive elements:')
    lesson5Interactive?.forEach(i => {
      console.log(`  [${i.order_index}] ${i.title} (${i.type})`)
    })
    
    console.log(`\nTotal visible: ${(lesson5Content?.length || 0) + (lesson5Interactive?.length || 0)}`)

    console.log('\n✅ Fix complete! The queries in useLessonData now filter by visibility.')
    console.log('\n🔄 Please rebuild and refresh your browser:')
    console.log('1. npm run build')
    console.log('2. Hard refresh (Cmd+Shift+R)')

  } catch (error) {
    console.error('Error during fix:', error)
  }
}

finalRenderingFix()