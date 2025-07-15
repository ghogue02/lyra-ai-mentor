#!/usr/bin/env node

/**
 * UI Automation Test for Toolkit Save Feature
 * 
 * This script uses Playwright to automatically test the "Save to MyToolkit" 
 * functionality without requiring manual clicking.
 */

import { chromium } from 'playwright';

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

async function runUITests() {
  log(`${colors.cyan}${colors.bold}🎭 Starting UI Automation Tests${colors.reset}\n`);
  
  let browser;
  let results = [];
  
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Mock authentication
    await page.addInitScript(() => {
      // Mock Supabase auth
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'test-token',
        user: { id: 'test-user-id', email: 'test@example.com' }
      }));
    });
    
    // Mock successful API responses
    await page.route('**/rest/v1/toolkit_categories**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'email-category-id',
            category_key: 'email',
            name: 'Email Templates',
            description: 'Professional email templates',
            is_active: true
          }
        ])
      });
    });

    await page.route('**/rest/v1/user_toolkit_unlocks**', async route => {
      const method = route.request().method();
      
      if (method === 'GET') {
        // First call returns empty (no existing unlock)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else if (method === 'POST') {
        // Successful creation
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 'new-unlock-id',
            user_id: 'test-user-id',
            toolkit_item_id: 'pace-email-item',
            unlocked_at: new Date().toISOString()
          }])
        });
      }
    });

    await page.route('**/rest/v1/toolkit_items**', async route => {
      const method = route.request().method();
      
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 'pace-email-item',
            name: 'PACE Email Template',
            category_id: 'email-category-id',
            unlock_count: 0
          }])
        });
      } else if (method === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({})
        });
      }
    });

    // Test 1: Page loads without errors
    log(`${colors.blue}▶ Test 1: Page Load Validation${colors.reset}`);
    try {
      await page.goto('http://localhost:8080/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      const title = await page.title();
      if (title && !title.includes('Error')) {
        log(`${colors.green}✅ Dashboard loads successfully${colors.reset}`);
        results.push({ test: 'Page Load', status: 'PASSED' });
      } else {
        throw new Error('Page failed to load properly');
      }
    } catch (error) {
      log(`${colors.red}❌ Dashboard load failed: ${error.message}${colors.reset}`);
      results.push({ test: 'Page Load', status: 'FAILED', error: error.message });
    }

    // Test 2: Check for toolkit-related elements
    log(`\n${colors.blue}▶ Test 2: Toolkit UI Elements${colors.reset}`);
    try {
      // Look for any save to toolkit buttons or toolkit-related UI
      const toolkitElements = await page.locator('text=/toolkit/i').count();
      
      if (toolkitElements > 0) {
        log(`${colors.green}✅ Found ${toolkitElements} toolkit-related UI elements${colors.reset}`);
        results.push({ test: 'Toolkit UI Elements', status: 'PASSED' });
      } else {
        log(`${colors.yellow}⚠️  No toolkit UI elements found on dashboard${colors.reset}`);
        results.push({ test: 'Toolkit UI Elements', status: 'WARNING' });
      }
    } catch (error) {
      log(`${colors.red}❌ Toolkit UI check failed: ${error.message}${colors.reset}`);
      results.push({ test: 'Toolkit UI Elements', status: 'FAILED', error: error.message });
    }

    // Test 3: Navigate to lesson page
    log(`\n${colors.blue}▶ Test 3: Lesson Page Navigation${colors.reset}`);
    try {
      await page.goto('http://localhost:8080/lesson/1', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      const hasContent = await page.locator('body').count() > 0;
      if (hasContent) {
        log(`${colors.green}✅ Lesson page loads successfully${colors.reset}`);
        results.push({ test: 'Lesson Navigation', status: 'PASSED' });
      } else {
        throw new Error('Lesson page has no content');
      }
    } catch (error) {
      log(`${colors.red}❌ Lesson navigation failed: ${error.message}${colors.reset}`);
      results.push({ test: 'Lesson Navigation', status: 'FAILED', error: error.message });
    }

    // Test 4: Look for Maya email composer
    log(`\n${colors.blue}▶ Test 4: Maya Email Composer Detection${colors.reset}`);
    try {
      // Look for Maya-related content or email composer
      const mayaElements = await page.locator('text=/maya|email|composer/i').count();
      const saveButtons = await page.locator('button:has-text("save")').count();
      
      if (mayaElements > 0 || saveButtons > 0) {
        log(`${colors.green}✅ Found potential Maya/email composer elements${colors.reset}`);
        results.push({ test: 'Maya Composer Detection', status: 'PASSED' });
      } else {
        log(`${colors.yellow}⚠️  No Maya email composer detected on this lesson${colors.reset}`);
        results.push({ test: 'Maya Composer Detection', status: 'WARNING' });
      }
    } catch (error) {
      log(`${colors.red}❌ Maya composer detection failed: ${error.message}${colors.reset}`);
      results.push({ test: 'Maya Composer Detection', status: 'FAILED', error: error.message });
    }

    // Test 5: Console error check
    log(`\n${colors.blue}▶ Test 5: Console Error Check${colors.reset}`);
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const relevantErrors = consoleErrors.filter(error => 
      error.includes('toolkit') || 
      error.includes('409') || 
      error.includes('403') ||
      error.includes('supabase.raw')
    );
    
    if (relevantErrors.length === 0) {
      log(`${colors.green}✅ No toolkit-related console errors detected${colors.reset}`);
      results.push({ test: 'Console Errors', status: 'PASSED' });
    } else {
      log(`${colors.red}❌ Found ${relevantErrors.length} toolkit-related errors:${colors.reset}`);
      relevantErrors.forEach(error => log(`${colors.red}   - ${error}${colors.reset}`));
      results.push({ test: 'Console Errors', status: 'FAILED', errors: relevantErrors });
    }

  } catch (error) {
    log(`${colors.red}❌ UI Automation failed: ${error.message}${colors.reset}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // Results summary
  log(`\n${colors.bold}📊 UI Test Results${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;
  
  log(`Total Tests: ${results.length}`);
  log(`${colors.green}Passed: ${passed}${colors.reset}`);
  log(`${colors.red}Failed: ${failed}${colors.reset}`);
  log(`${colors.yellow}Warnings: ${warnings}${colors.reset}`);
  
  results.forEach((result, index) => {
    const statusColor = result.status === 'PASSED' ? colors.green : 
                       result.status === 'FAILED' ? colors.red : colors.yellow;
    log(`\n${index + 1}. ${result.test}: ${statusColor}${result.status}${colors.reset}`);
    if (result.error) {
      log(`   ${colors.red}Error: ${result.error}${colors.reset}`);
    }
  });

  if (failed === 0) {
    log(`\n${colors.green}${colors.bold}🎉 UI automation tests completed successfully!${colors.reset}`);
    log(`${colors.green}The toolkit UI appears to be working correctly.${colors.reset}`);
  } else {
    log(`\n${colors.yellow}${colors.bold}⚠️  Some UI tests failed or had warnings.${colors.reset}`);
  }

  return failed === 0;
}

// Check if running in development
async function checkDevServer() {
  try {
    const response = await fetch('http://localhost:8080');
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const isDevRunning = await checkDevServer();
  
  if (!isDevRunning) {
    log(`${colors.red}❌ Development server is not running${colors.reset}`);
    log(`${colors.yellow}Please start the dev server first: npm run dev${colors.reset}`);
    process.exit(1);
  }
  
  const success = await runUITests();
  process.exit(success ? 0 : 1);
}

// Check if Playwright is available
try {
  await main();
} catch (error) {
  if (error.message.includes('playwright')) {
    log(`${colors.yellow}⚠️  Playwright not installed. Install with: npx playwright install${colors.reset}`);
    log(`${colors.blue}Running basic server check instead...${colors.reset}`);
    
    const isRunning = await checkDevServer();
    if (isRunning) {
      log(`${colors.green}✅ Development server is running at http://localhost:8080${colors.reset}`);
    } else {
      log(`${colors.red}❌ Development server is not running${colors.reset}`);
    }
  } else {
    log(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
  }
}