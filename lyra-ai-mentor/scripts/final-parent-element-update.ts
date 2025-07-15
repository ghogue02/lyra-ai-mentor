import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function finalUpdate() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🎯 Final update for parent response element...\n')
  
  // Update via Edge Function with proper field mapping
  const { data, error } = await supabase.functions.invoke('content-manager', {
    body: {
      action: 'update-interactive-element',
      data: {
        elementId: 68,
        updates: {
          title: "Turn Maya's Email Anxiety into Connection",
          description: `Transform Sarah's worried message into an opportunity to strengthen trust. Use AI to craft a response that balances empathy, policy, and solutions.

**Your Mission:** Help Maya respond to Sarah Chen, who's stressed about the new 5:30 PM pickup time conflicting with her 6 PM work schedule.

**Scaffolded Approach:**
1. Start with understanding - Acknowledge Sarah's concern
2. Explain transparently - Share reasons without defensiveness  
3. Offer concrete options - Extended care, carpool network, work-study
4. End with partnership - Reinforce Emma's value

**Success:** Sarah should feel heard, have options, and know Emma's place is secure.`
        }
      }
    }
  })
  
  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Update successful!')
    
    // Verify the update
    const { data: element } = await supabase
      .from('interactive_elements')
      .select('title, content')
      .eq('id', 68)
      .single()
    
    if (element) {
      console.log('\n📋 Updated element:')
      console.log(`Title: ${element.title}`)
      console.log(`Content preview: ${element.content.substring(0, 150)}...`)
    }
  }
}

finalUpdate().catch(console.error)