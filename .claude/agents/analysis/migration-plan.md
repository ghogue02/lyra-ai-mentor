# Chat System Migration Plan - From Dual to Unified Architecture

## Migration Overview

This document outlines the step-by-step migration from the current dual chat system to the unified ChatSystem architecture, ensuring zero downtime and maintaining all existing functionality.

## Pre-Migration Analysis

### Current File Structure
```
src/components/lesson/chat/
├── ContextualLyraChat.tsx (ROOT - 625 lines)
├── lyra/
│   └── ContextualLyraChat.tsx (NESTED - 353 lines)
├── ChatHeader.tsx (47 lines)
├── ChatInput.tsx (76 lines)  
├── ChatMessages.tsx (173 lines)
├── FormattedMessage.tsx
├── shared/
│   └── ChatMessage.tsx
└── __tests__/
    ├── ContextualLyraChatIntegration.test.tsx
    └── [other test files]
```

### Dependencies Analysis
```typescript
// ROOT ContextualLyraChat.tsx imports:
import { useLyraChat } from '@/hooks/useLyraChat';
import { getMayaContextualQuestions } from './maya/Chapter2ContextualQuestions';
import { ChatMessage } from '../shared/ChatMessage';

// NESTED ContextualLyraChat.tsx imports:  
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LessonContext, ContextualQuestion, ChatEngagement } from '@/types/ContextualChat';
```

## Migration Strategy: Feature Flag Approach

### Phase 1: Foundation Setup (Day 1-2)

#### Step 1.1: Create New Architecture Foundation
```bash
# Create new component structure
mkdir -p src/components/chat-system/{core,providers,hooks}

# New files to create:
src/components/chat-system/
├── index.ts                     # Export all components
├── ChatSystem.tsx              # Root component
├── core/
│   ├── ChatAvatar.tsx          # Floating state
│   ├── ChatContainer.tsx       # Expanded state  
│   ├── ChatContent.tsx         # Message area
│   └── ChatControls.tsx        # Input area
├── providers/
│   ├── ChatSystemProvider.tsx  # Context provider
│   └── ChatSystemContext.ts    # Context definition
└── hooks/
    ├── useChatSystem.ts        # Main hook
    ├── useChatKeyboard.ts      # Keyboard handling
    └── useChatPerformance.ts   # Performance optimizations
```

#### Step 1.2: Create Feature Flag System
```typescript
// src/config/features.ts
export const FEATURES = {
  UNIFIED_CHAT_SYSTEM: process.env.REACT_APP_UNIFIED_CHAT === 'true',
  // Enable via environment variable for gradual rollout
} as const;

// Usage in components:
import { FEATURES } from '@/config/features';

export const SomeLesson = () => {
  return (
    <div>
      {FEATURES.UNIFIED_CHAT_SYSTEM ? (
        <ChatSystem lessonContext={context} />
      ) : (
        <ContextualLyraChat lessonContext={context} />
      )}
    </div>
  );
};
```

### Phase 2: Core Component Development (Day 3-5)

#### Step 2.1: ChatSystemProvider Implementation
```typescript
// src/components/chat-system/providers/ChatSystemProvider.tsx
import React, { createContext, useReducer, useCallback } from 'react';
import { chatSystemReducer, initialState } from './chatSystemReducer';
import { ChatSystemState, ChatSystemActions } from './types';

interface ChatSystemContextValue {
  state: ChatSystemState;
  actions: ChatSystemActions;
}

export const ChatSystemContext = createContext<ChatSystemContextValue | null>(null);

export const ChatSystemProvider: React.FC<{
  children: React.ReactNode;
  lessonContext: LessonContext;
  config?: ChatSystemConfig;
  onEngagementChange?: (engagement: ChatEngagement) => void;
  onNarrativeControl?: (action: 'pause' | 'resume') => void;
}> = ({ 
  children, 
  lessonContext, 
  config = DEFAULT_CONFIG,
  onEngagementChange,
  onNarrativeControl 
}) => {
  const [state, dispatch] = useReducer(chatSystemReducer, {
    ...initialState,
    lessonContext,
    config
  });

  const actions = useMemo(() => ({
    toggleExpanded: () => dispatch({ type: 'TOGGLE_EXPANDED' }),
    sendMessage: async (content: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Integrate existing chat API logic
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, lessonContext })
        });
        const data = await response.json();
        dispatch({ type: 'ADD_MESSAGE', payload: data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    selectQuestion: async (question: ContextualQuestion) => {
      return actions.sendMessage(question.text);
    },
    // ... other actions
  }), [state]);

  // Handle side effects
  useEffect(() => {
    if (state.isExpanded && onNarrativeControl) {
      onNarrativeControl('pause');
    } else if (!state.isExpanded && onNarrativeControl) {
      onNarrativeControl('resume');
    }
  }, [state.isExpanded, onNarrativeControl]);

  useEffect(() => {
    if (onEngagementChange) {
      onEngagementChange(state.engagement.isEngaged, state.engagement.exchangeCount);
    }
  }, [state.engagement, onEngagementChange]);

  return (
    <ChatSystemContext.Provider value={{ state, actions }}>
      {children}
    </ChatSystemContext.Provider>
  );
};
```

