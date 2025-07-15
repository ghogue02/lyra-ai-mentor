#!/usr/bin/env node

/**
 * Automated Layout Code Verification
 * Analyzes the two-column layout implementation without running the app
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_RESULTS = {
  timestamp: new Date().toISOString(),
  component: 'LyraNarratedMayaSideBySideComplete',
  codeAnalysis: {
    responsive: [],
    layout: [],
    overlap: [],
    accessibility: []
  },
  cssAnalysis: {
    mediaQueries: [],
    flexbox: [],
    positioning: [],
    overflow: []
  },
  summary: {
    totalChecks: 0,
    passed: 0,
    warnings: 0,
    failed: 0
  }
};

// Component file path
const COMPONENT_PATH = path.join(__dirname, '../../src/components/lesson/chat/lyra/LyraNarratedMayaSideBySideComplete.tsx');
const CSS_PATH = path.join(__dirname, '../../src/styles/maya-journey-layout.css');

function analyzeComponent() {
  console.log('🔍 Analyzing Component Implementation...\n');
  
  try {
    const componentCode = fs.readFileSync(COMPONENT_PATH, 'utf8');
    
    // Check 1: Mobile Detection
    const hasMobileDetection = componentCode.includes('useState<boolean>(false)') && 
                              componentCode.includes('window.innerWidth < 1024');
    addResult('responsive', 'Mobile detection implemented', hasMobileDetection);
    
    // Check 2: Responsive Classes
    const responsivePatterns = [
      { pattern: /isMobile\s*\?\s*["'].*["']\s*:\s*["'].*["']/, name: 'Conditional mobile classes' },
      { pattern: /lg:hidden/, name: 'Large screen hiding' },
      { pattern: /fixed.*z-50.*lg:hidden/, name: 'Mobile menu button positioning' }
    ];
    
    responsivePatterns.forEach(({ pattern, name }) => {
      const found = pattern.test(componentCode);
      addResult('responsive', name, found);
    });
    
    // Check 3: Layout Structure
    const layoutPatterns = [
      { pattern: /absolute.*left-0.*top-0.*w-80.*h-full/, name: 'Desktop sidebar positioning' },
      { pattern: /ml-80/, name: 'Main content margin for sidebar' },
      { pattern: /fixed.*inset-0.*z-50/, name: 'Mobile panel overlay' }
    ];
    
    layoutPatterns.forEach(({ pattern, name }) => {
      const found = pattern.test(componentCode);
      addResult('layout', name, found);
    });
    
    // Check 4: Overlap Prevention
    const overlapChecks = [
      { pattern: /overflow-hidden/, name: 'Overflow hidden on containers' },
      { pattern: /z-\d+/, name: 'Z-index layering' },
      { pattern: /min-w-0/, name: 'Flexbox min-width fix' }
    ];
    
    overlapChecks.forEach(({ pattern, name }) => {
      const found = pattern.test(componentCode);
      addResult('overlap', name, found);
    });
    
    // Check 5: Accessibility
    const a11yPatterns = [
      { pattern: /aria-label/, name: 'ARIA labels present' },
      { pattern: /role=["'](navigation|main|banner)/, name: 'Landmark roles' },
      { pattern: /<SkipLink/, name: 'Skip link component' },
      { pattern: /tabIndex/, name: 'Tab index management' }
    ];
    
    a11yPatterns.forEach(({ pattern, name }) => {
      const found = pattern.test(componentCode);
      addResult('accessibility', name, found);
    });
    
  } catch (error) {
    console.error('❌ Error reading component file:', error.message);
    TEST_RESULTS.codeAnalysis.error = error.message;
  }
}

function analyzeCSS() {
  console.log('\n🎨 Analyzing CSS Implementation...\n');
  
  try {
    const cssCode = fs.readFileSync(CSS_PATH, 'utf8');
    
    // Check 1: Media Queries
    const mediaQueries = cssCode.match(/@media[^{]+/g) || [];
    mediaQueries.forEach(query => {
      const isValid = query.includes('1024px') || query.includes('1023px');
      addResult('mediaQueries', `Media query: ${query.trim()}`, isValid, isValid ? null : 'Non-standard breakpoint');
    });
    
    // Check 2: Flexbox Layout
    const flexPatterns = [
      { pattern: /\.maya-journey-sidebar\s*{[^}]*width:\s*20rem/, name: 'Sidebar fixed width (20rem)' },
      { pattern: /\.maya-journey-main\s*{[^}]*flex:\s*1/, name: 'Main content flex grow' },
      { pattern: /min-width:\s*0/, name: 'Flex overflow prevention' }
    ];
    
    flexPatterns.forEach(({ pattern, name }) => {
      const found = pattern.test(cssCode);
      addResult('flexbox', name, found);
    });
    
    // Check 3: Positioning
    const positionPatterns = [
      { pattern: /position:\s*fixed/, name: 'Fixed positioning for mobile' },
      { pattern: /z-index:\s*\d+/, name: 'Z-index layering' },
      { pattern: /inset:\s*0/, name: 'Full screen overlays' }
    ];
    
    positionPatterns.forEach(({ pattern, name }) => {
      const found = pattern.test(cssCode);
      addResult('positioning', name, found);
    });
    
    // Check 4: Overflow Handling
    const overflowPatterns = [
      { pattern: /overflow-[xy]:\s*(auto|hidden|scroll)/, name: 'Overflow control' },
      { pattern: /scrollbar-gutter:\s*stable/, name: 'Scrollbar space reservation' }
    ];
    
    overflowPatterns.forEach(({ pattern, name }) => {
      const found = pattern.test(cssCode);
      addResult('overflow', name, found);
    });
    
  } catch (error) {
    console.error('❌ Error reading CSS file:', error.message);
    TEST_RESULTS.cssAnalysis.error = error.message;
  }
}

function addResult(category, check, passed, warning = null) {
  TEST_RESULTS.summary.totalChecks++;
  
  const result = {
    check,
    passed,
    warning,
    timestamp: new Date().toISOString()
  };
  
  if (TEST_RESULTS.codeAnalysis[category]) {
    TEST_RESULTS.codeAnalysis[category].push(result);
  } else if (TEST_RESULTS.cssAnalysis[category]) {
    TEST_RESULTS.cssAnalysis[category].push(result);
  }
  
  if (passed && !warning) {
    TEST_RESULTS.summary.passed++;
    console.log(`✅ ${check}`);
  } else if (passed && warning) {
    TEST_RESULTS.summary.warnings++;
    console.log(`⚠️  ${check} (${warning})`);
  } else {
    TEST_RESULTS.summary.failed++;
    console.log(`❌ ${check}`);
  }
}

function generateReport() {
  console.log('\n📊 Test Report Summary');
  console.log('='.repeat(50));
  
  const { totalChecks, passed, warnings, failed } = TEST_RESULTS.summary;
  const passRate = Math.round((passed / totalChecks) * 100);
  
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Warnings: ${warnings} ⚠️`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Pass Rate: ${passRate}%`);
  
  console.log('\n📋 Layout Implementation Analysis:');
  console.log('-'.repeat(50));
  
  // Key findings
  const findings = [];
  
  // Check responsive implementation
  const responsiveChecks = TEST_RESULTS.codeAnalysis.responsive;
  const hasResponsive = responsiveChecks.filter(r => r.passed).length >= 3;
  findings.push({
    area: 'Responsive Design',
    status: hasResponsive ? 'PASSED' : 'NEEDS ATTENTION',
    details: hasResponsive 
      ? 'Mobile detection and conditional rendering properly implemented'
      : 'Missing critical responsive features'
  });
  
  // Check layout structure
  const layoutChecks = TEST_RESULTS.codeAnalysis.layout;
  const hasProperLayout = layoutChecks.filter(r => r.passed).length >= 2;
  findings.push({
    area: 'Two-Column Layout',
    status: hasProperLayout ? 'PASSED' : 'NEEDS ATTENTION',
    details: hasProperLayout
      ? 'Desktop sidebar and mobile panel correctly positioned'
      : 'Layout positioning issues detected'
  });
  
  // Check overlap prevention
  const overlapChecks = TEST_RESULTS.codeAnalysis.overlap;
  const hasOverlapPrevention = overlapChecks.filter(r => r.passed).length >= 2;
  findings.push({
    area: 'Overlap Prevention',
    status: hasOverlapPrevention ? 'PASSED' : 'WARNING',
    details: hasOverlapPrevention
      ? 'Proper overflow handling and z-index management'
      : 'Potential overlap issues may occur'
  });
  
  findings.forEach(finding => {
    console.log(`\n${finding.area}: ${finding.status}`);
    console.log(`└─ ${finding.details}`);
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`OVERALL STATUS: ${passRate >= 80 ? 'PASSED ✅' : passRate >= 60 ? 'NEEDS IMPROVEMENT ⚠️' : 'FAILED ❌'}`);
  console.log('='.repeat(50));
  
  // Save detailed results
  const reportPath = path.join(__dirname, 'layout-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(TEST_RESULTS, null, 2));
  console.log(`\n📄 Detailed results saved to: ${reportPath}`);
  
  return TEST_RESULTS;
}

// Run the verification
console.log('🚀 Starting Two-Column Layout Code Verification\n');
console.log('Component:', COMPONENT_PATH.split('/').slice(-4).join('/'));
console.log('CSS:', CSS_PATH.split('/').slice(-3).join('/'));
console.log('='.repeat(50) + '\n');

analyzeComponent();
analyzeCSS();
const results = generateReport();

// Export for use in other scripts
export { results as TEST_RESULTS };

// Exit with appropriate code
process.exit(results.summary.failed > 0 ? 1 : 0);