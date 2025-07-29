/**
 * 🧪 Test Script to Validate 503 Error Fix
 * Run this AFTER applying the database fixes to verify everything works
 */

import { createClient } from '@supabase/supabase-js';
import process from 'process';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hfkzwjnlxrwynactcmpe.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE5NTI3MzMsImV4cCI6MjAzNzUyODczM30.YgiBzLEv3lVEamcIhGRdaUwY-zQQrz--TdFzYcOJnfc';

// Test the exact scenario that was failing: template library
const testTemplateLibraryScenario = async () => {
    console.log('🧪 Testing Template Library Scenario (Chapter 2)');
    console.log('Route: https://hellolyra.app/chapter/2/interactive/template-library');
    console.log('Expected: Maya generating email templates');
    console.log('=' .repeat(60));

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    try {
        const { data, error } = await supabase.functions.invoke('generate-character-content', {
            body: {
                characterType: 'maya',
                contentType: 'email', 
                topic: 'Email template for nonprofit donor engagement',
                context: 'Generate professional email template for nonprofit organizations to engage with donors. Include personalization elements and clear call-to-action.',
                targetAudience: 'nonprofit development professionals'
            }
        });

        if (error) {
            console.log('❌ STILL FAILING:', error.message);
            console.log('Error details:', error);
            return false;
        }

        if (!data || !data.content) {
            console.log('❌ No content generated');
            return false;
        }

        console.log('✅ SUCCESS! Template library should now work');
        console.log('📝 Generated content length:', data.content.length);
        console.log('🆔 Content ID:', data.contentId);
        console.log('🎭 Character:', data.characterType);
        console.log('📄 Content type:', data.contentType);
        console.log('\n📧 Sample content:');
        console.log(data.content.substring(0, 200) + '...');
        
        return true;

    } catch (error) {
        console.log('❌ REQUEST FAILED:', error.message);
        return false;
    }
};

// Test multiple scenarios to ensure comprehensive fix
const runComprehensiveValidation = async () => {
    console.log('🚀 Running Comprehensive 503 Fix Validation');
    console.log('Testing the scenarios that previously failed with 503 errors\n');

    const testScenarios = [
        { character: 'maya', content: 'email', description: 'Template Library (Chapter 2)' },
        { character: 'rachel', content: 'article', description: 'Ecosystem Builder (Chapter 5)' },
        { character: 'sofia', content: 'lesson', description: 'Voice Development' },
        { character: 'david', content: 'article', description: 'Data Storytelling' },
        { character: 'alex', content: 'lesson', description: 'Change Management' }
    ];

    let successCount = 0;
    const results = [];

    for (const [index, scenario] of testScenarios.entries()) {
        console.log(`\n🧪 Test ${index + 1}/5: ${scenario.description}`);
        console.log(`   Character: ${scenario.character}, Content: ${scenario.content}`);

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        try {
            const startTime = Date.now();
            
            const { data, error } = await supabase.functions.invoke('generate-character-content', {
                body: {
                    characterType: scenario.character,
                    contentType: scenario.content,
                    topic: `Test ${scenario.content} content for ${scenario.character}`,
                    context: `Generate ${scenario.content} content from ${scenario.character}'s perspective.`
                }
            });

            const duration = Date.now() - startTime;

            if (error) {
                console.log(`   ❌ FAILED: ${error.message}`);
                results.push({ ...scenario, status: 'failed', error: error.message });
                continue;
            }

            console.log(`   ✅ SUCCESS (${duration}ms)`);
            console.log(`   📝 Content: ${data.content.length} chars`);
            
            successCount++;
            results.push({ ...scenario, status: 'success', duration });

        } catch (error) {
            console.log(`   ❌ FAILED: ${error.message}`);
            results.push({ ...scenario, status: 'failed', error: error.message });
        }
    }

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 VALIDATION SUMMARY');
    console.log('=' .repeat(60));
    console.log(`✅ Successful: ${successCount}/5 (${Math.round(successCount/5*100)}%)`);
    console.log(`❌ Failed: ${5-successCount}/5 (${Math.round((5-successCount)/5*100)}%)`);

    if (successCount === 5) {
        console.log('\n🎉 PERFECT! All 503 errors have been resolved!');
        console.log('✅ Template library should now work correctly');
        console.log('✅ All microlessons should function properly');
        console.log('✅ OpenRouter integration is fully operational');
    } else {
        console.log('\n⚠️ Some issues remain. Check failed scenarios above.');
        console.log('💡 Try the template library manually to confirm the fix.');
    }

    return successCount === 5;
};

// Main execution
console.log('🎯 503 Error Fix Validation Test');
console.log('Run this AFTER applying the database constraint fixes\n');

// Test the specific failing scenario first
testTemplateLibraryScenario()
    .then(success => {
        if (success) {
            console.log('\n🎯 Template library test passed! Running comprehensive validation...\n');
            return runComprehensiveValidation();
        } else {
            console.log('\n🚨 Template library still failing. Database fixes may not be applied yet.');
            console.log('📋 Next steps:');
            console.log('1. Go to: https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql');
            console.log('2. Execute the SQL from APPLY_503_FIX_NOW.sql');
            console.log('3. Run this test again');
            return false;
        }
    })
    .then(allSuccess => {
        process.exit(allSuccess ? 0 : 1);
    })
    .catch(error => {
        console.error('🚨 Test validation failed:', error);
        process.exit(1);
    });