# Chapter 2 Implementation Guide: Maya's Email Communication Integration

## 🚀 Quick Start Implementation

This guide provides step-by-step instructions for implementing the Chapter 2 ContextualLyraChat integration with Maya's email communication journey and PACE framework.

## 📋 Prerequisites

- Existing ContextualLyraChat component is functional
- MayaTemplateLibraryBuilder component is operational
- Maya character components are available
- PACE framework content is prepared

## 🔧 Implementation Steps

### Step 1: Install New Components

1. **Add Chapter 2 Contextual Questions Component**
   ```bash
   # The file is already created at:
   # src/components/lesson/chat/lyra/maya/Chapter2ContextualQuestions.tsx
   ```

2. **Add Maya Integration Component**
   ```bash
   # The file is already created at:
   # src/components/lesson/chat/lyra/maya/MayaContextualChatIntegration.tsx
   ```

### Step 2: Update Existing ContextualLyraChat

Update the `getContextualQuestions` function in `ContextualLyraChat.tsx`:

```typescript
// Add import
import { getMayaContextualQuestions, MayaJourneyState } from './maya/Chapter2ContextualQuestions';

// Update the function to handle Maya-specific questions
const getContextualQuestions = (lessonContext: LessonContext, mayaProgress?: MayaJourneyState): Array<{
  id: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  priority: 'high' | 'medium' | 'low';
}> => {
  const { chapterNumber, lessonTitle, phase } = lessonContext;
  
  // Chapter 2 - Maya's Email Challenge with enhanced contextual questions
  if (chapterNumber === 2 && mayaProgress) {
    const mayaQuestions = getMayaContextualQuestions(lessonContext, mayaProgress);
    // Convert to expected format
    return mayaQuestions.map(q => ({
      id: q.id,
      text: q.text,
      icon: q.icon,
      category: q.category,
      priority: q.priority
    }));
  }
  
  // Fallback to existing Chapter 2 questions if mayaProgress not provided
  if (chapterNumber === 2) {
    return [
      {
        id: 'email-help',
        text: "How can AI help me write better emails?",
        icon: MessageCircle,
        category: 'Email Writing',
        priority: 'high'
      },
      {
        id: 'donor-communication',
        text: "How do I communicate with different donor types?",
        icon: Users,
        category: 'Donor Relations',
        priority: 'high'
      },
      {
        id: 'pace-framework',
        text: "What is the PACE framework Maya uses?",
        icon: Target,
        category: 'Frameworks',
        priority: 'high'
      },
      {
        id: 'personalization',
        text: "How can I personalize messages at scale?",
        icon: Sparkles,
        category: 'Personalization',
        priority: 'medium'
      }
    ];
  }
  
  // Continue with existing logic for other chapters...
};
```

### Step 3: Integrate with MayaTemplateLibraryBuilder

Update `MayaTemplateLibraryBuilder.tsx` to include contextual chat:

```typescript
// Add imports
import MayaContextualChatIntegration from './chat/lyra/maya/MayaContextualChatIntegration';
import { MayaJourneyState } from './chat/lyra/maya/Chapter2ContextualQuestions';

// Add state for Maya journey tracking
const [mayaJourneyState, setMayaJourneyState] = useState<MayaJourneyState>({
  completedStages: [],
  currentStage: 'intro',
  paceFrameworkProgress: {
    purpose: false,
    audience: false,
    context: false,
    execution: false
  },
  templateLibraryProgress: 0,
  donorSegmentationComplete: false
});

// Add chat integration to each phase render function
const renderNarrativePhase = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6"
  >
    {/* Existing content */}
    <MicroLessonNavigator ... />
    
    <div className="max-w-4xl mx-auto pt-20">
      <NarrativeManager
        messages={narrativeMessages}
        onComplete={() => {
          setCurrentPhase('workshop');
          // Update Maya journey progress
          setMayaJourneyState(prev => ({
            ...prev,
            completedStages: [...prev.completedStages, 'narrative-complete'],
            currentStage: 'workshop-intro'
          }));
        }}
        phaseId="maya-template-narrative"
      />
    </div>
    
    {/* Add Maya contextual chat integration */}
    <MayaContextualChatIntegration
      mayaJourneyState={mayaJourneyState}
      onJourneyStateUpdate={setMayaJourneyState}
      currentPhase={currentPhase}
      lessonTitle="Template Library Builder"
      onNarrativePause={() => {
        // Pause any ongoing narrative animations
      }}
      onNarrativeResume={() => {
        // Resume narrative animations
      }}
    />
  </motion.div>
);
```

