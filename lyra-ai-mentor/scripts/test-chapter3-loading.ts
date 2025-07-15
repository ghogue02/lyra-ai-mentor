import { supabase } from '../src/integrations/supabase/client'

async function testChapter3Loading() {
  console.log('=== Testing Chapter 3, Lesson 5 Component Loading ===\n')

  try {
    // Get Chapter 3 lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, order_index')
      .eq('chapter_id', 3)
      .order('order_index')

    if (lessonsError) throw lessonsError

    console.log('Chapter 3 Lessons:')
    lessons?.forEach(lesson => {
      console.log(`  - Lesson ${lesson.order_index}: ${lesson.title} (ID: ${lesson.id})`)
    })

    // Find Lesson 3 in Chapter 3 (The Breakthrough Story)
    const lesson3 = lessons?.find(l => l.order_index === 30) // Lesson 3 has order_index 30
    
    if (!lesson3) {
      console.error('Could not find Lesson 3 in Chapter 3')
      return
    }

    console.log(`\nFocusing on Lesson 3: ${lesson3.title} (ID: ${lesson3.id})`)

    // Get all interactive elements for Lesson 3
    const { data: elements, error: elementsError } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', lesson3.id)
      .order('order_index')

    if (elementsError) throw elementsError

    console.log(`\nFound ${elements?.length || 0} total interactive elements in Lesson 3 (${lesson3.title})`)
    
    // Filter by active status
    const activeElements = elements?.filter(e => e.is_active)
    const visibleElements = activeElements?.filter(e => e.is_visible)
    
    console.log(`  - Active: ${activeElements?.length || 0}`)
    console.log(`  - Visible: ${visibleElements?.length || 0}`)

    // Analyze element types
    console.log('\nElement Types in Lesson 3:')
    const elementTypes = new Map<string, number>()
    
    visibleElements?.forEach(element => {
      const count = elementTypes.get(element.type) || 0
      elementTypes.set(element.type, count + 1)
    })

    elementTypes.forEach((count, type) => {
      console.log(`  - ${type}: ${count}`)
    })

    // Check for problematic types
    const problematicTypes = ['difficult_conversation_helper', 'interactive_element_auditor', 'automated_element_enhancer']
    const problematicElements = visibleElements?.filter(e => problematicTypes.includes(e.type))
    
    if (problematicElements && problematicElements.length > 0) {
      console.log('\n⚠️  WARNING: Found problematic element types that may cause React.lazy errors:')
      problematicElements.forEach(e => {
        console.log(`  - ${e.type}: "${e.title}" (ID: ${e.id})`)
      })
    }

    // Check for Sofia's components
    console.log('\nSofia\'s Components in Lesson 3:')
    const sofiaElements = visibleElements?.filter(e => 
      e.title.includes('Sofia') || 
      e.type === 'ai_email_composer' ||
      e.type === 'ai_content_generator'
    )

    sofiaElements?.forEach(element => {
      console.log(`  - ${element.type}: "${element.title}" (ID: ${element.id}, Order: ${element.order_index})`)
    })

    // Component routing analysis
    console.log('\nComponent Routing Analysis:')
    visibleElements?.forEach(element => {
      let expectedComponent = 'Unknown'
      
      switch (element.type) {
        case 'ai_email_composer':
          if (element.title.includes('Sofia')) {
            expectedComponent = 'SofiaStoryBreakthrough'
          } else {
            expectedComponent = 'AIEmailComposer'
          }
          break
        case 'ai_content_generator':
          expectedComponent = 'AIContentGenerator'
          break
        case 'lyra_chat':
          expectedComponent = 'LyraChatRenderer'
          break
        case 'knowledge_check':
          expectedComponent = 'KnowledgeCheckRenderer'
          break
        case 'reflection':
          expectedComponent = 'ReflectionRenderer'
          break
        case 'callout_box':
          expectedComponent = 'CalloutBoxRenderer'
          break
        case 'difficult_conversation_helper':
          expectedComponent = 'DifficultConversationHelper'
          break
      }

      console.log(`  - Element ${element.id} (${element.type}) → ${expectedComponent}`)
    })

    // Check which components should use direct imports
    console.log('\nDirect Import Analysis:')
    const directImportComponents = [
      'SofiaStoryBreakthrough',
      'CalloutBoxRenderer',
      'LyraChatRenderer',
      'KnowledgeCheckRenderer',
      'ReflectionRenderer',
      'DifficultConversationHelper',
      'AIEmailComposer',
      'AIContentGenerator'
    ]

    visibleElements?.forEach(element => {
      const usesDirectImport = 
        element.title.includes('Sofia') || 
        ['callout_box', 'lyra_chat', 'knowledge_check', 'reflection', 'difficult_conversation_helper'].includes(element.type)
      
      console.log(`  - ${element.type}: ${usesDirectImport ? '✓ Direct Import' : '⚠️  React.lazy'}`)
    })

  } catch (error) {
    console.error('Error:', error)
  }
}

testChapter3Loading()