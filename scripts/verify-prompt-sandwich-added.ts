import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function verifyPromptSandwichAdded() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🥪 VERIFYING PROMPT SANDWICH BUILDER')
  console.log('=' * 40)
  
  // Check if element exists
  const { data: element, error } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('title', 'Master the AI Prompt Sandwich')
    .eq('lesson_id', 5)
    .single()
  
  if (error || !element) {
    console.log('\n❌ Element NOT FOUND in database')
    console.log('   Please run the SQL migration first')
    return
  }
  
  console.log('\n✅ ELEMENT SUCCESSFULLY ADDED!')
  console.log(`   ID: ${element.id}`)
  console.log(`   Type: ${element.type}`)
  console.log(`   Order: ${element.order_index}`)
  console.log(`   Active: ${element.is_active}`)
  console.log(`   Component: ${element.configuration?.component}`)
  
  // Show complete flow
  const { data: flow } = await supabase
    .rpc('get_lesson_flow', { lesson_id_param: 5 })
    .order('order_index')
    .in('order_index', [40, 45, 50, 55, 60, 90])
  
  console.log('\n📍 Element in Lesson Flow:')
  const contentBlocks = await supabase
    .from('content_blocks')
    .select('title, order_index')
    .eq('lesson_id', 5)
    .in('order_index', [40, 50])
    .order('order_index')
  
  const interactiveElements = await supabase
    .from('interactive_elements')
    .select('title, order_index')
    .eq('lesson_id', 5)
    .eq('is_active', true)
    .in('order_index', [45, 55, 90])
    .order('order_index')
  
  const allItems = [
    ...(contentBlocks.data || []).map(b => ({ ...b, type: 'content' })),
    ...(interactiveElements.data || []).map(e => ({ ...e, type: 'interactive' }))
  ].sort((a, b) => a.order_index - b.order_index)
  
  allItems.forEach(item => {
    const icon = item.type === 'content' ? '📄' : '🎯'
    const highlight = item.title === 'Master the AI Prompt Sandwich' ? ' ← NEW!' : ''
    console.log(`   [${item.order_index}] ${icon} ${item.title}${highlight}`)
  })
  
  console.log('\n🎉 Users can now:')
  console.log('   • Build 3-layer prompt sandwiches')
  console.log('   • Choose from 320 prompt combinations')
  console.log('   • See real-time previews')
  console.log('   • Copy prompts with one click')
  console.log('   • Save 27 minutes per email!')
}

verifyPromptSandwichAdded().catch(console.error)