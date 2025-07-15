import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function addParentContext() {
  console.log('🚀 Adding missing parent context to Maya\'s lesson...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  try {
    const { data, error } = await supabase.functions.invoke('add-parent-context')
    
    if (error) {
      console.error('❌ Error:', error)
      return
    }
    
    console.log('✅ Success!', data)
    console.log('\n📝 What was fixed:')
    console.log('- Added story context introducing Sarah Chen\'s email')
    console.log('- Interactive element now has proper setup')
    console.log('- Users understand why Maya needs to write a parent response')
    console.log('\nThe lesson flow now makes sense:')
    console.log('1. Maya learns about AI Email Composer')
    console.log('2. Sarah Chen\'s urgent email arrives (NEW)')
    console.log('3. Interactive: Help Maya respond to Sarah')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

addParentContext()