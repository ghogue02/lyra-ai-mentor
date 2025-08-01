# ContextualLyraChat System - Integration Guide

## 🎯 Overview

The ContextualLyraChat system provides lesson-aware, context-driven chat interactions that replace generic chat with intelligent, lesson-specific assistance. Built as an expandable floating avatar system with deep integration into the existing OpenRouter Edge Function backend.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Component Architecture](#component-architecture)
3. [Integration Points](#integration-points)
4. [Lesson Context Configuration](#lesson-context-configuration)
5. [Mobile Responsive Design](#mobile-responsive-design)
6. [Customization Options](#customization-options)
7. [API Integration](#api-integration)
8. [Performance Considerations](#performance-considerations)
9. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Basic Integration

```tsx
import { FloatingLyraAvatar } from '@/components/lesson/FloatingLyraAvatar';

// In your lesson component
const MyLessonComponent = () => {
  const lessonContext = {
    chapterNumber: 1,
    lessonTitle: "AI Foundations & Introduction",
    phase: "introduction",
    content: "This lesson introduces AI concepts for nonprofits...",
    objectives: ["Understand AI basics", "Identify use cases"],
    difficulty: "beginner" as const
  };

  return (
    <div className="lesson-container">
      {/* Your lesson content */}
      
      <FloatingLyraAvatar
        lessonContext={lessonContext}
        onEngagementChange={(isEngaged, count) => {
          console.log(`Student engagement: ${isEngaged}, Messages: ${count}`);
        }}
        onNarrativePause={() => {
          // Pause lesson narrative/audio
          pauseNarrative();
        }}
        onNarrativeResume={() => {
          // Resume lesson narrative/audio
          resumeNarrative();
        }}
      />
    </div>
  );
};
```

### Advanced Integration with Configuration

```tsx
import { FloatingLyraAvatar } from '@/components/lesson/FloatingLyraAvatar';
import { ContextualChatConfig } from '@/types/ContextualChat';

const advancedConfig: ContextualChatConfig = {
  position: 'bottom-right',
  theme: 'brand',
  size: 'md',
  pauseNarrativeOnOpen: true,
  trackEngagement: true,
  minEngagementExchanges: 3,
  enableContextualQuestions: true
};

const MyAdvancedLesson = () => {
  return (
    <FloatingLyraAvatar
      lessonContext={lessonContext}
      config={advancedConfig}
      onEngagementChange={handleEngagement}
      className="custom-chat-styling"
    />
  );
};
```

## 🏗️ Component Architecture

### Core Components

```
src/components/lesson/
├── FloatingLyraAvatar.tsx          # Main wrapper component
├── chat/lyra/
│   ├── ContextualLyraChat.tsx      # Core chat interface
│   └── ContextualLyraChatExample.tsx # Demo/example component
└── ...
```

### Component Hierarchy

```
FloatingLyraAvatar
└── ContextualLyraChat
    ├── Chat Header (with lesson context)
    ├── Contextual Questions (lesson-specific)
    ├── Messages Area (scrollable)
    ├── Typing Indicator
    └── Input Area (with send button)
```

### Key Features

- **Expandable Interface**: Starts as floating avatar, expands to full chat
- **Contextual Questions**: Pre-defined questions based on lesson content
- **Mobile Responsive**: Adapts to screen size and touch interactions
- **Engagement Tracking**: Monitors student interaction and engagement levels
- **Narrative Integration**: Pauses/resumes lesson content during chat
- **Persistent State**: Maintains chat history across sessions

## 🔗 Integration Points

### 1. Narrative Manager Integration

```tsx
// In your narrative-driven lesson component
const NarrativeLessonWithChat = () => {
  const [narrativePaused, setNarrativePaused] = useState(false);

  const handleNarrativePause = () => {
    setNarrativePaused(true);
    // Pause audio, video, or animation
    narrativeManager.pause();
  };

  const handleNarrativeResume = () => {
    setNarrativePaused(false);
    // Resume content
    narrativeManager.resume();
  };

  return (
    <div>
      <NarrativeManager paused={narrativePaused} />
      <FloatingLyraAvatar
        lessonContext={lessonContext}
        onNarrativePause={handleNarrativePause}
        onNarrativeResume={handleNarrativeResume}
      />
    </div>
  );
};
```

### 2. Progress Tracking Integration

```tsx
// Track student engagement for progress analytics
const LessonWithProgress = () => {
  const [progress, setProgress] = useState({
    completed: false,
    engagementLevel: 0,
    chatExchanges: 0
  });

  const handleEngagementChange = (isEngaged: boolean, exchangeCount: number) => {
    setProgress(prev => ({
      ...prev,
      engagementLevel: isEngaged ? exchangeCount : 0,
      chatExchanges: exchangeCount,
      completed: exchangeCount >= 3 // Consider lesson complete after 3 exchanges
    }));
    
    // Send to analytics
    trackEvent('lesson_engagement', {
      lessonId: lessonContext.chapterNumber,
      engagementLevel: exchangeCount,
      isEngaged
    });
  };

  return (
    <FloatingLyraAvatar
      lessonContext={lessonContext}
      onEngagementChange={handleEngagementChange}
    />
  );
};
```

### 3. Chapter-Specific Routing Integration

```tsx
// Use with React Router for dynamic lesson context
import { useParams } from 'react-router-dom';

const DynamicLessonChat = () => {
  const { chapterId, lessonId } = useParams();
  
  const lessonContext = useMemo(() => ({
    chapterNumber: parseInt(chapterId || '1'),
    lessonTitle: getLessonTitle(chapterId, lessonId),
    phase: getCurrentPhase(),
    content: getLessonContent(chapterId, lessonId),
    objectives: getLessonObjectives(chapterId, lessonId),
    difficulty: getLessonDifficulty(chapterId, lessonId) as 'beginner' | 'intermediate' | 'advanced'
  }), [chapterId, lessonId]);

  return (
    <FloatingLyraAvatar
      lessonContext={lessonContext}
      position="bottom-right"
    />
  );
};
```

## 📚 Lesson Context Configuration

### Chapter-Specific Question Sets

The system automatically generates contextual questions based on the lesson context:

#### Chapter 1 - AI Foundations
```tsx
// Automatically generated questions for Chapter 1
const chapter1Questions = [
  "I'm new to AI - where should I start?",
  "How can AI help my nonprofit's daily work?", 
  "What are the most important AI concepts for beginners?",
  "I'm worried about AI ethics - can you help me understand?"
];
```

#### Chapter 2 - Maya's Email Challenge
```tsx
// Automatically generated questions for Chapter 2
const chapter2Questions = [
  "How can AI help me write better emails?",
  "How do I communicate with different donor types?",
  "What is the PACE framework Maya uses?",
  "How can I personalize messages at scale?"
];
```

### Custom Question Sets

```tsx
import { ContextualQuestion } from '@/types/ContextualChat';

const customQuestions: ContextualQuestion[] = [
  {
    id: 'custom-1',
    text: "How does this apply to my specific nonprofit?",
    icon: Target,
    category: 'Application',
    priority: 'high',
    tags: ['practical', 'specific']
  },
  {
    id: 'custom-2', 
    text: "What tools should I try first?",
    icon: Zap,
    category: 'Tools',
    priority: 'medium',
    tags: ['tools', 'getting-started']
  }
];

// Use in component
<FloatingLyraAvatar
  lessonContext={lessonContext}
  customQuestions={customQuestions}
/>
```

### Lesson Context Properties

```tsx
interface LessonContext {
  chapterNumber: number;        // Required: Chapter identifier
  lessonTitle: string;          // Required: Display title
  phase: string;                // Required: Current lesson phase
  content: string;              // Required: Lesson content/description
  chapterTitle?: string;        // Optional: Chapter title
  objectives?: string[];        // Optional: Learning objectives
  keyTerms?: string[];         // Optional: Key vocabulary
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;   // Optional: Minutes to complete
  prerequisites?: string[];     // Optional: Required prior knowledge
  relatedLessons?: number[];   // Optional: Related lesson IDs
}
```

## 📱 Mobile Responsive Design

### Automatic Responsive Behavior

The system automatically adapts to different screen sizes:

- **Desktop (>1024px)**: Floating avatar with expandable chat overlay
- **Tablet (768-1024px)**: Larger touch targets, optimized spacing
- **Mobile (<768px)**: Full-screen chat interface, simplified controls

### Mobile-Specific Features

```tsx
const mobileConfig = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  mobileOptimizations: {
    fullScreenOnMobile: true,    // Use full screen on mobile
    reducedAnimations: false,    // Keep animations for engagement
    simplifiedUI: true,          // Simpler interface elements
    keyboardHandling: true       // Handle virtual keyboard
  }
};

<FloatingLyraAvatar
  lessonContext={lessonContext}
  mobileConfig={mobileConfig}
/>
```

### Touch Interaction Optimizations

- **Larger Touch Targets**: Minimum 44px touch targets for accessibility
- **Gesture Support**: Swipe to minimize/expand on mobile
- **Keyboard Handling**: Automatic viewport adjustment for virtual keyboards
- **Scroll Behavior**: Smooth scrolling with momentum on iOS/Android

## 🎨 Customization Options

### Positioning Options

```tsx
// Available positions
type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

<FloatingLyraAvatar
  position="bottom-left"  // Change avatar position
  lessonContext={lessonContext}
/>
```

### Theming and Styling

```tsx
// Custom styling with Tailwind classes
<FloatingLyraAvatar
  className="custom-z-index shadow-2xl"
  lessonContext={lessonContext}
/>
```

### Behavior Configuration

```tsx
const behaviorConfig = {
  autoExpand: false,              // Don't auto-expand on load
  persistState: true,             // Save state across sessions
  enableTypingIndicator: true,    // Show "Lyra is thinking..."
  enableScrollToBottom: true,     // Auto-scroll to new messages
  pauseNarrativeOnOpen: true,     // Pause lesson when chat opens
  trackEngagement: true,          // Enable engagement analytics
  minEngagementExchanges: 3       // Minimum exchanges for engagement
};
```

## 🔌 API Integration

### Existing OpenRouter Integration

The system integrates seamlessly with the existing Edge Function at:
`https://hfkzwjnlxrwynactcmpe.supabase.co/functions/v1/chat-with-lyra`

### Request Format

```typescript
// The system automatically sends this format to the Edge Function
const requestPayload = {
  messages: [
    { role: 'user', content: 'User message' },
    { role: 'assistant', content: 'Previous AI response' }
  ],
  lessonContext: {
    chapterNumber: 1,
    lessonTitle: "AI Foundations",
    content: "Lesson description...",
    objectives: ["Learn AI basics"]
  },
  conversationId: "uuid-string",
  userId: "user-uuid", 
  lessonId: 1
};
```

### Response Handling

The system handles both streaming and non-streaming responses:

```typescript
// Streaming response (preferred)
// Server sends: data: {"content": "partial text"}

// Non-streaming response (fallback)  
// Server sends: {"generatedText": "complete response"}
```

### Error Handling

```typescript
// Automatic error recovery with user-friendly messages
const errorMessage = "I'm having trouble responding right now. But hey, that just means I'm human-ish! Try asking me again?";
```

## ⚡ Performance Considerations

### Optimization Features

1. **Lazy Loading**: Chat interface only loads when expanded
2. **Message Pagination**: Loads messages in chunks for large conversations  
3. **Debounced Input**: Prevents excessive API calls during typing
4. **Request Cancellation**: Cancels previous requests when new ones are made
5. **Efficient Re-renders**: Uses React.memo and useCallback for optimization

### Memory Management

```tsx
// Automatic cleanup of resources
useEffect(() => {
  return () => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, []);
```

### Bundle Size Impact

- **Core Component**: ~15KB gzipped
- **Dependencies**: Uses existing project dependencies
- **Lazy Loading**: Non-critical features load on demand

## 🐛 Troubleshooting

### Common Issues

#### 1. Chat Not Expanding
```tsx
// Check if lessonContext is properly provided
const lessonContext = {
  chapterNumber: 1,              // Must be number, not string
  lessonTitle: "Valid Title",    // Must be non-empty string
  phase: "introduction",         // Must be non-empty string
  content: "Valid content..."    // Must be non-empty string
};
```

#### 2. Contextual Questions Not Loading
```tsx
// Ensure chapterNumber is correctly set
// Questions are generated based on chapterNumber value
// Chapter 1 = AI Foundations questions
// Chapter 2 = Communication questions  
// Other chapters = Default questions
```

#### 3. Engagement Tracking Not Working
```tsx
// Make sure onEngagementChange callback is provided
<FloatingLyraAvatar
  lessonContext={lessonContext}
  onEngagementChange={(isEngaged, count) => {
    console.log('Engagement:', isEngaged, 'Count:', count);
    // Your tracking logic here
  }}
/>
```

#### 4. Mobile Responsiveness Issues
```tsx
// Ensure proper viewport meta tag in HTML
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

// Check for CSS conflicts with z-index
// Component uses z-50, ensure no higher z-index elements interfere
```

#### 5. API Integration Issues
```tsx
// Check console for network errors
// Verify Edge Function URL is accessible
// Ensure proper authentication headers are included
// Check lessonContext format matches API expectations
```

### Debug Mode

```tsx
// Enable debug logging
<FloatingLyraAvatar
  lessonContext={lessonContext}
  debugMode={true}  // Enables console logging
  onError={(error) => {
    console.error('ContextualChat Error:', error);
  }}
/>
```

### Performance Debugging

```tsx
// Monitor component renders
import { memo } from 'react';

const OptimizedLesson = memo(() => {
  return (
    <FloatingLyraAvatar
      lessonContext={memoizedLessonContext}  // Use useMemo for stable reference
      onEngagementChange={useCallback(handleEngagement, [])}
    />
  );
});
```

## 📈 Analytics and Tracking

### Built-in Engagement Metrics

The system automatically tracks:
- Chat open/close events
- Message exchange count
- Time spent in chat
- Question selection patterns
- Engagement milestones

### Custom Analytics Integration  

```tsx
const MyLessonWithAnalytics = () => {
  const handleEngagementChange = (isEngaged: boolean, exchangeCount: number) => {
    // Send to your analytics service
    analytics.track('lesson_chat_engagement', {
      lessonId: lessonContext.chapterNumber,
      isEngaged,
      exchangeCount,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <FloatingLyraAvatar
      lessonContext={lessonContext}
      onEngagementChange={handleEngagementChange}
      analytics={true}  // Enable built-in analytics
    />
  );
};
```

## 🔄 Migration from Existing Chat

### From Generic Chat Components

```tsx
// Old generic chat
import { GenericChat } from './old/GenericChat';

// New contextual chat
import { FloatingLyraAvatar } from '@/components/lesson/FloatingLyraAvatar';

// Replace with lesson context
const lessonContext = {
  chapterNumber: getCurrentChapter(),
  lessonTitle: getCurrentLessonTitle(),
  phase: getCurrentPhase(),
  content: getCurrentLessonContent()
};

<FloatingLyraAvatar lessonContext={lessonContext} />
```

### Preserving Existing Functionality

```tsx
// Maintain existing chat features
<FloatingLyraAvatar
  lessonContext={lessonContext}
  // Map old props to new props
  onChatOpen={oldProps.onOpen}
  onChatClose={oldProps.onClose}
  onEngagementChange={oldProps.onEngagement}
  className={oldProps.className}
/>
```

## 🚀 Future Enhancements

### Planned Features

1. **Voice Integration**: Speech-to-text and text-to-speech capabilities
2. **Multi-language Support**: Contextual questions in multiple languages
3. **Advanced Analytics**: Detailed engagement insights and recommendations
4. **Offline Support**: Cached responses for common questions
5. **Accessibility Improvements**: Enhanced screen reader support

### Extension Points

```tsx
// Plugin architecture for custom features
interface ChatPlugin {
  name: string;
  initialize: (chat: ContextualChatInstance) => void;
  onMessage?: (message: string) => void;
  onEngagement?: (engagement: ChatEngagement) => void;
}

// Usage
<FloatingLyraAvatar
  lessonContext={lessonContext}
  plugins={[analyticsPlugin, voicePlugin]}
/>
```

---

## 📞 Support

For technical support or feature requests:

1. Check this documentation first
2. Review the example component (`ContextualLyraChatExample.tsx`)
3. Enable debug mode for detailed logging
4. Create an issue with reproduction steps

**File Locations:**
- Main Component: `/src/components/lesson/chat/lyra/ContextualLyraChat.tsx`
- Floating Avatar: `/src/components/lesson/FloatingLyraAvatar.tsx`
- Type Definitions: `/src/types/ContextualChat.ts`
- Example Usage: `/src/components/lesson/chat/lyra/ContextualLyraChatExample.tsx`