### Step 4: Update Chat Response System

Create Maya-specific response handling in your chat hook (`useLyraChat`):

```typescript
// In hooks/useLyraChat.ts or equivalent
import { mayaChatResponseSystem } from '@/components/lesson/chat/lyra/maya/Chapter2ContextualQuestions';

const generateMayaResponse = async (userMessage: string, lessonContext: LessonContext) => {
  const { characterContext, responsePatterns, contextualPrompts } = mayaChatResponseSystem;
  
  // Determine response type based on user message
  let responsePattern = responsePatterns.donorCommunication; // default
  
  if (userMessage.toLowerCase().includes('pace')) {
    responsePattern = responsePatterns.paceFramework;
  } else if (userMessage.toLowerCase().includes('template')) {
    responsePattern = responsePatterns.templateCreation;
  } else if (userMessage.toLowerCase().includes('crisis')) {
    responsePattern = responsePatterns.crisisCommunication;
  }
  
  // Build context-aware prompt
  const systemPrompt = `
    You are ${characterContext.name}, ${characterContext.role} at ${characterContext.organization}.
    Your expertise includes: ${characterContext.expertise.join(', ')}.
    Your personality is: ${characterContext.personality}.
    Background: ${characterContext.background}
    
    Response pattern for this query:
    Structure: ${responsePattern.structure}
    Tone: ${responsePattern.tone}
    Examples: ${responsePattern.examples}
    
    Use these contextual prompts when appropriate:
    ${contextualPrompts.hopeGardensReferences.join('\n')}
    
    User question: ${userMessage}
    Lesson context: ${lessonContext.content}
  `;
  
  return await callAIService(systemPrompt, userMessage);
};
```

### Step 5: Add Progressive Engagement Logic

Create a hook for tracking Maya's journey progress:

```typescript
// hooks/useMayaJourney.ts
import { useState, useEffect } from 'react';
import { MayaJourneyState } from '@/components/lesson/chat/lyra/maya/Chapter2ContextualQuestions';

export const useMayaJourney = (initialState?: Partial<MayaJourneyState>) => {
  const [journeyState, setJourneyState] = useState<MayaJourneyState>({
    completedStages: [],
    currentStage: 'intro',
    paceFrameworkProgress: {
      purpose: false,
      audience: false,
      context: false,
      execution: false
    },
    templateLibraryProgress: 0,
    donorSegmentationComplete: false,
    ...initialState
  });

  const completeStage = (stageName: string) => {
    setJourneyState(prev => ({
      ...prev,
      completedStages: [...prev.completedStages, stageName]
    }));
  };

  const updatePaceProgress = (component: keyof MayaJourneyState['paceFrameworkProgress']) => {
    setJourneyState(prev => ({
      ...prev,
      paceFrameworkProgress: {
        ...prev.paceFrameworkProgress,
        [component]: true
      }
    }));
  };

  const updateTemplateProgress = (progress: number) => {
    setJourneyState(prev => ({
      ...prev,
      templateLibraryProgress: Math.max(prev.templateLibraryProgress, progress)
    }));
  };

  return {
    journeyState,
    setJourneyState,
    completeStage,
    updatePaceProgress,
    updateTemplateProgress
  };
};
```

## 🧪 Testing Implementation

### 1. Unit Tests

Create test file `src/components/lesson/chat/lyra/maya/__tests__/Chapter2ContextualQuestions.test.tsx`:

```typescript
import { getMayaContextualQuestions, MayaJourneyState } from '../Chapter2ContextualQuestions';
import { LessonContext } from '../../ContextualLyraChat';

describe('Maya Contextual Questions', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 2,
    lessonTitle: 'Email Mastery',
    phase: 'workshop',
    content: 'Maya learning PACE framework'
  };

  const mockMayaState: MayaJourneyState = {
    completedStages: ['pace-introduction'],
    currentStage: 'audience-analysis',
    paceFrameworkProgress: {
      purpose: true,
      audience: false,
      context: false,
      execution: false
    },
    templateLibraryProgress: 0,
    donorSegmentationComplete: false
  };

  test('returns appropriate questions based on Maya progress', () => {
    const questions = getMayaContextualQuestions(mockLessonContext, mockMayaState);
    
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.some(q => q.paceComponent === 'Purpose')).toBe(true);
    expect(questions.some(q => q.availableAfter === 'pace-introduction')).toBe(true);
  });

  test('filters questions based on completed stages', () => {
    const questionsWithRequirements = getMayaContextualQuestions(mockLessonContext, mockMayaState);
    const questionsWithoutRequirements = getMayaContextualQuestions(mockLessonContext, {
      ...mockMayaState,
      completedStages: []
    });
    
    expect(questionsWithRequirements.length).toBeGreaterThanOrEqual(questionsWithoutRequirements.length);
  });
});
```

