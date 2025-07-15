import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function testAndFix() {
  console.log('🔍 Testing rendering issue...\n')

  // Step 1: Check what's in the database for lesson 5
  const { data: lesson5Interactive } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .order('order_index')

  console.log('Interactive elements in lesson 5:')
  lesson5Interactive?.forEach(e => {
    console.log(`- [${e.order_index}] ${e.title} (${e.type}) - visible: ${e.is_visible}`)
  })

  // Check for the specific problematic types that are still there
  const stillProblematic = lesson5Interactive?.filter(e => 
    ['difficult_conversation_helper', 'interactive_element_auditor', 'automated_element_enhancer'].includes(e.type)
  )

  if (stillProblematic && stillProblematic.length > 0) {
    console.log(`\n⚠️ Found ${stillProblematic.length} problematic elements still in database`)
    console.log('These elements have React components that might not render properly\n')

    // Fix attempt 1: Delete them completely
    console.log('🔧 Fix 1: Removing problematic elements completely...')
    
    for (const elem of stillProblematic) {
      const { error } = await supabase
        .from('interactive_elements')
        .delete()
        .eq('id', elem.id)
      
      if (!error) {
        console.log(`✅ Deleted ${elem.type} (ID: ${elem.id})`)
      } else {
        console.log(`❌ Failed to delete ${elem.type}: ${error.message}`)
      }
    }
  }

  // Step 2: Check if there are any null/undefined issues
  const { data: contentBlocks } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', 5)
    .order('order_index')

  const invalidContent = contentBlocks?.filter(cb => 
    !cb.title || !cb.content || cb.order_index === null
  ) || []

  const invalidInteractive = lesson5Interactive?.filter(ie => 
    !ie.title || ie.order_index === null
  ) || []

  if (invalidContent.length > 0 || invalidInteractive.length > 0) {
    console.log('\n⚠️ Found elements with invalid data')
    console.log(`Content blocks with issues: ${invalidContent.length}`)
    console.log(`Interactive elements with issues: ${invalidInteractive.length}`)
  }

  // Step 3: Check final state
  const { data: finalInteractive } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')

  const { data: finalContent } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')

  console.log('\n✅ Final state:')
  console.log(`Content blocks: ${finalContent?.length || 0}`)
  console.log(`Interactive elements: ${finalInteractive?.length || 0}`)
  console.log(`Total visible elements: ${(finalContent?.length || 0) + (finalInteractive?.length || 0)}`)

  // List what should render
  console.log('\n📋 Elements that should render:')
  const allElements = [
    ...(finalContent || []).map(c => ({ ...c, elementType: 'content' })),
    ...(finalInteractive || []).map(i => ({ ...i, elementType: 'interactive' }))
  ].sort((a, b) => a.order_index - b.order_index)

  allElements.forEach(elem => {
    console.log(`[${elem.order_index}] ${elem.elementType === 'content' ? '📄' : '🎯'} ${elem.title} (${elem.type})`)
  })

  // Check for console errors
  console.log('\n💡 To check for React errors:')
  console.log('1. Open browser console (F12)')
  console.log('2. Look for red error messages')
  console.log('3. Check for "Unknown element type:" warnings')
  console.log('4. Look for component import errors')
}

testAndFix().catch(console.error)