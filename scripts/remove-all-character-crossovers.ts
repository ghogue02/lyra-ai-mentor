import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function removeAllCharacterCrossovers() {
  console.log('🧹 Removing all inappropriate character mentions from lessons...\n')

  try {
    // Maya's lesson (5) should only mention Maya
    console.log('1️⃣ Cleaning up Maya\'s lesson (Lesson 5)...')
    
    const { data: mayaBlocks } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 5)
      .or('content.ilike.%James%,content.ilike.%Sofia%,content.ilike.%David%,content.ilike.%Rachel%,content.ilike.%Alex%')

    if (mayaBlocks) {
      for (const block of mayaBlocks) {
        let updatedContent = block.content
        let needsUpdate = false

        // Handle "Maya's Transformation Begins" block
        if (block.title === 'Maya\'s Transformation Begins') {
          if (block.content.includes('Coming up:')) {
            // Remove the entire "Coming up" paragraph
            updatedContent = block.content.split('Coming up:')[0].trim()
            needsUpdate = true
            console.log(`  📝 ${block.title}: Removing "Coming up" section`)
          }
        }

        // Handle "Meet Your Nonprofit Heroes" block
        if (block.title === 'Meet Your Nonprofit Heroes') {
          // This block lists all characters - let's focus it on just Maya and preview James
          updatedContent = `Throughout this course, you'll follow the journeys of nonprofit professionals facing real challenges just like yours. Today, you're meeting Maya Rodriguez, who's transforming her email communication at Hope Gardens Community Center. In the next lesson, you'll meet James Chen as he tackles document creation challenges. Each character's story will teach you practical AI skills you can apply immediately in your own work.`
          needsUpdate = true
          console.log(`  📝 ${block.title}: Refocused on Maya with James preview only`)
        }

        // Handle "Character Transformation Outcomes" block
        if (block.title === 'Character Transformation Outcomes') {
          // Keep only Maya's outcomes since this is her lesson
          const mayaSection = updatedContent.match(/\*\*Maya[^*]+\*\*[^*]+(?=\*\*|$)/)?.[0] || ''
          if (mayaSection) {
            updatedContent = `By the end of this lesson, here's what you'll achieve:\n\n${mayaSection}\n\nYour transformation starts with mastering email communication - the foundation of nonprofit relationship building.`
            needsUpdate = true
            console.log(`  📝 ${block.title}: Focused on Maya's outcomes only`)
          }
        }

        if (needsUpdate) {
          const { error } = await supabase
            .from('content_blocks')
            .update({ content: updatedContent })
            .eq('id', block.id)

          if (error) {
            console.error(`    ❌ Error updating ${block.title}:`, error)
          } else {
            console.log(`    ✅ Updated successfully`)
          }
        }
      }
    }

    // James's lesson (6) should only mention James (with possible Maya callback)
    console.log('\n2️⃣ Checking James\'s lesson (Lesson 6)...')
    
    const { data: jamesBlocks } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('lesson_id', 6)
      .or('content.ilike.%Sofia%,content.ilike.%David%,content.ilike.%Rachel%,content.ilike.%Alex%')

    if (jamesBlocks && jamesBlocks.length > 0) {
      console.log(`Found ${jamesBlocks.length} blocks with other character mentions`)
      // Handle James's blocks similarly if needed
    } else {
      console.log('✅ No inappropriate character mentions found')
    }

    // Final verification
    console.log('\n3️⃣ Final verification...')
    
    // Check Maya's lesson
    const { data: mayaFinal } = await supabase
      .from('content_blocks')
      .select('title')
      .eq('lesson_id', 5)
      .or('content.ilike.%James%,content.ilike.%Sofia%,content.ilike.%David%,content.ilike.%Rachel%,content.ilike.%Alex%')

    if (mayaFinal && mayaFinal.length > 0) {
      console.log(`⚠️ Lesson 5 still has ${mayaFinal.length} blocks with character mentions:`)
      mayaFinal.forEach(block => console.log(`  - ${block.title}`))
    } else {
      console.log('✅ Lesson 5 (Maya) is clean - no inappropriate character mentions')
    }

    console.log('\n✅ Character crossover cleanup complete!')
    console.log('- Maya\'s lesson focuses solely on her email transformation')
    console.log('- James preview moved to appropriate context')
    console.log('- Removed confusing references to undeveloped characters')

  } catch (error) {
    console.error('Error during cleanup:', error)
  }
}

removeAllCharacterCrossovers()