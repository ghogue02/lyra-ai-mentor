# Lesson Modularization Guidelines

## Overview

This document provides comprehensive guidelines for creating modular, reusable, and maintainable lesson components in the Lyra AI Mentor platform. These guidelines are based on analysis of successful patterns from the existing codebase and are designed to ensure consistency, quality, and scalability across all lesson implementations.

## 🏗️ Architecture Patterns

### Component Hierarchy

```
📁 src/components/
├── 📁 lesson/              # Core lesson infrastructure
│   ├── InteractiveElementRenderer.tsx
│   ├── LessonContent.tsx
│   ├── LessonProgress.tsx
│   └── interactive/        # Interactive component loading system
├── 📁 interactive/         # Character-specific interactive components
│   ├── MayaEmailComposer.tsx
│   ├── SofiaVoiceDiscovery.tsx
│   ├── DavidDataRevival.tsx
│   ├── RachelAutomationVision.tsx
│   ├── AlexChangeStrategy.tsx
│   └── __tests__/         # Component tests
├── 📁 templates/          # Component templates
│   └── LessonComponentTemplate.tsx
└── 📁 ui/                 # Reusable UI components
    ├── button.tsx
    ├── card.tsx
    └── ...
```

### Component Types

#### 1. Interactive Components
**Purpose**: Character-specific learning interactions
**Location**: `/src/components/interactive/`
**Examples**: `MayaEmailComposer.tsx`, `SofiaVoiceDiscovery.tsx`

#### 2. Lesson Infrastructure
**Purpose**: Core lesson rendering and progress tracking
**Location**: `/src/components/lesson/`
**Examples**: `InteractiveElementRenderer.tsx`, `LessonProgress.tsx`

#### 3. UI Components
**Purpose**: Reusable interface elements
**Location**: `/src/components/ui/`
**Examples**: `button.tsx`, `card.tsx`, `progress.tsx`

## 🧩 Component Reusability Guidelines

### Template-Based Development

Always start with the provided template:

```typescript
// Use LessonComponentTemplate.tsx as base
import { LessonComponentTemplate } from '@/templates/LessonComponentTemplate';

// Copy template structure, update imports and logic
export function YourLessonComponent({ 
  chapterNumber, 
  lessonNumber, 
  characterName 
}: LessonComponentProps) {
  // Follow template patterns
}
```

### Shared Utilities

Create reusable utilities for common functionality:

```typescript
// Example: Character-specific utilities
export const characterUtils = {
  getCharacterTheme: (characterName: string) => {...},
  getCharacterIcon: (characterName: string) => {...},
  getCharacterColor: (characterName: string) => {...}
};

// Example: Progress tracking utilities
export const progressUtils = {
  trackInteraction: (componentId: string, points: number) => {...},
  markComplete: (componentId: string, score: number) => {...}
};
```

### Component Composition

Build complex components from smaller, reusable pieces:

```typescript
// Base component structure
const BaseInteractiveComponent = ({ 
  children, 
  onComplete, 
  componentId 
}) => {
  const { trackInteraction, markAsComplete } = useComponentProgress({
    componentId,
    autoStart: true,
    completionThreshold: 80
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <ProgressWidget componentId={componentId} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter>
        <SaveToToolkitButton onSave={handleSave} />
      </CardFooter>
    </Card>
  );
};
```

## 🔄 State Management Patterns

### Context-Based State

Use React Context for global state management:

```typescript
// Character Story Context
const CharacterStoryContext = createContext<{
  currentCharacter: string;
  storyProgress: number;
  updateProgress: (progress: number) => void;
}>();

// Progress Context
const ProgressContext = createContext<{
  startComponent: (id: string) => void;
  completeComponent: (id: string, score: number) => void;
  getComponentProgress: (id: string) => Progress;
}>();
```

### Hook-Based State Management

Create custom hooks for component-specific state:

