import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

// Simulate the routing logic from InteractiveElementRenderer
function simulateRouting(element: any, lessonId: number): string {
  switch (element.type) {
    case 'ai_email_composer':
      // Check if this is the Maya parent response element
      if (element.title === "Turn Maya's Email Anxiety into Connection" || 
          element.title === "Help Maya Write the Parent Response" ||
          (lessonId === 5 && element.order_index === 80)) {
        return 'MayaParentResponseEmail';
      }
      return 'AIEmailComposer';
      
    case 'document_generator':
    case 'report_generator':
      // Check if this is Maya's grant proposal element in lesson 6
      if (lessonId === 6 && element.title?.includes('Maya')) {
        return 'MayaGrantProposal';
      }
      return 'DocumentGenerator';
      
    case 'meeting_prep_assistant':
      // Check if this is Maya's board meeting prep element in lesson 7
      if (lessonId === 7 && element.title?.includes('Maya')) {
        return 'MayaBoardMeetingPrep';
      }
      return 'MeetingPrepAssistant';
      
    case 'research_assistant':
      // Check if this is Maya's research synthesis element in lesson 8
      if (lessonId === 8 && element.title?.includes('Maya')) {
        return 'MayaResearchSynthesis';
      }
      return 'ResearchAssistant';
      
    default:
      return element.type;
  }
}

async function testMayaComponentRouting() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🧪 Testing Maya Component Routing Logic...\n')
  
  for (const lessonId of [5, 6, 7, 8]) {
    console.log(`📚 LESSON ${lessonId}:`)
    
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('is_active', true)
      .order('order_index')
    
    if (elements && elements.length > 0) {
      elements.forEach((element, index) => {
        const componentName = simulateRouting(element, lessonId)
        const isMayaComponent = componentName.startsWith('Maya')
        const status = isMayaComponent ? '✅ MAYA COMPONENT' : '   Generic component'
        
        console.log(`   ${index + 1}. "${element.title}"`)
        console.log(`      Type: ${element.type}`)
        console.log(`      Renders: ${componentName}`)
        console.log(`      Status: ${status}`)
        console.log('')
      })
    } else {
      console.log('   ❌ No active elements found')
    }
  }
  
  // Test specific routing conditions
  console.log('\n🔍 ROUTING CONDITION TESTS:')
  
  const testCases = [
    {
      lessonId: 5,
      element: { 
        type: 'ai_email_composer', 
        title: "Turn Maya's Email Anxiety into Connection",
        order_index: 50
      },
      expected: 'MayaParentResponseEmail'
    },
    {
      lessonId: 6,
      element: { 
        type: 'document_generator', 
        title: "Maya's Grant Proposal Challenge" 
      },
      expected: 'MayaGrantProposal'
    },
    {
      lessonId: 7,
      element: { 
        type: 'meeting_prep_assistant', 
        title: "Maya's Emergency Board Meeting Prep" 
      },
      expected: 'MayaBoardMeetingPrep'
    },
    {
      lessonId: 8,
      element: { 
        type: 'research_assistant', 
        title: "Maya's Research Synthesis Challenge" 
      },
      expected: 'MayaResearchSynthesis'
    }
  ]
  
  testCases.forEach((test, index) => {
    const result = simulateRouting(test.element, test.lessonId)
    const passed = result === test.expected
    const status = passed ? '✅ PASS' : '❌ FAIL'
    
    console.log(`Test ${index + 1}: ${status}`)
    console.log(`   Lesson ${test.lessonId}: "${test.element.title}"`)
    console.log(`   Expected: ${test.expected}`)
    console.log(`   Got: ${result}`)
    console.log('')
  })
  
  console.log('🎉 Maya Component Routing Test Complete!')
}

testMayaComponentRouting().catch(console.error)