import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function simpleUpdate() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔧 Updating parent response element...\n')
  
  // Find the element
  const { data: element } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .eq('type', 'ai_email_composer')
    .eq('order_index', 80)
    .single()
  
  if (!element) {
    console.error('Element not found')
    return
  }
  
  console.log(`Found element: ${element.title} (ID: ${element.id})`)
  
  // Create a focused prompt that works with the existing AI Email Composer
  const improvedPrompt = `Help Maya respond to Sarah Chen's urgent concern about the new 5:30 PM pickup time. Sarah is a single parent who works until 6 PM downtown and is worried her daughter Emma will have to drop out of the program.

Key Context:
- Sarah is stressed and needs reassurance
- The change is due to staff scheduling and safety protocols
- Emma is a valued participant who loves the program

Available Solutions to Offer:
1. Extended care until 6:30 PM for $5/day (sliding scale available)
2. Parent carpool network for downtown families
3. Potential work-study where Emma helps with younger children

Your response should:
- Start with genuine empathy and acknowledgment
- Explain the reason for changes without being defensive
- Present the three solutions clearly
- End with a personal touch about Emma and next steps
- Maintain a warm, supportive tone throughout

Remember: Transform anxiety into connection by showing you truly care about keeping Emma in the program.`
  
  // Try direct update first
  const { error } = await supabase
    .from('interactive_elements')
    .update({
      title: "Turn Maya's Email Anxiety into Connection",
      description: "Transform Sarah's worried message into an opportunity to strengthen trust. Use AI to craft a response that balances empathy, policy, and solutions.",
      prompt: improvedPrompt
    })
    .eq('id', element.id)
  
  if (error) {
    console.error('Direct update failed:', error)
    console.log('\nTrying Edge Function...')
    
    // Try via Edge Function
    const { error: funcError } = await supabase.functions.invoke('content-manager', {
      body: {
        action: 'update-interactive-element',
        data: {
          elementId: element.id,
          updates: {
            title: "Turn Maya's Email Anxiety into Connection",
            description: "Transform Sarah's worried message into an opportunity to strengthen trust. Use AI to craft a response that balances empathy, policy, and solutions."
          }
        }
      }
    })
    
    if (funcError) {
      console.error('Edge Function also failed:', funcError)
    } else {
      console.log('✅ Updated via Edge Function!')
    }
  } else {
    console.log('✅ Element updated successfully!')
  }
  
  // Verify the update
  const { data: updated } = await supabase
    .from('interactive_elements')
    .select('title, description')
    .eq('id', element.id)
    .single()
  
  if (updated) {
    console.log('\n📋 Current element:')
    console.log(`Title: ${updated.title}`)
    console.log(`Description: ${updated.description}`)
  }
}

simpleUpdate().catch(console.error)