```typescript
// Component progress tracking
export const useComponentProgress = ({
  componentId,
  autoStart = true,
  completionThreshold = 80
}: UseComponentProgressOptions) => {
  const { startComponent, completeComponent } = useProgress();
  
  return {
    isCompleted: boolean;
    timeSpent: number;
    trackInteraction: (points: number) => void;
    markAsComplete: (score?: number) => void;
  };
};

// Character-specific hooks
export const useCharacterTheme = (characterName: string) => {
  return {
    primaryColor: string;
    secondaryColor: string;
    gradientClass: string;
    iconSet: IconSet;
  };
};
```

### Service-Based State

Use services for complex business logic:

```typescript
// Enhanced AI Service
export const enhancedAIService = {
  generateContent: async (prompt: string, options: AIOptions) => {...},
  streamResponse: async (prompt: string) => {...},
  analyzeContent: async (content: string) => {...}
};

// Toolkit Service
export const toolkitService = {
  saveItem: async (item: ToolkitItem) => {...},
  getItems: async (categoryKey: string) => {...},
  deleteItem: async (id: string) => {...}
};
```

## 🎨 UI/UX Design Patterns

### Consistent Component Structure

Follow this structure for all interactive components:

```typescript
export function InteractiveComponent() {
  return (
    <EnsureToolkitData fallback={<LoadingSpinner />}>
      <Card className="w-full max-w-4xl mx-auto">
        {/* Header with progress */}
        <CardHeader>
          <CardTitle>Component Title</CardTitle>
          <ProgressWidget componentId={componentId} />
        </CardHeader>

        {/* Main content area */}
        <CardContent className="space-y-6">
          {/* Loading state */}
          {isLoading && <LoadingComponent />}
          
          {/* Error state */}
          {error && <ErrorComponent error={error} />}
          
          {/* Main content */}
          {!isLoading && !error && (
            <MainContent />
          )}
        </CardContent>

        {/* Action buttons */}
        <CardFooter className="flex justify-between">
          <TutorialButton />
          <SaveToToolkitButton />
        </CardFooter>
      </Card>
    </EnsureToolkitData>
  );
}
```

### Animation Patterns

Use consistent Framer Motion animations:

```typescript
// Standard animation variants
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

const staggerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Usage
<motion.div
  variants={fadeInVariants}
  initial="hidden"
  animate="visible"
>
  <Content />
</motion.div>
```

### Responsive Design

Use mobile-first responsive patterns:

```typescript
// Responsive wrapper
const ResponsiveWrapper = ({ children }) => (
  <div className="
    w-full 
    max-w-4xl 
    mx-auto 
    px-4 
    sm:px-6 
    lg:px-8
  ">
    {children}
  </div>
);

// Responsive grid
const ResponsiveGrid = ({ children }) => (
  <div className="
    grid 
    grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3 
    gap-4 
    md:gap-6
  ">
    {children}
  </div>
);
```

## 💡 Implementation Best Practices

### Error Handling

Implement comprehensive error boundaries:

```typescript
// Component-level error boundary
class ComponentErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ComponentError]', {
      component: this.props.componentName,
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Something went wrong. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
```

### Loading States

Implement proper loading states:

```typescript
// Loading component
const LoadingComponent = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
    <span className="ml-2 text-gray-600">{message}</span>
  </div>
);

// Skeleton loading
const SkeletonLoader = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
```

### Data Validation

Use proper TypeScript types and validation:

```typescript
// Component props interface
interface ComponentProps {
  chapterNumber: number;
  lessonNumber: number;
  characterName: string;
  onComplete?: (data: CompletionData) => void;
}

// Data validation
const validateLessonData = (data: unknown): data is LessonData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'content' in data
  );
};
```

## 🧪 Testing Guidelines

### Test-Driven Development (TDD)

Follow TDD patterns for all components:

