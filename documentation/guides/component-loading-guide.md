# Component Loading Guidelines

## Overview
This guide documents best practices for component loading in the AI Learning Hub, particularly regarding React.lazy and dynamic imports.

## Direct Import Requirements

### Components That MUST Use Direct Imports
The following component types have proven incompatible with React.lazy and must use direct imports:

1. **Character-Specific Components** (23 total)
   - All Maya components (Chapter 2)
   - All Sofia components (Chapter 3) 
   - All David components (Chapter 4)
   - All Rachel components (Chapter 5)
   - All Alex components (Chapter 6)

2. **Core Renderer Components** (5 total)
   - CalloutBoxRenderer
   - LyraChatRenderer
   - KnowledgeCheckRenderer
   - ReflectionRenderer
   - SequenceSorterRenderer

3. **AI/Testing Components** (7 total)
   - DifficultConversationHelper
   - AIContentGenerator
   - AIEmailComposer
   - DocumentImprover
   - TemplateCreator
   - DocumentGenerator
   - AISocialMediaGenerator

### Why Direct Imports Are Required
React.lazy's internal error handling mechanism can fail when trying to convert complex component structures to primitive values. This causes the "Cannot convert object to primitive value" error.

## Implementation Pattern

### Adding New Direct Import Components

1. **Add to directImportLoader.ts**:
```typescript
// Import at the top
import { NewComponent } from '@/components/interactive/NewComponent';

// Add to directImportMap
const directImportMap: Record<string, React.ComponentType<any>> = {
  // ... existing components
  'NewComponent': NewComponent,
};
```

2. **Update shouldUseDirectImport function** if needed for new categories

3. **Test thoroughly** to ensure the component loads without errors

### Component Loader Architecture

The system uses a two-tier approach:
1. **Check for direct imports first** via `shouldUseDirectImport()`
2. **Fall back to React.lazy** for components not requiring direct imports

## Performance Considerations

- Direct imports increase initial bundle size but provide 100% reliability
- Current impact: ~909KB bundle size (acceptable for production)
- Trade-off: Larger bundle vs. runtime errors

## Debugging Component Loading Issues

### Warning Signs
- "Cannot convert object to primitive value" errors
- Errors in React chunk files (e.g., chunk-*.js)
- Errors mentioning `lazyInitializer` or `mountLazyComponent`

### Debug Tools Available
- `/src/pages/DebugChapter3.tsx` - UI for testing component loading
- Comprehensive logging with `[ComponentLoader]` prefix
- Test scripts in `/scripts/` directory

## Best Practices

1. **Test new components** with both lazy loading and direct imports
2. **Monitor console** for loading errors during development
3. **Document** any components added to direct imports with reasoning
4. **Use error boundaries** around dynamically loaded content
5. **Keep directImportLoader.ts organized** by component category

## Maintenance

- Review quarterly for components that could return to lazy loading
- Monitor React updates for improved lazy loading capabilities
- Keep bundle size under 1MB when possible