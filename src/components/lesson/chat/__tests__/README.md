# ContextualLyraChat Test Suite

A comprehensive test suite for the ContextualLyraChat system covering unit tests, integration tests, E2E scenarios, performance benchmarks, and error recovery mechanisms.

## Test Structure

### Unit Tests

#### `FloatingLyraAvatar.test.tsx`
- **Purpose**: Tests the floating avatar component behavior and interactions
- **Coverage**: States (idle, pulsing, active), user interactions, accessibility, animations
- **Key Areas**:
  - State management and visual expressions
  - Keyboard and mouse interactions
  - ARIA attributes and accessibility compliance
  - Performance with rapid state changes
  - Error handling and edge cases

#### `ContextualLyraChat.test.tsx`
- **Purpose**: Tests the main chat interface component
- **Coverage**: Chat flow, messaging, context handling, UI states
- **Key Areas**:
  - Contextual question generation based on lesson chapters
  - Message sending and receiving
  - Chat expansion/collapse behavior
  - Loading states and error handling
  - Integration with useLyraChat hook
  - Mobile and desktop responsive behavior

#### `NarrativeManager.test.tsx`
- **Purpose**: Tests the narrative management system
- **Coverage**: Pause/resume integration, state persistence, user navigation
- **Key Areas**:
  - Message progression and typing animations
  - Navigation controls (forward/back buttons)
  - State persistence across sessions
  - Interaction points and user engagement
  - Auto-advance mode functionality
  - Stuck detection and reset mechanisms

#### `LessonContextValidation.test.tsx`
- **Purpose**: Tests lesson context validation and processing
- **Coverage**: Context structure validation, chapter-specific logic, edge cases
- **Key Areas**:
  - Required and optional field validation
  - Chapter-specific question generation
  - Difficulty level processing
  - Edge cases with malformed data
  - Integration with chat components

### Integration Tests

#### `ContextualLyraChatIntegration.test.tsx`
- **Purpose**: Tests complete workflow integration
- **Coverage**: Narrative → avatar → chat → resume workflow
- **Key Areas**:
  - Cross-component state management
  - Complete user journey simulation
  - Engagement tracking and metrics
  - Performance under load scenarios
  - Error recovery across components

#### `APIIntegration.test.tsx`
- **Purpose**: Tests GPT-4.1 API integration and error handling
- **Coverage**: API calls, error scenarios, performance optimization
- **Key Areas**:
  - Successful API communication
  - Rate limiting and timeout handling
  - Network connectivity issues
  - Response validation and error recovery
  - Context-aware API calls
  - Streaming response handling
  - Security and input sanitization

### End-to-End Tests

#### `E2EUserJourney.test.tsx`
- **Purpose**: Tests complete Chapter 1 Lesson 1 user experience
- **Coverage**: Full user journey from start to completion
- **Key Areas**:
  - Complete lesson flow progression
  - User engagement tracking throughout journey
  - Chat interaction during different phases
  - Progress persistence and recovery
  - Performance with realistic usage patterns
  - Accessibility throughout the journey

### Performance Tests

#### `PerformanceAndMemory.test.tsx`
- **Purpose**: Tests performance benchmarks and memory management
- **Coverage**: Rendering performance, memory usage, optimization
- **Key Areas**:
  - Rendering performance within budget (50ms)
  - Memory leak detection and cleanup
  - Large dataset handling (1000+ messages)
  - Animation performance (60fps maintenance)
  - Resource usage optimization
  - Long-term stability testing

### Error Recovery Tests

#### `ErrorRecoveryAndEdgeCases.test.tsx`
- **Purpose**: Tests error scenarios and recovery mechanisms
- **Coverage**: Hook failures, network issues, invalid data, edge cases
- **Key Areas**:
  - Hook failure recovery
  - Network disconnection handling
  - Invalid props and data processing
  - User interaction edge cases
  - Memory pressure handling
  - Browser compatibility issues
  - State corruption recovery
  - Race condition handling

### Accessibility Tests

