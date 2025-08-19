# Memory Management Implementation Guide

This guide provides step-by-step instructions for implementing the memory management system in your React application.

## Quick Integration

### 1. Wrap Your App with AutoCleanupProvider

```tsx
// src/App.tsx
import React from 'react';
import { AutoCleanupProvider } from '@/components/memory-management';
import { MemoryMonitoringDashboard } from '@/components/memory-management';

function App() {
  return (
    <AutoCleanupProvider 
      options={{
        enableMemoryTracking: true,
        enableLeakDetection: true,
        maxCacheEntries: 200,
        cacheTimeout: 300000, // 5 minutes
        gcInterval: 60000,     // 1 minute
        onMemoryWarning: (metrics) => {
          console.warn('Memory warning:', metrics);
          // Optional: Show user notification
        },
        onLeakDetected: (report) => {
          console.error('Memory leak detected:', report);
          // Optional: Send to error tracking service
        }
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Add memory monitoring for admins */}
          <Route path="/admin/memory" element={<MemoryMonitoringDashboard />} />
        </Routes>
      </Router>
    </AutoCleanupProvider>
  );
}
```

### 2. Update Existing Components

#### Chat Components
```tsx
// Before
import { useState, useEffect, useRef } from 'react';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const subscription = chatService.subscribe(handleMessage);
    // ❌ No cleanup - potential memory leak
  }, []);
}

// After
import { useState, useEffect, useRef } from 'react';
import { useCleanup, useMemoryManager } from '@/hooks/memory-management';

function ChatComponent() {
  const { registerCleanup } = useCleanup();
  const { createCache } = useMemoryManager();
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Create cache for messages
    const messageCache = createCache('chatMessages', 100, 300000);
    
    const subscription = chatService.subscribe(handleMessage);
    
    // ✅ Automatic cleanup
    return registerCleanup(() => {
      subscription.unsubscribe();
      messageCache.clear();
    });
  }, [registerCleanup, createCache]);
}
```

#### Context Providers
```tsx
// Before
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  // ❌ No memory management
  
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

// After
import { useCleanup, useMemoryManager } from '@/hooks/memory-management';

export const ChatProvider = ({ children }) => {
  const { registerCleanup } = useCleanup();
  const { createCache, createWeakRef } = useMemoryManager();
  const [state, dispatch] = useReducer(chatReducer, initialState);
  
  useEffect(() => {
    // Create caches for conversation data
    const conversationCache = createCache('conversations', 50, 600000);
    const messageCache = createCache('messages', 200, 300000);
    
    // Register cleanup
    return registerCleanup(() => {
      conversationCache.clear();
      messageCache.clear();
    });
  }, [registerCleanup, createCache]);
  
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
```

#### Interactive Components
```tsx
// Before
function InteractiveComponent() {
  const [interactionState, setInteractionState] = useState({});
  
  useEffect(() => {
    const timer = setInterval(updateState, 1000);
    window.addEventListener('resize', handleResize);
    // ❌ No cleanup
  }, []);
}

// After
import { useCleanup, useTimerCleanup, useEventListenerCleanup } from '@/hooks/memory-management';

function InteractiveComponent() {
  const { registerCleanup } = useCleanup();
  const { setInterval } = useTimerCleanup();
  const { addEventListener } = useEventListenerCleanup();
  const [interactionState, setInteractionState] = useState({});
  
  useEffect(() => {
    // ✅ Auto-cleanup timers and event listeners
    const timer = setInterval(updateState, 1000);
    addEventListener(window, 'resize', handleResize);
    
    // Additional cleanup if needed
    return registerCleanup(() => {
      console.log('InteractiveComponent: Custom cleanup executed');
    });
  }, [setInterval, addEventListener, registerCleanup]);
}
```

### 3. Add Memory Leak Detection

