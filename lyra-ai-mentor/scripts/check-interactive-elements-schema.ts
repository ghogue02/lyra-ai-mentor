import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function checkInteractiveElementsSchema() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 CHECKING INTERACTIVE_ELEMENTS TABLE SCHEMA')
  console.log('=' * 45)
  
  // Get a sample row to see all columns
  const { data, error } = await supabase
    .from('interactive_elements')
    .select('*')
    .limit(1)
    .single()
  
  if (data) {
    console.log('\n📋 Available columns:')
    Object.keys(data).forEach(column => {
      console.log(`   • ${column}: ${typeof data[column]}`)
    })
  }
  
  // Check if prompt_builder type already exists
  const { data: existing } = await supabase
    .from('interactive_elements')
    .select('id, title, type')
    .eq('type', 'prompt_builder')
  
  if (existing && existing.length > 0) {
    console.log('\n⚠️  Found existing prompt_builder elements:')
    existing.forEach(el => {
      console.log(`   - ${el.title} (ID: ${el.id})`)
    })
  } else {
    console.log('\n✅ No existing prompt_builder elements found')
  }
}

checkInteractiveElementsSchema().catch(console.error)