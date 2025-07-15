# Learning Path Integration Guide

## Overview
The Learning Path system transforms complex AI tools into focused 5-minute learning experiences. This guide shows how to integrate learning paths into existing components.

## Core Components

### 1. LearningPath Component
Located at: `src/components/learning/LearningPath.tsx`

The main wrapper that provides:
- 3-phase structure (Intro → Learning → Complete)
- Progress tracking and timer
- Step navigation
- Gamification elements

### 2. Character-Specific Learning Paths
Examples:
- `MayaEmailLearningPath.tsx` - Email writing mastery
- `DavidDataLearningPath.tsx` - Data storytelling

## Integration Pattern

### Step 1: Add Learning Mode Banner
Add this banner to your existing component's intro phase:

```tsx
{/* Learning Path Banner */}
{phase === 'intro' && (
  <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 mb-4">
    <CardContent className="pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-purple-900">New! 5-Minute Learning Path</p>
            <p className="text-sm text-purple-700">Master [skill] with guided AI practice</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/learning/[character]-[skill]')}
          variant="outline"
          className="border-purple-300 hover:bg-purple-100"
        >
          Try Learning Mode
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

### Step 2: Create Learning Path Component
Structure your learning path with:

1. **Define Objectives** (What they'll learn)
```tsx
const objectives = [
  {
    id: '1',
    title: 'Master the Core Concept',
    description: 'Understand the fundamental principle'
  },
  // 2-3 more objectives
];
```

2. **Define Steps** (How they'll learn)
```tsx
const steps = [
  {
    id: 'learn',
    title: 'Learn [Concept]',
    duration: '30 seconds',
    type: 'learn' as const,
    content: null,
    completed: false
  },
  {
    id: 'practice',
    title: 'Practice [Skill]',
    duration: '2 minutes',
    type: 'practice' as const,
    content: null,
    completed: false
  },
  {
    id: 'apply',
    title: 'Apply [Knowledge]',
    duration: '2.5 minutes',
    type: 'apply' as const,
    content: null,
    completed: false
  }
];
```

3. **Define Tips** (Practical AI guidance)
```tsx
const tips = [
  { id: '1', tip: 'Specific actionable advice', emoji: '💡' },
  // 4-5 more tips
];
```

### Step 3: Implement Step Content
Each step should have focused content:

**Learn Step**: Explain the concept simply
- Use analogies and metaphors
- Show before/after examples
- Keep it under 30 seconds to read

**Practice Step**: Guided hands-on practice
- Break complex tasks into simple choices
- Provide immediate feedback
- Show progress visually

**Apply Step**: Real-world application
- Let them generate actual output
- Show time/effort saved
- Celebrate the achievement

## Best Practices

### 1. Simplify AI Concepts
- ❌ "Adjust the temperature parameter to control stochasticity"
- ✅ "Temperature is like creativity level - higher = more creative"

### 2. Focus on Outcomes
- ❌ "This tool uses GPT-4 to process text"
- ✅ "Save 27 minutes on every email you write"

### 3. Use Progressive Disclosure
- Start with the simplest version
- Add complexity only when needed
- Let success build confidence

### 4. Make It Practical
- Use real nonprofit scenarios
- Show actual time savings
- Include templates they can reuse

### 5. Add Visual Feedback
- Progress bars for each step
- Celebration animations on completion
- Clear visual hierarchy

## Example Integration

Here's how Maya's Email Composer was transformed:

1. **Original**: Complex interface with many options
2. **Learning Path**: 3 simple steps
   - Learn the "Email Recipe" concept
   - Build recipe with 3 ingredients
   - Generate and see results

Key changes:
- Reduced cognitive load
- Clear progression
- Immediate value demonstration
- Focus on one skill at a time

## Quick Tips Component

Add contextual tips throughout your app:

```tsx
import { QuickAITips } from '@/components/learning/QuickAITips';

// Compact version
<QuickAITips compact category="Prompting" />

// Full version
<QuickAITips />
```

## Measuring Success

Track these metrics:
- Completion rate (target: >80%)
- Time to complete (target: <5 minutes)
- Skill application rate
- User confidence increase

## Next Steps

1. Identify a complex component to transform
2. Define the ONE core skill it teaches
3. Create 3 clear learning steps
4. Add practical AI tips throughout
5. Test with real users

Remember: The goal is to make AI accessible, not to teach everything at once. Focus on immediate, practical value in 5 minutes or less.