```tsx
import { useMemoryLeakDetector } from '@/hooks/memory-management';

function SuspiciousComponent() {
  const leakDetector = useMemoryLeakDetector({
    componentName: 'SuspiciousComponent',
    trackEventListeners: true,
    trackTimers: true,
    trackMemoryUsage: true,
    onLeakDetected: (report) => {
      // Send to monitoring service
      errorTracker.captureException(new Error(`Memory leak: ${report.description}`), {
        extra: report
      });
    }
  });
  
  // Component implementation
  return (
    <div>
      <div>Renders: {leakDetector.metrics.renderCount}</div>
      {leakDetector.hasLeaks && (
        <div className=\"text-red-600\">
          ⚠️ Memory leaks detected: {leakDetector.reports.length}
        </div>\n      )}\n    </div>\n  );\n}\n```\n\n### 4. Implement State Garbage Collection\n\n```tsx\nimport { useStateGarbageCollector } from '@/hooks/memory-management';\n\nfunction StatefulComponent() {\n  const { setState, getState, deleteState } = useStateGarbageCollector({\n    maxStateEntries: 100,\n    ttl: 300000, // 5 minutes\n    enablePriorityEviction: true,\n    onStateEvicted: (key, value) => {\n      console.log(`State evicted: ${key}`);\n    }\n  });\n  \n  const handleUserAction = (actionData) => {\n    // Store with appropriate priority\n    setState('userSession', sessionData, 'high');      // Keep longer\n    setState('tempUIState', uiData, 'low');           // Evict first\n    setState('cachedResults', results, 'medium');      // Balanced\n  };\n  \n  const getUserSession = () => {\n    return getState('userSession');\n  };\n  \n  const clearUserSession = () => {\n    deleteState('userSession');\n  };\n  \n  return (\n    <div>\n      {/* Component UI */}\n    </div>\n  );\n}\n```\n\n## Performance Optimization Patterns\n\n### 1. Efficient Caching Strategy\n\n```tsx\nfunction DataHeavyComponent() {\n  const { createCache } = useMemoryManager();\n  \n  // Different cache strategies for different data types\n  const userCache = createCache('users', 50, 600000);        // 10 min TTL\n  const searchCache = createCache('search', 100, 60000);     // 1 min TTL\n  const staticCache = createCache('static', 20, 1800000);    // 30 min TTL\n  \n  const fetchUserData = async (userId) => {\n    // Check cache first\n    let userData = userCache.get(userId);\n    if (userData) {\n      return userData;\n    }\n    \n    // Fetch and cache\n    userData = await api.getUser(userId);\n    userCache.set(userId, userData);\n    return userData;\n  };\n}\n```\n\n### 2. Weak Reference Usage\n\n```tsx\nfunction ComponentWithLargeData() {\n  const { createWeakRef, getWeakRef } = useMemoryManager();\n  \n  const handleLargeDataLoad = (largeObject) => {\n    // Store as weak reference to allow GC when not needed\n    const weakRef = createWeakRef('largeData', largeObject);\n    \n    // Later retrieval\n    const data = getWeakRef('largeData');\n    if (data) {\n      // Data still available\n      processData(data);\n    } else {\n      // Data was garbage collected, reload if needed\n      reloadLargeData();\n    }\n  };\n}\n```\n\n### 3. Memory-Aware Component Design\n\n```tsx\n// Use HOC for automatic cleanup\nimport { withAutoCleanup } from '@/components/memory-management';\n\nconst ExpensiveComponent = withAutoCleanup(\n  function ExpensiveComponent({ data }) {\n    // Component automatically gets lifecycle tracking\n    return <div>{/* Complex UI */}</div>;\n  },\n  {\n    componentName: 'ExpensiveComponent',\n    trackLeaks: true\n  }\n);\n\n// Or use memory-aware hooks directly\nfunction MemoryAwareComponent() {\n  const { trackDOMReference } = useMemoryLeakDetector();\n  const elementRef = useRef();\n  \n  useEffect(() => {\n    // Track DOM reference to detect leaks\n    return trackDOMReference(elementRef.current);\n  }, [trackDOMReference]);\n  \n  return <div ref={elementRef}>Content</div>;\n}\n```\n\n## Monitoring and Debugging\n\n### 1. Development Mode Monitoring\n\n```tsx\n// Add to your development environment\nif (process.env.NODE_ENV === 'development') {\n  // Enable detailed logging\n  window.memoryDebug = true;\n  \n  // Add global memory monitoring\n  setInterval(() => {\n    if (performance.memory) {\n      console.log('Memory usage:', {\n        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',\n        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',\n        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'\n      });\n    }\n  }, 10000); // Every 10 seconds\n}\n```\n\n### 2. Production Monitoring\n\n```tsx\n// Add to error tracking service\nconst memoryManager = useMemoryManager({\n  trackMetrics: true,\n  onMemoryWarning: (metrics) => {\n    // Send to monitoring service\n    analytics.track('memory_warning', {\n      heapUsed: metrics.heapUsed,\n      heapTotal: metrics.heapTotal,\n      timestamp: metrics.timestamp\n    });\n  }\n});\n\nconst leakDetector = useMemoryLeakDetector({\n  onLeakDetected: (report) => {\n    // Send to error tracking\n    errorService.captureException(new Error('Memory leak detected'), {\n      extra: report,\n      tags: {\n        component: report.componentName,\n        severity: report.severity,\n        type: report.leakType\n      }\n    });\n  }\n});\n```\n\n### 3. Memory Dashboard Integration\n\n```tsx\n// Admin dashboard with memory monitoring\nfunction AdminDashboard() {\n  const [showMemoryDashboard, setShowMemoryDashboard] = useState(false);\n  \n  return (\n    <div>\n      <nav>\n        <button onClick={() => setShowMemoryDashboard(!showMemoryDashboard)}>\n          Memory Monitor\n        </button>\n      </nav>\n      \n      {showMemoryDashboard && (\n        <MemoryMonitoringDashboard \n          refreshInterval={5000}\n          showDetailedMetrics={true}\n          className=\"fixed top-0 right-0 w-96 h-screen bg-white shadow-lg z-50\"\n        />\n      )}\n      \n      {/* Rest of admin dashboard */}\n    </div>\n  );\n}\n```\n\n## Common Pitfalls and Solutions\n\n### 1. Circular References\n\n```tsx\n// ❌ Bad: Circular reference\nconst parent = { name: 'parent' };\nconst child = { name: 'child', parent };\nparent.child = child; // Creates circular reference\n\n// ✅ Good: Use weak references\nconst { createWeakRef } = useMemoryManager();\nconst parent = { name: 'parent' };\nconst child = { name: 'child' };\nconst parentWeakRef = createWeakRef('parent', parent);\nchild.getParent = () => parentWeakRef.deref();\n```\n\n### 2. Event Listener Accumulation\n\n```tsx\n// ❌ Bad: Event listeners not cleaned up\nuseEffect(() => {\n  const handler = () => {};\n  window.addEventListener('scroll', handler);\n  // Missing cleanup\n}, []);\n\n// ✅ Good: Automatic cleanup\nconst { addEventListener } = useEventListenerCleanup();\nuseEffect(() => {\n  const handler = () => {};\n  addEventListener(window, 'scroll', handler); // Auto-cleanup\n}, [addEventListener]);\n```\n\n### 3. Large State Accumulation\n\n```tsx\n// ❌ Bad: Unlimited state growth\nconst [cache, setCache] = useState({});\nconst addToCache = (key, value) => {\n  setCache(prev => ({ ...prev, [key]: value })); // Grows indefinitely\n};\n\n// ✅ Good: Managed state with GC\nconst { setState } = useStateGarbageCollector();\nconst addToCache = (key, value) => {\n  setState(key, value, 'medium'); // Auto-eviction when limits reached\n};\n```\n\n## Testing Memory Management\n\n### 1. Unit Tests\n\n```tsx\nimport { renderHook, act } from '@testing-library/react';\nimport { useCleanup } from '@/hooks/memory-management';\n\ntest('should execute cleanup on unmount', () => {\n  const cleanup = jest.fn();\n  const { result, unmount } = renderHook(() => useCleanup());\n  \n  act(() => {\n    result.current.registerCleanup(cleanup);\n  });\n  \n  unmount();\n  \n  expect(cleanup).toHaveBeenCalledTimes(1);\n});\n```\n\n### 2. Integration Tests\n\n```tsx\nimport { render, screen, waitFor } from '@testing-library/react';\nimport { AutoCleanupProvider } from '@/components/memory-management';\n\ntest('should provide memory management context', async () => {\n  const TestComponent = () => {\n    const { registerCleanup } = useAutoCleanup();\n    return <div>{registerCleanup ? 'has-context' : 'no-context'}</div>;\n  };\n  \n  render(\n    <AutoCleanupProvider>\n      <TestComponent />\n    </AutoCleanupProvider>\n  );\n  \n  await waitFor(() => {\n    expect(screen.getByText('has-context')).toBeInTheDocument();\n  });\n});\n```\n\n### 3. Memory Leak Tests\n\n```tsx\ntest('should detect memory leaks', async () => {\n  const onLeakDetected = jest.fn();\n  \n  const LeakyComponent = () => {\n    useMemoryLeakDetector({\n      componentName: 'LeakyComponent',\n      onLeakDetected\n    });\n    \n    // Simulate leak\n    useEffect(() => {\n      const timer = setInterval(() => {}, 1000);\n      // Intentionally no cleanup\n    }, []);\n    \n    return <div>Leaky</div>;\n  };\n  \n  const { unmount } = render(<LeakyComponent />);\n  unmount();\n  \n  await waitFor(() => {\n    expect(onLeakDetected).toHaveBeenCalled();\n  });\n});\n```\n\n## Migration Checklist\n\n### Phase 1: Setup\n- [ ] Install memory management system\n- [ ] Wrap app with AutoCleanupProvider\n- [ ] Add memory monitoring dashboard for development\n- [ ] Configure error tracking for memory warnings\n\n### Phase 2: Critical Components\n- [ ] Update chat components with cleanup hooks\n- [ ] Add memory management to context providers\n- [ ] Implement state garbage collection for large forms\n- [ ] Add leak detection to performance-critical components\n\n### Phase 3: Optimization\n- [ ] Implement caching strategies for API calls\n- [ ] Add weak references for large data objects\n- [ ] Optimize interaction pattern state management\n- [ ] Add memory monitoring to production\n\n### Phase 4: Validation\n- [ ] Run memory leak detection tests\n- [ ] Validate cleanup functionality\n- [ ] Monitor production memory usage\n- [ ] Document memory management patterns\n\n## Troubleshooting\n\n### High Memory Usage\n1. Check memory dashboard for specific issues\n2. Review cache sizes and TTL settings\n3. Look for components with high render counts\n4. Identify large objects that should use weak references\n\n### Memory Leaks\n1. Review leak detection reports\n2. Ensure all event listeners have cleanup\n3. Check for circular references\n4. Verify timer cleanup\n\n### Performance Issues\n1. Optimize cache hit rates\n2. Adjust garbage collection intervals\n3. Use priority-based state eviction\n4. Implement lazy loading for heavy components\n\nBy following this implementation guide, you'll have a robust memory management system that prevents leaks, optimizes performance, and provides valuable insights into your application's memory usage.\n"