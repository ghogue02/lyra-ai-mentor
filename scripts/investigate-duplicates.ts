import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function investigateDuplicates() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Investigating duplicate blocks...\n')
  
  // Get ALL content blocks for lesson 5
  const { data: allBlocks } = await supabase
    .from('content_blocks')
    .select('id, title, order_index')
    .eq('lesson_id', 5)
    .order('order_index')
  
  console.log('All content blocks:')
  allBlocks?.forEach(block => {
    console.log(`ID: ${block.id}, Order: ${block.order_index}, Title: "${block.title}"`)
  })
  
  // Group by title to find true duplicates
  const titleGroups: { [key: string]: typeof allBlocks } = {}
  allBlocks?.forEach(block => {
    if (!titleGroups[block.title]) {
      titleGroups[block.title] = []
    }
    titleGroups[block.title].push(block)
  })
  
  console.log('\n\nDuplicates by title:')
  Object.entries(titleGroups).forEach(([title, blocks]) => {
    if (blocks.length > 1) {
      console.log(`\n"${title}" has ${blocks.length} copies:`)
      blocks.forEach(b => console.log(`  - ID: ${b.id}, Order: ${b.order_index}`))
    }
  })
}

investigateDuplicates().catch(console.error)