```typescript
// Component test structure
describe('MayaEmailComposer', () => {
  beforeEach(() => {
    // Setup test environment
    vi.clearAllMocks();
    setupTestDatabase();
  });

  describe('Initialization', () => {
    it('should render without errors', () => {
      render(<MayaEmailComposer {...defaultProps} />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should initialize with correct default state', () => {
      render(<MayaEmailComposer {...defaultProps} />);
      expect(screen.getByText('Ready to compose')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should track progress when user interacts', async () => {
      const mockOnComplete = vi.fn();
      render(<MayaEmailComposer {...defaultProps} onComplete={mockOnComplete} />);
      
      await user.click(screen.getByRole('button', { name: 'Generate Email' }));
      
      expect(mockOnComplete).toHaveBeenCalledWith({
        timeSpent: expect.any(Number),
        actionsCompleted: 1
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(enhancedAIService.generateContent).mockRejectedValue(
        new Error('API Error')
      );
      
      render(<MayaEmailComposer {...defaultProps} />);
      await user.click(screen.getByRole('button', { name: 'Generate Email' }));
      
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });
});
```

### Behavior-Driven Development (BDD)

Use BDD for complex user scenarios:

```typescript
// Feature file pattern
describe('Feature: Email Composition', () => {
  describe('Scenario: User creates first email', () => {
    it('Given user is on email composer page', () => {
      render(<MayaEmailComposer {...defaultProps} />);
    });

    it('When user fills out email form', async () => {
      await user.type(screen.getByLabelText('Subject'), 'Test Subject');
      await user.type(screen.getByLabelText('Body'), 'Test content');
    });

    it('Then email should be generated successfully', async () => {
      await user.click(screen.getByRole('button', { name: 'Generate' }));
      expect(screen.getByText('Email generated!')).toBeInTheDocument();
    });
  });
});
```

### Mock Patterns

Use consistent mocking patterns:

```typescript
// Service mocking
vi.mock('@/services/enhancedAIService', () => ({
  enhancedAIService: {
    generateContent: vi.fn(),
    streamResponse: vi.fn(),
    analyzeContent: vi.fn()
  }
}));

// Hook mocking
vi.mock('@/hooks/useComponentProgress', () => ({
  useComponentProgress: vi.fn(() => ({
    isCompleted: false,
    timeSpent: 0,
    trackInteraction: vi.fn(),
    markAsComplete: vi.fn()
  }))
}));
```

## 📊 Performance Optimization

### Component Loading Strategy

Use appropriate loading strategies:

```typescript
// Direct imports for character-specific components (avoids React.lazy issues)
import { MayaEmailComposer } from '@/components/interactive/MayaEmailComposer';

// Lazy loading for generic components
const GenericComponent = React.lazy(() => 
  import('@/components/interactive/GenericComponent')
);

// Component loading logic
const loadComponent = (componentName: string) => {
  // Check if component should use direct import
  if (DIRECT_IMPORT_COMPONENTS.includes(componentName)) {
    return directImportMap[componentName];
  }
  
  // Use lazy loading for other components
  return React.lazy(() => 
    import(`@/components/interactive/${componentName}`)
  );
};
```

### Memory Management

Implement proper cleanup:

```typescript
export function OptimizedComponent() {
  const [data, setData] = useState(null);
  const abortController = useRef<AbortController>();

  useEffect(() => {
    abortController.current = new AbortController();
    
    const loadData = async () => {
      try {
        const response = await fetch('/api/data', {
          signal: abortController.current.signal
        });
        setData(await response.json());
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Load error:', error);
        }
      }
    };

    loadData();

    return () => {
      abortController.current?.abort();
    };
  }, []);

  return <div>{/* Component content */}</div>;
}
```

### Bundle Optimization

Optimize bundle size:

```typescript
// Use dynamic imports for heavy dependencies
const loadHeavyLibrary = async () => {
  const { heavyFunction } = await import('heavy-library');
  return heavyFunction;
};

// Lazy load AI services
const loadAIService = async () => {
  const { enhancedAIService } = await import('@/services/enhancedAIService');
  return enhancedAIService;
};
```

## 🔧 Code Templates and Examples

### Interactive Component Template

