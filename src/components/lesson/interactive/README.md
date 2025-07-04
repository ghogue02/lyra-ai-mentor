# Interactive Component Loading System

## Overview

This directory contains the component loading system for interactive elements in lessons. The system supports both lazy loading (for code splitting) and direct imports (for problematic components).

## Architecture

### Component Loading Flow

1. `InteractiveElementRenderer` calls `getComponentName()` to map element type to component name
2. `loadComponent()` checks if the component should use direct import
3. If yes, it returns the directly imported component
4. If no, it creates a lazy-loaded component using React.lazy()
5. Components are cached to avoid re-importing

### Key Files

- `componentLoader.ts` - Main component loading logic with mappings
- `directImportLoader.ts` - Direct imports for components that have issues with React.lazy
- `safeLazy.ts` - Safe wrapper around React.lazy (currently unused but available)
- `debugLazy.ts` - Debug utilities and SafeErrorBoundary for better error handling

## Troubleshooting Object-to-Primitive Errors

If you encounter "Cannot convert object to primitive value" errors with lazy-loaded components:

1. **Identify the problematic component** - Check console logs for the component name
2. **Add to direct imports** - Edit `directImportLoader.ts`:
   ```typescript
   import { YourComponent } from '@/components/interactive/YourComponent';
   
   const directImportMap: Record<string, React.ComponentType<any>> = {
     // ... existing components
     YourComponent,
   };
   ```
3. **Test the fix** - The component should now load without errors

### Why This Happens

React's internal lazy loading error handling sometimes tries to convert complex objects to strings when formatting error messages. This causes the "Cannot convert object to primitive value" error. Direct imports bypass React.lazy entirely, avoiding this issue.

### Current Direct Import Components

**Note**: Due to React.lazy incompatibility issues, all character-specific components now use direct imports.

#### Maya Components (Chapter 2)
- MayaEmailConfidenceBuilder
- MayaPromptSandwichBuilder  
- MayaParentResponseEmail
- MayaGrantProposal
- MayaGrantProposalAdvanced
- MayaBoardMeetingPrep
- MayaResearchSynthesis

#### Sofia Components (Chapter 3)
- SofiaMissionStoryCreator
- SofiaVoiceDiscovery
- SofiaStoryBreakthrough
- SofiaImpactScaling

#### David Components (Chapter 4)
- DavidDataRevival
- DavidDataStoryFinder
- DavidPresentationMaster
- DavidSystemBuilder

#### Rachel Components (Chapter 5)
- RachelAutomationVision
- RachelWorkflowDesigner
- RachelProcessTransformer
- RachelEcosystemBuilder

#### Alex Components (Chapter 6)
- AlexChangeStrategy
- AlexVisionBuilder
- AlexRoadmapCreator
- AlexLeadershipFramework

## Adding New Interactive Components

1. Create your component in `/src/components/interactive/`
2. Add the import mapping in `componentLoader.ts` under `componentMap`
3. Add the element type mapping in `getComponentName()` function
4. Test thoroughly - if you get object-to-primitive errors, add to direct imports

## Performance Considerations

- Direct imports are bundled in the main chunk (larger initial load)
- Lazy components are code-split (smaller initial load, loaded on demand)
- All character-specific components use direct imports due to React.lazy compatibility issues
- Generic components (KnowledgeCheckRenderer, ReflectionRenderer, etc.) continue to use lazy loading
- The performance impact is acceptable since users typically access multiple character components in a session