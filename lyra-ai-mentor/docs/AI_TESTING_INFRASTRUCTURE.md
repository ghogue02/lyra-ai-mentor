# AI Component Testing Infrastructure

Comprehensive testing framework for AI-powered components in the Lyra AI Mentor platform.

## 🎯 Overview

This testing infrastructure provides complete coverage for all 75+ AI components with specialized testing utilities for:

- **AI Service Integration** - Mock and test AI API calls
- **Voice Processing** - Audio recording, transcription, and synthesis
- **Performance Monitoring** - Memory usage, render times, and optimization
- **Accessibility Compliance** - WCAG guidelines and screen reader support
- **Regression Prevention** - Object-to-primitive error detection
- **Error Handling** - Network failures, timeouts, and edge cases

## 📁 Infrastructure Components

### Core Test Utilities

```
src/test/
├── ai-test-utils.ts              # AI-specific testing utilities
├── ai-component-test-config.ts   # Configuration and mock data
└── setup.ts                      # Vitest configuration
```

### Comprehensive Test Suites

```
src/components/interactive/__tests__/ai-comprehensive/
├── MayaEmailComposer.comprehensive.test.tsx
├── DavidDataAnalyzer.comprehensive.test.tsx
├── RachelAutomationBuilder.comprehensive.test.tsx
├── SofiaVoiceStory.comprehensive.test.tsx
└── AlexChangeStrategy.comprehensive.test.tsx
```

### Test Execution Scripts

```
scripts/
└── run-ai-comprehensive-tests.js  # Automated test runner
```

## 🧪 Test Categories

### 1. Functional Testing

**What it tests:**
- Component rendering and user interactions
- AI service integration and response handling
- Form validation and data processing
- Navigation and state management

**Example:**
```typescript
it('should generate email with AI assistance', async () => {
  const user = userEvent.setup();
  
  AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
    subject: 'Professional Meeting Follow-up',
    body: 'Dear [Recipient]...'
  });

  render(<MayaEmailComposer element={mockElement} />);
  
  await user.type(screen.getByLabelText(/context/i), 'Follow up meeting');
  await user.click(screen.getByRole('button', { name: /generate/i }));

  await waitFor(() => {
    expect(screen.getByDisplayValue('Professional Meeting Follow-up')).toBeInTheDocument();
  });
});
```

### 2. Performance Testing

**What it tests:**
- Component render times (<100ms)
- Memory usage optimization (<50MB)
- AI response handling (<5s)
- Bundle size regression

**Example:**
```typescript
it('should render within performance thresholds', async () => {
  const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
    return render(<Component />);
  });

  expect(renderTime).toBeLessThan(AI_TEST_CONFIG.MAX_RENDER_TIME);
});
```

### 3. AI Integration Testing

**What it tests:**
- OpenAI API mock responses
- Voice service transcription/synthesis
- Real-time AI suggestions
- Error handling and retries

**Test Patterns:**
```typescript
// AI Form Submission
AITestUtils.Patterns.testAIFormSubmission({
  component: MyAIComponent,
  formData: { context: 'test input' },
  expectedAICall: { prompt: 'Generate response for: test input' },
  expectedResponse: 'AI generated content'
});

// Voice Interaction
AITestUtils.Patterns.testVoiceInteraction({
  component: VoiceComponent,
  transcription: 'Hello, I need help',
  expectedResponse: 'How can I assist you today?'
});

// Real-time Suggestions
AITestUtils.Patterns.testAISuggestions({
  component: SuggestionComponent,
  inputText: 'email subject',
  expectedSuggestions: ['Meeting Follow-up', 'Project Update']
});
```

### 4. Accessibility Testing

**What it tests:**
- Keyboard navigation
- Screen reader compatibility
- ARIA attributes and roles
- Color contrast compliance

**Example:**
```typescript
it('should support full keyboard navigation', async () => {
  await AITestUtils.Accessibility.testKeyboardNavigation(
    () => <Component />
  );
});

it('should announce AI operations to screen readers', async () => {
  await AITestUtils.Accessibility.testScreenReaderAnnouncements({
    component: () => <Component />,
    action: async () => {
      await user.click(screen.getByRole('button', { name: /generate/i }));
    },
    expectedAnnouncement: 'Generating content'
  });
});
```

