import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function fixLesson1LyraElement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔧 FIXING LESSON 1 LYRA ELEMENT')
  console.log('=' * 32)
  
  // Use the same Edge Function approach that worked for the other cleanup
  console.log('🔄 Using Edge Function to deactivate element...')
  
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'fix-element-visibility',
      data: {
        deactivateElements: [
          {
            element_id: 1,
            reason: 'Archiving final Lyra chat element as requested'
          }
        ],
        reorderElements: []
      }
    }
  })
  
  if (error) {
    console.error('❌ Error via Edge Function:', error)
  } else {
    console.log('✅ Element deactivated via Edge Function!')
  }
  
  // Verification
  console.log('\n🔍 Final verification:')
  const { data: lyraCheck } = await supabase
    .from('interactive_elements')
    .select('id, title, is_active')
    .ilike('title', '%lyra%')
    .eq('is_active', true)
  
  if (!lyraCheck || lyraCheck.length === 0) {
    console.log('✅ SUCCESS: All Lyra elements are now inactive!')
  } else {
    console.log(`❌ ${lyraCheck.length} Lyra elements still active:`)
    lyraCheck.forEach(element => {
      console.log(`   - ID ${element.id}: "${element.title}"`)
    })
  }
  
  console.log('\n🎉 FINAL CLEANUP COMPLETE!')
}

fixLesson1LyraElement().catch(console.error)