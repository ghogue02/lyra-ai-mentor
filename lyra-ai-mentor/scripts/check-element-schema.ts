import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function checkSchema() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Checking interactive_elements schema...\n')
  
  // Get a sample element to see what fields exist
  const { data: element, error } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .eq('type', 'ai_email_composer')
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching element:', error)
    return
  }
  
  console.log('Available fields in interactive_elements:')
  console.log('----------------------------------------')
  Object.keys(element).forEach(key => {
    const value = element[key]
    const type = typeof value
    const preview = type === 'string' && value.length > 50 
      ? value.substring(0, 50) + '...' 
      : value
    console.log(`${key}: ${type} = ${preview}`)
  })
  
  console.log('\n📝 Key findings:')
  console.log(`- Has 'description' field: ${element.hasOwnProperty('description')}`)
  console.log(`- Has 'prompt' field: ${element.hasOwnProperty('prompt')}`)
  console.log(`- Has 'config' field: ${element.hasOwnProperty('config')}`)
  console.log(`- Has 'instructions' field: ${element.hasOwnProperty('instructions')}`)
  
  // Show current values for our element
  console.log('\n📋 Current element details:')
  console.log(`ID: ${element.id}`)
  console.log(`Title: ${element.title}`)
  console.log(`Type: ${element.type}`)
  console.log(`Order: ${element.order_index}`)
  
  // Try to update just the title
  console.log('\n🔧 Testing title-only update...')
  const { error: updateError } = await supabase
    .from('interactive_elements')
    .update({ title: "Turn Maya's Email Anxiety into Connection" })
    .eq('id', element.id)
  
  if (updateError) {
    console.error('Title update failed:', updateError)
  } else {
    console.log('✅ Title update succeeded!')
  }
}

checkSchema().catch(console.error)