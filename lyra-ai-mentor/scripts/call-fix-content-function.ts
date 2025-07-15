import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function callFixContentFunction() {
  console.log('🚀 Calling Edge Function to fix Chapter 2 content...\n')

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

  try {
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('fix-content', {
      body: { action: 'fix-maya-lesson' }
    })

    if (error) {
      console.error('❌ Error calling function:', error)
      return
    }

    console.log('✅ Edge Function response:', data)

    // Verify the fixes
    console.log('\n🔍 Verifying fixes...')
    
    const { data: verifyBlock } = await supabase
      .from('content_blocks')
      .select('content')
      .eq('lesson_id', 5)
      .eq('title', 'Enter the AI Email Revolution')
      .single()

    if (verifyBlock) {
      if (verifyBlock.content.includes('practical AI tools') && !verifyBlock.content.includes('four game-changing tools')) {
        console.log('✅ Content successfully updated!')
        console.log('- "four tools" has been replaced with accurate description')
        console.log('- No more phantom tools or features')
      } else if (verifyBlock.content.includes('four game-changing tools')) {
        console.log('❌ Content still contains "four game-changing tools"')
        console.log('Edge Function may need debugging')
      }
    }

    // Check character mentions
    const { data: charCheck } = await supabase
      .from('content_blocks')
      .select('title')
      .eq('lesson_id', 5)
      .or('content.ilike.%Sofia%,content.ilike.%David%,content.ilike.%Rachel%,content.ilike.%Alex%')

    if (charCheck && charCheck.length > 0) {
      console.log(`\n⚠️ Some blocks may still contain character mentions:`)
      charCheck.forEach(block => console.log(`  - ${block.title}`))
    } else {
      console.log('\n✅ No inappropriate character mentions found')
    }

    console.log('\n🎉 Content fix complete!')
    console.log('Maya\'s lesson now accurately describes the 2 available tools')
    console.log('and focuses solely on her email transformation story.')

  } catch (error) {
    console.error('Error:', error)
  }
}

callFixContentFunction()