```typescript
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Import services and hooks
import { enhancedAIService } from '@/services/enhancedAIService';
import { useComponentProgress } from '@/hooks/useComponentProgress';
import { useCharacterTheme } from '@/hooks/useCharacterTheme';
import { EnsureToolkitData } from '@/hooks/useEnsureToolkitData';
import { ToolkitService } from '@/services/toolkitService';

// Component props interface
interface YourComponentProps {
  chapterNumber: number;
  lessonNumber: number;
  characterName: string;
  onComplete?: (data: CompletionData) => void;
}

// Completion data interface
interface CompletionData {
  timeSpent: number;
  actionsCompleted: number;
  score?: number;
  [key: string]: any;
}

export function YourComponent({ 
  chapterNumber, 
  lessonNumber, 
  characterName,
  onComplete 
}: YourComponentProps) {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Hooks
  const componentId = `${characterName}-component-${chapterNumber}-${lessonNumber}`;
  const { trackInteraction, markAsComplete } = useComponentProgress({
    componentId,
    autoStart: true,
    completionThreshold: 80
  });
  const { primaryColor, gradientClass } = useCharacterTheme(characterName);
  const toolkitService = new ToolkitService();

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  // Main component logic
  const handleAction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Perform action
      const result = await enhancedAIService.generateContent(
        'Your prompt here',
        { temperature: 0.7, maxTokens: 500 }
      );
      
      setData(result);
      trackInteraction(25); // Award points for interaction
      
      toast({
        title: "Success!",
        description: "Action completed successfully.",
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('[ComponentError]', {
        component: componentId,
        error: err
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    const completionData: CompletionData = {
      timeSpent: Date.now() - startTime,
      actionsCompleted: 1,
      score: 85
    };
    
    markAsComplete(completionData.score);
    onComplete?.(completionData);
  };

  const handleSaveToToolkit = async () => {
    try {
      const toolkitItem = {
        name: `${characterName}'s Work - Chapter ${chapterNumber}`,
        category_key: 'training',
        description: `Lesson ${lessonNumber} content`,
        file_type: 'lesson_content',
        is_new: true,
        metadata: JSON.stringify({
          chapter: chapterNumber,
          lesson: lessonNumber,
          character: characterName,
          data
        })
      };

      const result = await toolkitService.saveItem(toolkitItem);
      
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Saved to MyToolkit!",
        description: "You can access this content anytime.",
      });
      
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save to toolkit",
        variant: "destructive",
      });
    }
  };

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="link" 
            onClick={() => setError(null)}
            className="ml-2"
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Main render
  return (
    <EnsureToolkitData
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      }
    >
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className={`text-2xl font-bold ${gradientClass}`}>
              {characterName}'s Lesson {lessonNumber}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Processing...</span>
              </div>
            )}
            
            {/* Main content */}
            {!isLoading && (
              <div className="space-y-4">
                <Button 
                  onClick={handleAction}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Take Action'}
                </Button>
                
                {data && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleSaveToToolkit}
              disabled={!data}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Save to MyToolkit
            </Button>
            
            <Button
              onClick={handleComplete}
              disabled={!data}
            >
              Complete Lesson
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </EnsureToolkitData>
  );
}

// Export metadata for testing
export const COMPONENT_METADATA = {
  componentId: 'your-component',
  requiredCategories: ['training'],
  testIds: {
    actionButton: 'action-button',
    saveButton: 'save-button',
    completeButton: 'complete-button'
  }
};
```

### Hook Template

```typescript
import { useState, useEffect, useRef } from 'react';

interface UseYourHookOptions {
  autoStart?: boolean;
  onComplete?: (data: any) => void;
}

