# Interactive Element Analytics Guide

## Overview

The Interactive Element Analytics system provides comprehensive tracking and analysis capabilities for all interactive elements in the Lyra AI Mentor platform. This privacy-first system enables data-driven improvements while maintaining GDPR compliance.

## Architecture

### Core Components

1. **Analytics Service** (`/src/analytics/InteractiveElementAnalytics.ts`)
   - Centralized event tracking and management
   - Event queue with batch processing
   - Session management
   - Privacy controls

2. **Analytics Hook** (`/src/hooks/useElementAnalytics.ts`)
   - Easy integration for interactive components
   - Automatic lifecycle tracking
   - Phase and interaction tracking
   - A/B testing support

3. **Analytics Dashboard** (`/src/pages/AnalyticsDashboard.tsx`)
   - Comprehensive visualization of metrics
   - Performance analysis
   - User journey patterns
   - Improvement recommendations

4. **Consent Component** (`/src/components/AnalyticsConsent.tsx`)
   - GDPR-compliant consent management
   - Persistent user preferences
   - Clear privacy information

5. **A/B Testing Framework** (`/src/components/ABTestManager.tsx`)
   - Create and manage experiments
   - Variant configuration
   - Statistical analysis
   - Performance comparison

## Event Types

The system tracks the following event types:

### Lifecycle Events
- `ELEMENT_LOADED` - When element is rendered
- `ELEMENT_STARTED` - When user begins interaction
- `ELEMENT_COMPLETED` - When user successfully completes
- `ELEMENT_ABANDONED` - When user leaves without completing

### Phase Events
- `PHASE_STARTED` - Multi-phase element progress
- `PHASE_COMPLETED` - Phase completion tracking

### Interaction Events
- `USER_INTERACTION` - General user actions
- `INPUT_SUBMITTED` - Form/input submissions
- `OPTION_SELECTED` - Choice selections
- `RETRY_ATTEMPTED` - Retry tracking

### Support Events
- `HELP_REQUESTED` - Help feature usage
- `HINT_VIEWED` - Hint system engagement
- `ERROR_OCCURRED` - Error tracking
- `VALIDATION_FAILED` - Validation issues

## Implementation Guide

### 1. Basic Integration

Add analytics to any interactive element:

```typescript
import { useElementAnalytics } from '@/hooks/useElementAnalytics';

const MyInteractiveElement = ({ element, onComplete, analytics }) => {
  // Analytics is already initialized if passed from InteractiveElementRenderer
  
  // Track interactions
  const handleUserAction = () => {
    analytics.trackInteraction('button_click', { 
      buttonId: 'submit',
      value: userInput 
    });
  };
  
  // Track phase progression
  const handlePhaseChange = (phase) => {
    analytics.trackPhaseComplete(currentPhase);
    analytics.trackPhaseStart(phase);
  };
  
  return (
    // Your component JSX
  );
};
```

### 2. Time Tracking

Track time spent on elements or phases:

```typescript
// Start timing
analytics.startTimer(); // For entire element
analytics.startTimer('phase1'); // For specific phase

// Stop timing and get duration
const timeSpent = analytics.stopTimer();
const phaseTime = analytics.stopTimer('phase1');
```

### 3. Error Handling

Track errors and validation issues:

```typescript
try {
  // User action
} catch (error) {
  analytics.trackError(error.message, {
    errorType: 'validation',
    field: 'email',
    attemptNumber: retryCount
  });
}
```

### 4. A/B Testing

Enable A/B testing for an element:

```typescript
const MyElement = ({ element }) => {
  const analytics = useElementAnalytics({
    elementId: element.id,
    elementType: element.type,
    lessonId: element.lessonId,
    enableABTesting: true // Enable A/B testing
  });
  
  // Use variant configuration
  if (analytics.variant) {
    const { configuration } = analytics.variant;
    // Apply variant-specific settings
  }
  
  // Track conversion
  const handleSuccess = () => {
    analytics.trackVariantConversion();
    analytics.trackComplete();
  };
};
```

## Privacy and Compliance

### GDPR Compliance

1. **Explicit Consent**: Users must opt-in to analytics
2. **Anonymous Tracking**: No PII is collected
3. **Data Minimization**: Only necessary data is tracked
4. **User Control**: Users can revoke consent anytime
5. **Transparency**: Clear information about data usage

### Consent Management

The system checks for consent before tracking:

