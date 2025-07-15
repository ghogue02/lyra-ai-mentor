import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function checkLessonFlow() {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Checking Maya\'s lesson flow (Lesson 5)...\n')
  
  // Get all content blocks for lesson 5
  const { data: blocks } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', 5)
    .order('order_index')
  
  console.log('📄 Content Blocks:')
  blocks?.forEach(block => {
    console.log(`\n${block.order_index}. ${block.title}`)
    console.log('---')
    console.log(block.content.substring(0, 200) + '...')
  })
  
  // Get interactive elements
  const { data: elements } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')
  
  console.log('\n\n🎯 Interactive Elements:')
  elements?.forEach(element => {
    console.log(`\n${element.order_index}. ${element.title} (${element.type})`)
    if (element.description) {
      console.log('Description:', element.description.substring(0, 150) + '...')
    }
  })
  
  // Check if there's any setup for the parent response scenario
  console.log('\n\n🔎 Searching for parent/concern context...')
  const parentMentions = blocks?.filter(b => 
    b.content.toLowerCase().includes('parent') || 
    b.content.toLowerCase().includes('concern') ||
    b.content.toLowerCase().includes('complaint')
  )
  
  if (parentMentions && parentMentions.length > 0) {
    console.log('\nFound context in these blocks:')
    parentMentions.forEach(block => {
      console.log(`- ${block.title}`)
    })
  } else {
    console.log('\n❌ No context found for parent response scenario!')
    console.log('The interactive element appears without any story setup.')
  }
}

checkLessonFlow()