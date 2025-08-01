# Testing Tools & Automation Recommendations
*QA_Engineer Agent - Comprehensive tooling strategy for chat system testing*

## Current Testing Stack Analysis

### ✅ Already Installed (Good Foundation)
```json
{
  "vitest": "^3.2.4",                    // Modern, fast test runner
  "@testing-library/react": "^16.3.0",   // Component testing utilities
  "@testing-library/jest-dom": "^6.6.3", // DOM matchers
  "@testing-library/user-event": "^14.6.1", // User interaction simulation
  "jsdom": "^26.1.0"                     // Browser environment simulation
}
```

### 🚀 Recommended Additions

#### 1. End-to-End Testing
```bash
npm install --save-dev @playwright/test@^1.40.0
npm install --save-dev @playwright/test-coverage@^1.0.0
```

**Why Playwright over Cypress:**
- Better cross-browser support (Chrome, Firefox, Safari, Edge)
- Native mobile testing capabilities
- Faster execution and more reliable
- Built-in screenshot/video recording
- Better CI/CD integration

#### 2. Visual Regression Testing
```bash
npm install --save-dev @storybook/react@^7.5.0
npm install --save-dev @storybook/addon-docs@^7.5.0
npm install --save-dev chromatic@^7.0.0
npm install --save-dev playwright-visual-comparisons@^1.0.0
```

**Benefits:**
- Catch UI regressions automatically
- Document components visually
- Test responsive breakpoints
- Cross-browser visual consistency

#### 3. Accessibility Testing
```bash
npm install --save-dev @axe-core/playwright@^4.8.0
npm install --save-dev axe-core@^4.8.0
npm install --save-dev @testing-library/jest-axe@^2.0.0
```

**Comprehensive a11y coverage:**
- Automated WCAG 2.1 compliance testing
- Color contrast validation
- Keyboard navigation testing
- Screen reader compatibility

#### 4. Performance & Bundle Analysis
```bash
npm install --save-dev bundlesize@^0.18.1
npm install --save-dev lighthouse-ci@^0.12.0
npm install --save-dev @vitejs/plugin-bundle-analyzer@^0.7.0
npm install --save-dev web-vitals@^3.5.0
```

**Performance monitoring:**
- Bundle size regression protection
- Core Web Vitals tracking
- Memory leak detection
- Rendering performance analysis

#### 5. API Testing & Mocking
```bash
npm install --save-dev msw@^2.0.0
npm install --save-dev @mswjs/data@^0.16.0
npm install --save-dev nock@^13.4.0
```

**Robust API testing:**
- Service worker-based mocking
- Realistic API simulation
- Network condition testing
- Error scenario coverage

## Detailed Tool Configuration

### 1. Enhanced Vitest Configuration

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    
    // Performance settings
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        '**/*.stories.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Specific thresholds for critical components
        'src/components/lesson/chat/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      }
    },
    
    // Test categorization
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    
    // Performance benchmarking
    benchmark: {
      include: ['**/performance/*.bench.ts'],
      reporters: ['verbose']
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './tests')
    }
  }
});
```

### 2. Playwright Configuration

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporting
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Global test settings
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile Devices
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },

    // Accessibility Testing
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/accessibility/**/*.spec.ts',
    },

    // Performance Testing
    {
      name: 'performance',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--enable-precise-memory-info']
        }
      },
      testMatch: '**/performance/**/*.spec.ts',
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### 3. Storybook Configuration

**File:** `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-interactions',
    'chromatic'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  features: {
    buildStoriesJson: true,
  },
};

export default config;
```

### 4. MSW (Mock Service Worker) Setup

**File:** `tests/mocks/handlers.ts`

```typescript
import { rest } from 'msw';

export const handlers = [
  // Chat API endpoints
  rest.post('/api/chat/send', (req, res, ctx) => {
    return res(
      ctx.delay(100), // Simulate network delay
      ctx.json({
        id: 'response-' + Date.now(),
        content: 'This is a mocked AI response for testing purposes.',
        isUser: false,
        timestamp: Date.now()
      })
    );
  }),

  // Lesson context endpoints
  rest.get('/api/lessons/:id/context', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        chapterNumber: parseInt(id as string) <= 4 ? 1 : 2,
        lessonTitle: `Lesson ${id} Title`,
        phase: 'introduction',
        content: `Mock content for lesson ${id}`
      })
    );
  }),

  // Error scenarios
  rest.post('/api/chat/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal server error' })
    );
  }),

  rest.post('/api/chat/timeout', (req, res, ctx) => {
    return res(
      ctx.delay(5000), // 5 second delay to simulate timeout
      ctx.json({ error: 'Request timeout' })
    );
  }),
];
```

### 5. Test Setup Files

**File:** `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

