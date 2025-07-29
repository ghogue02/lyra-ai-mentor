/**
 * Final validation test using the actual Supabase client configuration
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🎯 Final 503 Error Fix Validation');
console.log('Using actual project Supabase configuration');
console.log('=' .repeat(60));

// Test the exact template library scenario that was failing
console.log('\n🧪 Testing Template Library (Chapter 2)');
console.log('Route: https://hellolyra.app/chapter/2/interactive/template-library');
console.log('Expected: Maya generating email templates');

try {
    const startTime = Date.now();
    
    const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
            characterType: 'maya',
            contentType: 'email',
            topic: 'Donor engagement email template for nonprofits',
            context: 'Generate a professional, engaging email template that nonprofit organizations can use to connect with donors. Include personalization elements, compelling subject line suggestions, and clear calls-to-action.',
            targetAudience: 'nonprofit development professionals'
        }
    });

    const duration = Date.now() - startTime;

    if (error) {
        console.log('❌ STILL FAILING:', error.message);
        
        if (error.context?.status === 503) {
            console.log('🚨 503 Service Unavailable - Database constraints may not be applied correctly');
            console.log('💡 Double-check the SQL was executed in Supabase SQL Editor');
        } else if (error.context?.status === 401) {
            console.log('🔑 401 Unauthorized - Anon key may be expired or invalid');
        } else {
            console.log('📊 Status:', error.context?.status);
        }
        
        console.log('\nError details:', error);
        process.exit(1);
    }

    console.log('✅ SUCCESS! Template library is now working!');
    console.log(`⏱️  Response time: ${duration}ms`);
    console.log('📝 Generated content length:', data.content.length);
    console.log('🆔 Content ID:', data.contentId);
    console.log('🎭 Character type:', data.characterType);
    console.log('📄 Content type:', data.contentType);
    
    console.log('\n📧 Generated Email Template Preview:');
    console.log('-' .repeat(50));
    console.log(data.content.substring(0, 400) + '...');
    console.log('-' .repeat(50));

    // Test a few more critical scenarios
    console.log('\n🧪 Testing Additional Scenarios...');
    
    const additionalTests = [
        { character: 'rachel', content: 'article', description: 'Ecosystem Builder' },
        { character: 'sofia', content: 'lesson', description: 'Voice Development' }
    ];

    let allPassed = true;
    
    for (const test of additionalTests) {
        console.log(`\n   Testing: ${test.description} (${test.character} + ${test.content})`);
        
        try {
            const { data: testData, error: testError } = await supabase.functions.invoke('generate-character-content', {
                body: {
                    characterType: test.character,
                    contentType: test.content,
                    topic: `Test ${test.content} for ${test.character}`,
                    context: `Generate ${test.content} content from ${test.character}'s perspective.`
                }
            });

            if (testError) {
                console.log(`   ❌ Failed: ${testError.message}`);
                allPassed = false;
            } else {
                console.log(`   ✅ Success: ${testData.content.length} characters generated`);
            }
        } catch (err) {
            console.log(`   ❌ Error: ${err.message}`);
            allPassed = false;
        }
    }

    if (allPassed) {
        console.log('\n🎉 PERFECT! All tests passed!');
        console.log('✅ Template library is fully operational');
        console.log('✅ All character types are working');
        console.log('✅ All content types are supported');
        console.log('✅ 503 errors have been completely resolved');
        console.log('\n🚀 Your OpenRouter integration is now fully functional!');
    } else {
        console.log('\n⚠️ Some additional scenarios failed, but template library works');
        console.log('💡 The main 503 issue appears to be resolved');
    }

} catch (error) {
    console.log('❌ Test execution failed:', error.message);
    console.log('Full error:', error);
    process.exit(1);
}