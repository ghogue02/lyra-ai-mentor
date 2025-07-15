import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function fixChapter2MayaElements() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔧 FIXING CHAPTER 2 MAYA ELEMENTS VISIBILITY')
  console.log('=' * 45)
  
  // Define the Maya elements that should be active and their proper order
  const mayaElementFixes = [
    {
      title: "Turn Maya's Email Anxiety into Connection",
      lesson_id: 5,
      should_be_active: true,
      target_order_index: 10,
      reason: "Primary Maya email element - should be first"
    },
    {
      title: "Maya's Board Chair Challenge", 
      lesson_id: 5,
      should_be_active: true,
      target_order_index: 20,
      reason: "Secondary Maya element for difficult conversations"
    },
    {
      title: "Maya's Grant Proposal Challenge",
      lesson_id: 6, 
      should_be_active: true,
      target_order_index: 10,
      reason: "Primary Maya element for lesson 6"
    },
    {
      title: "Maya's Emergency Board Meeting Prep",
      lesson_id: 7,
      should_be_active: true, 
      target_order_index: 10,
      reason: "Primary Maya element for lesson 7"
    },
    {
      title: "Maya's Research Synthesis Challenge",
      lesson_id: 8,
      should_be_active: true,
      target_order_index: 10, 
      reason: "Primary Maya element for lesson 8"
    }
  ]
  
  console.log('📋 Maya Elements to Fix:')
  mayaElementFixes.forEach(fix => {
    console.log(`   L${fix.lesson_id}: "${fix.title}" → order ${fix.target_order_index}`)
  })
  
  // Archive any Lyra chat elements that shouldn't be active
  console.log('\n🗄️ Archiving Lyra chat elements in Chapter 2...')
  const { data: lyraElements } = await supabase
    .from('interactive_elements')
    .select('id, title, lesson_id')
    .in('lesson_id', [5, 6, 7, 8])
    .ilike('title', '%chat%')
    .eq('is_active', true)
  
  if (lyraElements && lyraElements.length > 0) {
    console.log(`   Found ${lyraElements.length} chat elements to archive:`)
    for (const element of lyraElements) {
      console.log(`     - L${element.lesson_id}: "${element.title}"`)
    }
  }
  
  // Use Edge Function to make the fixes
  console.log('\n🔄 Applying fixes via Edge Function...')
  
  const elementsToReactivate = []
  const elementsToReorder = []
  const elementsToDeactivate = lyraElements?.map(e => ({ element_id: e.id, reason: 'Archive Lyra chat element' })) || []
  
  // Get the current elements and prepare updates
  for (const fix of mayaElementFixes) {
    const { data: element } = await supabase
      .from('interactive_elements')
      .select('id, is_active, order_index')
      .eq('lesson_id', fix.lesson_id)
      .ilike('title', fix.title)
      .single()
    
    if (element) {
      if (!element.is_active) {
        elementsToReactivate.push({
          element_id: element.id,
          reason: fix.reason
        })
      }
      
      if (element.order_index !== fix.target_order_index) {
        elementsToReorder.push({
          element_id: element.id,
          new_order_index: fix.target_order_index,
          reason: fix.reason
        })
      }
    }
  }
  
  console.log(`   Elements to reactivate: ${elementsToReactivate.length}`)
  console.log(`   Elements to reorder: ${elementsToReorder.length}`)
  console.log(`   Elements to deactivate: ${elementsToDeactivate.length}`)
  
  const { data, error } = await supabase.functions.invoke('chapter-content-manager', {
    body: {
      action: 'fix-element-visibility',
      data: {
        reactivateElements: elementsToReactivate,
        reorderElements: elementsToReorder,
        deactivateElements: elementsToDeactivate
      }
    }
  })
  
  if (error) {
    console.error('❌ Error via Edge Function:', error)
    
    // Fallback to direct updates
    console.log('🔄 Applying fixes directly...')
    
    // Reactivate elements
    for (const reactivate of elementsToReactivate) {
      try {
        const { error: updateError } = await supabase
          .from('interactive_elements')
          .update({ is_active: true })
          .eq('id', reactivate.element_id)
        
        if (updateError) {
          console.error(`❌ Error reactivating element ${reactivate.element_id}:`, updateError.message)
        } else {
          console.log(`✅ Reactivated element ${reactivate.element_id}`)
        }
      } catch (err) {
        console.error(`❌ Exception reactivating element ${reactivate.element_id}:`, err)
      }
    }
    
    // Reorder elements
    for (const reorder of elementsToReorder) {
      try {
        const { error: updateError } = await supabase
          .from('interactive_elements')
          .update({ order_index: reorder.new_order_index })
          .eq('id', reorder.element_id)
        
        if (updateError) {
          console.error(`❌ Error reordering element ${reorder.element_id}:`, updateError.message)
        } else {
          console.log(`✅ Reordered element ${reorder.element_id} to ${reorder.new_order_index}`)
        }
      } catch (err) {
        console.error(`❌ Exception reordering element ${reorder.element_id}:`, err)
      }
    }
    
    // Deactivate chat elements
    for (const deactivate of elementsToDeactivate) {
      try {
        const { error: updateError } = await supabase
          .from('interactive_elements')
          .update({ is_active: false })
          .eq('id', deactivate.element_id)
        
        if (updateError) {
          console.error(`❌ Error deactivating element ${deactivate.element_id}:`, updateError.message)
        } else {
          console.log(`✅ Deactivated element ${deactivate.element_id}`)
        }
      } catch (err) {
        console.error(`❌ Exception deactivating element ${deactivate.element_id}:`, err)
      }
    }
  } else {
    console.log('✅ All fixes applied via Edge Function!')
  }
  
  // Final verification
  console.log('\n🔍 VERIFICATION - Chapter 2 Maya Elements After Fix:')
  
  for (const lesson_id of [5, 6, 7, 8]) {
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('id, title, is_active, order_index')
      .eq('lesson_id', lesson_id)
      .ilike('title', '%maya%')
      .eq('is_active', true)
      .order('order_index')
    
    console.log(`\n📖 Lesson ${lesson_id}:`)
    if (elements && elements.length > 0) {
      elements.forEach(element => {
        console.log(`   ✅ [${element.order_index}] "${element.title}"`)
      })
    } else {
      console.log('   ❌ No active Maya elements found')
    }
  }
  
  console.log('\n🎉 CHAPTER 2 MAYA ELEMENTS FIX COMPLETE!')
  console.log('\n📝 Expected Result:')
  console.log('   - Lesson 5 should now show 2 Maya elements')
  console.log('   - Lessons 6, 7, 8 should each show 1 Maya element')
  console.log('   - All elements should have proper priority order (10-20)')
}

fixChapter2MayaElements().catch(console.error)