#### Step 2.2: ChatSystem Root Component
```typescript
// src/components/chat-system/ChatSystem.tsx
import React from 'react';
import { ChatSystemProvider } from './providers/ChatSystemProvider';
import { ChatAvatar } from './core/ChatAvatar';
import { ChatContainer } from './core/ChatContainer';
import { cn } from '@/lib/utils';

export interface ChatSystemProps {
  lessonContext: LessonContext;
  mayaJourneyState?: MayaJourneyState;
  variant?: 'floating' | 'embedded' | 'fullscreen';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  config?: ChatSystemConfig;
  onEngagementChange?: (engagement: ChatEngagement) => void;
  onNarrativeControl?: (action: 'pause' | 'resume') => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({
  lessonContext,
  mayaJourneyState,
  variant = 'floating',
  position = 'bottom-right', 
  className,
  config,
  onEngagementChange,
  onNarrativeControl
}) => {
  return (
    <ChatSystemProvider
      lessonContext={lessonContext}
      config={{ ...config, mayaJourneyState }}
      onEngagementChange={onEngagementChange}
      onNarrativeControl={onNarrativeControl}
    >
      <div className={cn(
        'chat-system',
        `chat-system--${variant}`,
        `chat-system--${position}`,
        // Neumorphic base styling
        'nm-interactive',
        className
      )}>
        {variant === 'floating' && <ChatAvatar />}
        <ChatContainer />
      </div>
    </ChatSystemProvider>
  );
};

export default ChatSystem;
```

#### Step 2.3: ChatAvatar Component (Floating State)
```typescript
// src/components/chat-system/core/ChatAvatar.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useChatSystem } from '../hooks/useChatSystem';
import { cn } from '@/lib/utils';

export const ChatAvatar: React.FC = () => {
  const { state, actions } = useChatSystem();
  
  if (state.isExpanded) return null;
  
  return (
    <motion.div
      className={cn(
        // Neumorphic button styling
        'nm-button nm-rounded-full nm-shadow-floating',
        'nm-interactive nm-animate-float',
        // Position styling
        'fixed z-50 cursor-pointer',
        'bottom-6 right-6', // Default position - make configurable
        // Hover effects
        'hover:nm-shadow-accent hover:scale-105',
        'active:scale-95'
      )}
      onClick={actions.toggleExpanded}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <LyraAvatar 
        size="lg" 
        expression="helping"
        className="nm-shadow-floating" 
      />
      
      {/* Notification indicator */}
      {state.engagement.hasNewSuggestions && (
        <motion.div 
          className="absolute -top-1 -right-1 w-3 h-3 nm-gradient-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Tooltip */}
      <div className={cn(
        'absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100',
        'transition-opacity duration-200 pointer-events-none',
        'nm-card nm-shadow-subtle nm-p-sm nm-rounded-md',
        'text-xs whitespace-nowrap'
      )}>
        Chat with Lyra about {state.lessonContext.lessonTitle}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
      </div>
    </motion.div>
  );
};
```

### Phase 3: Component Migration (Day 6-8)

