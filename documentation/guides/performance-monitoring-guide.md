# Performance Monitoring Guide

This guide explains how to use the comprehensive performance monitoring system in the Lyra AI Mentor application.

## Overview

The performance monitoring system tracks:
- Component load times (especially the 35 direct imports)
- Bundle size changes over time
- React render performance
- Error rates and types
- Memory usage patterns
- API call performance
- Web Vitals (LCP, FID, CLS)

## Accessing the Performance Dashboard

Navigate to `/performance` in your application to view the real-time performance dashboard.

## Automatic Alerts

The system automatically alerts when:
- Bundle size exceeds 2MB in production (currently 1.5MB)
  - Note: Bundle size tracking is disabled in development mode
  - Development loads ~4-5MB due to HMR, source maps, and individual modules
- Component load times exceed 100ms
- Object-to-primitive errors occur
- Memory leaks are detected (requires 10MB+ or 25%+ increase over 20 samples)
  - Note: Memory leak alerts are suppressed in development mode to avoid false positives
- Error rates exceed 5%

## Key Features

### 1. Component Performance Tracking

All directly imported components are automatically tracked:

```tsx
// Components are automatically wrapped with performance tracking
import { MayaEmailComposer } from '@/components/interactive/MayaEmailComposer';

// The component is tracked when loaded via directImportLoader
const component = getDirectComponent('MayaEmailComposer');
```

### 2. Manual Performance Tracking

For custom performance tracking in your components:

```tsx
import { usePerformanceTracking } from '@/monitoring/PerformanceMonitor';

function MyComponent() {
  const { trackRender, trackError } = usePerformanceTracking('MyComponent');
  
  useEffect(() => {
    trackRender();
  });
  
  // Track errors
  try {
    // Some operation
  } catch (error) {
    trackError(error);
  }
}
```

### 3. HOC for Automatic Tracking

Wrap any component with automatic performance tracking:

```tsx
import { withPerformanceTracking } from '@/monitoring/PerformanceMonitor';

const TrackedComponent = withPerformanceTracking(MyComponent, 'MyComponent');
```

### 4. API Performance Tracking

For Supabase queries:

```tsx
import { createSupabasePerformanceWrapper } from '@/monitoring/middleware';

const trackedSupabase = createSupabasePerformanceWrapper(supabase);
```

For fetch requests:

```tsx
import { performanceTrackedFetch } from '@/monitoring/middleware';

const response = await performanceTrackedFetch('/api/data');
```

## Performance Dashboard Features

### Real-time Metrics
- Live updating charts for render performance
- Memory usage visualization
- Component load time rankings
- Error distribution pie charts

### Alert Management
- Severity-based alert filtering
- Historical alert tracking
- Export alerts for analysis

### Data Export
- Export full performance reports as JSON
- Clear performance data when needed
- Auto-refresh toggle for real-time monitoring

## Best Practices

### 1. Component Optimization

Monitor the performance dashboard regularly to identify:
- Components with load times > 100ms
- Components with high render counts
- Memory-intensive components

### 2. Bundle Size Management

- Check the bundle size metric regularly
- The current bundle is 909KB, approaching the 1MB threshold
- Use code splitting for large features

### 3. Error Monitoring

- Review error patterns in the dashboard
- Address recurring errors promptly
- Check component stacks for error origins

### 4. Memory Management

- Monitor for memory leak alerts
- Check memory usage trends
- Clear unused data regularly

## Troubleshooting

### High Component Load Times

1. Check the Components tab in the dashboard
2. Identify components marked with "Slow Load" badge
3. Consider lazy loading or optimization

### Memory Leak Alerts

1. Check the Memory tab for usage patterns
2. Look for continuously increasing memory usage
3. Review component cleanup in useEffect returns

### Error Rate Spikes

1. Check the Errors tab for details
2. Review error types and frequencies
3. Check component stacks for error sources

## Configuration

Adjust performance thresholds in your code:

```tsx
import { PerformanceMonitor } from '@/monitoring/PerformanceMonitor';

PerformanceMonitor.setThresholds({
  bundleSizeKB: 1024,          // 1MB
  componentLoadTimeMs: 100,     // 100ms
  errorRatePercentage: 5,       // 5%
  memoryUsageMB: 512,          // 512MB
  renderTimeMs: 16             // 60fps target
});
```

## Integration with CI/CD

Export performance reports in your build pipeline:

```bash
# Visit /performance and export the report
# Or programmatically:
const report = PerformanceMonitor.getReport();
fs.writeFileSync('performance-report.json', JSON.stringify(report));
```

## Performance Impact

The monitoring system itself has minimal performance impact:
- Lightweight tracking using Performance API
- Efficient memory management (max 1000 metrics stored)
- Batched updates to prevent UI blocking
- Automatic cleanup of old data

## Future Enhancements

Planned features:
- Historical performance trends
- Automated performance regression detection
- Integration with external monitoring services
- Custom alert webhooks
- Performance budgets per component