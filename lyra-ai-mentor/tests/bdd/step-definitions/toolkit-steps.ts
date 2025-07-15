import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Test context
interface TestContext {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  supabase: SupabaseClient;
  testUser: { email: string; id: string; password: string };
  generatedEmail: {
    purpose: string;
    audience: string;
    framework: string;
    content: string;
    promptBuilder: any;
    dynamicPath: any;
  } | null;
  savedItemId: string | null;
  networkFailure: boolean;
  categories: Map<string, any>;
  toolkitItems: any[];
}

let world: TestContext;

// Setup and teardown
Before(async function () {
  // Initialize browser
  world.browser = await chromium.launch({ headless: true });
  world.context = await world.browser.newContext();
  world.page = await world.context.newPage();
  
  // Initialize Supabase client
  world.supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'http://localhost:54321',
    process.env.VITE_SUPABASE_ANON_KEY || 'test-key'
  );
  
  // Initialize test data
  world.generatedEmail = null;
  world.savedItemId = null;
  world.networkFailure = false;
  world.categories = new Map();
  world.toolkitItems = [];
  
  // Set up network interception
  await world.context.route('**/*', async (route) => {
    if (world.networkFailure && route.request().url().includes('/rest/v1/')) {
      await route.abort('failed');
    } else {
      await route.continue();
    }
  });
});

After(async function () {
  // Clean up test data
  if (world.testUser?.id) {
    await world.supabase
      .from('user_toolkit_unlocks')
      .delete()
      .eq('user_id', world.testUser.id);
      
    await world.supabase
      .from('user_toolkit_achievements')
      .delete()
      .eq('user_id', world.testUser.id);
  }
  
  // Clean up test toolkit items
  for (const item of world.toolkitItems) {
    await world.supabase
      .from('toolkit_items')
      .delete()
      .eq('id', item.id);
  }
  
  // Close browser
  await world.context.close();
  await world.browser.close();
});

// Background steps
Given('the toolkit categories are properly initialized', async function () {
  const requiredCategories = ['email', 'grants', 'data'];
  
  for (const categoryKey of requiredCategories) {
    const { data, error } = await world.supabase
      .from('toolkit_categories')
      .select('*')
      .eq('category_key', categoryKey)
      .single();
      
    if (!error && data) {
      world.categories.set(categoryKey, data);
    }
  }
  
  expect(world.categories.size).toBeGreaterThanOrEqual(3);
});

Given('the following categories exist:', async function (dataTable) {
  const categories = dataTable.hashes();
  
  for (const category of categories) {
    const { data } = await world.supabase
      .from('toolkit_categories')
      .select('*')
      .eq('category_key', category.category_key)
      .single();
      
    if (data) {
      world.categories.set(category.category_key, data);
    }
  }
});

// Authentication steps
Given('I am logged in as {string}', async function (email: string) {
  // Create or get test user
  const password = 'testpassword123';
  const { data: authData, error } = await world.supabase.auth.signUp({
    email,
    password,
  });
  
  if (authData?.user) {
    world.testUser = {
      email,
      id: authData.user.id,
      password,
    };
    
    // Set auth cookie in browser context
    await world.context.addCookies([{
      name: 'sb-auth-token',
      value: authData.session?.access_token || '',
      domain: 'localhost',
      path: '/',
    }]);
  }
});

Given('I am not logged in', async function () {
  await world.context.clearCookies();
  world.testUser = null;
});

// Email generation steps
Given('I have generated a PACE email with:', async function (dataTable) {
  const emailData = dataTable.rowsHash();
  
  world.generatedEmail = {
    purpose: emailData.purpose || 'solve_problems',
    audience: emailData.audience || 'Friend or Family Member',
    framework: emailData.framework || 'Empathy Bridge',
    content: emailData.content || 'I understand you\'re worried about...',
    promptBuilder: {
      purpose: `Purpose: ${emailData.purpose}`,
      audience: `Audience: ${emailData.audience}`,
      content: `Framework: ${emailData.framework}`,
      execute: 'Generate email',
    },
    dynamicPath: {
      purpose: emailData.purpose,
      audience: { label: emailData.audience },
      content: {
        name: emailData.framework,
        framework: {
          mayaFramework: { name: emailData.framework }
        }
      }
    }
  };
  
  // Navigate to the page and set the email state
  await world.page.goto('/lyra-maya-demo');
  await world.page.evaluate((email) => {
    window.localStorage.setItem('generatedEmail', JSON.stringify(email));
  }, world.generatedEmail);
});

Given('I have generated a PACE email for {string}', async function (purpose: string) {
  world.generatedEmail = {
    purpose: 'solve_problems',
    audience: 'Friend or Family Member',
    framework: 'Empathy Bridge',
    content: `Email content for: ${purpose}`,
    promptBuilder: {
      purpose: `Purpose: ${purpose}`,
      audience: 'Audience: Friend',
      content: 'Framework: Empathy',
      execute: 'Generate',
    },
    dynamicPath: {
      purpose: 'solve_problems',
      audience: { label: 'Friend or Family Member' },
      content: { name: 'Empathy Bridge' }
    }
  };
});

// Action steps
When('I click the {string} button', async function (buttonText: string) {
  const button = await world.page.locator(`button:has-text("${buttonText}")`);
  await button.click();
});

// Assertion steps
Then('the button should show a loading spinner with text {string}', async function (text: string) {
  const button = await world.page.locator('button:has-text("Saving...")');
  await expect(button).toBeVisible();
  const spinner = await button.locator('svg.animate-spin');
  await expect(spinner).toBeVisible();
});

