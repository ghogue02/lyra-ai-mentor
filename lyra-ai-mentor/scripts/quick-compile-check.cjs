#!/usr/bin/env node

/**
 * Quick Compile Check - Fast automated testing for critical errors
 * Focus on compilation and build errors that block development
 */

const { execSync } = require('child_process');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log('green', `✓ ${description} passed`);
    return true;
  } catch (error) {
    log('red', `✗ ${description} failed`);
    if (error.stdout) {
      console.log(error.stdout.split('\n').slice(0, 5).join('\n')); // Show first 5 lines of error
    }
    return false;
  }
}

async function quickCheck() {
  console.log(`${colors.bold}${colors.blue}⚡ Quick Compile Check${colors.reset}\n`);
  
  let allPassed = true;
  
  // TypeScript compilation check
  log('blue', 'Checking TypeScript compilation...');
  if (!runCommand('npx tsc --noEmit --skipLibCheck', 'TypeScript compilation')) {
    allPassed = false;
  }
  
  // Build test (quick)
  log('blue', 'Testing build process...');
  if (!runCommand('vite build', 'Build process')) {
    allPassed = false;
  }
  
  console.log(`\n${colors.bold}${'='.repeat(40)}${colors.reset}`);
  if (allPassed) {
    log('green', `${colors.bold}✅ QUICK CHECK PASSED!${colors.reset}`);
    process.exit(0);
  } else {
    log('red', `${colors.bold}❌ QUICK CHECK FAILED!${colors.reset}`);
    process.exit(1);
  }
}

// Run the quick check
quickCheck().catch(error => {
  log('red', `Fatal error: ${error.message}`);
  process.exit(1);
});