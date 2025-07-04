import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function fixParentResponseElement() {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Finding and fixing the parent response interactive element...\n')
  
  // Find the element
  const { data: element } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .eq('title', 'Help Maya Write the Parent Response')
    .single()
  
  if (element) {
    console.log(`Found element with ID: ${element.id}`)
    console.log(`Current description: ${element.description || 'None'}`)
    
    // Update using Edge Function
    const { data, error } = await supabase.functions.invoke('content-manager', {
      body: {
        action: 'update-interactive-element',
        data: {
          elementId: element.id,
          updates: {
            description: "Sarah Chen is worried about the new 5:30 PM pickup time. Help Maya craft a response that acknowledges Sarah's concerns, explains the reasons for the change, and offers practical solutions while maintaining warmth and professionalism.",
            prompt: "I need to respond to a concerned parent email. Sarah Chen is worried about our new 5:30 PM pickup time (moved from 6:00 PM) because she works until 6 PM downtown. She's afraid her daughter Emma will lose her spot in our after-school program. I need to acknowledge her concerns, explain that the change was necessary due to staff scheduling and safety protocols, offer solutions (like our extended care option until 6:30 PM for a small fee, or connecting her with other parents for carpooling), and maintain a warm, understanding tone while being professional. The response should be empathetic but also clear about our policies."
          }
        }
      }
    })
    
    if (!error) {
      console.log('\n✅ Updated interactive element successfully!')
      console.log('- Added proper context about Sarah Chen')
      console.log('- Explained the specific pickup time issue')
      console.log('- Provided clear guidance for the AI tool')
    } else {
      console.error('Error updating element:', error)
    }
  } else {
    console.log('❌ Could not find the parent response element')
  }
  
  // Verify the context block was added
  const { data: contextBlock } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', 5)
    .eq('title', "Maya's First Test: The Concerned Parent Email")
    .single()
  
  if (contextBlock) {
    console.log('\n✅ Context block verified at order index:', contextBlock.order_index)
    console.log('The story now properly introduces Sarah Chen before the interactive element.')
  } else {
    console.log('\n⚠️ Context block may need to be added manually')
  }
}

fixParentResponseElement()