import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function runFinalCleanup() {
  console.log('🧹 Running comprehensive chapter cleanup...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  const { data, error } = await supabase.functions.invoke('cleanup-chapter')
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  console.log('✅ Cleanup complete!\n')
  console.log(`Deleted duplicates: ${data.results.deletedDuplicates}`)
  console.log(`Total content blocks: ${data.results.totalContentBlocks}`)
  console.log(`Total interactive elements: ${data.results.totalInteractiveElements}`)
  
  console.log('\n📄 Final Content Structure:')
  data.results.structure.contentBlocks?.forEach((block: string) => {
    console.log(`  ${block}`)
  })
  
  console.log('\n🎯 Interactive Elements:')
  data.results.structure.interactiveElements?.forEach((element: string) => {
    console.log(`  ${element}`)
  })
}

runFinalCleanup().catch(console.error)