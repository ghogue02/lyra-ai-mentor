# Interactive Element Development Guidelines

> **Living Document**: This guide captures patterns from successful interactive elements like Decision Matrix and Team Capacity Calculator. Updates automatically trigger when new patterns emerge or feedback is received.

## 🎯 Component Architecture Patterns

### Three-Phase Structure (Universal Pattern)
Every interactive element follows this progression:
```typescript
type Phase = 'intro' | 'narrative' | 'workshop';
```

**Phase Breakdown:**
- **Intro (0-33% progress)**: Problem statement, tool overview, visual hook
- **Narrative (33-66% progress)**: Character context using NarrativeManager
- **Workshop (66-100% progress)**: Active building/calculation with multi-step flow

### Multi-Step Workshop Pattern
```typescript
const [currentStep, setCurrentStep] = useState(0);
const steps = ['scenario-selection', 'configuration', 'analysis', 'results'];
```

**Step Components:**
1. **Scenario Selection**: PresetSelector with realistic nonprofit contexts
2. **Configuration**: Interactive builders with preset options and drag-drop
3. **Analysis**: Real-time calculations with visual feedback
4. **Results**: Dedicated page with comprehensive visualizations

### Dedicated Results Pages
For complex tools requiring full-screen visualization:
- **Route Pattern**: `/chapter/{n}/interactive/{tool-name}-results`
- **Navigation**: Pass data via `navigate()` state, not URL params
- **Fallback**: Redirect to main tool if no data present

### State Management Standards
```typescript
// Clear naming with realistic defaults
const [requirements, setRequirements] = useState<Requirement[]>([
  { id: '1', category: 'Content Creation', hours: 40 }
]);

// Memoized calculations for performance
const utilizationRate = useMemo(() => 
  available > 0 ? (reqHours / available) * 100 : 0, 
  [available, reqHours]
);
```

## 🤖 AI Integration Standards

### Prompt Structure Template
```typescript
const promptPreview = `Analyze [TOOL_PURPOSE] for nonprofit project:

CONTEXT OVERVIEW:
- Key metric: ${calculatedValue}
- Risk level: ${riskAssessment}
- Character connection: ${characterContext}

DETAILED DATA:
${structuredDataFormatting}

Provide a concise [CHARACTER_NAME]-style assessment with specific recommendations.`;
```

### Error Handling Pattern
```typescript
try {
  const { data, error } = await supabase.functions.invoke('generate-character-content', {
    body: {
      characterType: 'sofia',
      contentType: 'article', // Always use 'article' for analysis
      topic: 'Descriptive tool purpose',
      context: promptPreview
    }
  });
  
  if (error) throw error;
  
  // Check for success response format
  if (data?.success && data?.content) {
    // Success flow with navigation
    navigate('/results-page', { state: { analysisData } });
  } else {
    throw new Error(data?.error || 'Failed to generate analysis');
  }
} catch (e) {
  const errorMessage = e instanceof Error ? e.message : 'An error occurred';
  toast({ 
    title: 'Generation failed', 
    description: errorMessage, 
    variant: 'destructive' 
  });
}
```

### Navigation Flow
1. User completes configuration in main tool
2. "Generate Analysis" triggers AI with loading state
3. On success, navigate to results page with state
4. Results page displays comprehensive analysis
5. "Continue Learning" returns to chapter progression

## 🎨 User Experience Patterns

### Scenario-Based Learning
Always provide 2-4 realistic scenarios:
```typescript
const scenarios = [
  {
    id: 'campaign-launch',
    name: 'Major Campaign Launch', 
    description: 'Multi-channel advocacy campaign promoting new policy initiative',
    data: { /* realistic preset data */ }
  }
];
```

### Progressive Disclosure
- **Step 0**: Scenario selection with clear visual cards
- **Step 1+**: Gradual complexity introduction with progress tracking
- **Each Step**: Single focus with clear next action

### Visual Feedback Systems
```typescript
// Real-time progress calculation
const progress = useMemo(() => {
  let baseProgress = phase === 'intro' ? 0 : phase === 'narrative' ? 33 : 66;
  if (phase === 'workshop') {
    const completionFactors = [
      selectedScenario ? 8 : 0,
      hasRequirements ? 8 : 0,
      hasTeam ? 8 : 0,
      aiGenerated ? 10 : 0
    ];
    baseProgress += completionFactors.reduce((a, b) => a + b, 0);
  }
  return Math.min(100, baseProgress);
}, [phase, completionFactors]);
```

### Preset Options Strategy
Reduce cognitive load with smart defaults:
- **Hour Presets**: Light (10h), Medium (25h), Heavy (40h), Intensive (60h)
- **Role Presets**: Communications Lead, Designer, Project Manager with default capacities
- **Task Presets**: Common nonprofit activities for quick selection

## 📊 Data Visualization Standards

