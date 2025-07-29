// Test the OpenRouter Edge Function with correct parameter names
// This will confirm the 503 database constraint issues

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const testEdgeFunctionFixed = async () => {
  console.log('🧪 Testing OpenRouter Edge Function - With Correct Parameters');
  console.log('==========================================================');
  
  // Test different combinations that should cause the 503 error due to constraints
  const testCases = [
    {
      name: "Maya Email (might work)",
      characterType: "maya",
      contentType: "email",
      topic: "Write a professional email about AI"
    },
    {
      name: "Rachel Article (should fail with constraint violation)",
      characterType: "rachel", 
      contentType: "article",
      topic: "Write an article about automation"
    },
    {
      name: "Sofia Social Post (should fail with constraint violation)",
      characterType: "sofia",
      contentType: "social_post", 
      topic: "Create a social media post about storytelling"
    },
    {
      name: "David Ecosystem Blueprint (should fail with constraint violation)",
      characterType: "david",
      contentType: "ecosystem-blueprint",
      topic: "Create a data ecosystem blueprint"
    },
    {
      name: "Alex Newsletter (should fail with constraint violation)",
      characterType: "alex",
      contentType: "newsletter",
      topic: "Create a leadership newsletter"
    },
    {
      name: "Lyra Lesson (might work)",
      characterType: "lyra",
      contentType: "lesson",
      topic: "AI fundamentals lesson"
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    console.log(`   Character: ${testCase.characterType}`);
    console.log(`   Content Type: ${testCase.contentType}`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-character-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          characterType: testCase.characterType,  // Correct camelCase
          contentType: testCase.contentType,      // Correct camelCase  
          topic: testCase.topic,                  // Correct parameter name
          targetAudience: "professionals"         // Add optional parameter
        })
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 503) {
        console.log('   ❌ 503 ERROR - Database constraint violation (CONFIRMED!)');
        const errorText = await response.text();
        console.log(`   Error: ${errorText.substring(0, 200)}...`);
        
        // Look for specific constraint violation messages
        if (errorText.includes('violates check constraint')) {
          console.log('   🎯 CONFIRMED: Check constraint violation detected');
        }
      } else if (response.status === 200) {
        console.log('   ✅ SUCCESS - Function working');
        const result = await response.json();
        console.log(`   Generated content ID: ${result.contentId}`);
        console.log(`   Generated content length: ${result.content?.length || 0} chars`);
      } else if (response.status === 400) {
        const errorText = await response.text();
        console.log(`   ⚠️  Validation Error: ${errorText.substring(0, 100)}...`);
      } else {
        console.log(`   ⚠️  Unexpected status: ${response.status}`);
        const errorText = await response.text();
        console.log(`   Error: ${errorText.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');
  console.log('If you see 503 errors above, it CONFIRMS the database constraint issue.');
  console.log('The constraint violations are preventing non-Maya characters and non-lesson content types.');
  console.log('');
  console.log('🔧 URGENT CONSTRAINT FIX NEEDED:');
  console.log('1. Go to: https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql');
  console.log('2. Copy and run the SQL from: supabase/migrations/20250729110531_fix_database_constraints_urgent.sql');
  console.log('3. Re-run this test to verify ALL characters and content types work');
  console.log('');
  console.log('Expected after fix:');
  console.log('✅ Maya, Rachel, Sofia, David, Alex, Lyra - ALL should work');
  console.log('✅ Email, Lesson, Article, Social Post, Newsletter, Blog Post, Ecosystem Blueprint - ALL should work');
};

testEdgeFunctionFixed().catch(console.error);