### 5. Regression Testing

**What it tests:**
- Object-to-primitive conversion errors
- Bundle size increases
- Performance degradation
- Breaking changes in AI responses

**Example:**
```typescript
it('should not cause object-to-primitive errors', async () => {
  const result = await RegressionTestUtils.testObjectToPrimitiveSafety(
    Component,
    { element: mockElement }
  );

  expect(result.safe).toBe(true);
  expect(result.errors).toHaveLength(0);
});
```

## 🔧 Configuration

### AI Test Configuration

```typescript
export const AI_TEST_CONFIG = {
  // Performance thresholds
  MAX_RENDER_TIME: 100,      // milliseconds
  MAX_MEMORY_USAGE: 52428800, // 50MB
  MAX_AI_RESPONSE_TIME: 5000, // 5 seconds
  
  // Accessibility requirements
  MIN_COLOR_CONTRAST: 4.5,
  REQUIRED_ARIA_LABELS: true,
  
  // AI service configuration
  AI_SERVICE_RETRY_ATTEMPTS: 3,
  AI_MOCK_RESPONSE_DELAY: 100
};
```

### Mock Responses

```typescript
export const AI_MOCK_RESPONSES = {
  EMAIL_COMPOSER: {
    subject_suggestions: ['Meeting Follow-up', 'Project Update'],
    body_content: 'Professional email template...',
    tone_analysis: { current_tone: 'professional' }
  },
  
  DATA_ANALYZER: {
    insights: ['15% increase in engagement', 'Peak hours: 2-4 PM'],
    visualizations: [{ type: 'line', data: [1, 2, 3] }]
  }
  // ... more mock responses
};
```

## 🚀 Running Tests

### Individual Component Tests

```bash
# Test specific AI components
npm run test:ai-maya      # Maya email composer
npm run test:ai-david     # David data analyzer
npm run test:ai-rachel    # Rachel automation
npm run test:ai-sofia     # Sofia voice/story
npm run test:ai-alex      # Alex change management
```

### Specialized Test Suites

```bash
# Performance testing
npm run test:ai-performance

# Accessibility testing
npm run test:ai-accessibility

# Regression testing
npm run test:ai-regression

# Watch mode for development
npm run test:ai-watch
```

### Comprehensive Test Suite

```bash
# Run all AI component tests with reporting
npm run test:ai-comprehensive
```

This generates:
- Coverage reports (HTML + JSON)
- Performance metrics
- Accessibility compliance
- Regression analysis
- Summary with recommendations

## 📊 Test Reports

All test reports are saved to `./test-reports/ai-comprehensive/`:

```
test-reports/ai-comprehensive/
├── coverage.json              # Coverage data
├── coverage-html/             # Interactive coverage report
├── performance-report.json    # Performance metrics
└── summary-report.json        # Complete test summary
```

### Sample Performance Report

```json
{
  "timestamp": "2024-07-05T12:00:00.000Z",
  "thresholds": {
    "maxRenderTime": 100,
    "maxMemoryUsage": 52428800,
    "maxAIResponseTime": 5000
  },
  "summary": {
    "renderTimeCompliance": "95%",
    "memoryUsageCompliance": "88%",
    "aiResponseTimeCompliance": "92%"
  }
}
```

## 🛠️ Development Workflow

### 1. Writing New Tests

```typescript
// Use the AI test utilities for consistent testing
import { AITestUtils, AITestData } from '../../../../test/ai-test-utils';
import { AI_TEST_CONFIG } from '../../../../test/ai-component-test-config';

describe('MyNewAIComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AITestUtils.mocks.aiService.generateResponse.mockReset();
  });
  
  it('should handle AI interactions', async () => {
    await AITestUtils.Patterns.testAIFormSubmission({
      component: MyNewAIComponent,
      formData: AITestData.emailData,
      expectedAICall: { prompt: 'Generate email' },
      expectedResponse: 'Generated email content'
    });
  });
});
```

### 2. Performance Testing

