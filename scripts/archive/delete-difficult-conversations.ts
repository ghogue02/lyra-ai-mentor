import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function deleteDifficultConversations() {
  console.log('🗑️ Removing difficult_conversation_helper elements...\n')

  try {
    // First get them to see what we're deleting
    const { data: toDelete, error: fetchError } = await supabase
      .from('interactive_elements')
      .select('id, lesson_id, title')
      .eq('type', 'difficult_conversation_helper')

    if (fetchError) {
      console.error('Error fetching elements:', fetchError)
      return
    }

    console.log(`Found ${toDelete?.length || 0} elements to delete:`)
    toDelete?.forEach(elem => {
      console.log(`- Lesson ${elem.lesson_id}: ${elem.title} (ID: ${elem.id})`)
    })

    if (toDelete && toDelete.length > 0) {
      // Delete them one by one to ensure it works
      for (const elem of toDelete) {
        const { error } = await supabase
          .from('interactive_elements')
          .delete()
          .eq('id', elem.id)
        
        if (error) {
          console.error(`Error deleting element ${elem.id}:`, error)
        } else {
          console.log(`✅ Deleted element ${elem.id}`)
        }
      }
    }

    // Verify they're gone
    const { data: remaining } = await supabase
      .from('interactive_elements')
      .select('id')
      .eq('type', 'difficult_conversation_helper')

    console.log(`\n✅ Remaining difficult_conversation_helper elements: ${remaining?.length || 0}`)

    // Check lesson 5 final state
    const { data: lesson5Elements } = await supabase
      .from('interactive_elements')
      .select('title, type, order_index')
      .eq('lesson_id', 5)
      .order('order_index')

    console.log('\n📋 Lesson 5 interactive elements after cleanup:')
    lesson5Elements?.forEach(elem => {
      console.log(`[${elem.order_index}] ${elem.title} (${elem.type})`)
    })

  } catch (error) {
    console.error('Error:', error)
  }
}

deleteDifficultConversations()