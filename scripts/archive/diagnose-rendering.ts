import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'
import puppeteer from 'puppeteer'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function diagnoseRendering() {
  console.log('🔍 Starting rendering diagnosis...\n')

  // Check database state
  const { data: lesson5Content } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')

  const { data: lesson5Interactive } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')

  console.log(`Database: ${lesson5Content?.length || 0} content blocks, ${lesson5Interactive?.length || 0} interactive elements`)

  // Check for problematic element types
  const elementTypes = [...new Set(lesson5Interactive?.map(e => e.type) || [])]
  console.log('Element types:', elementTypes)

  // Look for missing React component cases
  const knownTypes = [
    'knowledge_check', 'reflection', 'lyra_chat', 'callout_box', 'sequence_sorter',
    'multiple_choice_scenarios', 'ai_impact_story_creator', 'ai_content_generator',
    'grant_writing_assistant_demo', 'donor_persona_generator', 'ai_email_composer',
    'document_generator', 'document_improver', 'template_creator', 'agenda_creator',
    'meeting_prep_assistant', 'summary_generator', 'research_assistant',
    'information_summarizer', 'task_prioritizer', 'project_planner',
    'ai_social_media_generator', 'hashtag_optimizer', 'engagement_predictor',
    'ai_email_campaign_writer', 'subject_line_tester', 'content_calendar_builder',
    'content_repurposer', 'data_analyzer', 'impact_dashboard_creator',
    'survey_creator', 'report_builder', 'donor_insights_analyzer',
    'trend_identifier', 'kpi_tracker', 'data_storyteller', 'workflow_automator',
    'task_scheduler', 'email_automation_builder', 'data_entry_automator',
    'process_optimizer', 'integration_builder', 'time_tracker',
    'ai_readiness_assessor', 'team_ai_trainer', 'change_leader',
    'ai_governance_builder', 'impact_measurement', 'innovation_roadmap',
    'storytelling_agent', 'content_audit_agent', 'chapter_builder_agent',
    'database_debugger', 'interactive_element_auditor', 'interactive_element_builder',
    'element_workflow_coordinator', 'database_content_viewer',
    'automated_element_enhancer', 'difficult_conversation_helper'
  ]

  const unknownTypes = elementTypes.filter(type => !knownTypes.includes(type))
  if (unknownTypes.length > 0) {
    console.log('⚠️ Unknown element types:', unknownTypes)
  }

  // Test with Puppeteer
  console.log('\n🌐 Testing with browser automation...')
  
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    
    // Inject console message interception
    page.on('console', msg => {
      if (msg.text().includes('Error') || msg.type() === 'error') {
        console.log('Browser error:', msg.text())
      }
    })
    
    page.on('pageerror', error => {
      console.log('Page error:', error.message)
    })

    // Navigate to lesson
    await page.goto('http://localhost:8081/lesson/2/5', { waitUntil: 'networkidle2' })
    
    // Wait for content to load
    await page.waitForTimeout(3000)
    
    // Count rendered elements
    const elementCounts = await page.evaluate(() => {
      const contentBlocks = document.querySelectorAll('[data-content-block-id]').length
      const interactiveElements = document.querySelectorAll('[data-interactive-element-id]').length
      const allDivs = document.querySelectorAll('.lesson-content > div').length
      const cards = document.querySelectorAll('.lesson-content .card').length
      
      // Check for hidden elements
      const hiddenElements = Array.from(document.querySelectorAll('.lesson-content *')).filter(el => {
        const style = window.getComputedStyle(el)
        return style.display === 'none' || 
               style.visibility === 'hidden' || 
               style.opacity === '0' ||
               el.offsetHeight === 0
      }).length
      
      return { contentBlocks, interactiveElements, allDivs, cards, hiddenElements }
    })
    
    console.log('DOM elements:', elementCounts)
    
    await browser.close()
  } catch (error) {
    console.log('Puppeteer not installed, skipping browser test')
  }

  // Analyze the issue
  console.log('\n📊 Analysis:')
  
  if (lesson5Interactive && lesson5Interactive.length > 0) {
    const problematicElements = lesson5Interactive.filter(e => 
      ['difficult_conversation_helper', 'interactive_element_auditor', 'automated_element_enhancer'].includes(e.type)
    )
    
    if (problematicElements.length > 0) {
      console.log(`Found ${problematicElements.length} problematic elements that may cause rendering issues:`)
      problematicElements.forEach(e => {
        console.log(`- ${e.title} (${e.type})`)
      })
    }
  }
}

diagnoseRendering().catch(console.error)