### Recharts Integration
```typescript
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Chart configuration pattern
<ChartContainer
  config={{
    metricName: {
      label: "Display Label",
      color: "hsl(var(--primary))",
    },
  }}
  className="h-[300px]"
>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <ChartTooltip content={CustomTooltipContent} />
      <Bar dataKey="value" fill="hsl(var(--primary))" />
    </BarChart>
  </ResponsiveContainer>
</ChartContainer>
```

### Color Coding System
```typescript
// Risk-based color mapping using theme variables
const getRiskColor = (level: string) => {
  switch (level) {
    case 'high': return 'hsl(var(--warning))';
    case 'medium': return 'hsl(var(--chart-3))';
    default: return 'hsl(var(--accent))';
  }
};

// Data preparation with theme colors
const chartData = items.map(item => ({
  ...item,
  fill: item.value > threshold ? 'hsl(var(--warning))' : 'hsl(var(--primary))'
}));
```

### Metrics Display Standards
```typescript
// Key metrics grid pattern
<div className="grid md:grid-cols-4 gap-4">
  {metrics.map(metric => (
    <Card key={metric.id} className="gradient-accent">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <metric.icon className="w-8 h-8 text-primary" />
          <div>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

### Interactive Elements
- **Hover States**: All charts must have meaningful tooltips
- **Click Actions**: Navigate to detail views or trigger modal overlays
- **Color Consistency**: Use theme variables, never hardcoded colors
- **Responsive Design**: All charts work on mobile with appropriate sizing

## 🗂️ Development Workflow

### File Organization
```
src/components/lesson/tools/
├── ToolName.tsx              # Main tool component (phases + workshop)
├── ToolNameResults.tsx       # Dedicated results page
├── ToolNameRenderer.tsx      # Legacy pattern (refactor to above)
└── shared/                   # Shared utilities
    ├── PresetSelectors.tsx
    └── ChartHelpers.tsx
```

### Routing Pattern
```typescript
// App.tsx - Add nested route for results
<Route path="/chapter/:chapterNumber/interactive/:toolName-results" element={<ToolResults />} />

// InteractiveJourney.tsx - Register tool
const journeyRegistry = {
  'tool-name': {
    component: ToolComponent,
    characterId: 'sofia',
    title: 'Tool Display Name',
    description: 'Brief description for navigation'
  }
};
```

### Component Separation
- **Main Tool**: Input, configuration, scenario selection, basic analysis
- **Results Component**: Comprehensive visualization, AI analysis display, navigation
- **Shared Utilities**: Preset selectors, chart configurations, common calculations

## ✅ Quality Checklist

### Character Integration Requirements
- [ ] Character voice woven throughout (Sofia's expertise in storytelling/communications)
- [ ] Narrative messages reflect character's perspective and challenges
- [ ] AI prompts include character context for authentic voice
- [ ] Tool directly solves character's stated problems

### Accessibility Standards  
- [ ] Keyboard navigation for all interactive elements
- [ ] Screen reader compatible with proper ARIA labels
- [ ] Color contrast meets WCAG AA standards (verify with design system)
- [ ] Clear instructions at each phase
- [ ] Error states provide helpful guidance

### Mobile Responsiveness
- [ ] Charts render properly on mobile (minimum 300px width)
- [ ] Touch targets are at least 44px for mobile interaction
- [ ] Text remains readable at all screen sizes
- [ ] Navigation works with touch gestures

### Performance Optimization
- [ ] Large data sets use React.memo and useMemo
- [ ] Charts use lazy loading for complex visualizations
- [ ] State updates batched appropriately
- [ ] No unnecessary re-renders during user interaction

### Error Handling
- [ ] Network failures show user-friendly messages
- [ ] Missing data gracefully falls back to defaults
- [ ] Invalid configurations provide specific guidance
- [ ] Loading states maintain user engagement

## 🔄 Automated Reference System

### Guideline Integration
This document is automatically referenced during development through:
1. **Pre-development Check**: Verify existing patterns before creating new tools
2. **Code Review Points**: Automated checklist validation against these standards
3. **Pattern Updates**: Regular prompts during development to capture new patterns

### Update Triggers
I will ask: **"Should we update the development guidelines based on what we just built?"** when:
- New UI patterns emerge that weren't documented
- Different AI integration approaches prove more effective  
- User feedback suggests better UX flows
- Performance optimizations reveal new best practices
- Accessibility improvements are discovered

### Documentation Evolution
- **Weekly Reviews**: Check if patterns have evolved beyond current guidelines
- **Feature Completion**: Capture lessons learned after each major tool build
- **User Feedback Integration**: Update guidelines based on user testing insights
- **Performance Metrics**: Evolve patterns based on engagement and completion data

---

## 📝 Continuous Improvement Notes

**Last Updated**: {current_date}
**Next Review**: {trigger_on_next_build}

**Recent Pattern Changes**:
- Dedicated results pages for complex visualizations
- State-based navigation instead of URL parameters
- Recharts integration with theme variables
- Three-phase structure with NarrativeManager integration

**Pending Explorations**:
- Advanced chart animations and transitions
- Real-time collaboration features
- Enhanced AI context management
- Mobile-first chart interactions