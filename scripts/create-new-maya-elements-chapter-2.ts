import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function createNewMayaElementsChapter2() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🚀 CREATING NEW MAYA ELEMENTS FOR CHAPTER 2')
  console.log('=' * 45)
  
  // Define new Maya elements with high priority that will definitely be visible
  const newMayaElements = [
    {
      lesson_id: 5,
      type: 'ai_email_composer',
      title: 'Maya\'s Parent Response Email Helper',
      content: 'Help Maya craft the perfect response to concerned parents using AI assistance',
      configuration: {
        character: 'Maya',
        challenge: 'Writing empathetic responses to parent concerns',
        component: 'MayaParentResponseEmail',
        context: 'parent_communication',
        scenario: 'concern_response'
      },
      order_index: 5,
      is_active: true
    },
    {
      lesson_id: 6,
      type: 'document_generator', 
      title: 'Maya\'s Strategic Grant Proposal Builder',
      content: 'Guide Maya through creating a winning grant proposal for program expansion',
      configuration: {
        character: 'Maya',
        challenge: 'Building comprehensive grant proposal',
        component: 'MayaGrantProposal',
        context: 'grant_writing',
        scenario: 'program_expansion'
      },
      order_index: 5,
      is_active: true
    },
    {
      lesson_id: 7,
      type: 'meeting_prep_assistant',
      title: 'Maya\'s Critical Board Meeting Preparation',
      content: 'Help Maya prepare for the high-stakes board meeting that could determine program funding',
      configuration: {
        character: 'Maya',
        challenge: 'Preparing for critical board presentation',
        component: 'MayaBoardMeetingPrep', 
        context: 'board_meeting',
        scenario: 'funding_presentation'
      },
      order_index: 5,
      is_active: true
    },
    {
      lesson_id: 8,
      type: 'research_assistant',
      title: 'Maya\'s Research Synthesis Wizard',
      content: 'Transform overwhelming research data into actionable insights for Maya\'s program',
      configuration: {
        character: 'Maya',
        challenge: 'Synthesizing complex research into clear insights',
        component: 'MayaResearchSynthesis',
        context: 'research_analysis',
        scenario: 'program_improvement'
      },
      order_index: 5,
      is_active: true
    }
  ]
  
  console.log('📋 New Maya Elements to Create:')
  newMayaElements.forEach(element => {
    console.log(`   L${element.lesson_id}: "${element.title}" (order: ${element.order_index})`)
  })
  
  // Use the same Edge Function pattern that worked for chapters 3-6
  console.log('\n🔄 Creating elements via Edge Function...')
  
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'add-interactive-elements',
      data: {
        elements: newMayaElements
      }
    }
  })
  
  if (error) {
    console.error('❌ Error via Edge Function:', error)
    
    // Fallback to direct insert
    console.log('🔄 Attempting direct insert...')
    for (const element of newMayaElements) {
      try {
        const { error: insertError } = await supabase
          .from('interactive_elements')
          .insert(element)
        
        if (insertError) {
          console.error(`❌ Error inserting "${element.title}":`, insertError.message)
        } else {
          console.log(`✅ Added: "${element.title}"`)
        }
      } catch (err) {
        console.error(`❌ Exception inserting "${element.title}":`, err)
      }
    }
  } else {
    console.log('✅ All elements created via Edge Function!')
  }
  
  // Update the existing main email element to lower priority 
  console.log('\n🔧 Updating existing element priorities...')
  const { error: updateError } = await supabase
    .from('interactive_elements')
    .update({ order_index: 10 })
    .eq('lesson_id', 5)
    .eq('title', 'Turn Maya\'s Email Anxiety into Connection')
  
  if (updateError) {
    console.error('❌ Error updating existing element:', updateError.message)
  } else {
    console.log('✅ Updated existing element to order 10')
  }
  
  // Final verification
  console.log('\n🔍 VERIFICATION - All Maya Elements by Lesson:')
  
  for (const lesson_id of [5, 6, 7, 8]) {
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('id, title, is_active, order_index')
      .eq('lesson_id', lesson_id)
      .ilike('title', '%maya%')
      .eq('is_active', true)
      .order('order_index')
    
    console.log(`\n📖 Lesson ${lesson_id}:`)
    if (elements && elements.length > 0) {
      elements.forEach(element => {
        console.log(`   ✅ [${element.order_index}] "${element.title}"`)
      })
    } else {
      console.log('   ❌ No active Maya elements found')
    }
  }
  
  // Count total active Maya elements in Chapter 2
  const { data: totalMaya } = await supabase
    .from('interactive_elements')
    .select('id')
    .in('lesson_id', [5, 6, 7, 8])
    .ilike('title', '%maya%')
    .eq('is_active', true)
  
  const totalCount = totalMaya?.length || 0
  
  console.log('\n🎉 CHAPTER 2 MAYA ELEMENTS CREATION COMPLETE!')
  console.log(`📊 Total Active Maya Elements: ${totalCount}`)
  console.log('\n📝 Expected Frontend Result:')
  console.log('   - Lesson 5: 2+ Maya elements visible (including new Parent Response)')
  console.log('   - Lesson 6: 2+ Maya elements visible (including new Grant Proposal)')  
  console.log('   - Lesson 7: 2+ Maya elements visible (including new Board Meeting)')
  console.log('   - Lesson 8: 2+ Maya elements visible (including new Research Synthesis)')
  console.log('\n✅ All elements should now be visible with high priority (order_index 5-10)')
}

createNewMayaElementsChapter2().catch(console.error)