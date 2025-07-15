# Component Testing Guide: Object-to-Primitive Regression Prevention

## Overview

This guide covers the comprehensive test suite created to prevent regression of the object-to-primitive fixes implemented for all 35 direct import components in the Lyra AI Mentor application.

## Table of Contents

1. [Test Structure](#test-structure)
2. [Running Tests](#running-tests)
3. [Test Categories](#test-categories)
4. [Object-to-Primitive Prevention](#object-to-primitive-prevention)
5. [Performance Testing](#performance-testing)
6. [Integration Testing](#integration-testing)
7. [Writing New Tests](#writing-new-tests)
8. [Troubleshooting](#troubleshooting)
9. [CI/CD Integration](#cicd-integration)

## Test Structure

The test suite is organized into several directories with specific purposes:

```
src/components/interactive/__tests__/
├── core/                     # Core renderer components (5 components)
│   ├── CalloutBoxRenderer.test.tsx
│   ├── LyraChatRenderer.test.tsx
│   ├── KnowledgeCheckRenderer.test.tsx
│   ├── ReflectionRenderer.test.tsx
│   └── SequenceSorterRenderer.test.tsx
├── maya/                     # Maya character components (6 components)
├── sofia/                    # Sofia character components (4 components)
├── david/                    # David character components (4 components)
├── rachel/                   # Rachel character components (4 components)
├── alex/                     # Alex character components (4 components)
├── testing/                  # Generic testing components (7 components)
├── regression/               # Regression-specific tests
├── performance/              # Performance benchmarks
├── testUtils.tsx            # Shared testing utilities
└── componentTestTemplate.ts  # Test template for consistency

tests/
├── integration/
│   └── components/
│       ├── full-lesson-loading.test.tsx
│       └── component-switching.test.tsx
└── performance/
    └── regression/
        ├── bundle-size-regression.test.ts
        ├── performance-regression.test.ts
        └── object-to-primitive-regression.test.ts
```

## Running Tests

### Quick Start

```bash
# Run all component tests
npm run test

# Run specific test categories
npm run test:coverage

# Run performance tests
npm test tests/performance/

# Run object-to-primitive specific tests (CRITICAL)
npm test tests/performance/regression/object-to-primitive-regression.test.ts
```

### Automated Test Script

Use the comprehensive test automation script:

```bash
./scripts/run-component-tests.sh
```

This script will:
- Run all component tests by category
- Generate detailed reports
- Check performance thresholds
- Validate object-to-primitive safety
- Generate coverage reports
- Provide actionable feedback

### Watch Mode

For development, run tests in watch mode:

```bash
npm run test -- --watch

# Watch specific component
npm run test -- --watch src/components/interactive/__tests__/maya/
```

## Test Categories

### 1. Object-to-Primitive Safety Tests (CRITICAL)

These tests are the most important as they prevent the core issue that was fixed:

```typescript
describe('Object-to-Primitive Safety (CRITICAL)', () => {
  it('should not throw "Cannot convert object to primitive" errors', async () => {
    const { safe, errors } = await RegressionTestUtils.testObjectToPrimitiveSafety(
      Component,
      baseProps
    );
    
    expect(safe).toBe(true);
    expect(errors).toHaveLength(0);
  });
});
```

**What these tests check:**
- Components don't throw object-to-primitive errors
- String coercion is handled safely
- Complex prop objects are processed correctly
- Circular references don't cause issues

### 2. Core Rendering Tests

```typescript
describe('Core Rendering', () => {
  it('should render without errors', () => {
    renderWithProviders(<Component {...baseProps} />);
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });
});
```

**What these tests check:**
- Components render without throwing errors
- Handle null/undefined configurations
- Gracefully handle missing props
- Display expected content

### 3. Performance Regression Tests

```typescript
describe('Performance Regression', () => {
  it('should render within performance threshold', async () => {
    const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
      return renderWithProviders(<Component {...baseProps} />);
    });

    expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RENDER_TIME_MS);
  });
});
```

**Performance Thresholds:**
- Render time: < 100ms
- Interaction time: < 50ms
- Memory usage: < 50MB per component
- Bundle size: < 1MB total

### 4. Props Validation Tests

```typescript
describe('Props Validation', () => {
  it('should handle complex object props safely', () => {
    const complexProps = {
      element: {
        configuration: {
          nested: { deeply: { object: 'value' } },
          array: [1, 2, 3, { complex: true }],
          nullValue: null,
          function: () => 'test',
        },
      },
    };

    expect(() => renderWithProviders(<Component {...complexProps} />)).not.toThrow();
  });
});
```

### 5. User Interaction Tests

For components with `hasInteractions: true`:

```typescript
describe('User Interactions', () => {
  it('should handle user interactions within performance limits', async () => {
    // Test button clicks, form submissions, etc.
  });
});
```

### 6. Error Boundary Tests

```typescript
describe('Error Handling', () => {
  it('should handle rendering errors gracefully', () => {
    // Test with problematic props
    // Verify error boundary catches issues
  });
});
```

## Object-to-Primitive Prevention

### The Problem

The original issue occurred when React components tried to convert complex objects to strings, causing errors like:

```
TypeError: Cannot convert object to primitive value
```

### Prevention Strategies

Our tests ensure components handle these scenarios safely:

1. **String Coercion Safety**
   ```typescript
   // BAD: Direct string coercion of objects
   const title = element.title; // Might be an object
   
   // GOOD: Safe string conversion
   const title = typeof element.title === 'string' ? element.title : String(element.title || '');
   ```

2. **Template Literal Safety**
   ```typescript
   // BAD: Object in template literal
   console.log(`Element: ${element}`);
   
   // GOOD: Safe template literal
   console.log(`Element: ${String(element.id)} - ${String(element.title || '')}`);
   ```

3. **Prop Spreading Safety**
   ```typescript
   // BAD: Spreading potentially circular objects
   const props = { ...element, ...configuration };
   
   // GOOD: Controlled prop assignment
   const props = {
     element: {
       id: element.id,
       type: String(element.type || ''),
       title: String(element.title || ''),
       content: String(element.content || ''),
     },
   };
   ```

### Test Utilities for Object-to-Primitive

```typescript
// Create problematic test data
const problematicElement = createProblematicElement({
  configuration: {
    complex: { nested: { object: 'value' } },
    circular: (() => {
      const obj: any = {};
      obj.self = obj;
      return obj;
    })(),
  },
});

// Test safety
const { safe, errors } = await RegressionTestUtils.testObjectToPrimitiveSafety(
  Component,
  { element: problematicElement }
);
```

## Performance Testing

### Bundle Size Monitoring

Current bundle size: **909KB** (Target: < 1MB)

```bash
# Check current bundle size
npm run build
du -sh dist/

# Run bundle size regression tests
npm test tests/performance/regression/bundle-size-regression.test.ts
```

**Bundle Size Limits:**
- Current: 909KB
- Warning: 950KB
- Error: 1MB

### Performance Benchmarks

```typescript
describe('Performance Benchmarks', () => {
  it('should load 35 components within 2 seconds total', async () => {
    // Test loading all direct import components
  });
  
  it('should maintain memory usage under 100MB for all components', async () => {
    // Test memory consumption
  });
});
```

### Automated Performance Monitoring

The test suite includes automated performance monitoring that:
- Tracks render times for each component
- Monitors memory usage patterns
- Detects performance regressions
- Generates performance reports

## Integration Testing

### Full Lesson Loading

Tests how components work together in a real lesson environment:

```typescript
describe('Full Lesson Loading Integration Tests', () => {
  it('should load multiple components simultaneously', async () => {
    // Test batch loading performance
    // Verify no interference between components
    // Check memory cleanup
  });
});
```

### Component Switching

Tests dynamic component switching scenarios:

```typescript
describe('Component Switching Integration Tests', () => {
  it('should switch between components without memory leaks', async () => {
    // Test rapid component switching
    // Monitor memory usage
    // Verify state preservation
  });
});
```

## Writing New Tests

### For New Components

1. **Use the Template System**
   ```typescript
   import { createComponentTestSuite } from '../componentTestTemplate';
   
   createComponentTestSuite(
     'NewComponent',
     NewComponent,
     'component_type',
     {
       hasInteractions: true,
       hasAsyncOperations: false,
       hasComplexState: true,
     }
   );
   ```

2. **Add Component-Specific Tests**
   ```typescript
   describe('NewComponent Specific Tests', () => {
     it('should handle component-specific behavior', () => {
       // Test unique functionality
     });
   });
   ```

3. **Include Object-to-Primitive Tests**
   ```typescript
   it('should handle problematic props safely', async () => {
     const { safe, errors } = await RegressionTestUtils.testObjectToPrimitiveSafety(
       NewComponent,
       problematicProps
     );
     
     expect(safe).toBe(true);
   });
   ```

### Test Naming Conventions

- **Component tests**: `ComponentName.test.tsx`
- **Integration tests**: `feature-integration.test.tsx`
- **Performance tests**: `performance-regression.test.ts`
- **Utility tests**: `utility-name.test.ts`

### Required Test Coverage

Each component test must include:

1. ✅ Object-to-primitive safety tests
2. ✅ Basic rendering tests
3. ✅ Props validation tests
4. ✅ Performance threshold tests
5. ✅ Error boundary tests
6. ✅ Accessibility tests (basic)
7. ✅ Analytics integration tests

Optional tests based on component type:
- 🔄 User interaction tests (if `hasInteractions: true`)
- 🔄 Async operation tests (if `hasAsyncOperations: true`)
- 🔄 State management tests (if `hasComplexState: true`)

## Troubleshooting

### Common Issues

#### 1. Object-to-Primitive Errors

**Error:**
```
Cannot convert object to primitive value
```

**Solution:**
```typescript
// Instead of:
console.log('Element:', element);

// Use:
console.log('Element:', String(element.id), String(element.title || ''));
```

#### 2. Performance Test Failures

**Error:**
```
Render time 150ms exceeds threshold 100ms
```

**Solutions:**
- Check for synchronous operations in render
- Optimize component logic
- Consider memoization
- Review prop complexity

#### 3. Memory Leak Test Failures

**Error:**
```
Memory usage 75MB exceeds threshold 50MB
```

**Solutions:**
- Check for event listener cleanup
- Review useEffect dependencies
- Ensure proper component unmounting
- Check for reference retention

#### 4. Bundle Size Regression

**Error:**
```
Bundle size 1.1MB exceeds threshold 1MB
```

**Solutions:**
- Review new dependencies
- Check for duplicate imports
- Optimize component code
- Consider code splitting

### Debugging Tests

1. **Enable Debug Mode**
   ```bash
   DEBUG=true npm test
   ```

2. **Run Single Component Test**
   ```bash
   npm test -- --testNamePattern="ComponentName"
   ```

3. **View Detailed Error Reports**
   ```bash
   npm test -- --verbose
   ```

4. **Generate Coverage Report**
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

### Performance Debugging

1. **Profile Component Rendering**
   ```typescript
   it('should profile render performance', async () => {
     const { renderTime } = await PerformanceTestUtils.measureRenderTime(() => {
       return render(<Component {...props} />);
     });
     
     console.log(`Render time: ${renderTime}ms`);
   });
   ```

2. **Memory Profiling**
   ```typescript
   it('should profile memory usage', async () => {
     const { memoryDelta } = await PerformanceTestUtils.measureMemoryUsage(async () => {
       // Component operations
     });
     
     console.log(`Memory used: ${memoryDelta / 1024 / 1024}MB`);
   });
   ```

## CI/CD Integration

### GitHub Actions Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Component Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run component tests
        run: ./scripts/run-component-tests.sh
      
      - name: Upload test reports
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: test-reports/
      
      - name: Check bundle size
        run: npm run build && ls -la dist/
```

### Pre-commit Hooks

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run critical object-to-primitive tests before commit
npm test tests/performance/regression/object-to-primitive-regression.test.ts

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

### Quality Gates

Set up quality gates for:

1. **Test Coverage**: Minimum 90%
2. **Bundle Size**: Maximum 1MB
3. **Performance**: All components < 100ms render time
4. **Object-to-Primitive**: Zero errors allowed

## Best Practices

### 1. Test-Driven Development

When adding new components:

1. Write object-to-primitive safety tests first
2. Write basic rendering tests
3. Implement component
4. Add performance tests
5. Add interaction tests

### 2. Continuous Monitoring

- Run tests on every commit
- Monitor performance trends
- Track bundle size growth
- Review test coverage regularly

### 3. Test Data Management

```typescript
// Good: Use factory functions
const element = createTestElement({
  type: 'ai_content_generator',
  configuration: { character: 'maya' },
});

// Bad: Hardcoded test data
const element = {
  id: 1,
  type: 'ai_content_generator',
  // ... lots of hardcoded values
};
```

### 4. Error Testing

Always test error scenarios:

```typescript
describe('Error Scenarios', () => {
  it('should handle malformed configuration', () => {
    const badElement = {
      ...goodElement,
      configuration: { circular: null },
    };
    
    expect(() => render(<Component element={badElement} />)).not.toThrow();
  });
});
```

## Maintenance

### Weekly Tasks

1. Review test failure reports
2. Check performance trends
3. Update performance thresholds if needed
4. Review bundle size changes

### Monthly Tasks

1. Update test dependencies
2. Review test coverage gaps
3. Performance baseline updates
4. Documentation updates

### When Adding New Components

1. Generate test file using template
2. Add to direct import list if needed
3. Update performance thresholds
4. Add to test automation script
5. Update this documentation

## Conclusion

This comprehensive test suite ensures that the object-to-primitive fixes remain stable and that all 35 direct import components continue to work correctly. The tests cover:

- ✅ **Object-to-primitive safety** (CRITICAL)
- ✅ **Performance regression prevention**
- ✅ **Bundle size monitoring**
- ✅ **Integration testing**
- ✅ **Error boundary protection**
- ✅ **Memory leak prevention**

By following this guide and maintaining the test suite, we can prevent regression of the critical object-to-primitive fixes and ensure the continued stability of the Lyra AI Mentor application.

---

**Remember**: Object-to-primitive safety tests are CRITICAL and must always pass. Any failures in these tests should be treated as high-priority bugs that need immediate attention.