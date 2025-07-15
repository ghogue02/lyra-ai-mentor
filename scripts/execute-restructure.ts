import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function executeRestructure() {
  console.log('\n🚀 EXECUTING CHAPTER 2 RESTRUCTURE\n' + '='.repeat(60))
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  // Load the restructure plan
  const planData = readFileSync('chapter-2-restructure-plan.json', 'utf-8')
  const plan = JSON.parse(planData)
  
  console.log(`\n📋 Loaded ${plan.length} restructure operations`)
  
  // Count operations by type
  const operations = {
    hide: plan.filter((i: any) => i.action === 'hide').length,
    delete: plan.filter((i: any) => i.action === 'delete').length,
    edit: plan.filter((i: any) => i.action === 'edit').length,
    create: plan.filter((i: any) => i.action === 'create').length,
    merge: plan.filter((i: any) => i.action === 'merge').length,
    keep: plan.filter((i: any) => i.action === 'keep').length
  }
  
  console.log('\n📊 Operations breakdown:')
  Object.entries(operations).forEach(([action, count]) => {
    if (count > 0) console.log(`  - ${action}: ${count}`)
  })
  
  console.log('\n⚡ Executing restructure via Edge Function...')
  
  try {
    const { data, error } = await supabase.functions.invoke('restructure-chapter', {
      body: { plan, lessonId: 5 }
    })
    
    if (error) {
      console.error('❌ Error:', error)
      return
    }
    
    console.log('\n✅ Restructure completed successfully!')
    console.log('\n📈 Results:')
    console.log(`  - Hidden elements: ${data.results.hidden}`)
    console.log(`  - Deleted blocks: ${data.results.deleted}`)
    console.log(`  - Updated items: ${data.results.updated}`)
    console.log(`  - Created items: ${data.results.created}`)
    
    if (data.results.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:')
      data.results.errors.forEach((err: string) => console.log(`  - ${err}`))
    }
    
    console.log('\n📚 Final structure:')
    console.log(`  - Total content blocks: ${data.summary.totalContentBlocks}`)
    console.log(`  - Total interactive elements: ${data.summary.totalInteractiveElements}`)
    
  } catch (error) {
    console.error('Error executing restructure:', error)
  }
}

// Add confirmation prompt
async function main() {
  console.log('\n⚠️  WARNING: This will restructure Chapter 2, Lesson 5')
  console.log('This includes:')
  console.log('- Hiding admin tools')
  console.log('- Deleting redundant content')
  console.log('- Creating new story content')
  console.log('- Reordering everything')
  
  const readline = await import('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  rl.question('\nProceed with restructure? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      await executeRestructure()
    } else {
      console.log('Restructure cancelled.')
    }
    rl.close()
  })
}

main().catch(console.error)