Then('the email should be saved in the {string} category', async function (categoryKey: string) {
  // Wait for save operation
  await world.page.waitForTimeout(1000);
  
  // Check database for saved item
  const category = world.categories.get(categoryKey);
  expect(category).toBeDefined();
  
  const { data: items } = await world.supabase
    .from('toolkit_items')
    .select('*')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })
    .limit(1);
    
  expect(items).toHaveLength(1);
  world.savedItemId = items[0].id;
  world.toolkitItems.push(items[0]);
});

Then('I should see a success notification {string}', async function (message: string) {
  const notification = await world.page.locator(`[role="status"]:has-text("${message}")`);
  await expect(notification).toBeVisible();
});

Then('the notification should have an action button {string}', async function (buttonText: string) {
  const actionButton = await world.page.locator(`[role="status"] button:has-text("${buttonText}")`);
  await expect(actionButton).toBeVisible();
});

Then('the button should change to show {string} with a check icon', async function (text: string) {
  const button = await world.page.locator(`button:has-text("${text}")`);
  await expect(button).toBeVisible();
  const checkIcon = await button.locator('svg[data-lucide="check"]');
  await expect(checkIcon).toBeVisible();
});

Then('the button should be disabled', async function () {
  const button = await world.page.locator('button:has-text("Saved to Toolkit")');
  await expect(button).toBeDisabled();
});

// Error handling steps
Then('I should see an error notification {string}', async function (message: string) {
  const notification = await world.page.locator(`[role="alert"]:has-text("${message}")`);
  await expect(notification).toBeVisible();
});

Then('I should be redirected to {string}', async function (url: string) {
  await world.page.waitForURL(url);
  expect(world.page.url()).toContain(url);
});

// Network failure steps
Given('the network will fail on the next request', async function () {
  world.networkFailure = true;
});

When('the network is restored', async function () {
  world.networkFailure = false;
});

// Category-specific steps
When('I navigate to {string}', async function (url: string) {
  await world.page.goto(url);
});

When('the toolkit page loads', async function () {
  await world.page.waitForSelector('[data-testid="toolkit-grid"]');
});

Then('I should see {int} category cards', async function (count: number) {
  const cards = await world.page.locator('[data-testid="category-card"]');
  await expect(cards).toHaveCount(count);
});

// Filter interaction steps
When('I click on the {string} category', async function (categoryName: string) {
  const categoryCard = await world.page.locator(`[data-testid="category-card"]:has-text("${categoryName}")`);
  await categoryCard.click();
});

Then('I should only see {int} items', async function (count: number) {
  const items = await world.page.locator('[data-testid="toolkit-item"]');
  await expect(items).toHaveCount(count);
});

Then('the items should be {string} and {string}', async function (item1: string, item2: string) {
  const firstItem = await world.page.locator(`[data-testid="toolkit-item"]:has-text("${item1}")`);
  const secondItem = await world.page.locator(`[data-testid="toolkit-item"]:has-text("${item2}")`);
  await expect(firstItem).toBeVisible();
  await expect(secondItem).toBeVisible();
});

// Achievement steps
Given('I have never saved any toolkit items before', async function () {
  // Clean slate for test user
  if (world.testUser?.id) {
    await world.supabase
      .from('user_toolkit_unlocks')
      .delete()
      .eq('user_id', world.testUser.id);
  }
});

Given('there is an achievement {string} with criteria_type {string} and value {int}', async function (name: string, criteriaType: string, value: number) {
  // Achievements should already exist in the database
  const { data: achievement } = await world.supabase
    .from('toolkit_achievements')
    .select('*')
    .eq('name', name)
    .eq('criteria_type', criteriaType)
    .single();
    
  expect(achievement).toBeDefined();
  expect(achievement.criteria_value).toBe(value);
});

Then('I should see an achievement notification {string}', async function (message: string) {
  const achievementNotification = await world.page.locator(`[role="status"]:has-text("${message}")`);
  await expect(achievementNotification).toBeVisible();
});

// Mobile responsive steps
Given('I am viewing the toolkit on a mobile device', async function () {
  await world.page.setViewportSize({ width: 375, height: 667 });
});

Then('the categories should be displayed in a horizontal scroll', async function () {
  const scrollContainer = await world.page.locator('[data-testid="category-scroll-container"]');
  const scrollWidth = await scrollContainer.evaluate(el => el.scrollWidth);
  const clientWidth = await scrollContainer.evaluate(el => el.clientWidth);
  expect(scrollWidth).toBeGreaterThan(clientWidth);
});

// Deep linking steps
Then('the toolkit tab should be active', async function () {
  const toolkitTab = await world.page.locator('[data-testid="toolkit-tab"][aria-selected="true"]');
  await expect(toolkitTab).toBeVisible();
});

Then('the {string} category should be pre-selected', async function (categoryName: string) {
  const selectedCategory = await world.page.locator(`[data-testid="category-card"][data-selected="true"]:has-text("${categoryName}")`);
  await expect(selectedCategory).toBeVisible();
});

// Helper functions
async function createTestToolkitItem(world: TestContext, data: any) {
  const { data: item, error } = await world.supabase
    .from('toolkit_items')
    .insert({
      name: data.name,
      category_id: world.categories.get(data.category)?.id,
      description: data.description || 'Test item',
      file_type: data.file_type || 'test',
      is_new: data.is_new !== undefined ? data.is_new : true,
      is_active: true,
      metadata: data.metadata || null,
    })
    .select()
    .single();
    
  if (item) {
    world.toolkitItems.push(item);
    
    if (data.unlocked && world.testUser?.id) {
      await world.supabase
        .from('user_toolkit_unlocks')
        .insert({
          user_id: world.testUser.id,
          toolkit_item_id: item.id,
        });
    }
  }
  
  return item;
}

// Export for cucumber
export default { Given, When, Then };