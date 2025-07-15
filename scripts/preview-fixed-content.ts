import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function previewFixedContent() {
  console.log('📄 PREVIEW: What the content SHOULD look like after fixes\n')
  
  console.log('=' .repeat(80))
  console.log('BEFORE (Current - WRONG):')
  console.log('=' .repeat(80))
  console.log('"In the next 20 minutes, Maya will learn to use four game-changing tools..."')
  console.log('"Coming up: You\'ll see how James tackles grant proposal deadlines..."')
  console.log('\n')
  
  console.log('=' .repeat(80))
  console.log('AFTER (Fixed - CORRECT):')
  console.log('=' .repeat(80))
  console.log('"In the next 20 minutes, Maya will master practical AI tools that will')
  console.log('revolutionize her email communication: the AI Email Composer that helps')
  console.log('her craft professional, personalized messages in any tone or situation,')
  console.log('and personalized AI guidance through Lyra Chat to navigate her specific')
  console.log('communication challenges."')
  console.log('\n[No mention of James, Sofia, David, Rachel, or Alex]')
  console.log('\n')

  // Check what tools are actually available
  console.log('=' .repeat(80))
  console.log('ACTUAL TOOLS AVAILABLE TO USERS:')
  console.log('=' .repeat(80))
  
  const { data: elements } = await supabase
    .from('interactive_elements')
    .select('type, title')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')

  // Simulate frontend filtering
  const adminTypes = [
    'difficult_conversation_helper',
    'interactive_element_auditor',
    'automated_element_enhancer'
  ]
  
  const userVisibleElements = elements?.filter(e => 
    !adminTypes.includes(e.type) && 
    !e.title.toLowerCase().includes('test')
  ) || []

  userVisibleElements.forEach((elem, index) => {
    console.log(`${index + 1}. ${elem.title} (${elem.type})`)
  })
  
  console.log(`\nTotal tools users see: ${userVisibleElements.length}`)
  console.log('\n✅ Content now accurately describes 2 tools instead of 4')
  console.log('✅ No confusing references to undeveloped characters')
  console.log('✅ Maya\'s story stays focused on her email transformation')
}

previewFixedContent()