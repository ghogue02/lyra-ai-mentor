# FloatingLyraAvatar Implementation

## Overview

The FloatingLyraAvatar system provides an interactive AI companion that appears as a floating avatar in lesson contexts. It includes multiple visual states, contextual chat functionality, and seamless integration with narrative components.

## Components

### 1. FloatingLyraAvatar.tsx
Main component that renders the floating avatar with various visual states and integrates with the chat system.

**Visual States:**
- **Idle:** Subtle breathing animation with Heart icon
- **Pulsing:** Gentle glow effect with scale animation and tooltip to encourage interaction
- **Active:** Slightly scaled up during chat interactions  
- **Chat Open:** Standard appearance when chat interface is expanded

**Features:**
- Auto-triggers pulsing state based on lesson phase
- Context-aware positioning (bottom-right, bottom-left, top-right, top-left)
- Smooth animations between states using Framer Motion
- Tooltip guidance for user interaction
- Minimize/maximize/close controls for chat interface

### 2. ContextualLyraChat.tsx
Full-featured chat interface that provides lesson-aware conversation capabilities.

**Features:**
- Contextual quick-start questions based on lesson content
- Integration with existing AI backend via `/api/chat` endpoint
- Engagement tracking (message count, interaction time)
- Chapter-specific question generation
- Responsive design with mobile optimizations
- Loading states and error handling
- Auto-scroll to new messages

### 3. FloatingLyraAvatarTest.tsx
Development/testing component for validation and debugging.

## Integration Example

```tsx
import { FloatingLyraAvatar } from '@/components/lesson/chat/FloatingLyraAvatar';

// In your lesson component:
<FloatingLyraAvatar
  lessonContext={{
    chapterNumber: 1,
    lessonTitle: "AI Foundations & Introduction",
    phase: "introduction",
    content: "Lesson content...",
    objectives: ["Learn AI basics", "..."],
    keyTerms: ["AI", "Machine Learning"],
    difficulty: "beginner"
  }}
  position="bottom-right"
  onEngagementChange={(isEngaged, exchangeCount) => {
    console.log(`Engagement: ${isEngaged}, Messages: ${exchangeCount}`);
  }}
  onNarrativePause={() => {
    // Pause lesson narrative during chat
  }}
  onNarrativeResume={() => {
    // Resume lesson narrative after chat
  }}
/>
```

## Visual State Behavior

### Auto-Pulsing Logic
The avatar automatically enters pulsing state during these lesson phases:
- `introduction`
- `learning` 
- `practice`
- `capabilities-demo`
- `lyra-introduction`

### State Transitions
1. **Idle → Pulsing:** Auto-triggered after 3 seconds in appropriate phases
2. **Pulsing → Chat Open:** User clicks avatar
3. **Chat Open → Active:** User engages in conversation
4. **Active → Idle:** User closes chat interface

## Chat Integration

### Contextual Questions
Questions are automatically generated based on:
- Lesson content and objectives
- Chapter number and focus area
- Current lesson phase
- User's learning progression

### Chapter-Specific Features
- **Chapter 1:** AI basics, nonprofit-specific AI questions
- **Additional chapters:** Customized based on content focus

### Backend Integration
- Uses existing `/api/chat` endpoint
- Sends lesson context with each message
- Handles API errors gracefully with fallback responses
- Tracks engagement metrics for analytics

## Mobile Responsiveness

- **Full-screen chat** on mobile devices
- **Touch-optimized** controls and interactions  
- **Keyboard handling** for mobile input
- **Reduced animations** on low-performance devices

## Accessibility Features

- **Keyboard navigation** support
- **Screen reader** compatible
- **High contrast** mode support
- **Focus management** for chat interface
- **ARIA labels** for all interactive elements

## Development Testing

Use the test component for development:
```tsx
import FloatingLyraAvatarTest from '@/components/lesson/chat/FloatingLyraAvatarTest';

// Renders test interface with avatar
<FloatingLyraAvatarTest />
```

The test component includes:
- Visual state demonstration
- Console logging for debugging
- Instructions for manual testing
- Expected behavior documentation

## Performance Considerations

- **Lazy loading** of chat interface
- **Animation optimization** using Framer Motion
- **Efficient re-renders** with React.memo where appropriate
- **Memory cleanup** for event listeners and timers
- **Debounced API calls** to prevent spam

## Troubleshooting

### Avatar Not Appearing
- Check that `disabled` prop is not set to `true`
- Verify lesson context is properly passed
- Ensure component is not hidden by CSS z-index issues

### Chat Not Opening  
- Check console for JavaScript errors
- Verify `/api/chat` endpoint is accessible
- Ensure lesson context contains required fields

### Visual States Not Working
- Check that lesson `phase` is set correctly
- Verify Framer Motion is properly installed
- Check for CSS conflicts with animations

### Mobile Issues
- Test touch interactions on actual devices
- Verify responsive breakpoints are working
- Check keyboard behavior on mobile browsers

## Future Enhancements

- **Voice interaction** support
- **Multi-language** contextual questions
- **Advanced analytics** integration
- **Personalized question** generation based on user history
- **Offline support** with cached responses
- **Integration with Learning Management Systems**