// MSW Setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn();

// Mock performance.memory for memory testing
Object.defineProperty(performance, 'memory', {
  value: {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  },
  writable: true,
});

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## Custom Testing Utilities

### 1. Chat Testing Utilities

**File:** `tests/utils/chat-test-utils.tsx`

```typescript
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Chat-specific test utilities
export const createMockLessonContext = (overrides = {}) => ({
  chapterNumber: 1,
  lessonTitle: 'Test Lesson',
  phase: 'introduction',
  content: 'Test content',
  ...overrides,
});

export const createMockMayaJourney = (overrides = {}) => ({
  currentPhase: 'email_challenge',
  progress: 0.5,
  completedChallenges: ['persona_identification'],
  ...overrides,
});

export const waitForTypewriter = async (expectedText: string, timeout = 5000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const element = screen.queryByText(expectedText);
    if (element) return element;
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`Typewriter text "${expectedText}" not found within ${timeout}ms`);
};

export const mockChatHook = (overrides = {}) => {
  const defaultMock = {
    messages: [],
    sendMessage: vi.fn().mockResolvedValue({}),
    clearChat: vi.fn(),
    isLoading: false,
    ...overrides,
  };
  
  vi.mocked(useLyraChat).mockReturnValue(defaultMock);
  return defaultMock;
};

export * from '@testing-library/react';
export { customRender as render };
```

### 2. Performance Testing Utilities

**File:** `tests/utils/performance-utils.ts`

```typescript
export class PerformanceMonitor {
  private startTime: number = 0;
  private measurements: Map<string, number[]> = new Map();

  start(label: string = 'default') {
    this.startTime = performance.now();
    return label;
  }

  end(label: string = 'default') {
    const duration = performance.now() - this.startTime;
    
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    
    this.measurements.get(label)!.push(duration);
    return duration;
  }

  getStats(label: string = 'default') {
    const measurements = this.measurements.get(label) || [];
    
    if (measurements.length === 0) {
      return { count: 0, avg: 0, min: 0, max: 0 };
    }

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return { count: measurements.length, avg, min, max };
  }

  reset(label?: string) {
    if (label) {
      this.measurements.delete(label);
    } else {
      this.measurements.clear();
    }
  }
}

export const measureMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    };
  }
  return null;
};

export const expectPerformance = (duration: number, maxExpected: number) => {
  expect(duration).toBeLessThan(maxExpected);
  
  if (duration > maxExpected * 0.8) {
    console.warn(`Performance warning: ${duration}ms is close to limit of ${maxExpected}ms`);
  }
};
```

### 3. Accessibility Testing Utilities

**File:** `tests/utils/accessibility-utils.ts`

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
import { RenderResult } from '@testing-library/react';

expect.extend(toHaveNoViolations);

interface A11yTestOptions {
  rules?: Record<string, { enabled: boolean }>;
  tags?: string[];
  include?: string[][];
  exclude?: string[][];
}

export const testAccessibility = async (
  container: HTMLElement,
  options: A11yTestOptions = {}
) => {
  const defaultOptions = {
    rules: {
      // Disable rules that might not apply in test environment
      'color-contrast': { enabled: false }, // Will be tested separately
      'landmark-one-main': { enabled: false }, // Not applicable to components
    },
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    ...options,
  };

  const results = await axe(container, defaultOptions);
  expect(results).toHaveNoViolations();
  
  return results;
};

export const testKeyboardNavigation = async (renderResult: RenderResult) => {
  const { container } = renderResult;
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  // Test that all elements are focusable
  for (const element of Array.from(focusableElements)) {
    (element as HTMLElement).focus();
    expect(document.activeElement).toBe(element);
  }

  return focusableElements.length;
};

