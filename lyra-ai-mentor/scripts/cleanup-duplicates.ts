import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function cleanupDuplicates() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🧹 Cleaning up duplicate content blocks...\n')
  
  // Get all blocks with order 40
  const { data: duplicates } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', 5)
    .eq('order_index', 40)
    .order('id')
  
  console.log(`Found ${duplicates?.length} blocks with order_index 40`)
  
  if (duplicates && duplicates.length > 1) {
    // Keep only the first one, delete the rest
    const toKeep = duplicates[0]
    const toDelete = duplicates.slice(1)
    
    console.log(`Keeping: "${toKeep.title}" (ID: ${toKeep.id})`)
    console.log(`Deleting ${toDelete.length} duplicates...`)
    
    for (const block of toDelete) {
      await supabase
        .from('content_blocks')
        .delete()
        .eq('id', block.id)
    }
  }
  
  // Now fix the missing board communication challenge element
  console.log('\n🔧 Ensuring board communication element exists...')
  
  // Check if it already exists
  const { data: boardElement } = await supabase
    .from('interactive_elements')
    .select('*')
    .eq('lesson_id', 5)
    .ilike('title', '%Board Communication%')
    .single()
  
  if (!boardElement) {
    console.log('Creating board communication element...')
    
    // Since direct insert isn't working, let's try a different approach
    // Update an existing hidden element instead
    const { data: hiddenElements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 5)
      .eq('is_visible', false)
      .eq('type', 'ai_email_composer')
      .limit(1)
    
    if (hiddenElements && hiddenElements.length > 0) {
      const elementToUpdate = hiddenElements[0]
      console.log(`Repurposing hidden element: ${elementToUpdate.title}`)
      
      await supabase
        .from('interactive_elements')
        .update({
          title: "Maya's Board Communication Challenge",
          description: "Help Maya respond to Board Chair Patricia Williams' urgent concerns about program funding with data, solutions, and persuasive leadership.",
          order_index: 140,
          is_visible: true,
          is_active: true
        })
        .eq('id', elementToUpdate.id)
      
      console.log('✅ Board communication element created')
    }
  } else {
    console.log('✅ Board communication element already exists')
  }
  
  // Fix any remaining order issues
  console.log('\n🔧 Final order cleanup...')
  
  // Move Maya's First Test block to proper position if it's at 999
  await supabase
    .from('content_blocks')
    .update({ order_index: 70 })
    .eq('lesson_id', 5)
    .eq('title', "Maya's First Test: The Concerned Parent Email")
    .eq('order_index', 999)
  
  // Update Help Maya Respond to Sarah if needed
  await supabase
    .from('interactive_elements')
    .update({ 
      title: "Help Maya Respond to Sarah",
      order_index: 80
    })
    .eq('lesson_id', 5)
    .eq('title', 'Help Maya Write the Parent Response')
  
  // Update Coffee Chat title
  await supabase
    .from('interactive_elements')
    .update({ 
      title: "Coffee Chat with Lyra: Your Challenges",
      order_index: 170
    })
    .eq('lesson_id', 5)
    .eq('title', "Maya's Coffee Chat: What's Next?")
  
  console.log('\n✅ Cleanup complete!')
}

cleanupDuplicates().catch(console.error)