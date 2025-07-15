import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function fixVisibilityWithEdgeFunction() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔧 Fixing Chapter 2 Element Visibility via Edge Function...\n')
  
  // First, get the current element IDs to work with
  console.log('📊 Step 1: Getting current element data...')
  
  // Elements to deactivate (Lyra chat + James elements)
  const elementsToDeactivate = [
    70, // Maya's Coffee Chat: What's Next? (lyra_chat)
    139, // Test Element - Can You See This? (lyra_chat)
    71, // Help James Complete His Grant Proposal
    72, // Polish James's Executive Summary  
    73, // Build James's Success Template
    74  // James's Next Challenge: Build More Chapters
  ]
  
  // Maya elements to reorder
  const mayaElementsReorder = [
    { id: 68, order_index: 50 }, // Turn Maya's Email Anxiety into Connection
    { id: 152, order_index: 20 }, // Maya's Grant Proposal Challenge 
    { id: 153, order_index: 20 }, // Maya's Emergency Board Meeting Prep
    { id: 154, order_index: 20 }  // Maya's Research Synthesis Challenge
  ]
  
  console.log('🚀 Step 2: Calling Edge Function to fix visibility...')
  
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'fix-element-visibility',
      data: {
        deactivateElements: elementsToDeactivate,
        reorderElements: mayaElementsReorder
      }
    }
  })
  
  if (error) {
    console.error('❌ Error calling Edge Function:', error)
    return
  }
  
  console.log('✅ Edge Function call successful:', data)
  
  // Step 3: Verification
  console.log('\n🔍 Step 3: Verifying changes...')
  
  for (const lessonId of [5, 6, 7, 8]) {
    console.log(`\n📚 Lesson ${lessonId}:`)
    
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('id, title, type, is_active, order_index')
      .eq('lesson_id', lessonId)
      .eq('is_active', true)
      .order('order_index')
    
    if (elements && elements.length > 0) {
      elements.forEach((element, index) => {
        const isMaya = element.title?.includes('Maya') ? '🎯 ' : '   '
        console.log(`   ${index + 1}. ${isMaya}"${element.title}" (${element.type}) - Order: ${element.order_index}`)
      })
    } else {
      console.log('   ❌ No active elements found')
    }
  }
  
  console.log('\n🎉 Element Visibility Fix Complete!')
  console.log('\nSummary:')
  console.log(`✅ Deactivated ${elementsToDeactivate.length} elements (Lyra chat + James elements)`)
  console.log(`✅ Reordered ${mayaElementsReorder.length} Maya elements`)
  console.log('✅ Maya elements should now be visible as primary elements')
}

fixVisibilityWithEdgeFunction().catch(console.error)