export const testColorContrast = async (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  const textColor = style.color;
  
  // This would integrate with a color contrast library
  // For now, we'll just check that colors are defined
  expect(bgColor).not.toBe('');
  expect(textColor).not.toBe('');
  
  // TODO: Implement actual contrast ratio calculation
  // using a library like 'color-contrast-checker'
};
```

## Package.json Script Updates

**Add to `package.json`:**

```json
{
  "scripts": {
    // Existing scripts...
    
    // Enhanced testing scripts
    "test:unit": "vitest run src/",
    "test:integration": "vitest run tests/integration/",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:visual": "chromatic --exit-zero-on-changes",
    "test:a11y": "vitest run tests/accessibility/",
    "test:performance": "vitest run tests/performance/",
    "test:mobile": "playwright test --project='Mobile Chrome' --project='Mobile Safari'",
    "test:cross-browser": "playwright test --project=chromium --project=firefox --project=webkit",
    
    // Test maintenance
    "test:update-snapshots": "vitest run --update-snapshots",
    "test:clear-cache": "vitest --clear-cache",
    "test:coverage:open": "open coverage/index.html",
    
    // CI/CD scripts
    "test:ci": "vitest run --coverage && playwright test",
    "test:ci:unit": "vitest run --coverage --reporter=junit --outputFile=test-results/unit-results.xml",
    "test:ci:e2e": "playwright test --reporter=junit",
    
    // Development helpers
    "test:watch:unit": "vitest watch src/",
    "test:watch:integration": "vitest watch tests/integration/",
    "test:debug": "vitest --inspect-brk --no-coverage",
    
    // Storybook
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "chromatic": "chromatic --project-token=<your-project-token>"
  }
}
```

## CI/CD Integration Examples

### GitHub Actions Workflow

**File:** `.github/workflows/comprehensive-testing.yml`

```yaml
name: Comprehensive Testing Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests with coverage
        run: npm run test:ci:unit
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: unit-test-results
          path: test-results/

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  accessibility-tests:
    name: Accessibility Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run accessibility tests
        run: npm run test:a11y
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun

  visual-regression:
    name: Visual Regression Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Storybook
        run: npm run build-storybook
      
      - name: Run Chromatic
        uses: chromaui/action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook

  performance-tests:
    name: Performance Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Bundle size check
        run: npx bundlesize

  mobile-tests:
    name: Mobile Device Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run mobile tests
        run: npm run test:mobile
```

## Quality Gates Configuration

### Bundle Size Limits

**File:** `.bundlesizerc.json`

```json
{
  "files": [
    {
      "path": "./dist/assets/index-*.js",
      "maxSize": "500kb",
      "compression": "gzip"
    },
    {
      "path": "./dist/assets/index-*.css",
      "maxSize": "50kb",
      "compression": "gzip"
    }
  ],
  "ci": {
    "trackBranches": ["main", "develop"],
    "repoBranchBase": "main"
  }
}
```

### Lighthouse CI Configuration

**File:** `lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:5173'],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready in',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

## Monitoring & Reporting

### Test Results Dashboard

```typescript
// tests/reporting/test-dashboard.ts
export interface TestMetrics {
  unitTests: {
    total: number;
    passed: number;
    failed: number;
    coverage: number;
    duration: number;
  };
  e2eTests: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
    browsers: string[];
  };
  performance: {
    renderTime: number;
    bundleSize: number;
    memoryUsage: number;
  };
  accessibility: {
    violations: number;
    level: 'AA' | 'AAA';
    score: number;
  };
}

export const generateTestReport = (metrics: TestMetrics) => {
  return {
    overall: calculateOverallScore(metrics),
    recommendations: generateRecommendations(metrics),
    trends: calculateTrends(metrics),
    nextSteps: prioritizeImprovements(metrics),
  };
};
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. ✅ Install recommended packages
2. ✅ Setup enhanced Vitest configuration
3. ✅ Create test utilities and helpers
4. ✅ Configure MSW for API mocking
5. ✅ Setup basic CI/CD workflows

### Phase 2: Core Testing (Week 3-4)
1. ✅ Implement unit test suites
2. ✅ Setup Playwright for E2E testing
3. ✅ Configure Storybook for component docs
4. ✅ Add accessibility testing framework
5. ✅ Create performance testing utilities

### Phase 3: Advanced Features (Week 5-6)
1. ✅ Visual regression testing setup
2. ✅ Cross-browser testing automation
3. ✅ Mobile device testing configuration
4. ✅ Performance monitoring integration
5. ✅ Quality gates implementation

### Phase 4: Optimization (Week 7-8)
1. ✅ Test execution optimization
2. ✅ Reporting and dashboards
3. ✅ Documentation and training
4. ✅ Monitoring and alerting
5. ✅ Continuous improvement processes

---

This comprehensive testing tools strategy ensures the chat system meets the highest quality standards while enabling efficient development workflows and reliable automated testing.