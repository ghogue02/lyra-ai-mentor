import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI4Mzg1MCwiZXhwIjoyMDYzODU5ODUwfQ.bRjjXWDNf-NfSYJoLXompLI2JfLH8A0CzN7x5wR5WHO"

async function runPromptSandwichMigration() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  console.log('🥪 ADDING PROMPT SANDWICH BUILDER ELEMENT')
  console.log('=' * 40)
  
  try {
    // Check if element already exists
    const { data: existing, error: checkError } = await supabase
      .from('interactive_elements')
      .select('id, title')
      .eq('title', 'Master the AI Prompt Sandwich')
      .eq('lesson_id', 5)
      .single()
    
    if (existing) {
      console.log('\n✅ Element already exists!')
      console.log(`   ID: ${existing.id}`)
      console.log(`   Title: ${existing.title}`)
      return
    }
    
    // Add the element
    const { data, error } = await supabase
      .from('interactive_elements')
      .insert({
        type: 'prompt_builder',
        title: 'Master the AI Prompt Sandwich',
        content: 'Learn Maya\'s game-changing technique for crafting perfect AI prompts. Build your own prompt sandwich by selecting tone, context, and template layers to generate warm, professional emails in under 5 minutes.',
        configuration: {
          component: 'MayaPromptSandwichBuilder',
          instructions: 'Create a three-layer prompt sandwich by selecting tone, context, and email template',
          learning_objectives: [
            'Understand how to structure effective AI prompts',
            'Learn to layer tone, context, and purpose for better outputs',
            'Practice creating prompts that maintain your authentic voice',
            'See how proper prompting saves 27 minutes per email'
          ],
          maya_connection: 'This is the exact technique Maya discovered that transformed her email anxiety into confidence',
          time_savings: '32 minutes → 5 minutes per email',
          route_component: 'MayaPromptSandwichBuilder'
        },
        lesson_id: 5,
        order_index: 55,
        is_active: true,
        is_gated: false,
        required_for_completion: true
      })
      .select()
      .single()
    
    if (error) {
      console.error('\n❌ Error adding element:', error)
      return
    }
    
    console.log('\n✅ Successfully added Prompt Sandwich Builder!')
    console.log(`   ID: ${data.id}`)
    console.log(`   Type: ${data.type}`)
    console.log(`   Order: ${data.order_index}`)
    console.log(`   Active: ${data.is_active}`)
    
    // Verify placement
    const { data: flow } = await supabase
      .from('content_blocks')
      .select('title, order_index')
      .eq('lesson_id', 5)
      .in('order_index', [40, 50, 60])
      .order('order_index')
    
    console.log('\n📍 Element placed in lesson flow:')
    flow?.forEach(block => {
      console.log(`   [${block.order_index}] ${block.title}`)
      if (block.order_index === 50) {
        console.log(`   [55] 🥪 ${data.title} ← NEW!`)
      }
    })
    
    console.log('\n🎉 Migration complete! Users can now:')
    console.log('   • Build 3-layer prompt sandwiches')
    console.log('   • See real-time prompt previews')
    console.log('   • Generate sample emails')
    console.log('   • Save 27 minutes per email')
    
  } catch (err) {
    console.error('Migration failed:', err)
  }
}

runPromptSandwichMigration().catch(console.error)