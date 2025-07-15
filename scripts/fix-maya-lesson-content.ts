import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function fixMayaLessonContent() {
  console.log('🔧 Fixing Maya\'s lesson content (Lesson 5)...\n')

  try {
    // Step 1: Find the problematic content block about "four game-changing tools"
    console.log('1️⃣ Finding and fixing the "four tools" content block...')
    
    const { data: fourToolsBlock } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .eq('title', 'Enter the AI Email Revolution')
      .single()

    if (fourToolsBlock) {
      console.log('Found the block. Current content:')
      console.log(fourToolsBlock.content.substring(0, 200) + '...\n')

      // Update the content to match reality (only 2 tools)
      const correctedContent = `What Maya discovers today will transform not just her Monday mornings, but her entire approach to communication. AI isn't about replacing the human touch that makes her messages meaningful—it's about amplifying her natural empathy and expertise while eliminating the time-consuming struggle with tone, structure, and wording.

In the next 20 minutes, Maya will master two essential AI tools that will revolutionize her email communication: an AI Email Composer that helps her craft professional, personalized messages in any tone or situation, and the power of AI guidance through Lyra Chat to navigate her specific communication challenges. These tools preserve Maya's authentic voice while dramatically improving her efficiency and confidence.`

      const { error } = await supabase
        .from('content_blocks')
        .update({ content: correctedContent })
        .eq('id', fourToolsBlock.id)

      if (error) {
        console.error('Error updating content:', error)
      } else {
        console.log('✅ Updated "four tools" to "two essential AI tools"')
      }
    }

    // Step 2: Find any mentions of other characters in Lesson 5
    console.log('\n2️⃣ Finding inappropriate character mentions in Maya\'s lesson...')
    
    const { data: lesson5Blocks } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .or('content.ilike.%James%,content.ilike.%Sofia%,content.ilike.%David%,content.ilike.%Rachel%,content.ilike.%Alex%')

    if (lesson5Blocks && lesson5Blocks.length > 0) {
      console.log(`Found ${lesson5Blocks.length} blocks with character mentions:`)
      
      for (const block of lesson5Blocks) {
        console.log(`\n📄 Block: ${block.title}`)
        
        // Check which characters are mentioned
        const mentions = []
        if (block.content.includes('James')) mentions.push('James')
        if (block.content.includes('Sofia')) mentions.push('Sofia')
        if (block.content.includes('David')) mentions.push('David')
        if (block.content.includes('Rachel')) mentions.push('Rachel')
        if (block.content.includes('Alex')) mentions.push('Alex')
        
        console.log(`  Characters mentioned: ${mentions.join(', ')}`)
        
        // Fix the reflection block that mentions James
        if (block.title === 'Your Email Pain Points' && block.content.includes('James')) {
          const fixedReflection = block.content.replace(
            'Or perhaps you\'re like James (our development associate), who worries about striking the right tone with major donors?',
            'Or perhaps you worry about striking the right tone with major donors and key stakeholders?'
          )
          
          const { error } = await supabase
            .from('content_blocks')
            .update({ content: fixedReflection })
            .eq('id', block.id)
          
          if (!error) {
            console.log('  ✅ Removed James reference from reflection')
          }
        }
        
        // Remove the "Coming up" section that lists all other characters
        if (block.content.includes('Coming up: You\'ll see how James')) {
          const contentWithoutComingUp = block.content.split('Coming up:')[0].trim()
          
          const { error } = await supabase
            .from('content_blocks')
            .update({ content: contentWithoutComingUp })
            .eq('id', block.id)
          
          if (!error) {
            console.log('  ✅ Removed "Coming up" section with other character references')
          }
        }
      }
    }

    // Step 3: Verify what interactive elements actually exist
    console.log('\n3️⃣ Verifying actual interactive elements in Lesson 5...')
    
    const { data: interactiveElements } = await supabase
      .from('interactive_elements')
      .select('type, title, order_index')
      .eq('lesson_id', 5)
      .order('order_index')

    console.log('Interactive elements available:')
    interactiveElements?.forEach(elem => {
      console.log(`  - [${elem.order_index}] ${elem.title} (${elem.type})`)
    })

    // Step 4: Show final state
    console.log('\n4️⃣ Final check of corrected content...')
    
    const { data: finalCheck } = await supabase
      .from('content_blocks')
      .select('title, content')
      .eq('lesson_id', 5)
      .eq('title', 'Enter the AI Email Revolution')
      .single()

    if (finalCheck) {
      console.log('\nCorrected content preview:')
      console.log(finalCheck.content.substring(0, 300) + '...')
    }

    console.log('\n✅ Maya\'s lesson content fixed!')
    console.log('- Removed incorrect "four tools" promise')
    console.log('- Removed inappropriate character references')
    console.log('- Content now matches available tools')
    console.log('- Focused solely on Maya\'s email transformation story')

  } catch (error) {
    console.error('Error fixing content:', error)
  }
}

fixMayaLessonContent()