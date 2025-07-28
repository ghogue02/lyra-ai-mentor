// Database Connection Test Script
// This script tests the database connection and permissions for the Edge Function

import { createClient } from '@supabase/supabase-js';

// Test configuration - using local development settings
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

console.log('🔧 [TEST] Database Connection Test Starting...');
console.log('🔧 [TEST] SUPABASE_URL:', SUPABASE_URL);
console.log('🔧 [TEST] Service Role Key Length:', SUPABASE_SERVICE_ROLE_KEY?.length || 0);

async function testDatabaseConnection() {
  try {
    console.log('\n🗄️ [TEST] Creating Supabase client...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('✅ [TEST] Supabase client created successfully');

    // Test 1: Basic connection test
    console.log('\n🧪 [TEST 1] Testing basic database connection...');
    try {
      const { data: connectionTest, error: connectionError } = await supabase
        .from('generated_content')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        console.error('❌ [TEST 1] Connection test failed:');
        console.error('  Code:', connectionError.code);
        console.error('  Message:', connectionError.message);
        console.error('  Details:', connectionError.details);
        console.error('  Hint:', connectionError.hint);
      } else {
        console.log('✅ [TEST 1] Basic connection successful');
        console.log('  Result:', connectionTest);
      }
    } catch (error) {
      console.error('❌ [TEST 1] Connection test exception:', error.message);
    }

    // Test 2: Check if table exists
    console.log('\n🧪 [TEST 2] Checking if generated_content table exists...');
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'generated_content')
        .eq('table_schema', 'public');
      
      if (tableError) {
        console.error('❌ [TEST 2] Table check failed:', tableError.message);
      } else {
        if (tableInfo && tableInfo.length > 0) {
          console.log('✅ [TEST 2] generated_content table exists');
        } else {
          console.log('❌ [TEST 2] generated_content table does NOT exist');
        }
      }
    } catch (error) {
      console.error('❌ [TEST 2] Table check exception:', error.message);
    }

    // Test 3: Get table schema
    console.log('\n🧪 [TEST 3] Getting table schema...');
    try {
      const { data: columns, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', 'generated_content')
        .eq('table_schema', 'public')
        .order('ordinal_position');
      
      if (schemaError) {
        console.error('❌ [TEST 3] Schema check failed:', schemaError.message);
      } else {
        if (columns && columns.length > 0) {
          console.log('✅ [TEST 3] Table schema:');
          columns.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
          });
        } else {
          console.log('❌ [TEST 3] No schema information found');
        }
      }
    } catch (error) {
      console.error('❌ [TEST 3] Schema check exception:', error.message);
    }

    // Test 4: Test insert permissions
    console.log('\n🧪 [TEST 4] Testing insert permissions...');
    try {
      const testData = {
        user_id: null,
        character_type: 'test',
        content_type: 'test',
        title: 'DB Connection Test',
        content: 'This is a test content from database connection test',
        metadata: { test: true, timestamp: new Date().toISOString() },
        approval_status: 'pending'
      };

      const { data: insertResult, error: insertError } = await supabase
        .from('generated_content')
        .insert(testData)
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ [TEST 4] Insert test failed:');
        console.error('  Code:', insertError.code);
        console.error('  Message:', insertError.message);
        console.error('  Details:', insertError.details);
        console.error('  Hint:', insertError.hint);
      } else {
        console.log('✅ [TEST 4] Insert test successful');
        console.log('  Inserted ID:', insertResult?.id);
        
        // Clean up test record
        if (insertResult?.id) {
          console.log('🧹 [TEST 4] Cleaning up test record...');
          await supabase
            .from('generated_content')
            .delete()
            .eq('id', insertResult.id);
          console.log('✅ [TEST 4] Test record cleaned up');
        }
      }
    } catch (error) {
      console.error('❌ [TEST 4] Insert test exception:', error.message);
    }

    // Test 5: Check RLS policies
    console.log('\n🧪 [TEST 5] Checking Row Level Security policies...');
    try {
      const { data: policies, error: policyError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'generated_content');
      
      if (policyError) {
        console.error('❌ [TEST 5] RLS check failed:', policyError.message);
      } else {
        if (policies && policies.length > 0) {
          console.log('✅ [TEST 5] RLS policies found:');
          policies.forEach(policy => {
            console.log(`  - ${policy.policyname}: ${policy.cmd} (${policy.roles})`);
          });
        } else {
          console.log('✅ [TEST 5] No RLS policies found (table may have RLS disabled)');
        }
      }
    } catch (error) {
      console.error('❌ [TEST 5] RLS check exception:', error.message);
    }

    // Test 6: Test with same structure as Edge Function
    console.log('\n🧪 [TEST 6] Testing Edge Function data structure...');
    try {
      const edgeFunctionData = {
        user_id: null, // Allow anonymous for testing
        character_type: 'maya',
        content_type: 'email',
        title: 'Test Email Content',
        content: 'This is test content generated for Maya character.',
        metadata: {
          topic: 'Email marketing optimization',
          targetAudience: 'Small business owners',
          mayaPatterns: 'Focus on personalization and data-driven approaches',
          character: {
            name: 'Maya',
            personality: 'Expert email marketer with a focus on data-driven campaigns and personalization',
            tone: 'Professional yet approachable, analytical, results-focused',
            expertise: 'Email marketing, automation, A/B testing, customer segmentation'
          }
        },
        approval_status: 'pending'
      };

      const { data: edgeTestResult, error: edgeTestError } = await supabase
        .from('generated_content')
        .insert(edgeFunctionData)
        .select()
        .single();
      
      if (edgeTestError) {
        console.error('❌ [TEST 6] Edge Function structure test failed:');
        console.error('  Code:', edgeTestError.code);
        console.error('  Message:', edgeTestError.message);
        console.error('  Details:', edgeTestError.details);
        console.error('  Hint:', edgeTestError.hint);
      } else {
        console.log('✅ [TEST 6] Edge Function structure test successful');
        console.log('  Inserted ID:', edgeTestResult?.id);
        
        // Clean up test record
        if (edgeTestResult?.id) {
          console.log('🧹 [TEST 6] Cleaning up test record...');
          await supabase
            .from('generated_content')
            .delete()
            .eq('id', edgeTestResult.id);
          console.log('✅ [TEST 6] Test record cleaned up');
        }
      }
    } catch (error) {
      console.error('❌ [TEST 6] Edge Function test exception:', error.message);
    }

    console.log('\n🎉 [TEST] Database connection testing completed!');

  } catch (error) {
    console.error('💥 [FATAL] Test script failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testDatabaseConnection();