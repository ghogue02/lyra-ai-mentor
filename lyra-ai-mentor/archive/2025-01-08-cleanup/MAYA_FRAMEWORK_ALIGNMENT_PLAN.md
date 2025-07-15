# Maya Framework Alignment Implementation Plan

## Executive Summary
There is a significant disconnect between Lyra's narrative about Maya's three frameworks and what the interactive content actually displays. Lyra teaches about Story Arc, Teaching Moment, and Invitation frameworks, but the UI shows generic technical terms like "priority_order" and "compare_contrast."

## The Disconnect

### What Lyra Teaches (dynamicStages.tsx, line 592)
"Maya mastered three frameworks:
- **The Story Arc**: Setup, Struggle, Solution, Success
- **The Teaching Moment**: Observation, Insight, Application  
- **The Invitation**: Vision, Gap, Bridge"

### What Currently Displays (Stage 4)
```
Opening Approach: warm
Body Framework: priority_order
Closing Strategy: call_to_action
```

## Implementation Requirements

### Phase 1: Add Maya Framework Selection (New Stage 3.5)
**Location**: Between Audience Selection and Content Strategy

```typescript
// New framework selection stage
{
  id: 'maya-framework-selection',
  title: 'Choose Your Framework',
  component: (
    <FrameworkSelector 
      frameworks={[
        {
          id: 'story_arc',
          name: 'The Story Arc',
          description: 'Perfect when you need to take someone on a journey',
          elements: ['Setup', 'Struggle', 'Solution', 'Success'],
          mayaExample: 'Last Tuesday, our food pantry ran out of milk...',
          bestFor: ['Volunteer recruitment', 'Impact stories', 'Program updates']
        },
        {
          id: 'teaching_moment',
          name: 'The Teaching Moment',
          description: 'Ideal for sharing insights that change perspectives',
          elements: ['Observation', 'Insight', 'Application'],
          mayaExample: '12-year-old Carlos told me he finally understands...',
          bestFor: ['Board education', 'Donor cultivation', 'Team learning']
        },
        {
          id: 'invitation',
          name: 'The Invitation',
          description: 'When you want to open a door to meaningful action',
          elements: ['Vision', 'Gap', 'Bridge'],
          mayaExample: 'Imagine if every child in our community...',
          bestFor: ['Fundraising appeals', 'Partnership proposals', 'Call to action']
        }
      ]}
      onSelect={(framework) => {
        setMayaJourney(prev => ({ ...prev, framework: framework.id }));
        setCurrentStageIndex(4);
      }}
    />
  )
}
```

### Phase 2: Enhance Dynamic Choice Service
**File**: `src/services/dynamicChoiceService.ts`

Add Maya framework awareness:

```typescript
private createAdaptiveFramework(
  purpose: PurposeType,
  audience: DynamicAudience,
  context: UserContext,
  mayaFramework?: 'story_arc' | 'teaching_moment' | 'invitation'
): ContentFramework {
  if (mayaFramework) {
    return this.createMayaFramework(mayaFramework, purpose, audience, context);
  }
  // Existing logic...
}

private createMayaFramework(
  framework: 'story_arc' | 'teaching_moment' | 'invitation',
  purpose: PurposeType,
  audience: DynamicAudience,
  context: UserContext
): ContentFramework {
  const mayaStructures = {
    story_arc: {
      structure: {
        openingApproach: 'story' as OpeningApproach,
        bodyFramework: 'maya_story_arc' as BodyFramework,
        closingStrategy: 'forward_looking' as ClosingStrategy,
        callToAction: 'soft_suggestion' as CallToActionType
      },
      elements: [
        { phase: 'Setup', description: 'Paint the scene, introduce the characters' },
        { phase: 'Struggle', description: 'Show the challenge or tension' },
        { phase: 'Solution', description: 'Reveal the turning point' },
        { phase: 'Success', description: 'Celebrate the transformation' }
      ]
    },
    teaching_moment: {
      structure: {
        openingApproach: 'question' as OpeningApproach,
        bodyFramework: 'maya_teaching' as BodyFramework,
        closingStrategy: 'summary' as ClosingStrategy,
        callToAction: 'benefit_focused' as CallToActionType
      },
      elements: [
        { phase: 'Observation', description: 'What I noticed that surprised me' },
        { phase: 'Insight', description: 'What this teaches us' },
        { phase: 'Application', description: 'How we can use this wisdom' }
      ]
    },
    invitation: {
      structure: {
        openingApproach: 'warm' as OpeningApproach,
        bodyFramework: 'maya_invitation' as BodyFramework,
        closingStrategy: 'call_to_action' as ClosingStrategy,
        callToAction: 'multiple_options' as CallToActionType
      },
      elements: [
        { phase: 'Vision', description: 'The beautiful future we can create' },
        { phase: 'Gap', description: 'What stands between us and that future' },
        { phase: 'Bridge', description: 'Your role in building the path forward' }
      ]
    }
  };
  
  return {
    ...mayaStructures[framework],
    toneGuidelines: this.createMayaToneGuidelines(framework, audience),
    messagingHierarchy: this.createMayaMessagingHierarchy(framework, purpose),
    adaptiveElements: []
  };
}
```

