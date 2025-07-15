# Technical Implementation Specification - Maya Layout Fix

## Component: LyraNarratedMayaSideBySideComplete

### 1. Layout Structure Implementation

#### Desktop Layout (≥1024px)
```typescript
// Main container with CSS Grid
<div className={cn(
  "h-screen overflow-hidden",
  "grid",
  showSummaryPanel && "grid-cols-[320px_1fr] gap-0",
  !showSummaryPanel && "grid-cols-1"
)}>
  
  {/* Summary Panel - Grid Column 1 */}
  {showSummaryPanel && (
    <aside className="h-full overflow-hidden bg-gray-50 border-r-2 border-gray-200 shadow-sm">
      <CompleteMayaJourneyPanel {...panelProps} />
    </aside>
  )}
  
  {/* Main Content - Grid Column 2 */}
  <main className="h-screen flex flex-col bg-white overflow-hidden relative">
    {/* Header */}
    <header className="flex items-center justify-between p-4 border-b bg-white">
      {/* Header content */}
    </header>
    
    {/* Two-Column Content Area */}
    <div className="flex-1 overflow-hidden grid grid-cols-2 gap-2">
      {/* Lyra's Narrative Panel */}
      <div className="flex flex-col bg-white overflow-hidden border-r">
        {/* Chat content */}
      </div>
      
      {/* Interactive Panel */}
      <div className="flex flex-col bg-gradient-to-br from-purple-50/50 to-pink-50/50 overflow-hidden">
        {/* Interactive content */}
      </div>
    </div>
    
    {/* Progress Bar */}
    <div className="h-3 bg-gray-200 relative overflow-hidden">
      {/* Progress indicator */}
    </div>
  </main>
</div>
```

#### Mobile Layout (<1024px)
```typescript
// Main container with Flexbox
<div className="h-screen overflow-hidden flex flex-col">
  
  {/* Mobile Menu Button */}
  <motion.button
    className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border lg:hidden"
    onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
  >
    {isMobilePanelOpen ? <X /> : <Menu />}
  </motion.button>
  
  {/* Mobile Panel Overlay */}
  {isMobilePanelOpen && (
    <div className="fixed inset-0 z-50">
      <CompleteMayaJourneyPanel {...mobilePanelProps} />
    </div>
  )}
  
  {/* Main Content */}
  <main className="h-screen flex flex-col bg-white overflow-hidden pt-16">
    {/* Content stacked vertically */}
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Panels with full width */}
    </div>
  </main>
</div>
```

### 2. CSS Class Definitions

#### Grid Layout Classes
```css
/* Tailwind compiled output */
.grid-cols-\[320px_1fr\] {
  grid-template-columns: 320px 1fr;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-2 {
  gap: 0.5rem;
}

/* Custom CSS for edge cases */
.maya-journey-main {
  min-width: 0; /* Prevent grid blowout */
}
```

### 3. Responsive Behavior

```typescript
// Media query implementation
const isMobile = useMediaQuery('(max-width: 1023px)');

// Conditional rendering based on viewport
const layoutClasses = cn(
  "h-screen overflow-hidden",
  isMobile ? "flex flex-col" : "grid",
  !isMobile && showSummaryPanel && "grid-cols-[320px_1fr]",
  !isMobile && !showSummaryPanel && "grid-cols-1"
);
```

### 4. State Management

```typescript
interface LayoutState {
  showSummaryPanel: boolean;
  isMobilePanelOpen: boolean;
  currentStageIndex: number;
  panelBlurLevel: 'full' | 'partial' | 'clear';
}

// State hooks
const [showSummaryPanel, setShowSummaryPanel] = useState(true);
const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

// Effect for responsive behavior
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024);
  };
  
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

### 5. Accessibility Implementation

```typescript
// ARIA attributes
<main 
  id="main-content"
  tabIndex={-1}
  role="main"
  aria-label="Maya's Communication Mastery Journey"
>

// Skip links
<SkipLink href="#main-content">Skip to main content</SkipLink>

// Focus management
useEffect(() => {
  if (isMobilePanelOpen) {
    // Trap focus in mobile panel
    const panel = document.getElementById('mobile-panel');
    panel?.focus();
  }
}, [isMobilePanelOpen]);
```

### 6. Performance Optimizations

```typescript
// Memoized components
const MemoizedPanel = React.memo(CompleteMayaJourneyPanel);

// Lazy loading for stages
const stages = useMemo(() => 
  generateStages(mayaJourney, handlers),
  [mayaJourney, currentStageIndex]
);

// Debounced resize handler
const debouncedResize = useMemo(
  () => debounce(handleResize, 150),
  []
);
```

### 7. Animation Integration

```typescript
// Blur effect with performance optimization
<motion.div 
  className={cn(
    "absolute inset-0 pointer-events-none z-10",
    panelBlurLevel === 'full' && "backdrop-blur-xl",
    panelBlurLevel === 'partial' && "backdrop-blur-sm",
    panelBlurLevel === 'clear' && "backdrop-blur-none"
  )}
  initial={{ backdropFilter: 'blur(40px)' }}
  animate={{ 
    backdropFilter: panelBlurLevel === 'full' ? 'blur(40px)' : 
                   panelBlurLevel === 'partial' ? 'blur(4px)' : 'blur(0px)'
  }}
  transition={{ duration: 1.5, ease: "easeInOut" }}
  style={{ willChange: 'filter' }} // Performance hint
/>
```

### 8. Error Boundaries

```typescript
// Component-level error boundary
class LayoutErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <FallbackLayout />;
    }
    return this.props.children;
  }
}

// Usage
<LayoutErrorBoundary>
  <LyraNarratedMayaSideBySideComplete />
</LayoutErrorBoundary>
```

### 9. Testing Hooks

```typescript
// Custom hook for testing
export const useLayoutTest = () => {
  const container = useRef<HTMLDivElement>(null);
  
  return {
    getLayoutType: () => {
      const element = container.current;
      if (!element) return null;
      
      const styles = window.getComputedStyle(element);
      return styles.display === 'grid' ? 'desktop' : 'mobile';
    },
    
    getColumnWidths: () => {
      const panels = container.current?.querySelectorAll('[data-panel]');
      return Array.from(panels || []).map(p => p.clientWidth);
    }
  };
};
```

### 10. Browser Compatibility

```css
/* Fallback for older browsers */
@supports not (display: grid) {
  .grid {
    display: flex;
    flex-wrap: wrap;
  }
  
  .grid-cols-\[320px_1fr\] > :first-child {
    flex: 0 0 320px;
  }
  
  .grid-cols-\[320px_1fr\] > :last-child {
    flex: 1;
  }
}
```

## Integration Checklist

- [x] CSS Grid implementation for desktop
- [x] Flexbox fallback for mobile
- [x] Responsive breakpoints at 1024px
- [x] Mobile panel overlay system
- [x] Accessibility compliance
- [x] Performance optimizations
- [x] Error boundaries
- [x] Browser compatibility
- [x] Test coverage
- [x] Documentation

## Validation Steps

1. **Visual Testing**
   - Desktop: 1920px, 1440px, 1280px, 1024px
   - Mobile: 768px, 414px, 375px

2. **Functional Testing**
   - Panel toggle functionality
   - Stage progression
   - Content overflow
   - Dynamic content loading

3. **Performance Testing**
   - Layout shift measurement
   - Render performance
   - Memory usage
   - Animation smoothness

4. **Accessibility Testing**
   - Keyboard navigation
   - Screen reader compatibility
   - Focus management
   - ARIA compliance