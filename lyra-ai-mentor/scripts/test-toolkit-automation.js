#!/usr/bin/env node

/**
 * Automated Toolkit Testing Script
 * 
 * This script automates testing of the toolkit functionality without manual clicking.
 * It tests both the API endpoints and the UI components.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🧪 Starting Automated Toolkit Testing...\n');

// Color codes for better output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const runTest = (command, description) => {
  log(`\n${colors.blue}${colors.bold}🔧 ${description}${colors.reset}`);
  try {
    const output = execSync(command, { 
      cwd: projectRoot, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    log(`${colors.green}✅ PASSED${colors.reset}`);
    return { success: true, output };
  } catch (error) {
    log(`${colors.red}❌ FAILED${colors.reset}`);
    log(`${colors.red}Error: ${error.message}${colors.reset}`);
    return { success: false, error: error.message };
  }
};

const tests = [
  {
    command: 'npm run test:run tests/integration/toolkit-save-simple.test.ts',
    description: 'Integration Tests - Toolkit Service Logic'
  },
  {
    command: 'npm run db:check',
    description: 'Database Schema Validation'
  },
  {
    command: 'npm run typecheck',
    description: 'TypeScript Type Checking'
  }
];

// Run all tests
const results = [];
let totalTests = tests.length;
let passedTests = 0;

for (const test of tests) {
  const result = runTest(test.command, test.description);
  results.push({ ...test, ...result });
  if (result.success) passedTests++;
}

// Summary
log(`\n${colors.bold}📊 Test Summary${colors.reset}`);
log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
log(`Total Tests: ${totalTests}`);
log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
log(`${colors.red}Failed: ${totalTests - passedTests}${colors.reset}`);
log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

if (passedTests === totalTests) {
  log(`\n${colors.green}${colors.bold}🎉 All tests passed! Toolkit functionality is working correctly.${colors.reset}`);
} else {
  log(`\n${colors.yellow}${colors.bold}⚠️  Some tests failed. Check the errors above.${colors.reset}`);
}

// Detailed results
log(`\n${colors.bold}📋 Detailed Results${colors.reset}`);
log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);

results.forEach((result, index) => {
  const status = result.success ? 
    `${colors.green}✅ PASSED${colors.reset}` : 
    `${colors.red}❌ FAILED${colors.reset}`;
  
  log(`\n${index + 1}. ${result.description}`);
  log(`   Status: ${status}`);
  log(`   Command: ${colors.blue}${result.command}${colors.reset}`);
  
  if (!result.success && result.error) {
    log(`   Error: ${colors.red}${result.error}${colors.reset}`);
  }
});

// Exit with appropriate code
process.exit(passedTests === totalTests ? 0 : 1);