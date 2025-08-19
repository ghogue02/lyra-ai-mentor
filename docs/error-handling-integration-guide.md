# Error Handling & Recovery System Integration Guide

This guide demonstrates how to integrate the comprehensive error handling and recovery system throughout the application.

## System Overview

The error handling system provides:

1. **Hierarchical Error Boundaries**: Different error boundaries for different contexts
2. **Automatic Recovery**: Self-healing mechanisms for common error types
3. **User Notifications**: Contextual error messages with recovery actions
4. **Fallback UIs**: Graceful degradation when components fail
5. **Comprehensive Logging**: Detailed error tracking and analytics

## Architecture

```
ApplicationErrorBoundary (Root Level)
├── AsyncErrorBoundary (Async Error Handling)
├── InteractionPatternErrorBoundary (Per Pattern)
├── CarmenComponentErrorBoundary (Per Component)
└── ErrorBoundaryProvider (Context & Hooks)
```

## Integration Steps

### 1. Application Root (Already Integrated)

The `App.tsx` has been enhanced with root-level error boundaries:

```tsx
<ApplicationErrorBoundary
  context="Application Root"
  enableAutoRecovery={true}
  maxRetries={3}
>
  <AsyncErrorBoundary enableAutoRecovery={true}>
    {/* Your app content */}
  </AsyncErrorBoundary>
</ApplicationErrorBoundary>
```

### 2. Interaction Pattern Components

Wrap interaction patterns with `InteractionPatternWrapper`:

```tsx
import { InteractionPatternWrapper } from '@/components/wrappers/InteractionPatternWrapper';

export const MyInteractionPattern = () => {
  return (
    <InteractionPatternWrapper
      patternType="decision-tree"
      enableFallbackMode={true}
      maxRetries={3}
    >
      <DecisionTreeComponent />
    </InteractionPatternWrapper>
  );
};
```

### 3. Carmen Components

Wrap Carmen components with `CarmenComponentWrapper`:

```tsx
import { CarmenComponentWrapper } from '@/components/wrappers/CarmenComponentWrapper';

export const MyCarmenComponent = () => {
  return (
    <CarmenComponentWrapper
      componentType="engagement-builder"
      chapterNumber={7}
      enableChapterRecovery={true}
      maxRetries={3}
    >
      <CarmenEngagementBuilder />
    </CarmenComponentWrapper>
  );
};
```

### 4. Error Handling in Components

Use the `useErrorHandler` hook for manual error handling:

```tsx
import { useErrorHandler } from '@/components/error-boundaries/ErrorBoundaryProvider';

const MyComponent = () => {
  const { handleError, handleNetworkError, isRecovering } = useErrorHandler();

  const performAsyncOperation = async () => {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      const recovered = await handleNetworkError(error, true);
      if (!recovered) {
        // Handle unrecoverable error
        console.error('Operation failed permanently:', error);
      }
    }
  };

  return (
    <div>
      {isRecovering && <div>Recovering from error...</div>}
      <button onClick={performAsyncOperation}>
        Perform Operation
      </button>
    </div>
  );
};
```

## Error Types and Recovery Strategies

### Network Errors
- **Auto-recovery**: Connection test, DNS refresh, offline mode
- **User actions**: Retry, wait, check connection
- **Fallback**: Cached content when available

### Chunk Loading Errors
- **Auto-recovery**: Clear chunk cache, reload dynamic imports
- **User actions**: Refresh page, clear browser cache
- **Fallback**: Basic functionality without dynamic imports

### State Corruption
- **Auto-recovery**: Reset application state, clear contexts
- **User actions**: Restart session, reload page
- **Fallback**: Default state with limited functionality

### Interaction Pattern Failures
- **Auto-recovery**: Reset pattern state, clear selections
- **User actions**: Simplified mode, alternative interface
- **Fallback**: Basic form-based interaction

### Carmen Component Errors
- **Auto-recovery**: Clear component state, reset progress
- **User actions**: Restart lesson, return to chapter hub
- **Fallback**: Chapter overview with navigation options

## Component Integration Examples

### Example 1: Enhanced Interaction Pattern

```tsx
// src/components/ui/interaction-patterns/ConversationalFlow.enhanced.tsx
import { InteractionPatternWrapper } from '@/components/wrappers/InteractionPatternWrapper';
import { useErrorHandler } from '@/components/error-boundaries/ErrorBoundaryProvider';

const ConversationalFlowInternal = ({ questions, onComplete }) => {
  const { handleInteractionPatternError } = useErrorHandler();

  const handleOptionSelect = async (questionId, optionId, option) => {
    try {
      // Your logic here
      const newResponses = { ...responses, [questionId]: optionId };
      setResponses(newResponses);
      
      if (option.nextQuestionId) {
        setCurrentQuestionId(option.nextQuestionId);
      } else {
        onComplete(newResponses);
      }
    } catch (error) {
      await handleInteractionPatternError(error, 'conversational', true);
    }
  };

  // Component render logic...
};

export const EnhancedConversationalFlow = (props) => (
  <InteractionPatternWrapper patternType="conversational">
    <ConversationalFlowInternal {...props} />
  </InteractionPatternWrapper>
);
```