#### Step 3.1: Migrate Existing Logic
```typescript
// Migration helper to extract logic from existing components
export const migrateContextualQuestions = (
  lessonContext: LessonContext,
  mayaJourneyState?: MayaJourneyState
): ContextualQuestion[] => {
  // Extract logic from both existing ContextualLyraChat components
  if (lessonContext.chapterNumber === 2 && mayaJourneyState) {
    return getMayaContextualQuestions(lessonContext, mayaJourneyState);
  }
  
  // Merge logic from both components
  return getUnifiedContextualQuestions(lessonContext);
};

// Extract chat logic from useLyraChat hook
export const useChatIntegration = (lessonContext: LessonContext) => {
  const { messages, sendMessage, clearChat, isLoading } = useLyraChat({
    chapterTitle: lessonContext.chapterTitle || `Chapter ${lessonContext.chapterNumber}`,
    lessonTitle: lessonContext.lessonTitle,
    content: lessonContext.content,
    lessonContext: lessonContext
  });

  return { messages, sendMessage, clearChat, isLoading };
};
```

#### Step 3.2: Create Compatibility Layer
```typescript
// src/components/chat-system/compat/LegacyWrapper.tsx
// Wrapper to maintain existing API while using new implementation
export const ContextualLyraChatCompat: React.FC<ContextualLyraChatProps> = (props) => {
  // Map old props to new ChatSystem props
  const chatSystemProps: ChatSystemProps = {
    lessonContext: props.lessonContext,
    mayaJourneyState: props.mayaJourneyState,
    variant: props.isFloating ? 'floating' : 'embedded',
    config: {
      theme: 'neumorphic',
      autoExpand: props.expanded,
      // Map other legacy config
    },
    onEngagementChange: props.onEngagementChange,
    onNarrativeControl: (action) => {
      if (action === 'pause') props.onNarrativePause?.();
      if (action === 'resume') props.onNarrativeResume?.();
    }
  };

  return <ChatSystem {...chatSystemProps} />;
};
```

### Phase 4: Gradual Rollout (Day 9-12)

#### Step 4.1: Component-by-Component Migration
```typescript
// Migration order (lowest risk first):
1. FloatingLyraAvatar components (isolated usage)
2. Lesson-specific chat instances (controlled environment)
3. Chapter 1 lessons (simplest context)
4. Chapter 2 Maya integration (complex logic)
5. Main dashboard chat (highest traffic)

// Example migration for a lesson:
// Before:
import { ContextualLyraChat } from '@/components/lesson/chat/ContextualLyraChat';

// After:
import { ChatSystem } from '@/components/chat-system';
// Or during transition:
import { FEATURES } from '@/config/features';
import { ChatSystem } from '@/components/chat-system';
import { ContextualLyraChat } from '@/components/lesson/chat/ContextualLyraChat';

const LessonComponent = () => {
  return (
    <div>
      {FEATURES.UNIFIED_CHAT_SYSTEM ? (
        <ChatSystem lessonContext={context} />
      ) : (
        <ContextualLyraChat lessonContext={context} />
      )}
    </div>
  );
};
```

#### Step 4.2: A/B Testing Setup
```typescript
// src/hooks/useChatVariant.ts
export const useChatVariant = (userId?: string) => {
  const [variant, setVariant] = useState<'legacy' | 'unified'>('legacy');
  
  useEffect(() => {
    // Gradual rollout logic
    const rolloutPercentage = 25; // Start with 25% of users
    const hash = userId ? hashCode(userId) : Math.random() * 100;
    
    if (hash < rolloutPercentage || FEATURES.UNIFIED_CHAT_SYSTEM) {
      setVariant('unified');
    }
  }, [userId]);
  
  return variant;
};

// Usage:
const SomeComponent = () => {
  const variant = useChatVariant(user?.id);
  
  return variant === 'unified' ? 
    <ChatSystem {...props} /> : 
    <ContextualLyraChat {...props} />;
};
```

### Phase 5: Testing & Validation (Day 13-15)

#### Step 5.1: Automated Testing
```typescript
// src/components/chat-system/__tests__/migration.test.tsx
describe('Chat System Migration', () => {
  it('maintains feature parity with legacy component', async () => {
    const legacyProps = {
      lessonContext: mockLessonContext,
      onEngagementChange: jest.fn(),
      onNarrativePause: jest.fn()
    };

    // Test legacy component
    const { unmount: unmountLegacy } = render(
      <ContextualLyraChat {...legacyProps} />
    );
    const legacyMessages = screen.getAllByRole('article');
    
    unmountLegacy();

    // Test new component
    render(<ChatSystem {...legacyProps} />);
    const newMessages = screen.getAllByRole('article');

    expect(newMessages).toHaveLength(legacyMessages.length);
  });

  it('preserves neumorphic styling', () => {
    render(<ChatSystem lessonContext={mockContext} />);
    
    const avatar = screen.getByRole('button');
    expect(avatar).toHaveClass('nm-button', 'nm-rounded-full', 'nm-shadow-floating');
  });
});
```