### 2. Integration Tests

Test the full integration in your existing test suite:

```typescript
// Add to existing ContextualLyraChatIntegration.test.tsx
describe('Maya Integration', () => {
  test('Maya chat integration loads correctly', async () => {
    const mayaProps = {
      mayaJourneyState: mockMayaState,
      onJourneyStateUpdate: jest.fn(),
      currentPhase: 'workshop' as const,
      lessonTitle: 'Template Builder'
    };

    render(<MayaContextualChatIntegration {...mayaProps} />);
    
    // Test Maya-specific functionality
    expect(screen.getByText(/Maya's PACE Progress/)).toBeInTheDocument();
  });
});
```

## 📊 Monitoring and Analytics

### 1. Add Engagement Tracking

```typescript
// utils/analyticsEvents.ts
export const trackMayaEngagement = {
  chatOpened: (phase: string, timeInPhase: number) => {
    // Analytics tracking
    analytics.track('Maya Chat Opened', {
      phase,
      timeInPhase,
      character: 'maya'
    });
  },
  
  questionClicked: (questionId: string, category: string, paceComponent?: string) => {
    analytics.track('Maya Question Clicked', {
      questionId,
      category,
      paceComponent,
      character: 'maya'
    });
  },
  
  stageCompleted: (stageName: string, withChatEngagement: boolean) => {
    analytics.track('Maya Stage Completed', {
      stageName,
      withChatEngagement,
      character: 'maya'
    });
  }
};
```

### 2. Performance Monitoring

```typescript
// utils/performanceMonitoring.ts
export const monitorMayaIntegration = {
  trackLoadTime: (componentName: string, loadTime: number) => {
    performance.mark(`maya-${componentName}-loaded`);
    // Monitor performance impact
  },
  
  trackMemoryUsage: () => {
    if ('memory' in performance) {
      // Monitor memory usage for Maya components
    }
  }
};
```

## 🚀 Deployment Checklist

- [ ] Chapter2ContextualQuestions component created and tested
- [ ] MayaContextualChatIntegration component integrated
- [ ] ContextualLyraChat updated with Maya-specific logic
- [ ] MayaTemplateLibraryBuilder includes chat integration
- [ ] Maya journey state management implemented
- [ ] Chat response system configured for Maya character
- [ ] Progressive engagement logic tested
- [ ] Unit tests pass for all new components
- [ ] Integration tests validate full workflow
- [ ] Performance monitoring configured
- [ ] Analytics tracking implemented
- [ ] Mobile responsiveness verified
- [ ] Accessibility compliance checked

## 🔄 Next Steps for Chapters 3-6

This implementation creates reusable patterns that can be applied to other chapters:

1. **Character-Specific Question Sets**: Follow the pattern in `Chapter2ContextualQuestions.tsx`
2. **Journey State Management**: Adapt `MayaJourneyState` for other characters
3. **Integration Components**: Create similar integration components for Sofia, David, Alex, Rachel
4. **Response Systems**: Develop character-specific response patterns
5. **Progressive Engagement**: Implement similar engagement escalation for each character

## 📚 Additional Resources

- [Maya Character Documentation](./maya/README.md)
- [PACE Framework Reference](../../docs/PACE_FRAMEWORK.md)
- [ContextualLyraChat API](../ContextualLyraChat.md)
- [Testing Guidelines](../../../__tests__/README.md)

---

## 🆘 Troubleshooting

### Common Issues

1. **Chat not appearing**: Check `shouldShowChat()` logic and engagement level progression
2. **Questions not filtering**: Verify `mayaJourneyState.completedStages` is updating correctly
3. **Character voice inconsistent**: Review `mayaChatResponseSystem` configuration
4. **Performance issues**: Monitor component re-renders and optimize state updates

### Support

For implementation support, refer to the main integration template document or create an issue in the project repository.