### Example 2: Enhanced Carmen Component

```tsx
// src/components/lesson/carmen/CarmenEngagementBuilder.enhanced.tsx
import { CarmenComponentWrapper } from '@/components/wrappers/CarmenComponentWrapper';
import { ErrorBoundaryProvider, useErrorHandler } from '@/components/error-boundaries/ErrorBoundaryProvider';

const CarmenEngagementBuilderInternal = () => {
  const { handleCarmenComponentError, handleNetworkError } = useErrorHandler();

  const generateEngagementStrategy = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        // Request body
      });

      if (error) throw error;
      setGeneratedStrategy(data.content);
    } catch (error) {
      if (error.message.includes('network')) {
        await handleNetworkError(error);
      } else {
        await handleCarmenComponentError(error, 'engagement-builder', 7);
      }
    }
  };

  // Component render logic...
};

export const EnhancedCarmenEngagementBuilder = () => (
  <ErrorBoundaryProvider enableProgressiveRecovery={true}>
    <CarmenComponentWrapper 
      componentType="engagement-builder" 
      chapterNumber={7}
    >
      <CarmenEngagementBuilderInternal />
    </CarmenComponentWrapper>
  </ErrorBoundaryProvider>
);
```

## Testing Error Handling

The system includes comprehensive tests in `tests/error-handling/ErrorBoundary.test.tsx`:

```bash
# Run error handling tests
npm run test tests/error-handling/

# Run specific error boundary tests
npm run test -- --testNamePattern="ApplicationErrorBoundary"
```

## Monitoring and Analytics

### Error Statistics
```tsx
import { useErrorRecovery } from '@/hooks/error-handling/useErrorRecovery';

const ErrorDashboard = () => {
  const { getRecoveryStats } = useErrorRecovery();
  
  const stats = getRecoveryStats();
  
  return (
    <div>
      <h3>Error Recovery Statistics</h3>
      <p>Total Attempts: {stats.totalAttempts}</p>
      <p>Success Rate: {(stats.successRate * 100).toFixed(1)}%</p>
      <p>Average Duration: {stats.averageDuration}ms</p>
    </div>
  );
};
```

### Error Logging
```tsx
import { ErrorLogger } from '@/utils/error-handling/ErrorLogger';

const logger = new ErrorLogger();

// Log custom errors
await logger.logError({
  message: 'Custom error occurred',
  context: 'MyComponent',
  errorType: 'custom',
  // ... other details
});

// Get error statistics
const stats = logger.getErrorStats();
console.log('Error statistics:', stats);
```

## Migration Strategy

### Phase 1: Critical Components
1. ✅ Application root error boundaries
2. ✅ Carmen engagement builder
3. ✅ Key interaction patterns

### Phase 2: All Components
1. Wrap all Carmen components with error boundaries
2. Enhance all interaction patterns
3. Add error handling to all async operations

### Phase 3: Advanced Features
1. Implement custom recovery strategies
2. Add error analytics dashboard
3. Integrate with external error tracking services

## Configuration

### Environment Variables
```env
# Error handling configuration
REACT_APP_ERROR_REPORTING_ENABLED=true
REACT_APP_ERROR_RECOVERY_ENABLED=true
REACT_APP_MAX_RECOVERY_ATTEMPTS=3
REACT_APP_SHOW_ERROR_DETAILS=false
```

### Global Setup
```tsx
// src/main.tsx
import { setupGlobalErrorHandling } from '@/utils/error-handling';

// Setup global error handlers
setupGlobalErrorHandling();
```

## Best Practices

### 1. Error Boundary Placement
- Place error boundaries as close to potential failure points as possible
- Use specific error boundaries for different contexts
- Always provide meaningful fallback UIs

### 2. Error Handling
- Use the provided hooks for consistent error handling
- Implement progressive recovery strategies
- Always log errors for debugging and analytics

### 3. User Experience
- Provide clear error messages with actionable recovery steps
- Show recovery progress to users
- Offer multiple recovery options when possible

### 4. Testing
- Test error scenarios regularly
- Verify recovery mechanisms work correctly
- Monitor error rates in production

## Support and Troubleshooting

### Common Issues

1. **Error boundaries not catching errors**: Ensure you're using class components or the provided hooks
2. **Recovery not working**: Check network connectivity and browser permissions
3. **Infinite recovery loops**: Verify recovery conditions and max attempt limits

### Debug Mode
```tsx
// Enable detailed error logging
const app = (
  <ApplicationErrorBoundary showDetails={true}>
    <App />
  </ApplicationErrorBoundary>
);
```

### Error Reporting
All errors are automatically logged and can be sent to external services. Configure your error tracking service in the `ErrorLogger` class.

## Summary

This comprehensive error handling system provides:

- **Robust error recovery** for network, state, and component failures
- **User-friendly error messages** with actionable recovery options
- **Automatic fallback mechanisms** to maintain application functionality
- **Detailed error logging and analytics** for monitoring and debugging
- **Easy integration** with existing components and workflows

The system is designed to be unobtrusive while providing maximum protection against errors and ensuring the best possible user experience even when things go wrong.