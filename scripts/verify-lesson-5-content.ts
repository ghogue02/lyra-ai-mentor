import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function verifyLesson5Content() {
  console.log('🔍 Verifying Lesson 5 content after fixes...\n')

  try {
    // Get the specific "Enter the AI Email Revolution" block
    const { data: revolutionBlock } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .eq('title', 'Enter the AI Email Revolution')
      .single()

    if (revolutionBlock) {
      console.log('📄 "Enter the AI Email Revolution" block:')
      console.log('Content:')
      console.log(revolutionBlock.content)
      console.log('\n' + '='.repeat(80) + '\n')
    }

    // Check what interactive elements the user will actually see
    console.log('🎯 Interactive elements (with frontend filtering):')
    
    const { data: interactiveElements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 5)
      .eq('is_visible', true)
      .eq('is_active', true)
      .order('order_index')

    // Apply the same filtering as useLessonData.ts
    const adminElementTypes = [
      'difficult_conversation_helper',
      'interactive_element_auditor', 
      'automated_element_enhancer',
      'database_debugger',
      'interactive_element_builder',
      'element_workflow_coordinator',
      'chapter_builder_agent',
      'content_audit_agent',
      'storytelling_agent'
    ]
    
    const filteredElements = interactiveElements?.filter(
      element => !adminElementTypes.includes(element.type) && 
                !element.title?.toLowerCase().includes('test') &&
                !element.title?.toLowerCase().includes('debug')
    ) || []

    console.log('User will see these tools:')
    filteredElements.forEach(elem => {
      console.log(`- ${elem.title} (${elem.type})`)
    })
    console.log(`Total: ${filteredElements.length} tools\n`)

    // Check if content matches reality
    if (revolutionBlock?.content.includes('two essential AI tools')) {
      console.log('✅ Content correctly states "two essential AI tools"')
    } else if (revolutionBlock?.content.includes('four game-changing tools')) {
      console.log('❌ Content still incorrectly states "four game-changing tools"')
    }

    // Check for character mentions
    console.log('\n🔍 Checking for character mentions in all Lesson 5 blocks...')
    
    const { data: allBlocks } = await supabase
      .from('content_blocks')
      .select('id, title, content')
      .eq('lesson_id', 5)
      .order('order_index')

    const characterMentions: any = {}
    const characters = ['James', 'Sofia', 'David', 'Rachel', 'Alex']

    allBlocks?.forEach(block => {
      const mentions = characters.filter(char => block.content.includes(char))
      if (mentions.length > 0) {
        characterMentions[block.title] = mentions
      }
    })

    if (Object.keys(characterMentions).length > 0) {
      console.log('Character mentions found:')
      Object.entries(characterMentions).forEach(([title, chars]) => {
        console.log(`- ${title}: ${(chars as string[]).join(', ')}`)
      })
    } else {
      console.log('✅ No inappropriate character mentions found')
    }

  } catch (error) {
    console.error('Error during verification:', error)
  }
}

verifyLesson5Content()