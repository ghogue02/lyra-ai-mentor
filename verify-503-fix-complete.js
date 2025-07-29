// Complete verification of 503 error fixes
// Run this AFTER applying the database constraint fixes and Edge Function updates

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const verifyComplete503Fix = async () => {
  console.log('🔍 COMPLETE VERIFICATION: 503 Error Fix');
  console.log('======================================');
  console.log('This test verifies ALL fixes have been applied successfully.');
  console.log('');
  
  // Test all character/content type combinations
  const testCases = [
    // Maya tests
    { character: "maya", content: "email", topic: "Email marketing best practices" },
    { character: "maya", content: "lesson", topic: "A/B testing fundamentals" },
    { character: "maya", content: "article", topic: "Email personalization strategies" },
    
    // Rachel tests  
    { character: "rachel", content: "article", topic: "Automation workflow design" },
    { character: "rachel", content: "newsletter", topic: "Process optimization tips" },
    { character: "rachel", content: "ecosystem-blueprint", topic: "System integration roadmap" },
    
    // Sofia tests
    { character: "sofia", content: "social_post", topic: "Brand voice development" },
    { character: "sofia", content: "blog_post", topic: "Storytelling techniques" },
    { character: "sofia", content: "article", topic: "Content strategy framework" },
    
    // David tests
    { character: "david", content: "article", topic: "Data visualization principles" },
    { character: "david", content: "ecosystem-blueprint", topic: "Analytics architecture" },
    { character: "david", content: "lesson", topic: "Business intelligence basics" },
    
    // Alex tests
    { character: "alex", content: "newsletter", topic: "Change management insights" },
    { character: "alex", content: "article", topic: "Leadership transformation" },
    { character: "alex", content: "email", topic: "Team adaptation strategies" },
    
    // Lyra tests (previously failed)
    { character: "lyra", content: "lesson", topic: "AI fundamentals introduction" },
    { character: "lyra", content: "article", topic: "Machine learning concepts" },
    { character: "lyra", content: "email", topic: "Technology education tips" }
  ];
  
  let successCount = 0;
  let failureCount = 0;
  const failures = [];
  
  console.log(`🧪 Running ${testCases.length} comprehensive tests...\n`);
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const testNumber = i + 1;
    
    console.log(`Test ${testNumber}/${testCases.length}: ${testCase.character} ${testCase.content}`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-character-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          characterType: testCase.character,
          contentType: testCase.content,
          topic: testCase.topic,
          targetAudience: "professionals"
        })
      });
      
      if (response.status === 200) {
        const result = await response.json();
        console.log(`   ✅ SUCCESS - Content ID: ${result.contentId}`);
        successCount++;
      } else if (response.status === 503) {
        console.log(`   ❌ 503 ERROR - Constraint fix not applied yet!`);
        const errorText = await response.text();
        failures.push({ 
          test: `${testCase.character} ${testCase.content}`, 
          error: errorText.substring(0, 100) + '...'
        });
        failureCount++;
      } else {
        console.log(`   ⚠️  Status ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        failures.push({ 
          test: `${testCase.character} ${testCase.content}`, 
          error: `${response.status}: ${errorText.substring(0, 100)}...`
        });
        failureCount++;
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
      failures.push({ 
        test: `${testCase.character} ${testCase.content}`, 
        error: `Network: ${error.message}`
      });
      failureCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('========================');
  console.log(`✅ Successful tests: ${successCount}/${testCases.length}`);
  console.log(`❌ Failed tests: ${failureCount}/${testCases.length}`);
  
  if (failureCount === 0) {
    console.log('\n🎉 ALL TESTS PASSED! 503 Error Fix COMPLETE!');
    console.log('✅ All character types working');
    console.log('✅ All content types working');
    console.log('✅ Anonymous usage working');
    console.log('✅ Database constraints fixed');
    console.log('✅ Edge Function updated');
    console.log('\n🚀 OpenRouter integration is now fully operational!');
  } else {
    console.log('\n🚨 SOME TESTS FAILED - Fix not complete yet');
    console.log('\nFailed tests:');
    failures.forEach((failure, index) => {
      console.log(`${index + 1}. ${failure.test}: ${failure.error}`);
    });
    console.log('\n💡 Next steps:');
    console.log('1. Ensure database constraint SQL was applied successfully');
    console.log('2. Ensure Edge Function was redeployed with Lyra character');
    console.log('3. Check Supabase logs for any remaining issues');
    console.log('4. Re-run this test after applying remaining fixes');
  }
  
  const successRate = (successCount / testCases.length * 100).toFixed(1);
  console.log(`\n📈 Success Rate: ${successRate}%`);
  
  if (successRate === '100.0') {
    console.log('🏆 MISSION ACCOMPLISHED: 503 errors completely resolved!');
  }
};

console.log('Starting comprehensive 503 error fix verification...');
verifyComplete503Fix().catch(console.error);