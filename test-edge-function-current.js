// Test the current state of the OpenRouter Edge Function
// This will help us confirm the 503 errors and then verify the fix

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const testEdgeFunction = async () => {
  console.log('🧪 Testing OpenRouter Edge Function - Current State');
  console.log('===============================================');
  
  // Test different combinations that should cause the 503 error
  const testCases = [
    {
      name: "Maya Email (should work after fix)",
      character_type: "maya",
      content_type: "email",
      prompt: "Write a professional email about AI"
    },
    {
      name: "Rachel Article (should fail currently)",
      character_type: "rachel", 
      content_type: "article",
      prompt: "Write an article about automation"
    },
    {
      name: "Sofia Social Post (should fail currently)",
      character_type: "sofia",
      content_type: "social_post", 
      prompt: "Create a social media post about storytelling"
    },
    {
      name: "David Ecosystem Blueprint (should fail currently)",
      character_type: "david",
      content_type: "ecosystem-blueprint",
      prompt: "Create a data ecosystem blueprint"
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    console.log(`   Character: ${testCase.character_type}`);
    console.log(`   Content Type: ${testCase.content_type}`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-character-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          character_type: testCase.character_type,
          content_type: testCase.content_type,
          prompt: testCase.prompt,
          user_id: null // Test anonymous usage
        })
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 503) {
        console.log('   ❌ 503 ERROR - Database constraint violation (expected)');
        const errorText = await response.text();
        console.log(`   Error: ${errorText.substring(0, 100)}...`);
      } else if (response.status === 200) {
        console.log('   ✅ SUCCESS - Function working');
        const result = await response.json();
        console.log(`   Generated content length: ${result.content?.length || 0} chars`);
      } else {
        console.log(`   ⚠️  Unexpected status: ${response.status}`);
        const errorText = await response.text();
        console.log(`   Error: ${errorText.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');
  console.log('If you see 503 errors above, it confirms the database constraint issue.');
  console.log('After applying the constraint fix, all tests should return 200 OK.');
  console.log('');
  console.log('🔧 TO FIX THE ISSUE:');
  console.log('1. Go to: https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql');
  console.log('2. Run the SQL from the migration file we created');
  console.log('3. Re-run this test to verify the fix');
};

testEdgeFunction().catch(console.error);