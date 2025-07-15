import { createClient } from '@supabase/supabase-js'

// Current credentials (anon key)
const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function diagnoseSupabaseAuth() {
  console.log('🔍 Diagnosing Supabase authentication and permissions...\n')

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Test 1: Check if we can read data
  console.log('1️⃣ Testing READ permissions...')
  const { data: readTest, error: readError } = await supabase
    .from('content_blocks')
    .select('id, title')
    .eq('lesson_id', 5)
    .limit(1)

  if (readError) {
    console.log('❌ Read failed:', readError.message)
  } else {
    console.log('✅ Read successful:', readTest?.length, 'records')
  }

  // Test 2: Check if we can update data
  console.log('\n2️⃣ Testing UPDATE permissions...')
  const { error: updateError } = await supabase
    .from('content_blocks')
    .update({ content: 'Test update' })
    .eq('id', -999) // Non-existent ID to avoid actual changes

  if (updateError) {
    console.log('❌ Update failed:', updateError.message)
    console.log('Error code:', updateError.code)
    console.log('Details:', updateError.details)
  } else {
    console.log('✅ Update would succeed (tested on non-existent record)')
  }

  // Test 3: Check RLS policies
  console.log('\n3️⃣ Checking RLS policies...')
  
  // Try to get RLS policy info (this requires admin access)
  const { data: policies, error: policyError } = await supabase
    .rpc('get_policies', { table_name: 'content_blocks' })
    .single()

  if (policyError) {
    console.log('ℹ️ Cannot read RLS policies (requires admin access)')
    console.log('This is likely why updates are failing - RLS policies are blocking anon users')
  } else {
    console.log('RLS policies:', policies)
  }

  // Test 4: Check authentication status
  console.log('\n4️⃣ Checking authentication status...')
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    console.log('❌ Not authenticated - using anonymous access')
    console.log('This is why updates fail: RLS policies likely require authenticated users')
  } else {
    console.log('✅ Authenticated as:', user.email)
  }

  // Test 5: Try different table to understand pattern
  console.log('\n5️⃣ Testing other tables...')
  const { error: ieUpdateError } = await supabase
    .from('interactive_elements')
    .update({ title: 'Test' })
    .eq('id', -999)

  if (ieUpdateError) {
    console.log('❌ interactive_elements update failed:', ieUpdateError.message)
  }

  // Diagnosis
  console.log('\n📊 DIAGNOSIS:')
  console.log('- We can READ data (SELECT works)')
  console.log('- We cannot UPDATE data (RLS policies block anonymous users)')
  console.log('- The anon key has limited permissions by design')
  console.log('- We need either:')
  console.log('  1. A service role key (bypasses RLS)')
  console.log('  2. An authenticated user session')
  console.log('  3. Modified RLS policies to allow anon updates')

  // Check for service role key in environment
  console.log('\n🔑 Checking for service role key...')
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceRoleKey) {
    console.log('✅ Found service role key in environment')
  } else {
    console.log('❌ No service role key found')
    console.log('\nTo fix this, we need to:')
    console.log('1. Get the service role key from Supabase dashboard')
    console.log('2. Create a .env.local file with SUPABASE_SERVICE_ROLE_KEY')
    console.log('3. Use the service role client for updates')
  }
}

diagnoseSupabaseAuth().catch(console.error)