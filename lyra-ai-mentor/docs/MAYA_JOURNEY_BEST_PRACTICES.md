# Maya Journey Component Best Practices

## Overview
This document outlines best practices learned while implementing the Maya Email Composer journey, a complex multi-stage educational experience that teaches the PACE framework through storytelling and interactive components.

## 1. PACE Framework Integration

### ✅ DO: Make PACE Explicit
- Use clear P-A-C-E labeling in UI components
- Reinforce the acronym visually (icons, colors, sections)
- Example: PromptBuilder.tsx uses Target/Users/FileText/Zap icons

### ❌ DON'T: Hide the Framework
- Avoid generic labels that don't teach PACE
- Don't assume users will infer the framework

## 2. Audience Descriptions

### ✅ DO: Write Complete, Natural Sentences
```typescript
// Good
"Someone who needs strong evidence and logical arguments, especially when it comes to decision-making"

// Bad
"Someone who needs strong evidence in the context of decision-making. Currently in a calm state."
```

### ✅ DO: Remove Line Clamps for Important Content
```tsx
// Good - Shows full description
<p className="text-gray-700 text-sm mb-3">
  {audience.contextualDescription}
</p>

// Bad - Cuts off content
<p className="text-gray-700 text-sm mb-3 line-clamp-3">
  {audience.contextualDescription}
</p>
```

## 3. Prompt Generation for AI Tools

### ✅ DO: Make Prompts Generic and Universal
- Remove character-specific references (e.g., "Maya")
- Use role descriptions instead of names
- Test prompts work with ChatGPT, Claude, etc.

### Code Pattern for Clean Prompts:
```typescript
// Convert specific labels to generic roles
const getGenericRole = (label: string): string => {
  if (label.includes('Thoughtful Strategist')) return 'thoughtful strategist';
  if (label.includes('Under Pressure')) return 'person under time pressure';
  // ... more mappings
};

// Clean descriptions
const cleanDescription = audienceDescription
  .replace(/Like Maya/g, 'Someone who is')
  .replace(/Maya/g, 'they')
  .toLowerCase();
```

## 4. Dynamic Choice Service Architecture

### ✅ DO: Separate Concerns
- Base data (audiences, purposes) → Service layer
- Personalization logic → Dynamic adaptation
- UI presentation → Component layer

### ✅ DO: Use TypeScript Types Extensively
```typescript
export interface DynamicAudience {
  id: string;
  label: string;
  description: string;
  contextualDescription: string;
  psychographics: {
    motivations: string[];
    painPoints: string[];
    preferredCommunicationStyle: CommunicationStyle;
    decisionMakingStyle: DecisionMakingStyle;
  };
  // ... more typed properties
}
```

## 5. Storytelling Integration

### ✅ DO: Use Progressive Disclosure
- Start with Maya's struggle (relatable)
- Show transformation through stages
- End with user empowerment

### ✅ DO: Keep It Concise
- 3-4 narrative messages per stage maximum
- Each message 2-3 sentences
- Focus on emotional connection, not exposition

## 6. Component Organization

### File Structure:
```
src/components/lesson/chat/lyra/maya/
├── LyraNarratedMayaDynamicComplete.tsx  # Main orchestrator
├── dynamicStages.tsx                     # Stage definitions
├── types.ts                              # Shared types
├── PromptBuilder.tsx                     # PACE prompt display
├── SimplifiedFrameworkDisplay.tsx        # Framework teaching
└── helpers.ts                            # Utility functions
```

### ✅ DO: Use Memoization for Complex Calculations
```typescript
const paceSections = useMemo<PromptSection[]>(() => {
  // Complex section building logic
  return sections;
}, [paceData, currentStageIndex]);
```

## 7. Accessibility and UX

### ✅ DO: Provide Multiple Options
- Always show 2-3 audience choices
- Include "Show Me Another" option
- Make selection criteria clear

### ✅ DO: Use Visual Hierarchy
- "Best Match" badge for recommended option
- Color coding (purple for primary, gray for secondary)
- Clear CTAs for each choice

## 8. Testing Considerations

### ✅ DO: Test All Combinations
- Every purpose × audience combination
- Different user contexts (time, stress, confidence)
- Framework selection variations

### ✅ DO: Validate Output Quality
```javascript
// Test script pattern
testCases.forEach(testCase => {
  const output = generatePrompt(testCase);
  validateCompleteness(output);
  validateGrammar(output);
  validateUniversality(output);
});
```

## 9. Memory and State Management

### ✅ DO: Track User Journey
```typescript
interface MayaJourneyState {
  purpose: string;
  selectedAudience: string;
  framework: MayaFramework | null;
  emailGenerated: boolean;
  // ... progression tracking
}
```

### ❌ DON'T: Overload Component State
- Use context for shared state
- Keep component state minimal
- Derive values when possible

## 10. Performance Optimization

### ✅ DO: Lazy Load Heavy Components
```typescript
const MayaEmailComposer = lazy(() => 
  import('./MayaEmailComposer')
);
```

### ✅ DO: Optimize Re-renders
- Use React.memo for pure components
- Proper dependency arrays in hooks
- Avoid inline function definitions in render

## Common Pitfalls to Avoid

1. **Grammar Issues in Generated Text**
   - Always use helper functions for articles (a/an)
   - Check sentence completeness
   - Avoid double periods from concatenation

2. **Context Loss Between Stages**
   - Pass complete journey state
   - Maintain narrative continuity
   - Show progress indicators

3. **Overcomplicated Frameworks**
   - Keep teaching frameworks simple (3-4 steps max)
   - Use natural language, not academic jargon
   - Show examples, not just theory

4. **Missing Error States**
   - Handle loading states for dynamic content
   - Provide fallbacks for failed generation
   - Clear error messages for users

## Code Quality Checklist

- [ ] TypeScript types for all props and state
- [ ] Proper error boundaries around dynamic content
- [ ] Accessibility: keyboard navigation, ARIA labels
- [ ] Mobile responsive design
- [ ] Loading states for async operations
- [ ] Memoization for expensive computations
- [ ] Clean, semantic HTML structure
- [ ] Consistent naming conventions
- [ ] Comments for complex logic
- [ ] Unit tests for utility functions

## Future Enhancements

1. **A/B Testing Framework**
   - Test different narrative approaches
   - Measure engagement with story elements
   - Optimize framework selection

2. **Advanced Personalization**
   - Learn from user choices over time
   - Adapt narrative style to user preferences
   - Suggest frameworks based on success rates

3. **Multi-modal Support**
   - Audio narration option
   - Visual framework diagrams
   - Interactive examples

4. **Analytics Integration**
   - Track completion rates by stage
   - Measure time spent on each section
   - Identify drop-off points

---

Last Updated: 2025-01-08
Contributors: Claude Code + Greg Hogue