import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function forceAlignmentFix() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔧 FORCE APPLYING ALIGNMENT FIXES')
  console.log('=' * 35)
  
  const updates = [
    // Lesson 5 corrections
    { id: 68, title: "Turn Maya's Email Anxiety into Connection", newOrder: 45 },
    { id: 171, title: "Maya's Parent Response Email Helper", newOrder: 135 },
    
    // Lesson 6 corrections  
    { id: 152, title: "Maya's Grant Proposal Challenge", newOrder: 15 },
    { id: 172, title: "Maya's Strategic Grant Proposal Builder", newOrder: 45 },
    
    // Lesson 7 corrections
    { id: 173, title: "Maya's Critical Board Meeting Preparation", newOrder: 15 },
    { id: 153, title: "Maya's Emergency Board Meeting Prep", newOrder: 25 },
    
    // Lesson 8 corrections
    { id: 174, title: "Maya's Research Synthesis Wizard", newOrder: 15 },
    { id: 154, title: "Maya's Research Synthesis Challenge", newOrder: 25 }
  ]
  
  console.log(`📋 Applying ${updates.length} direct database updates...`)
  
  let successCount = 0
  let failCount = 0
  
  for (const update of updates) {
    try {
      console.log(`\n🔧 Updating "${update.title}" → ${update.newOrder}`)
      
      const { error } = await supabase
        .from('interactive_elements')
        .update({ order_index: update.newOrder })
        .eq('id', update.id)
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`)
        failCount++
      } else {
        console.log(`   ✅ Success`)
        successCount++
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (err) {
      console.log(`   ❌ Exception: ${err}`)
      failCount++
    }
  }
  
  console.log(`\n📊 Results: ${successCount} success, ${failCount} failed`)
  
  // Verification
  console.log('\n🔍 Final Verification:')
  
  for (const update of updates) {
    try {
      const { data } = await supabase
        .from('interactive_elements')
        .select('order_index')
        .eq('id', update.id)
        .single()
      
      if (data) {
        const status = data.order_index === update.newOrder ? '✅' : '❌'
        console.log(`   ${status} ID ${update.id}: ${data.order_index} (expected ${update.newOrder})`)
      }
    } catch (err) {
      console.log(`   ❌ Could not verify ID ${update.id}`)
    }
  }
  
  if (successCount === updates.length) {
    console.log('\n🎉 ALL ALIGNMENT FIXES APPLIED SUCCESSFULLY!')
    console.log('\n📋 Perfect Story Flow Achieved:')
    console.log('   L5: Crisis → Discover AI → Practice → Board Crisis → Specific Help')
    console.log('   L6: Document Crisis → Basic Help → Learn Tools → Advanced Help')  
    console.log('   L7: Meeting Mayhem → Immediate Help → Understand Challenge → Strategic Help')
    console.log('   L8: Information Overload → Quick Help → Learn Approach → Structured Help')
  } else {
    console.log('\n⚠️ Some updates failed - manual review needed')
  }
}

forceAlignmentFix().catch(console.error)