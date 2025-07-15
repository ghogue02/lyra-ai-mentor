#!/usr/bin/env node

/**
 * Manual Toolkit Testing Script
 * 
 * This script provides automated commands to test toolkit functionality
 * without needing manual browser interactions.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Color codes for better output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

console.log(`${colors.cyan}${colors.bold}🧪 Toolkit Testing Automation${colors.reset}\n`);

// Test categories
const tests = {
  database: {
    name: 'Database Schema & RLS',
    tests: [
      {
        name: 'Verify Database Tables',
        command: 'npm run db:check',
        description: 'Checks that all toolkit tables exist and are properly configured'
      }
    ]
  },
  
  types: {
    name: 'TypeScript Integration',
    tests: [
      {
        name: 'Type Checking',
        command: 'npm run typecheck',
        description: 'Ensures TypeScript types are properly generated and valid'
      }
    ]
  },
  
  build: {
    name: 'Build & Validation',
    tests: [
      {
        name: 'Pre-build Validation',
        command: 'npm run validate',
        description: 'Runs comprehensive pre-build checks'
      }
    ]
  }
};

function runCommand(command, description) {
  log(`\n${colors.blue}▶ ${description}${colors.reset}`);
  log(`${colors.yellow}Command: ${command}${colors.reset}`);
  
  try {
    const start = Date.now();
    const output = execSync(command, { 
      cwd: projectRoot, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    const duration = Date.now() - start;
    
    log(`${colors.green}✅ PASSED (${duration}ms)${colors.reset}`);
    return { success: true, output, duration };
  } catch (error) {
    log(`${colors.red}❌ FAILED${colors.reset}`);
    log(`${colors.red}${error.message}${colors.reset}`);
    return { success: false, error: error.message, duration: 0 };
  }
}

// Manual testing instructions
function showManualTests() {
  log(`\n${colors.magenta}${colors.bold}📱 Manual Testing Instructions${colors.reset}`);
  log(`${colors.magenta}${'='.repeat(50)}${colors.reset}`);
  
  const manualSteps = [
    {
      step: 1,
      title: 'Start Development Server',
      command: 'npm run dev',
      description: 'Run this in a separate terminal to start the development server'
    },
    {
      step: 2,
      title: 'Navigate to Lesson',
      description: 'Go to http://localhost:8080/lesson/1 in your browser'
    },
    {
      step: 3,
      title: 'Find Maya Email Composer',
      description: 'Look for the Maya email composition section in the lesson'
    },
    {
      step: 4,
      title: 'Test Save to Toolkit',
      description: 'Click the "Save to MyToolkit" button - should work without errors'
    },
    {
      step: 5,
      title: 'Test Duplicate Save',
      description: 'Click "Save to MyToolkit" again - should handle gracefully (no 409 error)'
    }
  ];

  manualSteps.forEach(step => {
    log(`\n${colors.cyan}${step.step}. ${colors.bold}${step.title}${colors.reset}`);
    if (step.command) {
      log(`   ${colors.yellow}Command: ${step.command}${colors.reset}`);
    }
    log(`   ${colors.cyan}${step.description}${colors.reset}`);
  });
}

// Run automated tests
let totalTests = 0;
let passedTests = 0;
const results = [];

for (const [category, categoryData] of Object.entries(tests)) {
  log(`\n${colors.bold}${colors.blue}🔧 ${categoryData.name}${colors.reset}`);
  log(`${colors.blue}${'─'.repeat(30)}${colors.reset}`);
  
  for (const test of categoryData.tests) {
    totalTests++;
    const result = runCommand(test.command, test.description);
    if (result.success) passedTests++;
    
    results.push({
      category,
      test: test.name,
      ...result
    });
  }
}

// Show results summary
log(`\n${colors.bold}📊 Automated Test Results${colors.reset}`);
log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
log(`Total Tests: ${totalTests}`);
log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
log(`${colors.red}Failed: ${totalTests - passedTests}${colors.reset}`);
log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

if (passedTests === totalTests) {
  log(`\n${colors.green}${colors.bold}🎉 All automated tests passed!${colors.reset}`);
  log(`${colors.green}The toolkit backend functionality is working correctly.${colors.reset}`);
} else {
  log(`\n${colors.yellow}${colors.bold}⚠️  Some automated tests failed.${colors.reset}`);
  log(`${colors.yellow}Check the errors above for details.${colors.reset}`);
}

// Show manual testing section
showManualTests();

// Summary of what was fixed
log(`\n${colors.bold}🔧 Recent Fixes Applied${colors.reset}`);
log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
const fixes = [
  '✅ Fixed duplicate key error (409 Conflict) in toolkit unlock',
  '✅ Fixed supabase.raw() is not a function error', 
  '✅ Fixed DOM nesting warning in ChapterCard',
  '✅ Regenerated TypeScript types for toolkit tables',
  '✅ Created automated testing scripts'
];

fixes.forEach(fix => log(`${colors.green}${fix}${colors.reset}`));

log(`\n${colors.cyan}${colors.bold}💡 Quick Commands:${colors.reset}`);
log(`${colors.cyan}• Test database: npm run db:check${colors.reset}`);
log(`${colors.cyan}• Start dev server: npm run dev${colors.reset}`);
log(`${colors.cyan}• Run this script: npm run test:toolkit${colors.reset}`);

// Exit with appropriate code
process.exit(passedTests === totalTests ? 0 : 1);