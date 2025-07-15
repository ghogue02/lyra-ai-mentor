import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'
import fs from 'fs'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function implementChapter2Fixes() {
  console.log('🚀 Implementing Chapter 2 Interactive Elements Fixes...\n')

  try {
    // Step 1: Hide admin tools
    console.log('1️⃣ Hiding admin tools from learners...')
    const { error: hideError } = await supabase
      .from('interactive_elements')
      .update({ 
        is_visible: false, 
        is_active: false 
      })
      .eq('type', 'storytelling_agent')
      .in('lesson_id', [5, 6, 7, 8])
    
    if (hideError) console.error('Error hiding admin tools:', hideError)
    else console.log('✅ Admin tools hidden')

    // Step 2: Ensure existing elements are configured correctly
    console.log('\n2️⃣ Configuring existing elements...')
    const educationalTypes = [
      'ai_email_composer', 'difficult_conversation_helper', 'lyra_chat', 
      'knowledge_check', 'document_generator', 'document_improver', 'template_creator'
    ]
    
    const { error: configError } = await supabase
      .from('interactive_elements')
      .update({ 
        is_active: true, 
        is_visible: true,
        is_gated: false 
      })
      .in('lesson_id', [5, 6])
      .in('type', educationalTypes)
    
    if (configError) console.error('Error configuring elements:', configError)
    else console.log('✅ Existing elements configured')

    // Step 3: Create missing Lesson 7 elements
    console.log('\n3️⃣ Creating Lesson 7 elements (Meeting Master)...')
    
    const lesson7Elements = [
      {
        lesson_id: 7,
        type: 'agenda_creator',
        title: 'Build a Team Meeting Agenda',
        content: 'Create a structured agenda with time allocations for an important upcoming meeting. Practice organizing topics, setting realistic timeframes, and ensuring productive outcomes.',
        configuration: {
          meetingTypes: ["team_meeting", "board_meeting", "volunteer_orientation"],
          timeAllocation: true,
          character: "Maya Rodriguez",
          scenario: "weekly_team_meeting"
        },
        order_index: 80,
        is_active: true,
        is_visible: true,
        is_gated: false
      },
      {
        lesson_id: 7,
        type: 'meeting_prep_assistant',
        title: 'Prepare for a Board Conversation',
        content: 'Get AI help preparing talking points and anticipating questions for a board chair meeting. Learn to structure your thoughts and handle challenging discussions professionally.',
        configuration: {
          scenarioType: "board_chair_update",
          prepElements: ["key_points", "anticipated_questions", "supporting_data"],
          character: "Maya Rodriguez",
          context: "quarterly_update"
        },
        order_index: 90,
        is_active: true,
        is_visible: true,
        is_gated: false
      },
      {
        lesson_id: 7,
        type: 'summary_generator',
        title: 'Transform Meeting Notes',
        content: 'Convert rough meeting notes into a clear summary with action items and deadlines. Master the art of turning discussion into accountability.',
        configuration: {
          inputType: "rough_notes",
          outputElements: ["key_decisions", "action_items", "deadlines", "next_steps"],
          scenario: "staff_meeting_notes"
        },
        order_index: 100,
        is_active: true,
        is_visible: true,
        is_gated: false
      },
      {
        lesson_id: 7,
        type: 'reflection',
        title: 'Meeting Effectiveness Impact',
        content: 'How could better meeting preparation and follow-up impact your work? What would you do with the time saved from more efficient meetings?',
        configuration: {
          prompt: "How would better meetings impact your organization?",
          placeholderText: "If our meetings were more effective, I could...",
          minLength: 40,
          character_connection: "Maya Rodriguez"
        },
        order_index: 110,
        is_active: true,
        is_visible: true,
        is_gated: false
      }
    ]

    for (const element of lesson7Elements) {
      const { error } = await supabase
        .from('interactive_elements')
        .insert(element)
      
      if (error) {
        console.error(`Error creating ${element.type}:`, error)
      } else {
        console.log(`✅ Created ${element.type}`)
      }
    }

    // Step 4: Create missing Lesson 8 elements
    console.log('\n4️⃣ Creating Lesson 8 elements (Research & Organization Pro)...')
    
    const lesson8Elements = [
      {
        lesson_id: 8,
        type: 'research_assistant',
        title: 'Research Program Best Practices',
        content: 'Use AI to research evidence-based approaches for a challenge in your programs. Learn to find credible sources and synthesize actionable insights.',
        configuration: {
          researchTypes: ["best_practices", "case_studies", "academic_research"],
          sourceVerification: true,
          character: "James Chen",
          scenario: "conservation_research"
        },
        order_index: 90,
        is_active: true,
        is_visible: true,
        is_gated: false
      },
      {
        lesson_id: 8,
        type: 'information_summarizer',
        title: 'Distill a Complex Report',
        content: 'Take a lengthy document and create a concise, actionable summary for your team. Master the skill of extracting key insights from overwhelming information.',
        configuration: {
          summaryLengths: ["1_page", "executive_summary", "bullet_points"],
          focusAreas: ["key_findings", "recommendations", "action_items"],
          character: "James Chen"
        },
        order_index: 100,
        is_active: true,
        is_visible: true,
        is_gated: false
      },
      {
        lesson_id: 8,
        type: 'task_prioritizer',
        title: 'Organize Your Workload',
        content: 'Transform an overwhelming to-do list into a prioritized action plan using AI analysis. Learn to identify what matters most and tackle work strategically.',
        configuration: {
          priorityFactors: ["urgency", "impact", "effort"],
          timeframes: ["today", "this_week", "this_month"],
          scenario: "nonprofit_workload"
        },
        order_index: 110,
        is_active: true,
        is_visible: true,
        is_gated: false
      },
      {
        lesson_id: 8,
        type: 'project_planner',
        title: 'Plan a Complex Initiative',
        content: 'Break down a major project into phases, milestones, and specific tasks. Develop the project management skills every nonprofit leader needs.',
        configuration: {
          projectTypes: ["event_planning", "program_launch", "campaign_development"],
          planningElements: ["phases", "milestones", "dependencies", "timelines"],
          character: "James Chen"
        },
        order_index: 120,
        is_active: true,
        is_visible: true,
        is_gated: false
      },
      {
        lesson_id: 8,
        type: 'lyra_chat',
        title: 'Your Organization Challenge',
        content: 'What organizational or research challenge should we tackle first? I can help you create a plan to address it systematically using the tools you\'ve learned.',
        configuration: {
          minimumEngagement: 3,
          blockingEnabled: false,
          chatType: "persistent",
          character_connection: "James Chen",
          context: "chapter_integration"
        },
        order_index: 130,
        is_active: true,
        is_visible: true,
        is_gated: false
      }
    ]

    for (const element of lesson8Elements) {
      const { error } = await supabase
        .from('interactive_elements')
        .insert(element)
      
      if (error) {
        console.error(`Error creating ${element.type}:`, error)
      } else {
        console.log(`✅ Created ${element.type}`)
      }
    }

    // Step 5: Add chapter completion reflection
    console.log('\n5️⃣ Adding chapter completion reflection...')
    
    const { error: reflectionError } = await supabase
      .from('content_blocks')
      .insert({
        lesson_id: 8,
        type: 'reflection',
        title: 'Chapter 2 Complete: Your AI Transformation',
        content: 'You\'ve learned to use AI for emails, documents, meetings, and research - the four pillars of effective nonprofit work. Maya conquered her email anxiety, James broke through his writing blocks, and now you have the same tools they used. Which AI tool from this chapter will have the biggest immediate impact on your daily work? Set a specific goal to implement it this week.',
        metadata: {
          prompt: "Which AI tool from this chapter will you implement first, and how?",
          placeholderText: "I'm most excited to start using... because it will help me...",
          minLength: 50,
          character_connection: "Maya and James"
        },
        order_index: 140,
        is_active: true,
        is_visible: true
      })
    
    if (reflectionError) {
      console.error('Error adding reflection:', reflectionError)
    } else {
      console.log('✅ Chapter completion reflection added')
    }

    // Step 6: Verification
    console.log('\n6️⃣ Verifying implementation...')
    
    for (let lessonId = 5; lessonId <= 8; lessonId++) {
      const { count } = await supabase
        .from('interactive_elements')
        .select('*', { count: 'exact', head: true })
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .eq('is_active', true)
      
      console.log(`Lesson ${lessonId}: ${count} visible interactive elements`)
    }

    console.log('\n🎉 Chapter 2 Interactive Elements Implementation Complete!')
    console.log('\n📊 Summary:')
    console.log('- ✅ Admin tools hidden from learners')
    console.log('- ✅ 4 new interactive elements added to Lesson 7')
    console.log('- ✅ 5 new interactive elements added to Lesson 8')
    console.log('- ✅ Chapter completion reflection added')
    console.log('- ✅ All elements properly configured and visible')
    
    console.log('\n🔄 Next steps:')
    console.log('1. Clear browser cache and refresh')
    console.log('2. Test each lesson for functionality')
    console.log('3. Verify narrative integration')

  } catch (error) {
    console.error('Error during implementation:', error)
  }
}

implementChapter2Fixes()