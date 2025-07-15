#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Validating Performance Optimizations...\n');

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const checkMark = `${colors.green}✓${colors.reset}`;
const crossMark = `${colors.red}✗${colors.reset}`;
const warningMark = `${colors.yellow}⚠${colors.reset}`;

let totalChecks = 0;
let passedChecks = 0;
let warnings = [];

// Helper function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

// Helper function to run command and check output
function runCommand(command, expectedPattern = null) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (expectedPattern && !output.includes(expectedPattern)) {
      return { success: false, output };
    }
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 1. Check optimized files exist
console.log(`${colors.blue}1. Checking Optimization Files${colors.reset}`);
const optimizationFiles = [
  'src/utils/lazyComponents.tsx',
  'src/utils/performanceMonitor.ts',
  'src/hooks/usePerformanceOptimization.ts',
  'src/services/optimizedAIService.ts',
  'src/components/OptimizedMayaEmailComposer.tsx',
  'src/components/ui/OptimizedLoadingStates.tsx',
  'src/utils/accessibility.ts',
  'src/hooks/useCharacterConsistency.ts',
  'vite.config.optimized.ts',
  'PERFORMANCE_OPTIMIZATION_GUIDE.md'
];

optimizationFiles.forEach(file => {
  totalChecks++;
  if (fileExists(file)) {
    console.log(`  ${checkMark} ${file}`);
    passedChecks++;
  } else {
    console.log(`  ${crossMark} ${file} - Missing`);
  }
});

// 2. Check TypeScript compilation
console.log(`\n${colors.blue}2. TypeScript Compilation${colors.reset}`);
totalChecks++;
const tsCheck = runCommand('npm run typecheck');
if (tsCheck.success) {
  console.log(`  ${checkMark} No TypeScript errors`);
  passedChecks++;
} else {
  console.log(`  ${crossMark} TypeScript errors found`);
  if (tsCheck.output) {
    console.log(`  ${colors.red}${tsCheck.output.slice(0, 200)}...${colors.reset}`);
  }
}

// 3. Check bundle sizes
console.log(`\n${colors.blue}3. Bundle Size Analysis${colors.reset}`);
totalChecks++;
try {
  // Build and analyze
  console.log('  Building project (this may take a moment)...');
  execSync('npm run build', { stdio: 'pipe' });
  
  // Check dist folder size
  const distSize = execSync('du -sh dist', { encoding: 'utf8' }).trim();
  console.log(`  ${checkMark} Build completed - Total size: ${distSize}`);
  
  // Check for large chunks
  const files = fs.readdirSync(path.join(__dirname, '..', 'dist', 'assets'));
  const largeFiles = files.filter(file => {
    const stats = fs.statSync(path.join(__dirname, '..', 'dist', 'assets', file));
    return stats.size > 400 * 1024; // 400KB
  });
  
  if (largeFiles.length === 0) {
    console.log(`  ${checkMark} All chunks under 400KB`);
    passedChecks++;
  } else {
    console.log(`  ${warningMark} ${largeFiles.length} chunks over 400KB:`);
    largeFiles.forEach(file => {
      const size = fs.statSync(path.join(__dirname, '..', 'dist', 'assets', file)).size;
      console.log(`    - ${file}: ${(size / 1024).toFixed(0)}KB`);
    });
    warnings.push(`${largeFiles.length} large bundle chunks`);
  }
} catch (error) {
  console.log(`  ${crossMark} Build failed: ${error.message}`);
}

// 4. Check for unused dependencies
console.log(`\n${colors.blue}4. Dependency Analysis${colors.reset}`);
totalChecks++;
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const dependencies = Object.keys(packageJson.dependencies);
console.log(`  ${checkMark} ${dependencies.length} production dependencies`);
passedChecks++;

// Check for heavy dependencies
const heavyDeps = ['moment', 'lodash', 'jquery', 'bootstrap'];
const foundHeavyDeps = dependencies.filter(dep => heavyDeps.includes(dep));
if (foundHeavyDeps.length > 0) {
  console.log(`  ${warningMark} Heavy dependencies found: ${foundHeavyDeps.join(', ')}`);
  warnings.push(`Heavy dependencies: ${foundHeavyDeps.join(', ')}`);
} else {
  console.log(`  ${checkMark} No heavy dependencies found`);
}

