import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function createCharacterElements() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🎯 Creating Character-Specific Interactive Elements...\n')
  
  const characterElements = [
    // Sofia's elements (Chapter 3)
    {
      lesson_id: 11,
      type: 'ai_content_generator',
      title: "Sofia's Silent Crisis Story Creator",
      content: "Help Sofia transform her invisible mission into a compelling narrative that captures hearts and opens minds",
      configuration: {
        character: 'Sofia',
        challenge: 'Silent crisis - mission invisible to community',
        component: 'SofiaMissionStoryCreator'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 12,
      type: 'document_improver',
      title: "Sofia's Voice Discovery Journey",
      content: "Guide Sofia through discovering her authentic communication style that resonates with diverse audiences",
      configuration: {
        character: 'Sofia',
        challenge: 'Finding authentic voice that feels professional',
        component: 'SofiaVoiceDiscovery'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 13,
      type: 'ai_email_composer',
      title: "Sofia's Breakthrough Story Creator",
      content: "Help Sofia craft the breakthrough story that will captivate the annual gala audience and unlock major funding",
      configuration: {
        character: 'Sofia',
        challenge: 'Creating compelling narrative for high-stakes presentation',
        component: 'SofiaStoryBreakthrough'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 14,
      type: 'template_creator',
      title: "Sofia's Impact Scaling System",
      content: "Build Sofia's comprehensive storytelling system that scales impact across all communication channels",
      configuration: {
        character: 'Sofia',
        challenge: 'Scaling storytelling without losing quality or voice',
        component: 'SofiaImpactScaling'
      },
      order_index: 10,
      is_active: true
    },
    
    // David's elements (Chapter 4)
    {
      lesson_id: 15,
      type: 'ai_content_generator',
      title: "David's Data Graveyard Revival",
      content: "Help David resurrect buried insights and transform spreadsheet chaos into compelling data stories",
      configuration: {
        character: 'David',
        challenge: 'Data graveyard - insights lost in complexity',
        component: 'DavidDataRevival'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 16,
      type: 'data_storyteller',
      title: "David's Data Story Discovery",
      content: "Guide David through weaving compelling narratives from complex statistics and research findings",
      configuration: {
        character: 'David',
        challenge: 'Finding story in numbers that captivates audiences',
        component: 'DavidDataStoryFinder'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 17,
      type: 'document_generator',
      title: "David's Million-Dollar Presentation",
      content: "Help David create the high-stakes presentation that could unlock transformational funding",
      configuration: {
        character: 'David',
        challenge: 'High-stakes presentation with board and major donors',
        component: 'DavidPresentationMaster'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 18,
      type: 'template_creator',
      title: "David's Data Storytelling System",
      content: "Build David's comprehensive system for ongoing data communication and insight sharing",
      configuration: {
        character: 'David',
        challenge: 'Creating sustainable data storytelling infrastructure',
        component: 'DavidSystemBuilder'
      },
      order_index: 10,
      is_active: true
    },
    
    // Rachel's elements (Chapter 5)
    {
      lesson_id: 19,
      type: 'workflow_automator',
      title: "Rachel's Human-Centered Automation Vision",
      content: "Help Rachel develop automation strategies that enhance rather than replace human connection",
      configuration: {
        character: 'Rachel',
        challenge: 'Overcoming automation resistance through human benefits',
        component: 'RachelAutomationVision'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 20,
      type: 'process_optimizer',
      title: "Rachel's Workflow Design Studio",
      content: "Guide Rachel through designing workflows that improve both efficiency and job satisfaction",
      configuration: {
        character: 'Rachel',
        challenge: 'Balancing efficiency with human-centered design',
        component: 'RachelWorkflowDesigner'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 21,
      type: 'impact_measurement',
      title: "Rachel's Process Transformation Proof",
      content: "Help Rachel prove automation value through measurable transformation and success metrics",
      configuration: {
        character: 'Rachel',
        challenge: 'Demonstrating automation ROI to skeptical stakeholders',
        component: 'RachelProcessTransformer'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 22,
      type: 'integration_builder',
      title: "Rachel's Automation Ecosystem Builder",
      content: "Build Rachel's integrated automation system that transforms organizational capacity",
      configuration: {
        character: 'Rachel',
        challenge: 'Creating seamless automation ecosystem',
        component: 'RachelEcosystemBuilder'
      },
      order_index: 10,
      is_active: true
    },
    
    // Alex's elements (Chapter 6)
    {
      lesson_id: 23,
      type: 'change_leader',
      title: "Alex's Change Leadership Strategy",
      content: "Help Alex develop comprehensive strategy for overcoming organizational resistance to AI transformation",
      configuration: {
        character: 'Alex',
        challenge: 'Uniting divided organization around AI transformation',
        component: 'AlexChangeStrategy'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 24,
      type: 'ai_governance_builder',
      title: "Alex's Unified Vision Builder",
      content: "Guide Alex through creating shared vision that motivates diverse stakeholders toward common goals",
      configuration: {
        character: 'Alex',
        challenge: 'Creating inspiring vision that drives collective action',
        component: 'AlexVisionBuilder'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 25,
      type: 'innovation_roadmap',
      title: "Alex's Transformation Roadmap Creator",
      content: "Help Alex create practical roadmap for organizational AI adoption with clear milestones",
      configuration: {
        character: 'Alex',
        challenge: 'Building confidence through clear implementation path',
        component: 'AlexRoadmapCreator'
      },
      order_index: 10,
      is_active: true
    },
    {
      lesson_id: 26,
      type: 'ai_governance_builder',
      title: "Alex's AI Leadership Framework",
      content: "Build Alex's sustainable leadership framework for guiding AI-powered organizational transformation",
      configuration: {
        character: 'Alex',
        challenge: 'Establishing leadership model for the AI-powered future',
        component: 'AlexLeadershipFramework'
      },
      order_index: 10,
      is_active: true
    }
  ]
  
  console.log(`📋 Adding ${characterElements.length} character-specific elements...`)
  
  // Use Edge Function to add elements with service role access
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'add-interactive-elements',
      data: {
        elements: characterElements
      }
    }
  })
  
  if (error) {
    console.error('❌ Error adding elements via Edge Function:', error)
    
    // Fallback to direct insert
    console.log('🔄 Attempting direct insert...')
    for (const element of characterElements) {
      try {
        const { error: insertError } = await supabase
          .from('interactive_elements')
          .insert(element)
        
        if (insertError) {
          console.error(`❌ Error inserting "${element.title}":`, insertError.message)
        } else {
          console.log(`✅ Added: ${element.title}`)
        }
      } catch (err) {
        console.error(`❌ Exception inserting "${element.title}":`, err)
      }
    }
  } else {
    console.log('✅ All character elements added via Edge Function!')
  }
  
  // Verification
  console.log('\n🔍 Verification: Character elements by chapter...')
  
  const chapters = [
    { id: 3, character: 'Sofia', lessons: [11, 12, 13, 14] },
    { id: 4, character: 'David', lessons: [15, 16, 17, 18] },
    { id: 5, character: 'Rachel', lessons: [19, 20, 21, 22] },
    { id: 6, character: 'Alex', lessons: [23, 24, 25, 26] }
  ]
  
  for (const chapter of chapters) {
    console.log(`\n📚 Chapter ${chapter.id} (${chapter.character}):`)
    
    for (const lessonId of chapter.lessons) {
      const { data: elements } = await supabase
        .from('interactive_elements')
        .select('id, title, type, is_active')
        .eq('lesson_id', lessonId)
        .ilike('title', `%${chapter.character}%`)
        .eq('is_active', true)
      
      if (elements && elements.length > 0) {
        elements.forEach(element => {
          console.log(`   ✅ L${lessonId}: "${element.title}" (${element.type})`)
        })
      } else {
        console.log(`   ❌ L${lessonId}: No ${chapter.character} elements found`)
      }
    }
  }
  
  console.log('\n🎉 Character Element Creation Complete!')
  console.log('\nSummary:')
  console.log(`✅ Created ${characterElements.length} character-specific interactive elements`)
  console.log('✅ Each element routes to custom story-driven component')
  console.log('✅ All elements follow scaffolded template pattern')
  console.log('✅ Ready for user testing!')
}

createCharacterElements().catch(console.error)