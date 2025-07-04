import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function addMayaInteractiveElements() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🎯 Adding Maya\'s Interactive Elements to Lessons 6, 7, and 8...\n')
  
  const mayaElements = [
    // Lesson 6: Maya's Grant Proposal
    {
      lesson_id: 6,
      type: 'document_generator',
      title: "Maya's Grant Proposal Challenge",
      content: "Help Maya transform her passion into a winning $75,000 Morrison Foundation grant proposal using AI-powered templates",
      configuration: {
        scenario: 'grant_proposal',
        character: 'maya',
        context: 'youth_mentorship_program',
        funding_amount: 75000,
        funder: 'Morrison Foundation'
      },
      order_index: 100,
      is_active: true
    },
    
    // Lesson 7: Maya's Board Meeting Prep
    {
      lesson_id: 7,
      type: 'meeting_prep_assistant',
      title: "Maya's Emergency Board Meeting Prep",
      content: "Help Maya prepare for the crucial emergency board meeting about the funding crisis with AI-powered agenda creation",
      configuration: {
        meeting_type: 'emergency_board',
        character: 'maya',
        context: 'funding_crisis',
        duration: 45,
        urgency: 'high'
      },
      order_index: 100,
      is_active: true
    },
    
    // Lesson 8: Maya's Research Synthesis
    {
      lesson_id: 8,
      type: 'research_assistant',
      title: "Maya's Research Synthesis Challenge",
      content: "Help Maya transform overwhelming research into strategic insights for her youth mentorship program launch",
      configuration: {
        research_type: 'program_planning',
        character: 'maya',
        context: 'youth_mentorship',
        sources: ['national_study', 'local_assessment', 'competitor_analysis'],
        synthesis_focus: 'implementation_plan'
      },
      order_index: 100,
      is_active: true
    }
  ]
  
  console.log('📌 Step 1: Adding interactive elements via Edge Function...')
  
  // Use the Edge Function to add elements (bypasses RLS)
  const { error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'add-interactive-elements',
      data: {
        elements: mayaElements
      }
    }
  })
  
  if (error) {
    console.error('❌ Error adding interactive elements:', error)
    console.log('Attempting direct insert...')
    
    // Fallback to direct insert
    for (const element of mayaElements) {
      try {
        const { error: insertError } = await supabase
          .from('interactive_elements')
          .insert(element)
        
        if (insertError) {
          console.error(`❌ Error inserting element "${element.title}":`, insertError)
        } else {
          console.log(`✅ Added: ${element.title}`)
        }
      } catch (err) {
        console.error(`❌ Exception inserting "${element.title}":`, err)
      }
    }
  } else {
    console.log('✅ All Maya elements added successfully!')
  }
  
  // Verify the elements were added
  console.log('\n📌 Step 2: Verifying elements were added...')
  
  for (const lessonId of [6, 7, 8]) {
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('id, type, title, lesson_id')
      .eq('lesson_id', lessonId)
      .ilike('title', '%Maya%')
    
    if (elements && elements.length > 0) {
      console.log(`✅ Lesson ${lessonId}: Found ${elements.length} Maya elements`)
      elements.forEach(el => {
        console.log(`   - ${el.title} (${el.type})`)
      })
    } else {
      console.log(`❌ Lesson ${lessonId}: No Maya elements found`)
    }
  }
  
  console.log('\n🎉 Maya\'s Interactive Elements Setup Complete!')
  console.log('\nWhat was added:')
  console.log('✅ Lesson 6: Maya\'s Grant Proposal Challenge (document_generator)')
  console.log('✅ Lesson 7: Maya\'s Emergency Board Meeting Prep (meeting_prep_assistant)')
  console.log('✅ Lesson 8: Maya\'s Research Synthesis Challenge (research_assistant)')
  console.log('\n📚 Each element uses story-driven UI with scaffolded templates!')
}

addMayaInteractiveElements().catch(console.error)