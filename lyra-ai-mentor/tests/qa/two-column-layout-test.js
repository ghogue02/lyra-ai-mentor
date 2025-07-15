/**
 * QA Test Script for Two-Column Layout
 * Tests across mobile (375px), tablet (768px), and desktop (1200px+) viewports
 * 
 * Test Date: ${new Date().toISOString()}
 * Component: LyraNarratedMayaSideBySideComplete
 */

import { chromium } from 'playwright';

const TEST_URL = 'http://localhost:5173/maya-sidebyside-complete'; // Adjust URL as needed
const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 667, device: 'iPhone SE' },
  { name: 'Tablet', width: 768, height: 1024, device: 'iPad Mini' },
  { name: 'Desktop', width: 1200, height: 800, device: 'Desktop' },
  { name: 'Wide Desktop', width: 1920, height: 1080, device: 'Full HD' }
];

const TEST_RESULTS = {
  testDate: new Date().toISOString(),
  component: 'LyraNarratedMayaSideBySideComplete',
  results: []
};

async function testLayoutAtViewport(page, viewport) {
  console.log(`\nTesting ${viewport.name} (${viewport.width}x${viewport.height})`);
  
  const result = {
    viewport: viewport,
    tests: [],
    screenshots: [],
    passed: true
  };
  
  // Set viewport
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.waitForTimeout(500); // Allow layout to settle
  
  // Test 1: Check if main container exists
  const mainContainer = await page.$('.min-h-screen.bg-\\[\\#FAF9F7\\]');
  result.tests.push({
    name: 'Main container exists',
    passed: !!mainContainer,
    details: mainContainer ? 'Main container found' : 'Main container not found'
  });
  
  // Test 2: Check layout structure based on viewport
  if (viewport.width >= 1024) {
    // Desktop: Two-column layout
    
    // Check for left sidebar
    const leftSidebar = await page.$('.absolute.left-0.top-0.w-80.h-full');
    const sidebarVisible = leftSidebar ? await leftSidebar.isVisible() : false;
    result.tests.push({
      name: 'Desktop: Left sidebar visible',
      passed: sidebarVisible,
      details: sidebarVisible ? 'Sidebar is visible and positioned correctly' : 'Sidebar not visible or positioned incorrectly'
    });
    
    // Check main content margin
    const mainContent = await page.$('main.ml-80');
    const hasCorrectMargin = !!mainContent;
    result.tests.push({
      name: 'Desktop: Main content has left margin',
      passed: hasCorrectMargin,
      details: hasCorrectMargin ? 'Main content has ml-80 class for sidebar spacing' : 'Main content missing left margin'
    });
    
    // Check for no overlap
    if (leftSidebar && mainContent) {
      const sidebarBox = await leftSidebar.boundingBox();
      const mainBox = await mainContent.boundingBox();
      const noOverlap = sidebarBox && mainBox && (sidebarBox.x + sidebarBox.width <= mainBox.x);
      result.tests.push({
        name: 'Desktop: No column overlap',
        passed: noOverlap,
        details: noOverlap ? 'Columns properly separated with no overlap' : 'Column overlap detected!'
      });
    }
    
  } else {
    // Mobile/Tablet: Single column with overlay panel
    
    // Check for mobile menu button
    const mobileMenuButton = await page.$('button[aria-label="Toggle navigation panel"]');
    const menuButtonVisible = mobileMenuButton ? await mobileMenuButton.isVisible() : false;
    result.tests.push({
      name: 'Mobile: Menu button visible',
      passed: menuButtonVisible,
      details: menuButtonVisible ? 'Mobile menu button is visible' : 'Mobile menu button not found'
    });
    
    // Check main content padding
    const mainContent = await page.$('main.pt-16');
    const hasPadding = !!mainContent;
    result.tests.push({
      name: 'Mobile: Main content has top padding',
      passed: hasPadding,
      details: hasPadding ? 'Main content has pt-16 for mobile menu space' : 'Main content missing top padding'
    });
    
    // Test mobile panel toggle
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
      
      const mobilePanel = await page.$('.fixed.inset-0.z-50');
      const panelVisible = mobilePanel ? await mobilePanel.isVisible() : false;
      result.tests.push({
        name: 'Mobile: Panel opens on menu click',
        passed: panelVisible,
        details: panelVisible ? 'Mobile panel opens correctly' : 'Mobile panel failed to open'
      });
      
      // Close panel
      const closeButton = await page.$('button[aria-label="Close journey panel"]');
      if (closeButton) {
        await closeButton.click();
        await page.waitForTimeout(300);
      }
    }
  }
  
  // Test 3: Check content visibility and scrollability
  const lyraAvatar = await page.$('.flex.items-center.gap-3 img');
  const avatarVisible = lyraAvatar ? await lyraAvatar.isVisible() : false;
  result.tests.push({
    name: 'Lyra avatar visible',
    passed: avatarVisible,
    details: avatarVisible ? 'Lyra avatar is visible in header' : 'Lyra avatar not visible'
  });
  
  // Test 4: Check responsive text sizing
  const headerTitle = await page.$('h1');
  if (headerTitle) {
    const hasResponsiveClass = viewport.width < 768 
      ? await headerTitle.evaluate(el => el.classList.contains('text-base'))
      : await headerTitle.evaluate(el => el.classList.contains('text-lg'));
    result.tests.push({
      name: 'Responsive text sizing',
      passed: hasResponsiveClass,
      details: hasResponsiveClass ? 'Text size adjusts correctly for viewport' : 'Text sizing not responsive'
    });
  }
  
  // Test 5: Check overflow handling
  const mainScroll = await page.$('main');
  if (mainScroll) {
    const overflowClass = await mainScroll.evaluate(el => el.classList.contains('overflow-hidden'));
    result.tests.push({
      name: 'Overflow handling',
      passed: overflowClass,
      details: overflowClass ? 'Main content has overflow-hidden class' : 'Missing overflow handling'
    });
  }
  
  // Take screenshot
  const screenshotPath = `./screenshots/layout-test-${viewport.name.toLowerCase().replace(' ', '-')}-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: false });
  result.screenshots.push(screenshotPath);
  
  // Calculate overall pass status
  result.passed = result.tests.every(test => test.passed);
  
  return result;
}

async function runLayoutTests() {
  console.log('Starting Two-Column Layout QA Tests...');
  console.log('================================\n');
  
  const browser = await chromium.launch({ headless: false }); // Set to true for CI/CD
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the component
    await page.goto(TEST_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for initial render
    
    // Run tests for each viewport
    for (const viewport of VIEWPORTS) {
      const result = await testLayoutAtViewport(page, viewport);
      TEST_RESULTS.results.push(result);
    }
    
    // Additional cross-viewport tests
    console.log('\nRunning cross-viewport tests...');
    
    // Test viewport transition (Desktop to Mobile)
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const transitionTest = {
      name: 'Viewport transition test',
      passed: true,
      details: 'Layout transitions smoothly between viewports'
    };
    
    try {
      const mobileMenu = await page.$('button[aria-label="Toggle navigation panel"]');
      if (!mobileMenu || !(await mobileMenu.isVisible())) {
        transitionTest.passed = false;
        transitionTest.details = 'Mobile menu not visible after transition';
      }
    } catch (error) {
      transitionTest.passed = false;
      transitionTest.details = `Transition error: ${error.message}`;
    }
    
    TEST_RESULTS.crossViewportTests = [transitionTest];
    
  } catch (error) {
    console.error('Test execution error:', error);
    TEST_RESULTS.error = error.message;
  } finally {
    await browser.close();
  }
  
  // Generate summary
  generateTestSummary();
  
  return TEST_RESULTS;
}

function generateTestSummary() {
  console.log('\n================================');
  console.log('TEST SUMMARY');
  console.log('================================\n');
  
  let totalTests = 0;
  let passedTests = 0;
  
  TEST_RESULTS.results.forEach(viewportResult => {
    console.log(`\n${viewportResult.viewport.name} (${viewportResult.viewport.width}x${viewportResult.viewport.height})`);
    console.log('-'.repeat(40));
    
    viewportResult.tests.forEach(test => {
      totalTests++;
      if (test.passed) passedTests++;
      
      const status = test.passed ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
      if (!test.passed) {
        console.log(`   └─ ${test.details}`);
      }
    });
    
    console.log(`Overall: ${viewportResult.passed ? 'PASSED' : 'FAILED'}`);
  });
  
  // Cross-viewport tests
  if (TEST_RESULTS.crossViewportTests) {
    console.log('\nCross-Viewport Tests');
    console.log('-'.repeat(40));
    TEST_RESULTS.crossViewportTests.forEach(test => {
      totalTests++;
      if (test.passed) passedTests++;
      const status = test.passed ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
    });
  }
  
  console.log('\n================================');
  console.log(`TOTAL: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests * 100)}%)`);
  console.log('================================\n');
  
  TEST_RESULTS.summary = {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    passRate: Math.round(passedTests/totalTests * 100)
  };
}

// Export for use in other test runners
export { runLayoutTests, TEST_RESULTS };

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runLayoutTests().then(results => {
    console.log('\nTest results saved to memory.');
    process.exit(results.summary.failedTests > 0 ? 1 : 0);
  });
}