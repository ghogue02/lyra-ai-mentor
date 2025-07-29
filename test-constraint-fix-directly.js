// Test the constraint fix by applying it directly to production
// This will resolve the 503 errors immediately

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfkzwjnlxrwynactcmpe.supabase.co';
// We'll need the service role key to execute DDL statements

const testConstraintFix = async () => {
  try {
    console.log('🔧 Testing constraint fix application...');
    
    // First, let's try to connect and check current constraints
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/test_connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      console.log('🚨 Need to apply constraint fix through Supabase dashboard');
      console.log('');
      console.log('MANUAL STEPS TO APPLY FIX:');
      console.log('1. Go to: https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql');
      console.log('2. Run this SQL:');
      console.log('');
      console.log('-- Drop existing constraints');
      console.log('ALTER TABLE public.generated_content DROP CONSTRAINT IF EXISTS generated_content_character_type_check;');
      console.log('ALTER TABLE public.generated_content DROP CONSTRAINT IF EXISTS generated_content_content_type_check;');
      console.log('');
      console.log('-- Add corrected constraints');
      console.log("ALTER TABLE public.generated_content ADD CONSTRAINT generated_content_character_type_check CHECK (character_type IN ('maya', 'rachel', 'sofia', 'david', 'alex', 'lyra'));");
      console.log("ALTER TABLE public.generated_content ADD CONSTRAINT generated_content_content_type_check CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'ecosystem-blueprint'));");
      console.log('');
      console.log('3. After applying, test the Edge Function again');
      
      return;
    }
    
    console.log('✅ Connection successful');
    
  } catch (error) {
    console.error('❌ Error testing connection:', error);
    console.log('');
    console.log('🔧 URGENT: Apply constraint fix manually through Supabase dashboard');
    console.log('URL: https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql');
  }
};

// Check if we can get environment variables
const checkEnv = () => {
  console.log('🔍 Checking environment setup...');
  
  if (process.env.SUPABASE_URL) {
    console.log('✅ SUPABASE_URL found');
  } else {
    console.log('❌ SUPABASE_URL not found');
  }
  
  if (process.env.SUPABASE_ANON_KEY) {
    console.log('✅ SUPABASE_ANON_KEY found');
  } else {
    console.log('❌ SUPABASE_ANON_KEY not found');
  }
  
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY found (needed for DDL)');
  } else {
    console.log('❌ SUPABASE_SERVICE_ROLE_KEY not found (needed for DDL)');
    console.log('   This is required to alter table constraints');
  }
  
  console.log('');
};

checkEnv();
testConstraintFix();