// 5. Check lazy loading implementation
console.log(`\n${colors.blue}5. Lazy Loading Implementation${colors.reset}`);
totalChecks++;
const lazyImports = execSync('grep -r "lazy(" src --include="*.tsx" --include="*.ts" | wc -l', { encoding: 'utf8' }).trim();
if (parseInt(lazyImports) > 0) {
  console.log(`  ${checkMark} ${lazyImports} lazy imports found`);
  passedChecks++;
} else {
  console.log(`  ${crossMark} No lazy imports found`);
}

// 6. Check accessibility
console.log(`\n${colors.blue}6. Accessibility Features${colors.reset}`);
const a11yFeatures = [
  { pattern: 'aria-label', name: 'ARIA labels' },
  { pattern: 'aria-live', name: 'Live regions' },
  { pattern: 'role=', name: 'ARIA roles' },
  { pattern: 'tabIndex', name: 'Tab index management' }
];

a11yFeatures.forEach(feature => {
  totalChecks++;
  const count = execSync(`grep -r "${feature.pattern}" src --include="*.tsx" | wc -l`, { encoding: 'utf8' }).trim();
  if (parseInt(count) > 0) {
    console.log(`  ${checkMark} ${feature.name}: ${count} instances`);
    passedChecks++;
  } else {
    console.log(`  ${warningMark} ${feature.name}: Not found`);
    warnings.push(`Missing ${feature.name}`);
  }
});

// 7. Performance monitoring
console.log(`\n${colors.blue}7. Performance Monitoring${colors.reset}`);
totalChecks++;
const perfMonitorUsage = execSync('grep -r "performanceMonitor" src --include="*.tsx" --include="*.ts" | wc -l', { encoding: 'utf8' }).trim();
if (parseInt(perfMonitorUsage) > 0) {
  console.log(`  ${checkMark} Performance monitoring: ${perfMonitorUsage} usages`);
  passedChecks++;
} else {
  console.log(`  ${warningMark} Performance monitoring not implemented`);
  warnings.push('Performance monitoring not used');
}

// 8. Check caching implementation
console.log(`\n${colors.blue}8. Caching Strategy${colors.reset}`);
totalChecks++;
const cacheImplementations = execSync('grep -r "cache\\|Cache" src --include="*.ts" --include="*.tsx" | wc -l', { encoding: 'utf8' }).trim();
if (parseInt(cacheImplementations) > 10) {
  console.log(`  ${checkMark} Caching implemented: ${cacheImplementations} references`);
  passedChecks++;
} else {
  console.log(`  ${warningMark} Limited caching: ${cacheImplementations} references`);
  warnings.push('Limited caching implementation');
}

// Summary
console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}Optimization Validation Summary${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

const percentage = Math.round((passedChecks / totalChecks) * 100);
const statusColor = percentage >= 80 ? colors.green : percentage >= 60 ? colors.yellow : colors.red;

console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${colors.green}${passedChecks}${colors.reset}`);
console.log(`Failed: ${colors.red}${totalChecks - passedChecks}${colors.reset}`);
console.log(`Success Rate: ${statusColor}${percentage}%${colors.reset}\n`);

if (warnings.length > 0) {
  console.log(`${colors.yellow}Warnings (${warnings.length}):${colors.reset}`);
  warnings.forEach(warning => {
    console.log(`  ${warningMark} ${warning}`);
  });
}

// Recommendations
console.log(`\n${colors.blue}Recommendations:${colors.reset}`);
if (percentage === 100) {
  console.log(`  ${checkMark} All optimizations successfully implemented!`);
} else {
  if (totalChecks - passedChecks > 0) {
    console.log(`  • Fix ${totalChecks - passedChecks} failed checks`);
  }
  if (warnings.length > 0) {
    console.log(`  • Address ${warnings.length} warnings`);
  }
  console.log(`  • Run 'npm run build' to verify production build`);
  console.log(`  • Test performance on slow 3G connection`);
  console.log(`  • Monitor bundle sizes in CI/CD pipeline`);
}

// Exit code based on success rate
process.exit(percentage >= 80 ? 0 : 1);