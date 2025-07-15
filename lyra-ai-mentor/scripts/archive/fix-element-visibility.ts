import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function fixElementVisibility() {
  console.log('🔧 Fixing element visibility issues...\n')

  try {
    // Note: Supabase JS client doesn't support ALTER TABLE directly
    // We'll use the update operations we can perform
    
    // Step 1: Ensure all interactive elements are visible
    console.log('✅ Setting all interactive elements to visible...')
    const { error: ieError } = await supabase
      .from('interactive_elements')
      .update({ 
        is_active: true,
        is_gated: false,
        is_visible: true
      })
      .is('id', 'not.null') // Update all records
    
    if (ieError) {
      console.error('Error updating interactive elements:', ieError)
    }

    // Step 2: Ensure all content blocks are visible
    console.log('✅ Setting all content blocks to visible...')
    const { error: cbError } = await supabase
      .from('content_blocks')
      .update({ 
        is_active: true,
        is_visible: true
      })
      .is('id', 'not.null') // Update all records
    
    if (cbError) {
      console.error('Error updating content blocks:', cbError)
    }

    // Step 3: Fix problematic data in interactive elements
    console.log('✅ Fixing problematic data...')
    
    // Fix null/empty content
    const { error: contentError } = await supabase
      .from('interactive_elements')
      .update({ content: 'Interactive element content loading...' })
      .or('content.is.null,content.eq.')
    
    if (contentError) {
      console.error('Error fixing empty content:', contentError)
    }

    // Fix null configuration
    const { error: configError } = await supabase
      .from('interactive_elements')
      .update({ configuration: {} })
      .is('configuration', 'null')
    
    if (configError) {
      console.error('Error fixing null configuration:', configError)
    }

    // Fix extreme order_index values
    const { error: orderHighError } = await supabase
      .from('interactive_elements')
      .update({ order_index: 90 })
      .gt('order_index', 200)
    
    if (orderHighError) {
      console.error('Error fixing high order_index:', orderHighError)
    }

    const { error: orderLowError } = await supabase
      .from('interactive_elements')
      .update({ order_index: 10 })
      .lt('order_index', 0)
    
    if (orderLowError) {
      console.error('Error fixing low order_index:', orderLowError)
    }

    // Step 4: Show results
    console.log('\n📊 Checking results...\n')

    // Get total counts
    const { count: cbCount } = await supabase
      .from('content_blocks')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: ieCount } = await supabase
      .from('interactive_elements')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: gatedCount } = await supabase
      .from('interactive_elements')
      .select('*', { count: 'exact', head: true })
      .eq('is_gated', true)

    console.log(`Total active content blocks: ${cbCount}`)
    console.log(`Total active interactive elements: ${ieCount}`)
    console.log(`Total gated elements: ${gatedCount}`)

    // Check Chapter 2, Lesson 5 (should be 11 elements)
    const { data: lesson5Elements } = await supabase
      .from('interactive_elements')
      .select('id, type, title, order_index')
      .eq('lesson_id', 5)
      .order('order_index')

    const { data: lesson5Content } = await supabase
      .from('content_blocks')
      .select('id, title, order_index')
      .eq('lesson_id', 5)
      .order('order_index')

    console.log(`\n📚 Chapter 2, Lesson 5 Elements:`)
    console.log(`Content blocks: ${lesson5Content?.length || 0}`)
    console.log(`Interactive elements: ${lesson5Elements?.length || 0}`)
    console.log(`Total: ${(lesson5Content?.length || 0) + (lesson5Elements?.length || 0)}`)

    // Check for remaining issues
    const { count: emptyContentCount } = await supabase
      .from('interactive_elements')
      .select('*', { count: 'exact', head: true })
      .or('content.is.null,content.eq.')

    const { count: nullConfigCount } = await supabase
      .from('interactive_elements')
      .select('*', { count: 'exact', head: true })
      .is('configuration', 'null')

    const { count: inactiveCount } = await supabase
      .from('interactive_elements')
      .select('*', { count: 'exact', head: true })
      .or('is_active.eq.false,is_active.is.null')

    console.log(`\n⚠️ Remaining Issues:`)
    console.log(`Empty content: ${emptyContentCount}`)
    console.log(`Null configuration: ${nullConfigCount}`)
    console.log(`Inactive elements: ${inactiveCount}`)
    console.log(`Gated elements: ${gatedCount}`)

    console.log(`\n✅ Fix Complete!\n`)
    console.log(`Next steps:`)
    console.log(`1. Clear your browser cache (Cmd+Shift+R or Ctrl+Shift+R)`)
    console.log(`2. Navigate to any lesson`)
    console.log(`3. You should now see ALL elements (6-11 per lesson)`)
    console.log(`4. Check the debug panel in bottom-right corner\n`)
    console.log(`If you still see only 2 elements:`)
    console.log(`- Check browser console for JavaScript errors`)
    console.log(`- The debug panel will show database vs rendered counts`)

  } catch (error) {
    console.error('Error during visibility fix:', error)
  }
}

// Run the fix
fixElementVisibility()