import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function fixChapter2Consistency() {
  console.log('🔧 Fixing Chapter 2 content consistency issues...\n')

  try {
    // Get current content that needs fixing
    console.log('1️⃣ Analyzing current content...')
    
    const { data: lesson5Content } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .order('order_index')

    const { data: lesson5Interactive } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 5)
      .order('order_index')

    console.log(`Lesson 5: ${lesson5Content?.length} content blocks, ${lesson5Interactive?.length} interactive elements`)

    // Show what interactive elements actually exist
    console.log('\nActual interactive elements in Lesson 5:')
    lesson5Interactive?.forEach(elem => {
      console.log(`- ${elem.title} (${elem.type})`)
    })

    // Fix Lesson 5 tool promises
    console.log('\n2️⃣ Fixing Lesson 5 tool descriptions...')
    
    // Find and update content blocks that mention "four tools"
    const { data: toolPromiseBlocks } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .ilike('content', '%four%tools%')

    if (toolPromiseBlocks && toolPromiseBlocks.length > 0) {
      console.log(`Found ${toolPromiseBlocks.length} content blocks mentioning "four tools"`)
      
      for (const block of toolPromiseBlocks) {
        // Update the content to match actual available tools
        const updatedContent = block.content
          .replace(/four game-changing tools/gi, 'two powerful AI tools')
          .replace(/four essential email tools/gi, 'two essential email tools')
          .replace(/an AI Email Composer.*?clear action items\./gi, 
            'an AI Email Composer that helps you write professional, personalized messages in any tone, and a Difficult Conversation Helper that transforms challenging communications into opportunities for connection and understanding.')

        const { error } = await supabase
          .from('content_blocks')
          .update({ content: updatedContent })
          .eq('id', block.id)

        if (error) {
          console.error(`Error updating block ${block.id}:`, error)
        } else {
          console.log(`✅ Updated: ${block.title}`)
        }
      }
    }

    // Fix the first interactive element to have better context
    console.log('\n3️⃣ Improving interactive element context...')
    
    const { data: parentResponseElement } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 5)
      .eq('type', 'ai_email_composer')
      .single()

    if (parentResponseElement) {
      const improvedContent = `Maya faces a delicate situation: a concerned parent has questioned the safety of the community garden project. This email requires both professionalism and empathy. Help Maya craft a response that addresses the parent's concerns while maintaining trust and enthusiasm for the program.`
      
      const { error } = await supabase
        .from('interactive_elements')
        .update({ 
          content: improvedContent,
          title: 'Help Maya Handle a Concerned Parent'
        })
        .eq('id', parentResponseElement.id)

      if (error) {
        console.error('Error updating parent response element:', error)
      } else {
        console.log('✅ Improved context for parent response scenario')
      }
    }

    // Check Lesson 6 tool promises
    console.log('\n4️⃣ Checking Lesson 6 consistency...')
    
    const { data: lesson6Interactive } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 6)
      .order('order_index')

    console.log('Actual interactive elements in Lesson 6:')
    lesson6Interactive?.forEach(elem => {
      console.log(`- ${elem.title} (${elem.type})`)
    })

    // Update Lesson 6 tool promises to match reality
    const { data: lesson6ToolBlocks } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 6)
      .ilike('content', '%four%powerful%tools%')

    if (lesson6ToolBlocks && lesson6ToolBlocks.length > 0) {
      for (const block of lesson6ToolBlocks) {
        const updatedContent = block.content
          .replace(/four powerful tools/gi, 'three proven document creation tools')
          .replace(/the Report Generator.*?reusable formats\./gi,
            'the Document Generator for creating compelling first drafts from simple prompts, the Document Improver for polishing your writing to professional standards, and the Template Creator for building reusable frameworks that save hours on future projects.')

        const { error } = await supabase
          .from('content_blocks')
          .update({ content: updatedContent })
          .eq('id', block.id)

        if (error) {
          console.error(`Error updating lesson 6 block ${block.id}:`, error)
        } else {
          console.log(`✅ Updated Lesson 6: ${block.title}`)
        }
      }
    }

    // Check Lessons 7-8 for empty promises
    console.log('\n5️⃣ Checking Lessons 7-8 tool promises...')
    
    for (const lessonId of [7, 8]) {
      const { data: content } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('lesson_id', lessonId)

      const { data: interactive } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('lesson_id', lessonId)

      console.log(`Lesson ${lessonId}: ${content?.length || 0} content blocks, ${interactive?.length || 0} interactive elements`)
      
      if (content && content.length > 0 && (!interactive || interactive.length === 0)) {
        console.log(`⚠️ Lesson ${lessonId} has content but no interactive elements - potential consistency issue`)
      }
    }

    // Show final state
    console.log('\n6️⃣ Final consistency check...')
    
    for (const lessonId of [5, 6, 7, 8]) {
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('title')
        .eq('lesson_id', lessonId)
        .order('order_index')

      const { data: interactiveElements } = await supabase
        .from('interactive_elements')
        .select('title, type')
        .eq('lesson_id', lessonId)
        .eq('is_visible', true)
        .order('order_index')

      console.log(`\nLesson ${lessonId}:`)
      console.log(`  Content blocks: ${contentBlocks?.length || 0}`)
      console.log(`  Interactive elements: ${interactiveElements?.length || 0}`)
      
      if (interactiveElements && interactiveElements.length > 0) {
        console.log('  Available tools:')
        interactiveElements.forEach(elem => {
          console.log(`    - ${elem.title}`)
        })
      }
    }

    console.log('\n✅ Chapter 2 consistency fixes complete!')
    console.log('\n📋 Summary of changes:')
    console.log('- Updated tool count promises to match reality')
    console.log('- Improved interactive element context and titles')
    console.log('- Aligned content descriptions with available tools')
    console.log('- Identified lessons with content/tool mismatches')

  } catch (error) {
    console.error('Error during consistency fixes:', error)
  }
}

fixChapter2Consistency()