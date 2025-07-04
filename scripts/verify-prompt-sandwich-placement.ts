import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function verifyPromptSandwichPlacement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🥪 PROMPT SANDWICH BUILDER PLACEMENT')
  console.log('=' * 40)
  
  // Check if element already exists
  const { data: existing } = await supabase
    .from('interactive_elements')
    .select('id, title, order_index')
    .eq('title', 'Master the AI Prompt Sandwich')
    .eq('lesson_id', 5)
    .single()
  
  if (existing) {
    console.log('\n✅ Element already exists in database!')
    console.log(`   ID: ${existing.id}`)
    console.log(`   Order: ${existing.order_index}`)
  } else {
    console.log('\n⚠️  Element not yet in database')
    console.log('   Run: add-prompt-sandwich-element.sql')
  }
  
  // Show where it will appear in the lesson flow
  const { data: flow } = await supabase
    .from('content_blocks')
    .select('title, order_index')
    .eq('lesson_id', 5)
    .in('order_index', [40, 50, 60])
    .order('order_index')
  
  console.log('\n📍 Placement in Lesson 5:')
  flow?.forEach(block => {
    console.log(`   [${block.order_index}] ${block.title}`)
    if (block.order_index === 50) {
      console.log(`   [55] 🥪 Master the AI Prompt Sandwich ← NEW!`)
    }
  })
  
  console.log('\n🎯 Features:')
  console.log('   • 3-layer prompt building (Tone + Context + Template)')
  console.log('   • Real-time prompt preview')
  console.log('   • Sample email generation')
  console.log('   • Time savings visualization (32min → 5min)')
  console.log('   • Copy-to-clipboard functionality')
  console.log('   • Maya\'s story integration')
  
  console.log('\n💡 User Journey:')
  console.log('   1. Learn about AI Email Composer (content block)')
  console.log('   2. Master the Prompt Sandwich technique (interactive)')
  console.log('   3. Apply to real scenarios in next elements')
}

verifyPromptSandwichPlacement().catch(console.error)