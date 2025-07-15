import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function addMissingElement() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔧 Adding missing board communication interactive element...')
  
  // Use content-manager Edge Function to create it
  const { data, error } = await supabase.functions.invoke('content-manager', {
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
  
  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Successfully added board communication element!')
  }
}

addMissingElement()