### Phase 3: Transform Stage 4 Display
**Location**: Stage 4 component in dynamicStages.tsx

Replace technical display with Maya's framework:

```typescript
// Instead of showing technical structure, show Maya's framework
<div className="space-y-4">
  <h3 className="font-semibold text-lg">
    Using Maya's {getFrameworkName(mayaJourney.framework)}
  </h3>
  
  {mayaFrameworkElements.map((element, idx) => (
    <div key={idx} className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
        {idx + 1}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-purple-900">{element.phase}</h4>
        <p className="text-sm text-gray-600">{element.description}</p>
        {element.npoExample && (
          <p className="text-xs text-purple-600 italic mt-1">
            Example: {element.npoExample}
          </p>
        )}
      </div>
    </div>
  ))}
</div>
```

### Phase 4: Naturalize All Technical Language

**Technical → Natural Mappings**:

| Current Technical | Natural Maya Language |
|------------------|---------------------|
| openingApproach: 'warm' | "Start with heart" |
| bodyFramework: 'priority_order' | "What matters most" |
| closingStrategy: 'call_to_action' | "Your next step" |
| preferredCommunicationStyle: 'analytical_detailed' | "Loves the full picture" |
| decisionMakingStyle: 'thorough_analytical' | "Thinks it through carefully" |
| timeConstraints: 'very_limited' | "Racing against the clock" |

### Phase 5: Add NPO Context Throughout

Every framework element should include NPO examples:

```typescript
const npoExamples = {
  story_arc: {
    setup: "Picture our community center on a typical Tuesday afternoon...",
    struggle: "But this Tuesday, we had to turn away 15 families...",
    solution: "That's when volunteer Maria suggested...",
    success: "Now every Tuesday, those same 15 families..."
  },
  teaching_moment: {
    observation: "I noticed our quietest board member suddenly speaking up...",
    insight: "She taught me that silence often means processing, not disengagement...",
    application: "Now I always pause and invite quiet voices..."
  },
  invitation: {
    vision: "Imagine every child in our community reading at grade level...",
    gap: "Right now, 40% are falling behind...",
    bridge: "Your monthly gift of $30 provides one child..."
  }
};
```

## Implementation Priority

1. **Critical**: Add Maya framework selection (users need to choose which framework)
2. **Critical**: Update service to generate Maya framework structures
3. **Critical**: Transform Stage 4 display to show Maya's framework elements
4. **Important**: Naturalize all technical language throughout
5. **Important**: Add NPO examples to each framework element
6. **Nice-to-have**: Add framework recommendation based on purpose + audience

## Success Metrics

- [ ] User explicitly selects one of Maya's three frameworks
- [ ] Stage 4 displays the selected framework with its specific elements
- [ ] No technical terms visible to users (all naturalized)
- [ ] Each framework element includes an NPO example
- [ ] Generated emails follow the selected Maya framework structure

## Technical Debt to Address

1. Add new BodyFramework enum values: 'maya_story_arc', 'maya_teaching', 'maya_invitation'
2. Extend PathSpecificStrategy to include mayaFramework property
3. Update type definitions to support framework-specific elements
4. Ensure backward compatibility with existing paths

## Notes for Interactive Framework Developer

- The disconnect is significant - users are learning about three specific frameworks but never get to use them
- Maya's frameworks are storytelling tools, not technical structures
- Every technical term should be translated to Maya's warm, approachable language
- NPO context is essential - these aren't generic business frameworks
- The user journey should feel like Maya is personally guiding them through her proven approach