import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const FINAL_ORDER = [
  // Content blocks
  { title: "Maya's Monday Morning Email Crisis", order: 10 },
  { title: "The Real Cost of Communication Chaos", order: 20 },
  { title: "Maya Discovers Her AI Email Assistant", order: 40 },
  { title: "The AI Email Composer: Your New Best Friend", order: 50 },
  { title: "Challenge #1: Sarah's Schedule Concern", order: 70 },
  { title: "Maya's First Test: The Concerned Parent Email", order: 70 }, // This might be the old title
  { title: "Maya's First AI Success", order: 90 },
  { title: "Mastering Advanced Email Techniques", order: 100 },
  { title: "Challenge #2: The Board Chair's Funding Concern", order: 130 },
  { title: "Leadership Through Communication", order: 150 },
  { title: "Beyond Email: Meet Lyra, Your AI Mentor", order: 160 },
  { title: "Maya's Monday Morning Transformation", order: 180 },
  { title: "Your Email Revolution Starts Now", order: 190 },
  
  // Interactive elements
  { title: "Help Maya Write the Parent Response", order: 80, type: 'interactive' },
  { title: "Help Maya Respond to Sarah", order: 80, type: 'interactive' }, // Might be new title
  { title: "Maya's Board Communication Challenge", order: 140, type: 'interactive' },
  { title: "Coffee Chat with Lyra: Your Challenges", order: 170, type: 'interactive' },
  { title: "Maya's Coffee Chat: What's Next?", order: 170, type: 'interactive' } // Old title
]

async function fixFinalOrdering() {
  console.log('🔧 Fixing final content ordering...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  // Use batch update through Edge Function
  const updates = []
  
  // Fix content blocks
  for (const item of FINAL_ORDER) {
    if (!item.type || item.type !== 'interactive') {
      updates.push({
        table: 'content_blocks',
        data: { order_index: item.order },
        match: { lesson_id: 5, title: item.title }
      })
    }
  }
  
  // Fix interactive elements
  for (const item of FINAL_ORDER) {
    if (item.type === 'interactive') {
      updates.push({
        table: 'interactive_elements',
        data: { order_index: item.order },
        match: { lesson_id: 5, title: item.title }
      })
    }
  }
  
  console.log(`Updating ${updates.length} items...`)
  
  const { data, error } = await supabase.functions.invoke('content-manager', {
    body: {
      action: 'batch-update',
      data: { updates }
    }
  })
  
  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Order fixed successfully!')
    console.log('Results:', data)
  }
  
  // Also hide the old interactive elements that shouldn't be visible
  console.log('\n🔧 Hiding admin elements...')
  
  const { error: hideError } = await supabase.functions.invoke('content-manager', {
    body: {
      action: 'hide-admin-elements',
      data: {
        lessonIds: [5],
        elementTypes: ['difficult_conversation_helper']
      }
    }
  })
  
  if (!hideError) {
    console.log('✅ Admin elements hidden')
  }
  
  // Try to create the missing board element one more time
  console.log('\n🔧 Creating missing board communication element...')
  
  const { error: createError } = await supabase.functions.invoke('content-manager', {
    body: {
      action: 'create-interactive-element',
      data: {
        element: {
          lesson_id: 5,
          title: "Maya's Board Communication Challenge",
          type: 'ai_email_composer',
          description: "Help Maya respond to Board Chair Patricia Williams' urgent concerns about program funding with data, solutions, and persuasive leadership.",
          order_index: 140,
          is_visible: true,
          is_active: true,
          is_required: false
        }
      }
    }
  })
  
  if (!createError) {
    console.log('✅ Board communication element created')
  } else {
    console.log('⚠️  Element may already exist')
  }
}

fixFinalOrdering().catch(console.error)