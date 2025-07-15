#!/usr/bin/env tsx

/**
 * Quick Test Script for Content Scaling System
 * 
 * This script runs quick tests to verify the content scaling system works
 * Usage: npm run test-scaling
 */

import ContentScalingTestFramework from '../src/test/contentScalingTest';

async function runQuickTests() {
  console.log('🧪 Running Content Scaling System Tests...\n');
  
  const testFramework = new ContentScalingTestFramework();
  
  try {
    // Run core tests
    const coreTests = [
      'characters',
      'templates', 
      'generation',
      'quality'
    ];
    
    console.log('🎯 Running Core System Tests...');
    
    for (const testName of coreTests) {
      try {
        const result = await testFramework.runSpecificTest(testName);
        const status = result.successRate === 100 ? '✅' : result.successRate >= 80 ? '⚠️' : '❌';
        console.log(`${status} ${result.name}: ${result.passed}/${result.total} (${result.successRate.toFixed(1)}%)`);
      } catch (error) {
        console.log(`❌ ${testName} failed: ${error}`);
      }
    }
    
    console.log('\n🔍 Running System Validation...');
    
    // Test basic functionality
    const validationTests = [
      'performance',
      'errors'
    ];
    
    for (const testName of validationTests) {
      try {
        const result = await testFramework.runSpecificTest(testName);
        const status = result.successRate === 100 ? '✅' : result.successRate >= 80 ? '⚠️' : '❌';
        console.log(`${status} ${result.name}: ${result.passed}/${result.total} (${result.successRate.toFixed(1)}%)`);
      } catch (error) {
        console.log(`❌ ${testName} failed: ${error}`);
      }
    }
    
    console.log('\n🎉 Quick tests completed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run full test suite: npm run test-scaling -- --full');
    console.log('2. Create first component: npm run create-component alex 3 interactive-builder');
    console.log('3. Start development: npm run dev');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Check if full test suite requested
if (process.argv.includes('--full')) {
  const testFramework = new ContentScalingTestFramework();
  testFramework.runFullTestSuite().then(results => {
    console.log('\n📊 Full Test Suite Results:');
    console.log(testFramework.generateTestSummary(results));
  }).catch(console.error);
} else {
  runQuickTests();
}