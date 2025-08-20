#!/usr/bin/env node

/**
 * Test script to verify the Carmen Edge Function fix
 * This will test the database connection and Edge Function functionality
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Testing Carmen Edge Function Fix...\n');

async function testDatabaseConnection() {
  console.log('1️⃣ Testing Database Connection...');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    console.log('   SUPABASE_URL:', !!SUPABASE_URL);
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_SERVICE_ROLE_KEY);
    return false;
  }
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Test generated_content table
    console.log('   Testing generated_content table...');
    const { data: contentData, error: contentError } = await supabase
      .from('generated_content')
      .select('count')
      .limit(1);
    
    if (contentError) {
      console.error('   ❌ generated_content table error:', contentError.message);
      return false;
    } else {
      console.log('   ✅ generated_content table accessible');
    }
    
    // Test maya_analysis_results table
    console.log('   Testing maya_analysis_results table...');
    const { data: mayaData, error: mayaError } = await supabase
      .from('maya_analysis_results')
      .select('count')
      .limit(1);
    
    if (mayaError) {
      console.error('   ❌ maya_analysis_results table error:', mayaError.message);
      return false;
    } else {
      console.log('   ✅ maya_analysis_results table accessible');
    }
    
    console.log('✅ Database connection test passed\n');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testEdgeFunction() {
  console.log('2️⃣ Testing Edge Function...');
  
  if (!SUPABASE_URL) {
    console.error('❌ Missing SUPABASE_URL for Edge Function test');
    return false;
  }
  
  const testPayload = {
    characterType: 'carmen',
    contentType: 'hiring_strategy',
    topic: 'Building an inclusive tech team with diverse skill sets',
    targetAudience: 'startup founders and HR managers',
    context: 'Create a hiring strategy that balances technical skills with cultural fit for a growing startup.'
  };
  
  console.log('   Testing Carmen hiring strategy generation...');
  console.log('   Payload:', JSON.stringify(testPayload, null, 2));
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-character-content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('   Response status:', response.status, response.statusText);
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Edge Function test passed');
      console.log('   Generated content ID:', responseData.contentId);
      console.log('   Title:', responseData.title);
      console.log('   Content preview:', responseData.content?.substring(0, 100) + '...');
      console.log('   Character type:', responseData.characterType);
      console.log('   Content type:', responseData.contentType);
      return true;
    } else {
      console.error('   ❌ Edge Function test failed');
      console.error('   Error:', responseData.error);
      console.error('   Category:', responseData.category);
      console.error('   Status code:', responseData.statusCode);
      return false;
    }
  } catch (error) {
    console.error('❌ Edge Function test error:', error.message);
    return false;
  }
}

async function testFallbackBehavior() {
  console.log('3️⃣ Testing Fallback Behavior...');
  
  // Test with an invalid character type to trigger fallback
  const testPayload = {
    characterType: 'invalid_character',
    contentType: 'email',
    topic: 'Test fallback behavior',
    targetAudience: 'test users'
  };
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-character-content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(testPayload)
    });
    
    const responseData = await response.json();
    
    if (response.status === 400 && responseData.category === 'INVALID_CHARACTER') {
      console.log('   ✅ Fallback behavior test passed - Invalid character properly rejected');
      return true;
    } else {
      console.error('   ❌ Fallback behavior test failed');
      console.error('   Unexpected response:', responseData);
      return false;
    }
  } catch (error) {
    console.error('❌ Fallback behavior test error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🔧 Carmen Edge Function Fix - Test Suite');
  console.log('==========================================\n');
  
  let allPassed = true;
  
  // Test database connection
  allPassed = await testDatabaseConnection() && allPassed;
  
  // Test Edge Function
  allPassed = await testEdgeFunction() && allPassed;
  
  // Test fallback behavior
  allPassed = await testFallbackBehavior() && allPassed;
  
  console.log('\n==========================================');
  if (allPassed) {
    console.log('🎉 All tests passed! Carmen Edge Function fix is working correctly.');
    console.log('✅ The 503 error should now be resolved.');
  } else {
    console.log('❌ Some tests failed. Please check the error messages above.');
    console.log('🚨 The 503 error may still occur.');
  }
  console.log('==========================================\n');
  
  return allPassed;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}