export const useYourHook = ({ 
  autoStart = true, 
  onComplete 
}: UseYourHookOptions = {}) => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (autoStart && !hasInitialized.current) {
      hasInitialized.current = true;
      initialize();
    }
  }, [autoStart]);

  const initialize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialization logic
      const result = await performInitialization();
      setState(result);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Initialization failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const performAction = async (params: any) => {
    try {
      setIsLoading(true);
      
      // Action logic
      const result = await performAsyncAction(params);
      setState(prevState => ({ ...prevState, ...result }));
      
      onComplete?.(result);
      
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Action failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state,
    isLoading,
    error,
    performAction,
    reset: () => setState(initialState)
  };
};
```

## 🧪 Testing Framework

### Test Setup

```typescript
// test/setup.ts
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock services
vi.mock('@/services/enhancedAIService', () => ({
  enhancedAIService: {
    generateContent: vi.fn(),
    streamResponse: vi.fn(),
    analyzeContent: vi.fn()
  }
}));

vi.mock('@/services/toolkitService', () => ({
  ToolkitService: vi.fn(() => ({
    saveItem: vi.fn(),
    getItems: vi.fn(),
    deleteItem: vi.fn()
  }))
}));

// Mock hooks
vi.mock('@/hooks/useComponentProgress', () => ({
  useComponentProgress: vi.fn(() => ({
    isCompleted: false,
    timeSpent: 0,
    trackInteraction: vi.fn(),
    markAsComplete: vi.fn()
  }))
}));
```

### Test Utilities

```typescript
// test/testUtils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { CharacterStoryProvider } from '@/contexts/CharacterStoryContext';

interface CustomRenderOptions extends RenderOptions {
  initialEntries?: string[];
  characterName?: string;
}

const AllTheProviders = ({ 
  children, 
  characterName = 'Maya' 
}: { 
  children: React.ReactNode;
  characterName?: string;
}) => {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <CharacterStoryProvider initialCharacter={characterName}>
          {children}
        </CharacterStoryProvider>
      </ProgressProvider>
    </BrowserRouter>
  );
};

export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { characterName, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders characterName={characterName}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Common test data
export const mockLessonData = {
  id: 'test-lesson',
  title: 'Test Lesson',
  content: 'Test content',
  metadata: {}
};

export const mockComponentProps = {
  chapterNumber: 2,
  lessonNumber: 1,
  characterName: 'Maya',
  onComplete: vi.fn()
};
```

## 🚀 Performance Optimization Tips

### 1. Component Memoization

```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // Expensive rendering logic
  return <div>{/* Complex UI */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.data.id === nextProps.data.id;
});

// Memoize callbacks
const MemoizedCallback = useCallback((value: string) => {
  // Expensive callback logic
  performExpensiveOperation(value);
}, [dependency]);
```

### 2. Bundle Splitting

```typescript
// Split heavy dependencies
const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};

// Split by feature
const loadAdvancedFeatures = async () => {
  const { AdvancedFeatures } = await import('./advanced-features');
  return AdvancedFeatures;
};
```

### 3. Data Optimization

```typescript
// Implement pagination
const usePaginatedData = (pageSize: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);
  
  return { paginatedData, currentPage, setCurrentPage };
};

// Debounce expensive operations
const useDebouncedValue = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

## 📚 Summary

These guidelines provide a comprehensive framework for creating modular, maintainable, and scalable lesson components. Key principles include:

1. **Consistency**: Use templates and established patterns
2. **Reusability**: Create shared utilities and hooks
3. **Testability**: Follow TDD/BDD practices
4. **Performance**: Implement proper loading and optimization strategies
5. **Accessibility**: Include proper ARIA labels and keyboard navigation
6. **Error Handling**: Implement comprehensive error boundaries
7. **Type Safety**: Use TypeScript for better development experience

By following these guidelines, developers can create high-quality lesson components that integrate seamlessly with the existing Lyra AI Mentor platform while maintaining consistency and performance across the application.

## 🔗 Additional Resources

- [Component Templates](/src/templates/)
- [Testing Guidelines](/docs/TESTING_GUIDELINES.md)
- [Performance Optimization](/docs/PERFORMANCE_OPTIMIZATION.md)
- [Accessibility Guide](/docs/ACCESSIBILITY_GUIDE.md)
- [Character Guidelines](/docs/CHARACTER_GUIDELINES.md)

---

*This document should be updated as new patterns emerge and the platform evolves. Always refer to the latest version for current best practices.*