import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function archiveFinalLyraElement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🗄️ ARCHIVING FINAL LYRA ELEMENT')
  console.log('=' * 35)
  
  // Find the remaining active Lyra element
  const { data: lyraElements } = await supabase
    .from('interactive_elements')
    .select('id, title, type, lesson_id, is_active')
    .ilike('title', '%lyra%')
    .eq('is_active', true)
  
  if (!lyraElements || lyraElements.length === 0) {
    console.log('✅ No active Lyra elements found - all already archived!')
    return
  }
  
  console.log(`📋 Found ${lyraElements.length} active Lyra elements:`)
  lyraElements.forEach(element => {
    console.log(`   - ID ${element.id}: "${element.title}" (L${element.lesson_id})`)
  })
  
  // Archive using Edge Function for proper permissions
  console.log('\n🔄 Archiving via Edge Function...')
  
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'archive-elements',
      data: {
        elementIds: lyraElements.map(e => e.id)
      }
    }
  })
  
  if (error) {
    console.error('❌ Error via Edge Function:', error)
    
    // Fallback to direct update
    console.log('🔄 Trying direct update...')
    for (const element of lyraElements) {
      try {
        const { error: updateError } = await supabase
          .from('interactive_elements')
          .update({ is_active: false })
          .eq('id', element.id)
        
        if (updateError) {
          console.error(`❌ Error archiving "${element.title}":`, updateError.message)
        } else {
          console.log(`✅ Archived: "${element.title}"`)
        }
      } catch (err) {
        console.error(`❌ Exception archiving "${element.title}":`, err)
      }
    }
  } else {
    console.log('✅ Elements archived via Edge Function!')
  }
  
  // Verification
  console.log('\n🔍 Verification:')
  const { data: remainingLyra } = await supabase
    .from('interactive_elements')
    .select('id, title')
    .ilike('title', '%lyra%')
    .eq('is_active', true)
  
  if (!remainingLyra || remainingLyra.length === 0) {
    console.log('✅ All Lyra elements successfully archived!')
  } else {
    console.log(`❌ ${remainingLyra.length} Lyra elements still active`)
  }
  
  console.log('\n🎉 Final Lyra Element Archival Complete!')
}

archiveFinalLyraElement().catch(console.error)