# Maya's UX/UI Design Guidelines
*The Complete Pattern Library for Lyra AI Mentor*

## 🎯 Executive Summary

This document captures the proven UX/UI patterns from Maya's Email Composer and PACE Framework implementation. These patterns have demonstrated exceptional user engagement and learning outcomes and should be applied consistently across all remaining lessons.

---

## 📋 Table of Contents

1. [Component Architecture Patterns](#component-architecture-patterns)
2. [Visual Design Standards](#visual-design-standards)
3. [Interaction Design Principles](#interaction-design-principles)
4. [Animation and Transition Guidelines](#animation-and-transition-guidelines)
5. [Progress Tracking Patterns](#progress-tracking-patterns)
6. [Testing Integration Standards](#testing-integration-standards)
7. [Mobile Responsiveness Requirements](#mobile-responsiveness-requirements)
8. [Accessibility Considerations](#accessibility-considerations)
9. [Implementation Checklist](#implementation-checklist)
10. [Technical Reference](#technical-reference)

---

## 🏗️ Component Architecture Patterns

### 1. Multi-Phase Component Structure

**Pattern**: Every interactive lesson follows the 4-phase structure:
- `intro` - Story hook and character introduction
- `build` - Interactive learning/building process
- `preview` - Results and validation
- `success` - Transformation and next steps

```typescript
type Phase = 'intro' | 'build' | 'preview' | 'success';

interface InteractiveStage {
  id: string;
  title: string;
  component: React.ReactNode;
  narrativeMessages: LyraNarrativeMessage[];
  panelBlurState?: 'full' | 'partial' | 'clear';
}
```

### 2. Side-by-Side Layout Pattern

**Core Structure**:
```jsx
<div className="max-w-7xl mx-auto h-screen flex flex-col">
  {/* Header with progress */}
  <Header />
  
  {/* Main Content - Split */}
  <div className="flex-1 flex overflow-hidden">
    {/* Left: Lyra's Narrative */}
    <NarrativePanel />
    
    {/* Right: Interactive Learning */}
    <InteractivePanel />
  </div>
  
  {/* Progress Bar */}
  <ProgressBar />
</div>
```

### 3. PACE Framework Integration

**Structure**: All lessons should integrate the PACE methodology:
- **P** - Purpose/Prompt Foundation
- **A** - Audience Intelligence
- **C** - Connection (tone/context)
- **E** - Execute with AI

### 4. State Management Pattern

```typescript
const [currentStageIndex, setCurrentStageIndex] = useState(0);
const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
const [typedContent, setTypedContent] = useState<{[key: string]: string}>({});
const [isTyping, setIsTyping] = useState<string | null>(null);
const [panelBlurLevel, setPanelBlurLevel] = useState<'full' | 'partial' | 'clear'>('full');
```

---

## 🎨 Visual Design Standards

### 1. Color System

**Primary Colors**:
```css
:root {
  --color-background: #FAF9F7;      /* Warm off-white */
  --color-surface: #FFFFFF;         /* Pure white */
  --color-primary: #9333EA;         /* Purple primary */
  --color-magic: #EC4899;          /* Pink accent */
  --color-wisdom: #8B5CF6;         /* Sage purple */
}
```

**Character-Specific Colors**:
- Maya: Purple to Pink gradient (`from-purple-600 to-pink-600`)
- Sofia: Orange to Pink gradient (`from-orange-500 to-pink-500`)
- David: Blue to Cyan gradient (`from-blue-600 to-cyan-600`)
- Rachel: Green to Blue gradient (`from-green-600 to-blue-600`)
- Alex: Red to Orange gradient (`from-red-600 to-orange-600`)

### 2. Typography Hierarchy

**Font Stack**:
- Primary: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif`
- Storytelling: `'Crimson Text', 'Georgia', 'Cambria', serif`

**Text Sizing**:
```css
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
```

### 3. Spacing System

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### 4. Card and Component Styling

**Standard Card**:
```jsx
<Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-cyan-50">
```

**Interactive Elements**:
```jsx
<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200">
```

---

## 🔄 Interaction Design Principles

### 1. Blur Effect Storytelling

**Purpose**: Create visual metaphor for clarity and understanding

**Implementation**:
```jsx
const [panelBlurLevel, setPanelBlurLevel] = useState<'full' | 'partial' | 'clear'>('full');

// Trigger blur transitions based on story progress
if (message.trigger === 'blur-clear') {
  setPanelBlurLevel('clear');
}
```

**CSS Classes**:
```css
.blur-transition {
  transition: backdrop-filter 1.5s ease-in-out;
}

.blur-full { backdrop-filter: blur(40px); }
.blur-partial { backdrop-filter: blur(4px); }
.blur-clear { backdrop-filter: blur(0px); }
```

### 2. Progressive Disclosure Pattern

**Layer-by-Layer Building**:
1. **Layer 1**: Emotional Foundation (Tone)
2. **Layer 2**: Audience Intelligence
3. **Layer 3**: Purpose/Action
4. **Layer 4**: AI Execution

**Visual Indicator**:
```jsx
<Badge variant="outline" className="text-lg px-3 py-1">
  {Math.floor(recipeProgress * 3)}/3 layers selected
</Badge>
```

### 3. Multi-Level Content Adaptation

**User Level System**:
```typescript
interface LyraNarrativeMessage {
  layers?: {
    beginner: string;
    intermediate?: string;
    advanced?: string;
  };
}
```

**Level Switching**:
```jsx
<button onClick={() => setUserLevel(cycle(userLevel))}>
  <Eye className="w-4 h-4" />
  {userLevel} mode
</button>
```

### 4. Fast-Forward Testing Functionality

**Implementation**:
```jsx
const fastForwardStage = () => {
  setIsFastForwarding(true);
  // Clear all timeouts
  messageTimeoutsRef.current.forEach(clearTimeout);
  // Show all messages immediately
  setVisibleMessages(currentStage.narrativeMessages);
  // Complete all typed content
  const completedContent = {};
  currentStage.narrativeMessages.forEach(message => {
    completedContent[message.id] = message.content;
  });
  setTypedContent(completedContent);
};
```

---

## ✨ Animation and Transition Guidelines

### 1. Typewriter Effect Standards

**Natural Storytelling Rhythm**:
```javascript
// Character-based timing
let delay = 20 + Math.random() * 20;

// Punctuation pauses
if (['.', '!', '?'].includes(char)) delay += 400;
else if ([',', ';', ':'].includes(char)) delay += 200;
else if (char === '\n') delay += 300;

// Emotion-based pacing
if (message.emotion === 'thoughtful') delay *= 1.2;
else if (message.emotion === 'excited') delay *= 0.8;
```

**Cursor Animation**:
```css
.typewriter-cursor {
  animation: blink 0.8s infinite;
  box-shadow: 0 0 8px rgba(147, 51, 234, 0.4);
}

@keyframes blink {
  0%, 45% { opacity: 1; transform: scaleY(1); }
  50%, 100% { opacity: 0; transform: scaleY(0.8); }
}
```

### 2. Motion Design Patterns

**Entry Animations**:
```jsx
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
>
```

**Hover States**:
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

**Progress Animations**:
```jsx
<motion.div 
  className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
/>
```

### 3. Micro-Interactions

**Button States**:
```css
.button-primary {
  transition: all 150ms ease;
  box-shadow: 0 4px 14px rgba(147, 51, 234, 0.2);
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.3);
}

.button-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.2);
}
```

---

## 📊 Progress Tracking Patterns

### 1. Component Progress Integration

**Hook Usage**:
```typescript
const { isCompleted, timeSpent, trackInteraction, markAsComplete } = useComponentProgress({
  componentId: 'MayaEmailComposer',
  autoStart: true,
  completionThreshold: 80
});
```

**Progress Tracking Events**:
- Tone selection: `trackInteraction(25)` (25% progress)
- Audience selection: `trackInteraction(25)` (25% progress)
- Purpose selection: `trackInteraction(30)` (30% progress)
- Email generation: `trackInteraction(20)` (20% progress)

### 2. Visual Progress Indicators

**Progress Widget**:
```jsx
<ProgressWidget
  componentId="MayaEmailComposer"
  isCompleted={isCompleted}
  timeSpent={timeSpent}
  characterName="Maya"
  characterColor="purple"
/>
```

**Multi-Level Progress Bar**:
```jsx
<div className="h-3 bg-gray-200 relative overflow-hidden">
  <motion.div 
    className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"
    animate={{ width: `${progress}%` }}
  />
  {/* Stage indicators */}
  {stages.map((_, i) => (
    <div className={`w-2 h-2 rounded-full ${i <= currentStage ? 'bg-white' : 'bg-gray-300'}`} />
  ))}
</div>
```

### 3. Story Integration Progress

**PACE Summary Panel**:
```jsx
<PACESummaryPanel 
  showSummaryPanel={showSummaryPanel}
  emailDraft={emailDraft}
  isGenerating={isGenerating}
/>
```

---

## 🧪 Testing Integration Standards

### 1. Fast-Forward Testing

**Requirements**:
- All lessons MUST include fast-forward functionality
- Users should be able to skip to any stage instantly
- All animations and typewriter effects should complete immediately
- Story state should be preserved

**Implementation**:
```jsx
<motion.button
  onClick={fastForwardStage}
  className="px-3 py-1 rounded-full bg-orange-100 text-orange-700"
>
  <FastForward className="w-4 h-4" />
  Fast Forward
</motion.button>
```

### 2. AI Integration Testing

**Error Boundaries**:
```jsx
<AIComponentErrorBoundary componentName="ComponentName">
  {/* Component content */}
</AIComponentErrorBoundary>
```

**Retry Logic**:
```javascript
const result = await retryWithBackoff(async () => {
  return await enhancedAIService.generateContent(params);
});
```

### 3. Tutorial Integration

**Tutorial Buttons**:
```jsx
<TutorialButton 
  tutorialId="maya-email-composer"
  variant="icon"
/>
```

---

## 📱 Mobile Responsiveness Requirements

### 1. Responsive Layout Patterns

**Mobile-First Approach**:
```jsx
<div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
  {/* Stack vertically on mobile, side-by-side on desktop */}
</div>
```

**Touch Target Optimization**:
```css
.touch-target {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 16px;
}
```

### 2. Mobile-Specific Components

**Responsive Wrapper**:
```jsx
<MobileResponsiveWrapper 
  maxWidth="4xl" 
  padding="medium"
  safeArea={true}
>
```

**Responsive Grid**:
```jsx
<ResponsiveGrid 
  cols={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="medium"
>
```

### 3. Viewport and Safe Area Handling

**Viewport Height**:
```javascript
const { viewportHeight } = useViewportHeight();
```

**Safe Area Support**:
```css
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 4. Mobile Interaction Patterns

**Swipe Gestures**:
```jsx
const { navigate } = useMobileNavigation();
useSwipeGestures({
  onSwipeLeft: () => navigate(nextStage),
  onSwipeRight: () => navigate(previousStage)
});
```

---

## ♿ Accessibility Considerations

### 1. Semantic HTML Structure

**Required Attributes**:
```jsx
<div role="region" aria-label="Email composition tool">
<div role="status" aria-live="polite" className="sr-only">
  Now in Email Recipe Builder phase
</div>
```

### 2. Keyboard Navigation

**Focus Management**:
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Tab Order**:
- Ensure logical tab progression through interactive elements
- Include skip links for complex layouts

### 3. Screen Reader Support

**Alt Text and Labels**:
```jsx
<img alt="Maya's profile representing Hope Gardens Community Center" />
<label htmlFor="email-purpose">What's your email's purpose?</label>
```

**Live Regions**:
```jsx
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### 4. Reduced Motion Support

**Respect User Preferences**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## ✅ Implementation Checklist

### Phase 1: Component Structure
- [ ] Implement 4-phase structure (intro/build/preview/success)
- [ ] Create side-by-side layout with narrative and interactive panels
- [ ] Add character-specific theming
- [ ] Implement state management pattern

### Phase 2: Visual Design
- [ ] Apply color system and typography
- [ ] Implement gradient backgrounds and cards
- [ ] Add character avatar integration
- [ ] Create responsive spacing

### Phase 3: Interactions
- [ ] Implement blur effect storytelling
- [ ] Add progressive disclosure pattern
- [ ] Create multi-level content adaptation
- [ ] Add typewriter narrative system

### Phase 4: Animations
- [ ] Implement typewriter effect with natural timing
- [ ] Add entry/exit animations
- [ ] Create hover and active states
- [ ] Add progress animations

### Phase 5: Progress & Testing
- [ ] Integrate component progress tracking
- [ ] Add story integration elements
- [ ] Implement fast-forward testing
- [ ] Add tutorial integration

### Phase 6: Mobile & Accessibility
- [ ] Implement responsive layout patterns
- [ ] Add mobile-specific interactions
- [ ] Ensure accessibility compliance
- [ ] Test across devices and assistive technologies

### Phase 7: AI Integration
- [ ] Add AI error boundaries
- [ ] Implement retry logic
- [ ] Add export functionality
- [ ] Create help system integration

---

## 🔧 Technical Reference

### 1. Key Dependencies

```json
{
  "framer-motion": "^10.16.4",
  "lucide-react": "^0.263.1",
  "@radix-ui/react-progress": "^1.0.3",
  "sonner": "^1.0.3"
}
```

### 2. Essential Hooks

- `useComponentProgress` - Progress tracking
- `useResponsive` - Mobile responsiveness
- `useCharacterStory` - Story integration
- `useTutorial` - Tutorial system
- `useVoiceChat` - Voice interactions

### 3. Core Components

- `ProgressWidget` - Progress display
- `StoryIntegration` - Character story
- `ExportButton` - Content export
- `TutorialButton` - Tutorial access
- `MobileResponsiveWrapper` - Mobile layout

### 4. CSS Classes Reference

**Animation Classes**:
- `.fade-in` - Fade in animation
- `.slide-up` - Slide up animation
- `.gentle-bounce` - Bounce animation
- `.shimmer` - Loading shimmer

**Layout Classes**:
- `.minimal-ui` - Base layout
- `.storytelling-text` - Narrative text
- `.touch-target` - Mobile touch targets
- `.safe-area` - Safe area handling

### 5. State Management Patterns

**Message Queue System**:
```typescript
const messageQueueRef = useRef<Message[]>([]);
const isProcessingRef = useRef(false);

const processMessages = (messages: Message[], index = 0) => {
  // Sequential message processing
};
```

**Blur State Management**:
```typescript
const [panelBlurLevel, setPanelBlurLevel] = useState<'full' | 'partial' | 'clear'>('full');

// Trigger based on story progress
useEffect(() => {
  if (storyTrigger === 'blur-clear') {
    setPanelBlurLevel('clear');
  }
}, [storyTrigger]);
```

---

## 🎯 Implementation Priority

### High Priority (Immediate)
1. Component architecture patterns
2. Visual design standards
3. Progress tracking integration
4. Mobile responsiveness

### Medium Priority (Next Sprint)
1. Advanced animations
2. AI integration patterns
3. Tutorial system
4. Export functionality

### Low Priority (Future Enhancement)
1. Advanced accessibility features
2. Performance optimizations
3. Analytics integration
4. A/B testing framework

---

## 📝 Notes and Best Practices

### Performance Considerations
- Use React.memo for expensive components
- Implement virtualization for long lists
- Debounce user inputs
- Optimize image loading

### Code Quality
- Follow TypeScript strict mode
- Use consistent naming conventions
- Implement comprehensive error handling
- Add comprehensive testing

### User Experience
- Maintain consistent interaction patterns
- Provide clear feedback for all actions
- Ensure fast loading times
- Test with real users regularly

---

*This document serves as the definitive guide for implementing Maya's proven UX/UI patterns across all Lyra AI Mentor lessons. Following these guidelines ensures consistency, quality, and user engagement.*

**Last Updated**: January 2025
**Version**: 1.0
**Maintainer**: Lyra AI Development Team