```typescript
// Check consent status
const consent = localStorage.getItem('analytics_consent');

// Set consent programmatically
import { setAnalyticsConsent } from '@/analytics/InteractiveElementAnalytics';
setAnalyticsConsent(true); // Grant consent
setAnalyticsConsent(false); // Revoke consent
```

## Dashboard Features

### Performance Metrics
- Completion rates by element
- Average time spent
- Retry and error rates
- Engagement scores

### User Journey Analysis
- Common interaction patterns
- Drop-off points
- Success paths
- Time-based trends

### Improvement Insights
- AI-powered recommendations
- A/B testing opportunities
- Performance comparisons
- Failure point identification

## Database Schema

### Required Tables

```sql
-- Event tracking table
CREATE TABLE element_analytics_events (
  id SERIAL PRIMARY KEY,
  element_id INTEGER NOT NULL,
  element_type VARCHAR(100) NOT NULL,
  lesson_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP NOT NULL,
  session_id VARCHAR(100) NOT NULL
);

-- Aggregated analytics summary
CREATE TABLE element_analytics_summary (
  element_id INTEGER PRIMARY KEY,
  element_type VARCHAR(100) NOT NULL,
  element_title TEXT,
  lesson_id INTEGER NOT NULL,
  user_id UUID,
  start_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  abandonment_count INTEGER DEFAULT 0,
  completion_rate FLOAT DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  average_time_spent INTEGER DEFAULT 0,
  min_time_spent INTEGER,
  max_time_spent INTEGER,
  total_interactions INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  hint_view_count INTEGER DEFAULT 0,
  help_request_count INTEGER DEFAULT 0,
  phase_completions JSONB,
  average_phase_time JSONB,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- A/B test variants
CREATE TABLE ab_test_variants (
  variant_id VARCHAR(100) PRIMARY KEY,
  element_id INTEGER NOT NULL,
  variant_name VARCHAR(100) NOT NULL,
  configuration JSONB NOT NULL,
  weight FLOAT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- A/B test results
CREATE TABLE ab_test_results (
  variant_id VARCHAR(100) PRIMARY KEY,
  element_id INTEGER NOT NULL,
  sample_size INTEGER DEFAULT 0,
  completion_rate FLOAT DEFAULT 0,
  average_time_spent INTEGER DEFAULT 0,
  engagement_score FLOAT DEFAULT 0,
  statistical_significance FLOAT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

## Best Practices

### 1. Meaningful Event Names
Use descriptive, consistent event names:
- ✅ `quiz_answer_submitted`
- ❌ `click1`

### 2. Contextual Data
Include relevant context with events:
```typescript
analytics.trackInteraction('answer_selected', {
  questionId: 'q1',
  selectedOption: 'B',
  isCorrect: true,
  timeToAnswer: 15
});
```

### 3. Batch Operations
The system automatically batches events for efficiency. Events are flushed:
- Every 30 seconds
- On critical events (completion, errors)
- On page unload

### 4. Performance Considerations
- Analytics tracking is asynchronous
- Events are queued to prevent blocking
- Failed events are retried automatically

### 5. Testing Analytics
During development:
```typescript
// Enable debug mode
if (process.env.NODE_ENV === 'development') {
  window.analyticsDebug = true;
}

// View queued events
console.log(analyticsService.eventQueue);
```

## Troubleshooting

### Events Not Appearing
1. Check consent status in browser storage
2. Verify user is authenticated
3. Check for network errors in console
4. Ensure database tables exist

### Incorrect Metrics
1. Verify event types are correct
2. Check timestamp accuracy
3. Review aggregation logic
4. Clear and recalculate summaries

### A/B Test Issues
1. Ensure variant weights sum to 1.0
2. Check variant configuration format
3. Verify sufficient sample size
4. Review statistical calculations

## Future Enhancements

1. **Real-time Analytics**: WebSocket-based live tracking
2. **Custom Dashboards**: User-configurable views
3. **Export Capabilities**: CSV/PDF reports
4. **Machine Learning**: Predictive analytics
5. **Funnel Analysis**: Multi-element journey tracking
6. **Cohort Analysis**: User segment comparison
7. **Heat Maps**: Visual interaction tracking
8. **Alerts**: Automated performance notifications

## Support

For questions or issues with the analytics system:
1. Check this documentation
2. Review error logs in browser console
3. Verify database schema matches requirements
4. Contact the development team with specific error messages