#### Step 5.2: Performance Comparison
```typescript
// Performance monitoring during migration
export const useMigrationMetrics = () => {
  useEffect(() => {
    // Track bundle size impact
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('chat')) {
          console.log('Chat component performance:', entry);
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    return () => observer.disconnect();
  }, []);
};
```

### Phase 6: Cleanup & Optimization (Day 16-18)

#### Step 6.1: Remove Legacy Components
```bash
# After successful migration, remove old files:
rm src/components/lesson/chat/ContextualLyraChat.tsx
rm src/components/lesson/chat/lyra/ContextualLyraChat.tsx

# Update imports across codebase
find src -name "*.tsx" -exec sed -i 's/ContextualLyraChat/ChatSystem/g' {} \;
find src -name "*.tsx" -exec sed -i 's/@\/components\/lesson\/chat\/ContextualLyraChat/@\/components\/chat-system/g' {} \;
```

#### Step 6.2: Bundle Optimization
```typescript
// Ensure proper tree shaking
export { ChatSystem as default } from './ChatSystem';
export { ChatAvatar } from './core/ChatAvatar';
export { ChatContainer } from './core/ChatContainer';
export { useChatSystem } from './hooks/useChatSystem';

// Lazy loading for large components
const ChatContainer = lazy(() => import('./core/ChatContainer'));
const ContextualQuestions = lazy(() => import('./core/ContextualQuestions'));
```

## Risk Mitigation

### Rollback Strategy
```typescript
// Quick rollback via feature flag
export const FEATURES = {
  UNIFIED_CHAT_SYSTEM: process.env.REACT_APP_UNIFIED_CHAT === 'true',
  FORCE_LEGACY_CHAT: process.env.REACT_APP_FORCE_LEGACY === 'true', // Emergency override
};

// Automatic rollback on error
export const withErrorBoundary = (Component) => {
  return class extends React.Component {
    componentDidCatch(error) {
      if (error.message.includes('ChatSystem')) {
        // Automatic fallback to legacy
        console.warn('ChatSystem error, falling back to legacy');
        this.setState({ useLegacy: true });
      }
    }
    
    render() {
      return this.state?.useLegacy ? 
        <ContextualLyraChat {...this.props} /> : 
        <Component {...this.props} />;
    }
  };
};
```

### Monitoring & Alerts
```typescript
// Error tracking
export const trackChatError = (error: Error, context: any) => {
  console.error('Chat System Error:', error);
  // Send to monitoring service
  analytics.track('chat_error', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: Date.now()
  });
};

// Performance monitoring
export const trackChatPerformance = (metric: string, value: number) => {
  analytics.track('chat_performance', {
    metric,
    value,
    timestamp: Date.now()
  });
};
```

## Success Criteria

### Functional Requirements
- [ ] All existing chat functionality preserved
- [ ] Neumorphic design system fully integrated
- [ ] Performance improved or maintained
- [ ] Accessibility standards met
- [ ] Mobile responsiveness maintained

### Technical Requirements
- [ ] Code duplication eliminated
- [ ] Bundle size reduced by 30%
- [ ] Test coverage > 90%
- [ ] Zero regressions in existing tests
- [ ] Documentation updated

### User Experience Requirements
- [ ] Smooth animations and transitions
- [ ] Consistent visual design
- [ ] Improved load times
- [ ] Enhanced keyboard navigation
- [ ] Better screen reader support

## Post-Migration Tasks

1. **Documentation Updates**
   - Update component documentation
   - Create migration guide for future changes
   - Update design system documentation

2. **Performance Optimization**
   - Bundle analysis and optimization
   - Memory leak detection and fixing
   - Animation performance tuning

3. **Feature Enhancements**
   - Add new neumorphic variants
   - Implement advanced chat features
   - Improve AI response handling

This migration plan ensures a smooth transition from the dual chat system to the unified architecture while maintaining all functionality and improving the overall codebase quality.