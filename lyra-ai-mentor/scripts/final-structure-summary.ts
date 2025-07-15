import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function showFinalStructure() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('\n📚 FINAL CHAPTER 2 STRUCTURE\n' + '='.repeat(60))
  
  // Get properly ordered items
  const { data: blocks } = await supabase
    .from('content_blocks')
    .select('title, order_index')
    .eq('lesson_id', 5)
    .lte('order_index', 200)  // Exclude any with order 999
    .order('order_index')
  
  const { data: elements } = await supabase
    .from('interactive_elements')
    .select('title, type, order_index')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .lte('order_index', 200)
    .order('order_index')
  
  // Merge and display
  const all = [
    ...(blocks || []).map(b => ({ ...b, itemType: 'content' })),
    ...(elements || []).map(e => ({ ...e, itemType: 'interactive' }))
  ].sort((a, b) => a.order_index - b.order_index)
  
  console.log(`\nTotal items in proper order: ${all.length}`)
  console.log('(Content: ' + blocks?.length + ', Interactive: ' + elements?.length + ')\n')
  
  let lastPhase = ''
  all.forEach(item => {
    // Determine phase
    let phase = ''
    if (item.order_index <= 30) phase = 'PROBLEM'
    else if (item.order_index <= 60) phase = 'DISCOVERY'
    else if (item.order_index <= 90) phase = 'PRACTICE 1'
    else if (item.order_index <= 120) phase = 'ADVANCED'
    else if (item.order_index <= 150) phase = 'PRACTICE 2'
    else if (item.order_index <= 170) phase = 'LYRA'
    else phase = 'MASTERY'
    
    if (phase !== lastPhase) {
      console.log(`\n--- ${phase} ---`)
      lastPhase = phase
    }
    
    if (item.itemType === 'content') {
      console.log(`📄 ${item.order_index}. ${item.title}`)
    } else {
      console.log(`🎯 ${item.order_index}. ${item.title} (${(item as any).type})`)
    }
  })
  
  // Show any orphaned items
  const { data: orphaned } = await supabase
    .from('content_blocks')
    .select('title, order_index')
    .eq('lesson_id', 5)
    .eq('order_index', 999)
  
  if (orphaned && orphaned.length > 0) {
    console.log('\n\n⚠️  Items needing manual ordering:')
    orphaned.forEach(item => {
      console.log(`- ${item.title}`)
    })
  }
  
  console.log('\n✅ Restructure complete!')
  console.log('\nThe chapter now follows a clear story arc:')
  console.log('1. Maya struggles with email overwhelm')
  console.log('2. She discovers AI tools through a webinar')
  console.log('3. Practices with parent email (low stakes)')
  console.log('4. Learns advanced features')
  console.log('5. Handles board chair crisis (high stakes)')
  console.log('6. Discovers Lyra for ongoing support')
  console.log('7. Shows complete transformation')
}

showFinalStructure().catch(console.error)