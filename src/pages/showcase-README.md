# Component Showcase

## Overview

The Component Showcase is a comprehensive developer reference and marketing tool that displays all 35+ interactive components used in the Lyra AI Mentor platform. It provides live previews, performance metrics, and code snippets for easy integration.

## Features

### 🎨 Live Component Previews
- Interactive demonstrations of each component
- Real-time rendering with sample data
- Responsive design for all screen sizes

### 📊 Performance Metrics
- Loading time measurements
- Bundle size impact
- Render count tracking
- Toggle performance view on/off

### 💻 Developer Tools
- Copy-paste code snippets
- Import statements included
- Usage examples with props
- Syntax highlighting

### 🔍 Search & Filter
- Search by component name or description
- Filter by category:
  - Character Components (24 total)
  - Core Renderers (6 components)
  - AI/Testing Components (9 components)
- Filter by character (Maya, Sofia, Rachel, David, Alex)

## Component Categories

### Character Components (24 total)

#### Maya (8 components)
- **MayaEmailComposer** - AI-powered email composition tool
- **MayaGrantProposal** - Grant proposal writing assistant
- **MayaGrantProposalAdvanced** - Advanced grant proposal builder
- **MayaParentResponseEmail** - Parent communication specialist
- **MayaPromptSandwichBuilder** - Learn the "prompt sandwich" technique
- **MayaResearchSynthesis** - Research synthesis tool
- **MayaBoardMeetingPrep** - Board meeting preparation
- **MayaEmailConfidenceBuilder** - Build email confidence

#### Sofia (4 components)
- **SofiaMissionStoryCreator** - Create mission-driven stories
- **SofiaStoryBreakthrough** - Breakthrough storytelling techniques
- **SofiaVoiceDiscovery** - Discover your organizational voice
- **SofiaImpactScaling** - Scale impact through storytelling

#### Rachel (4 components)
- **RachelAutomationVision** - Envision automation possibilities
- **RachelEcosystemBuilder** - Build integrated tech ecosystems
- **RachelProcessTransformer** - Transform manual processes
- **RachelWorkflowDesigner** - Design automated workflows

#### David (4 components)
- **DavidDataRevival** - Revive dormant data
- **DavidDataStoryFinder** - Find stories in data
- **DavidPresentationMaster** - Master data presentation
- **DavidSystemBuilder** - Build data systems

#### Alex (4 components)
- **AlexChangeStrategy** - Develop change strategies
- **AlexLeadershipFramework** - Build leadership frameworks
- **AlexRoadmapCreator** - Create AI roadmaps
- **AlexVisionBuilder** - Build AI vision statements

### Core Renderers (6 components)
- **AIContentGeneratorRenderer** - Core AI content generation
- **CalloutBoxRenderer** - Important information callouts
- **KnowledgeCheckRenderer** - Knowledge check questions
- **LyraChatRenderer** - Interactive chat components
- **ReflectionRenderer** - Reflection prompts
- **SequenceSorterRenderer** - Sequence sorting exercises

### AI/Testing Components (9 components)
- **DonorBehaviorPredictor** - Predict donor patterns
- **RestaurantSurplusPredictor** - Food surplus prediction
- **VolunteerSkillsMatcher** - Match volunteers with opportunities
- **AIDefinitionBuilder** - Build AI definitions
- **AIMythsSwiper** - Interactive myth-busting
- **GrantWritingAssistant** - AI grant writing help
- **AIContentGenerator** - Generate various content
- **AIImpactStoryCreator** - Create impact stories
- **TimeSavingsCalculator** - Calculate AI time savings

## Usage

### Accessing the Showcase

1. Navigate to the Dashboard
2. Click on the "Developer Tools" tab
3. Select "Component Showcase"

Or directly visit: `/showcase`

### Using Components in Your Code

Each component includes a complete code snippet. For example:

```typescript
import { MayaEmailComposer } from '@/components/interactive/MayaEmailComposer';

function MyComponent() {
  return (
    <MayaEmailComposer 
      onComplete={() => console.log('Email completed')} 
    />
  );
}
```

### Performance Optimization

The showcase helps identify:
- Components with high load times
- Bundle size impacts
- Rendering performance
- Memory usage patterns

Use this data to:
- Optimize component loading
- Implement code splitting
- Add lazy loading where needed
- Reduce bundle sizes

## Mobile Responsiveness

All components are designed to work seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Development Guidelines

When adding new components:

1. **Import** the component in ComponentShowcase.tsx
2. **Add** to the components array with:
   - Unique name
   - Component reference
   - Category (character/renderer/ai-testing)
   - Character name (if applicable)
   - Description
   - Default props
   - Code snippet
3. **Test** the preview rendering
4. **Verify** mobile responsiveness
5. **Check** performance metrics

## Marketing Use Cases

The Component Showcase serves as:
- **Demo Tool** - Show potential users the platform's capabilities
- **Feature Gallery** - Highlight interactive learning elements
- **Technical Showcase** - Demonstrate modern React development
- **Training Resource** - Help new developers understand components

## Future Enhancements

Planned features:
- Component versioning
- A/B testing variants
- Accessibility scores
- Component dependencies graph
- Export to Storybook
- Component usage analytics
- Dark mode previews

## Troubleshooting

### Component Not Rendering
- Check import path is correct
- Verify component exports correctly
- Ensure props are provided
- Check console for errors

### Performance Issues
- Enable performance monitoring
- Check bundle size impact
- Look for unnecessary re-renders
- Consider lazy loading

### Search Not Working
- Clear browser cache
- Check component name spelling
- Try different search terms
- Use category filters

## Contributing

To add or modify components:
1. Follow the existing component structure
2. Include comprehensive props documentation
3. Add meaningful descriptions
4. Test across all breakpoints
5. Update this README if needed

---

For questions or support, contact the development team.