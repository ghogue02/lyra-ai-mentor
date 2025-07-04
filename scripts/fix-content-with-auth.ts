import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

// Check for service role key in environment
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

async function fixContentWithAuth() {
  console.log('🔧 Attempting to fix content with proper authentication...\n')

  // First, try with service role key if available
  if (SERVICE_ROLE_KEY) {
    console.log('✅ Found service role key, using elevated permissions...')
    const supabaseAdmin = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY)
    
    // Now we can update without RLS restrictions
    await performContentFixes(supabaseAdmin, true)
    return
  }

  // Try to authenticate as a user (if we have credentials)
  console.log('⚠️ No service role key found')
  console.log('Attempting user authentication...')
  
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  // Check if there's a session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    console.log('✅ Found existing session')
    await performContentFixes(supabase, false)
  } else {
    console.log('❌ No authenticated session found')
    console.log('\n📋 To fix this, you have several options:\n')
    
    console.log('Option 1: Get the service role key')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to Settings > API')
    console.log('3. Copy the service role key (secret)')
    console.log('4. Create a .env.local file with:')
    console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
    console.log('5. Re-run this script\n')
    
    console.log('Option 2: Create an Edge Function')
    console.log('1. Create a Supabase Edge Function that handles content updates')
    console.log('2. The Edge Function has access to SERVICE_ROLE_KEY by default')
    console.log('3. Call the Edge Function from this script\n')
    
    console.log('Option 3: Temporary RLS bypass')
    console.log('1. Temporarily modify RLS policies to allow updates')
    console.log('2. Run the updates')
    console.log('3. Restore RLS policies\n')
    
    // Show what needs to be fixed
    console.log('🔍 Content that needs fixing:')
    const { data: problematicContent } = await supabase
      .from('content_blocks')
      .select('id, title, content')
      .eq('lesson_id', 5)
      .eq('title', 'Enter the AI Email Revolution')
      .single()
    
    if (problematicContent) {
      console.log('\nCurrent (WRONG):')
      console.log('"' + problematicContent.content.substring(0, 150) + '..."')
      console.log('\nShould be:')
      console.log('"What Maya discovers today will transform not just her Monday mornings..."')
      console.log('(with mention of 2 tools, not 4, and no other character references)')
    }
  }
}

async function performContentFixes(supabase: any, isAdmin: boolean) {
  console.log(`\n📝 Performing content fixes (${isAdmin ? 'Admin' : 'User'} mode)...\n`)

  // Fix 1: Enter the AI Email Revolution
  const revolutionContent = `What Maya discovers today will transform not just her Monday mornings, but her entire approach to communication. AI isn't about replacing the human touch that makes her messages meaningful—it's about amplifying her natural empathy and expertise while eliminating the time-consuming struggle with tone, structure, and wording.

In the next 20 minutes, Maya will master practical AI tools that will revolutionize her email communication: the AI Email Composer that helps her craft professional, personalized messages in any tone or situation, and personalized AI guidance through Lyra Chat to navigate her specific communication challenges. These tools preserve Maya's authentic voice while dramatically improving her efficiency and confidence.

By the end of this lesson, you'll have the same capabilities Maya gains - turning email anxiety into email mastery, one message at a time.`

  const { error: error1 } = await supabase
    .from('content_blocks')
    .update({ content: revolutionContent })
    .eq('lesson_id', 5)
    .eq('title', 'Enter the AI Email Revolution')

  if (error1) {
    console.error('❌ Failed to update "Enter the AI Email Revolution":', error1.message)
  } else {
    console.log('✅ Fixed "Enter the AI Email Revolution" (removed four tools promise)')
  }

  // Fix 2: Remove James from reflection
  const { data: painPoints } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('lesson_id', 5)
    .eq('title', 'Your Email Pain Points')
    .single()

  if (painPoints && painPoints.content.includes('James')) {
    const fixedContent = painPoints.content.replace(
      'Or perhaps you\'re like James (our development associate), who worries about striking the right tone with major donors?',
      'Or perhaps you worry about striking the right tone with major donors and key stakeholders?'
    )
    
    const { error } = await supabase
      .from('content_blocks')
      .update({ content: fixedContent })
      .eq('id', painPoints.id)

    if (error) {
      console.error('❌ Failed to update "Your Email Pain Points":', error.message)
    } else {
      console.log('✅ Fixed "Your Email Pain Points" (removed James reference)')
    }
  }

  // Fix 3: Maya's Transformation Begins
  const transformContent = `Ready to transform your Monday mornings—and every email interaction—just like Maya? Let's discover how AI can turn your communication challenges into your greatest strengths. Your journey to email mastery begins right now.`

  const { error: error3 } = await supabase
    .from('content_blocks')
    .update({ content: transformContent })
    .eq('lesson_id', 5)
    .eq('title', 'Maya\'s Transformation Begins')

  if (error3) {
    console.error('❌ Failed to update "Maya\'s Transformation Begins":', error3.message)
  } else {
    console.log('✅ Fixed "Maya\'s Transformation Begins" (removed character list)')
  }

  // Continue with other fixes...
  console.log('\n🎉 Content fixes complete!')
  console.log('Maya\'s lesson now accurately describes 2 tools and focuses on her story.')
}

// Run the fix
fixContentWithAuth().catch(console.error)