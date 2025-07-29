/**
 * Comprehensive AI Generation Test Suite
 * Tests all microlesson AI functionality after OpenRouter fixes
 */

const { createClient } = require('@supabase/supabase-js');

// Test configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Test scenarios - all combinations that should work after fixes
const testScenarios = [
    // Character type coverage
    { character: 'maya', contentType: 'lesson', description: 'Maya lesson generation' },
    { character: 'rachel', contentType: 'article', description: 'Rachel ecosystem article' },
    { character: 'sofia', contentType: 'email', description: 'Sofia communication email' },
    { character: 'david', contentType: 'lesson', description: 'David data storytelling lesson' },
    { character: 'alex', contentType: 'article', description: 'Alex change management article' },
    { character: 'lyra', contentType: 'lesson', description: 'Lyra comprehensive lesson' },
    
    // Content type coverage
    { character: 'maya', contentType: 'email', description: 'Maya email campaign' },
    { character: 'rachel', contentType: 'ecosystem-blueprint', description: 'Rachel ecosystem blueprint' },
    { character: 'sofia', contentType: 'social_post', description: 'Sofia social media post' },
    { character: 'david', contentType: 'newsletter', description: 'David data newsletter' },
    { character: 'alex', contentType: 'blog_post', description: 'Alex change blog post' },
    
    // Microlesson specific scenarios
    { character: 'rachel', contentType: 'article', topic: 'automation ecosystem design', description: 'Ecosystem Builder microlesson' },
    { character: 'maya', contentType: 'email', topic: 'donor engagement campaign', description: 'Email automation microlesson' },
    { character: 'sofia', contentType: 'lesson', topic: 'brand voice development', description: 'Voice development microlesson' },
    { character: 'david', contentType: 'article', topic: 'data visualization best practices', description: 'Data storytelling microlesson' },
    { character: 'alex', contentType: 'lesson', topic: 'organizational change management', description: 'Change management microlesson' }
];

// Test execution
async function runComprehensiveTests() {
    console.log('🚀 Starting Comprehensive AI Generation Test Suite');
    console.log(`📊 Total scenarios to test: ${testScenarios.length}`);
    console.log('=' .repeat(80));

    let successCount = 0;
    let failureCount = 0;
    const results = [];

    for (const [index, scenario] of testScenarios.entries()) {
        console.log(`\n🧪 Test ${index + 1}/${testScenarios.length}: ${scenario.description}`);
        console.log(`   Character: ${scenario.character}, Content: ${scenario.contentType}`);
        
        try {
            const startTime = Date.now();
            
            const { data, error } = await supabase.functions.invoke('generate-character-content', {
                body: {
                    characterType: scenario.character,
                    contentType: scenario.contentType,
                    topic: scenario.topic || `Test ${scenario.contentType} content`,
                    context: `Generate ${scenario.contentType} content from ${scenario.character}'s perspective for testing purposes.`,
                    targetAudience: 'nonprofit professionals'
                }
            });

            const duration = Date.now() - startTime;

            if (error) {
                throw error;
            }

            if (!data || !data.content) {
                throw new Error('No content generated in response');
            }

            console.log(`   ✅ SUCCESS (${duration}ms)`);
            console.log(`   📝 Content length: ${data.content.length} characters`);
            console.log(`   🆔 Content ID: ${data.contentId}`);
            
            successCount++;
            results.push({
                ...scenario,
                status: 'success',
                duration,
                contentLength: data.content.length,
                contentId: data.contentId
            });

        } catch (error) {
            console.log(`   ❌ FAILED: ${error.message}`);
            failureCount++;
            results.push({
                ...scenario,
                status: 'failed',
                error: error.message
            });
        }
    }

    // Test summary
    console.log('\n' + '=' .repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(80));
    console.log(`✅ Successful tests: ${successCount} (${Math.round(successCount/testScenarios.length*100)}%)`);
    console.log(`❌ Failed tests: ${failureCount} (${Math.round(failureCount/testScenarios.length*100)}%)`);
    console.log(`📈 Success rate: ${Math.round(successCount/testScenarios.length*100)}%`);

    // Detailed results by category
    console.log('\n📋 RESULTS BY CHARACTER:');
    const characterResults = {};
    results.forEach(result => {
        if (!characterResults[result.character]) {
            characterResults[result.character] = { success: 0, failed: 0 };
        }
        characterResults[result.character][result.status === 'success' ? 'success' : 'failed']++;
    });

    Object.entries(characterResults).forEach(([character, stats]) => {
        const total = stats.success + stats.failed;
        const successRate = Math.round(stats.success / total * 100);
        console.log(`   ${character}: ${stats.success}/${total} (${successRate}%)`);
    });

    console.log('\n📋 RESULTS BY CONTENT TYPE:');
    const contentResults = {};
    results.forEach(result => {
        if (!contentResults[result.contentType]) {
            contentResults[result.contentType] = { success: 0, failed: 0 };
        }
        contentResults[result.contentType][result.status === 'success' ? 'success' : 'failed']++;
    });

    Object.entries(contentResults).forEach(([contentType, stats]) => {
        const total = stats.success + stats.failed;
        const successRate = Math.round(stats.success / total * 100);
        console.log(`   ${contentType}: ${stats.success}/${total} (${successRate}%)`);
    });

    // Failed test details
    if (failureCount > 0) {
        console.log('\n❌ FAILED TEST DETAILS:');
        results.filter(r => r.status === 'failed').forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.description}`);
            console.log(`      Character: ${result.character}, Content: ${result.contentType}`);
            console.log(`      Error: ${result.error}`);
        });
    }

    // Performance analysis
    const successfulTests = results.filter(r => r.status === 'success');
    if (successfulTests.length > 0) {
        const avgDuration = Math.round(successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length);
        const minDuration = Math.min(...successfulTests.map(r => r.duration));
        const maxDuration = Math.max(...successfulTests.map(r => r.duration));
        
        console.log('\n⚡ PERFORMANCE ANALYSIS:');
        console.log(`   Average response time: ${avgDuration}ms`);
        console.log(`   Fastest response: ${minDuration}ms`);
        console.log(`   Slowest response: ${maxDuration}ms`);
    }

    console.log('\n🎯 RECOMMENDATIONS:');
    if (successCount === testScenarios.length) {
        console.log('   🎉 Perfect! All AI generation functionality is working correctly.');
        console.log('   ✅ All character types are supported');
        console.log('   ✅ All content types are supported');
        console.log('   ✅ No more 503 database constraint errors');
        console.log('   🚀 Ready for production use across all microlessons');
    } else if (successCount > testScenarios.length * 0.8) {
        console.log('   ⚠️ Most functionality working but some issues remain');
        console.log('   🔍 Review failed test details above for specific fixes needed');
    } else {
        console.log('   🚨 Significant issues remain - requires immediate attention');
        console.log('   🔧 Check database constraints and Edge Function configuration');
    }

    console.log('\n' + '=' .repeat(80));
    console.log(`🏁 Test suite completed at ${new Date().toISOString()}`);
    console.log('=' .repeat(80));

    return {
        totalTests: testScenarios.length,
        successCount,
        failureCount,
        successRate: Math.round(successCount/testScenarios.length*100),
        results
    };
}

// Run tests if called directly
if (require.main === module) {
    runComprehensiveTests()
        .then(results => {
            process.exit(results.failureCount === 0 ? 0 : 1);
        })
        .catch(error => {
            console.error('🚨 Test suite failed to run:', error);
            process.exit(1);
        });
}

module.exports = { runComprehensiveTests };