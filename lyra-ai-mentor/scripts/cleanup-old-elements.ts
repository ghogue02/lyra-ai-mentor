import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function cleanupOldElements() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🧹 Cleaning up old test/admin elements...\n')
  
  // Get all elements for lesson 5 to see what we have
  const { data: allElements } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .order('order_index')
  
  console.log('Current elements in Lesson 5:')
  allElements?.forEach(el => {
    console.log(`- ${el.title} (${el.type}) - Order: ${el.order_index}, Visible: ${el.is_visible}`)
  })
  
  // Elements to hide/remove
  const adminElementTypes = [
    'difficult_conversation_helper',
    'interactive_element_auditor',
    'automated_element_enhancer',
    'database_debugger',
    'interactive_element_builder',
    'element_workflow_coordinator',
    'chapter_builder_agent',
    'content_audit_agent',
    'storytelling_agent',
    'database_content_viewer'
  ]
  
  console.log('\n🔧 Hiding admin/test elements...')
  
  // Use Edge Function to hide admin elements
  const { data, error } = await supabase.functions.invoke('content-manager', {
    body: {
      action: 'hide-admin-elements',
      data: {
        lessonIds: [5],
        elementTypes: adminElementTypes
      }
    }
  })
  
  if (error) {
    console.error('❌ Error hiding admin elements:', error)
  } else {
    console.log('✅ Admin elements hidden')
  }
  
  // Also check for any test/debug content blocks
  console.log('\n🔍 Checking for test content blocks...')
  
  const { data: testBlocks } = await supabase
    .from('content_blocks')
    .select('id, title')
    .eq('lesson_id', 5)
    .or('title.ilike.%test%,title.ilike.%debug%,title.ilike.%automation%')
  
  if (testBlocks && testBlocks.length > 0) {
    console.log('\nFound test/debug content blocks:')
    testBlocks.forEach(block => console.log(`- ${block.title}`))
    
    // Delete them
    for (const block of testBlocks) {
      await supabase
        .from('content_blocks')
        .delete()
        .eq('id', block.id)
    }
    console.log('✅ Test content blocks removed')
  }
  
  // Verify final state
  console.log('\n📊 Final state:')
  
  const { data: finalElements } = await supabase
    .from('interactive_elements')
    .select('title, type, order_index')
    .eq('lesson_id', 5)
    .eq('is_visible', true)
    .order('order_index')
  
  console.log('\nVisible interactive elements:')
  finalElements?.forEach(el => {
    console.log(`- ${el.title} (${el.type}) - Order: ${el.order_index}`)
  })
  
  const { data: finalBlocks } = await supabase
    .from('content_blocks')
    .select('title, order_index')
    .eq('lesson_id', 5)
    .lte('order_index', 200)
    .order('order_index')
  
  console.log(`\nTotal content blocks: ${finalBlocks?.length || 0}`)
  console.log(`Total visible interactive elements: ${finalElements?.length || 0}`)
  
  console.log('\n🎉 Cleanup complete! The lesson is now focused on the user experience.')
}

cleanupOldElements().catch(console.error)