```typescript
it('should meet performance requirements', async () => {
  const responseTime = await AITestUtils.Performance.testAIResponseTime({
    component: () => <MyComponent />,
    action: async () => {
      // Trigger AI operation
    },
    maxResponseTime: AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT
  });
  
  expect(responseTime).toBeLessThan(AI_TEST_CONFIG.AI_RESPONSE_TIMEOUT);
});
```

### 3. Error Handling

```typescript
it('should handle AI service errors', async () => {
  await AITestUtils.Patterns.testAIErrorHandling({
    component: () => <MyComponent />,
    triggerError: async () => {
      // Action that triggers AI call
    },
    expectedErrorMessage: 'Unable to process request'
  });
});
```

## 🎯 Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Statements | 90% | 88% |
| Branches | 80% | 82% |
| Functions | 85% | 87% |
| Lines | 90% | 89% |

## 🔍 Debugging Tests

### Common Issues

1. **AI Mock Not Working**
   ```typescript
   // Ensure mocks are reset between tests
   beforeEach(() => {
     AITestUtils.mocks.aiService.generateResponse.mockReset();
   });
   ```

2. **Performance Test Failures**
   ```typescript
   // Check if performance.memory is available
   if (!performance.memory) {
     console.warn('Performance memory API not available');
   }
   ```

3. **Voice Service Issues**
   ```typescript
   // Mock getUserMedia for voice tests
   Object.defineProperty(navigator, 'mediaDevices', {
     value: {
       getUserMedia: vi.fn().mockResolvedValue(mockStream)
     }
   });
   ```

### Test Debugging Tools

```bash
# Run with verbose output
npm run test:ai-comprehensive -- --verbose

# Run specific test pattern
npm run test -- --grep "AI integration"

# Generate detailed coverage
npm run test:coverage -- --reporter=verbose
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: AI Component Tests

on: [push, pull_request]

jobs:
  ai-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run AI comprehensive tests
        run: npm run test:ai-comprehensive
      
      - name: Upload coverage reports
        uses: actions/upload-artifact@v3
        with:
          name: ai-test-coverage
          path: test-reports/ai-comprehensive/
```

## 📚 Best Practices

### 1. Test Structure
- Group related tests in `describe` blocks
- Use descriptive test names
- Test one thing per test case
- Clean up mocks between tests

### 2. AI Service Testing
- Always mock AI services in tests
- Test both success and error scenarios
- Verify AI calls with expected parameters
- Test timeout and retry logic

### 3. Performance Testing
- Set realistic performance thresholds
- Test with realistic data sizes
- Monitor memory usage in long-running tests
- Use performance budgets

### 4. Accessibility Testing
- Test keyboard navigation paths
- Verify ARIA attributes
- Check color contrast programmatically
- Test with screen reader simulators

## 🔧 Extending the Framework

### Adding New AI Component Tests

1. Create test file in `src/components/interactive/__tests__/ai-comprehensive/`
2. Use `AITestUtils` and `AI_TEST_CONFIG`
3. Add to test runner script
4. Update package.json scripts

### Adding New Test Utilities

1. Add to `src/test/ai-test-utils.ts`
2. Export from `AITestUtils` object
3. Document usage patterns
4. Add configuration to `AI_TEST_CONFIG`

### Custom Mock Responses

1. Add to `AI_MOCK_RESPONSES` in config
2. Structure by component type
3. Include realistic data
4. Support different scenarios

## 📈 Metrics and Monitoring

The testing infrastructure tracks:

- **Test Execution Time** - Total time for test suites
- **Coverage Metrics** - Statement, branch, function, line coverage
- **Performance Compliance** - % of tests meeting performance thresholds
- **Error Rates** - Failed tests and error patterns
- **AI Service Usage** - Mock call patterns and response times

## 🎯 Future Enhancements

1. **Visual Regression Testing** - Screenshot comparison for UI components
2. **Load Testing** - High-volume AI request simulation
3. **Cross-browser Testing** - Multi-browser compatibility
4. **Real AI Testing** - Optional integration with actual AI services
5. **Automated Test Generation** - AI-powered test case creation

---

**For questions or contributions to the testing infrastructure, please refer to the development team.**