#### `AccessibilityAndResponsive.test.tsx`
- **Purpose**: Tests WCAG 2.1 AA compliance and responsive design
- **Coverage**: Keyboard navigation, screen readers, mobile responsiveness
- **Key Areas**:
  - Full keyboard navigation support
  - ARIA labels and semantic HTML
  - Screen reader compatibility
  - Color contrast and visual design
  - Mobile viewport adaptation
  - Touch interaction support
  - High contrast mode support
  - Motion preferences respect

## Test Configuration

### Setup Files
- `src/test/setup.ts` - Global test configuration
- `src/test/authHelpers.tsx` - Authentication mocking utilities
- `src/test/supabaseMocks.ts` - Supabase client mocking

### Mocking Strategy
- **External APIs**: Supabase functions and authentication
- **UI Components**: Simplified versions for faster testing
- **Animations**: Mock framer-motion for consistent testing
- **Hooks**: Custom hook mocking with controllable behavior

## Running Tests

### Individual Test Suites
```bash
# Unit tests
npm test FloatingLyraAvatar.test.tsx
npm test ContextualLyraChat.test.tsx
npm test NarrativeManager.test.tsx
npm test LessonContextValidation.test.tsx

# Integration tests
npm test ContextualLyraChatIntegration.test.tsx
npm test APIIntegration.test.tsx

# E2E tests
npm test E2EUserJourney.test.tsx

# Performance tests
npm test PerformanceAndMemory.test.tsx

# Error recovery tests
npm test ErrorRecoveryAndEdgeCases.test.tsx

# Accessibility tests
npm test AccessibilityAndResponsive.test.tsx
```

### All Tests
```bash
npm test src/components/lesson/chat/__tests__/
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Quality Metrics

### Coverage Requirements
- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

### Performance Benchmarks
- **Rendering**: <50ms for individual components
- **Integration**: <200ms for complete workflows
- **Memory**: <1MB increase during normal usage
- **API Calls**: <100ms response handling
- **Animations**: 60fps maintenance during state changes

### Accessibility Standards
- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: 100% functionality
- **Screen Reader**: Complete compatibility
- **Mobile**: Full responsive design support

## Best Practices Implemented

### Test Structure
- **Arrange-Act-Assert**: Clear test structure
- **Descriptive Names**: Tests explain behavior and expectations
- **Independent Tests**: No interdependencies between test cases
- **Comprehensive Mocking**: Reliable and consistent external dependencies

### Error Handling
- **Graceful Degradation**: Components continue functioning with errors
- **User-Friendly Messages**: Clear error communication
- **Recovery Mechanisms**: Automatic retry and fallback strategies
- **Logging**: Comprehensive error tracking for debugging

### Performance
- **Lazy Loading**: Non-critical components loaded on demand
- **Memory Management**: Proper cleanup and garbage collection
- **Efficient Rendering**: Optimized re-render strategies
- **Animation Optimization**: 60fps maintenance with reduced motion support

### Accessibility
- **Semantic HTML**: Proper heading structure and landmarks
- **ARIA Support**: Complete screen reader compatibility
- **Keyboard Navigation**: Full functionality without mouse
- **Visual Design**: High contrast and reduced motion support

## Maintenance

### Adding New Tests
1. Follow existing naming conventions
2. Include proper mocking setup
3. Add performance benchmarks for new features
4. Ensure accessibility compliance
5. Document test purpose and coverage

### Updating Tests
1. Maintain backward compatibility where possible
2. Update performance benchmarks as needed
3. Verify accessibility standards compliance
4. Review error handling coverage

### Test Data Management
- Use realistic but anonymized test data
- Maintain test data consistency across suites
- Regular cleanup of obsolete test scenarios

## Continuous Integration

### Pre-commit Hooks
- Run relevant tests for changed files
- Lint and format test files
- Verify coverage thresholds

### CI Pipeline
- Run full test suite on all branches
- Generate coverage reports
- Performance regression testing
- Accessibility audit integration

This comprehensive test suite ensures the ContextualLyraChat system is reliable, performant, accessible, and maintainable across all user scenarios and edge cases.