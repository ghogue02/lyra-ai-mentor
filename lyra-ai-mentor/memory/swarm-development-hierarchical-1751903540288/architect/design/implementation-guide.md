# Implementation Guide for LyraNarratedMayaSideBySideComplete Layout

## Quick Implementation Reference

### 1. CSS Module Structure

Create these CSS modules for better organization:

```css
/* maya-layout-grid.module.css */
.container {
  display: grid;
  grid-template-columns: var(--sidebar-width, 320px) 1fr;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  grid-column: 1;
  overflow-y: auto;
  border-right: 2px solid rgb(233 213 255);
}

.mainContent {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.contentSplit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  flex: 1;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 1023px) {
  .container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 288px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 50;
  }
  
  .sidebar.isOpen {
    transform: translateX(0);
  }
  
  .contentSplit {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
```

### 2. React Component Integration

```jsx
// Layout wrapper component
const MayaLayoutWrapper = ({ children, showSidebar, onToggleSidebar }) => {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside 
        className={cn(
          styles.sidebar,
          isMobile && showSidebar && styles.isOpen
        )}
      >
        <SidebarContent />
      </aside>
      
      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
      
      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className={styles.overlay}
          onClick={onToggleSidebar}
        />
      )}
    </div>
  );
};
```

### 3. Tailwind Configuration

```js
// tailwind.config.js extensions
module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        'maya-layout': '320px 1fr',
        'maya-layout-tablet': '240px 1fr',
      },
      width: {
        'maya-sidebar': '320px',
        'maya-sidebar-tablet': '240px',
        'maya-sidebar-mobile': '288px',
      },
      screens: {
        'maya-tablet': '768px',
        'maya-desktop': '1024px',
      }
    }
  }
}
```

### 4. Layout Utilities

```js
// utils/mayaLayout.js
export const LAYOUT_CONSTANTS = {
  SIDEBAR_WIDTH_DESKTOP: 320,
  SIDEBAR_WIDTH_TABLET: 240,
  SIDEBAR_WIDTH_MOBILE: 288,
  BREAKPOINT_DESKTOP: 1024,
  BREAKPOINT_TABLET: 768,
  HEADER_HEIGHT: 64,
  PROGRESS_BAR_HEIGHT: 12,
};

export const calculateMainContentWidth = (viewportWidth, showSidebar) => {
  if (viewportWidth >= LAYOUT_CONSTANTS.BREAKPOINT_DESKTOP && showSidebar) {
    return viewportWidth - LAYOUT_CONSTANTS.SIDEBAR_WIDTH_DESKTOP;
  }
  return viewportWidth;
};

export const getContentColumnWidth = (mainContentWidth) => {
  // Account for gap between columns (8px)
  return (mainContentWidth - 8) / 2;
};
```

### 5. CSS Custom Properties Integration

```css
/* Global CSS variables */
:root {
  /* Layout dimensions */
  --maya-sidebar-width: 320px;
  --maya-sidebar-width-tablet: 240px;
  --maya-sidebar-width-mobile: 288px;
  
  /* Spacing */
  --maya-content-gap: 0.5rem;
  --maya-panel-padding: 1.5rem;
  
  /* Z-index scale */
  --maya-z-sidebar: 10;
  --maya-z-mobile-menu: 40;
  --maya-z-mobile-overlay: 40;
  --maya-z-mobile-panel: 50;
  
  /* Animation */
  --maya-transition-panel: transform 0.3s ease-in-out;
}

/* Responsive overrides */
@media (max-width: 1023px) {
  :root {
    --maya-sidebar-width: var(--maya-sidebar-width-mobile);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  :root {
    --maya-sidebar-width: var(--maya-sidebar-width-tablet);
  }
}
```

### 6. Common Layout Patterns

```css
/* Fixed-Flexible Pattern */
.maya-fixed-flex {
  display: flex;
  gap: var(--maya-content-gap);
}

.maya-fixed-flex > .fixed {
  flex-shrink: 0;
  width: var(--maya-sidebar-width);
}

.maya-fixed-flex > .flexible {
  flex: 1;
  min-width: 0;
}

/* Equal Columns Pattern */
.maya-equal-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--maya-content-gap);
}

/* Stacked Mobile Pattern */
@media (max-width: 767px) {
  .maya-equal-columns {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(50vh, auto);
  }
}
```

### 7. Performance-Optimized Classes

```css
/* Container queries for future-proofing */
@container maya-main (min-width: 800px) {
  .maya-content-responsive {
    grid-template-columns: 1fr 1fr;
  }
}

/* Layout containment */
.maya-layout-contained {
  contain: layout style;
}

/* Scroll optimization */
.maya-scroll-optimized {
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-behavior: smooth;
}

/* GPU-accelerated transitions */
.maya-transition-optimized {
  will-change: transform;
  transform: translateZ(0);
}
```

### 8. Debugging Helpers

```css
/* Development mode layout debugging */
.maya-debug-layout {
  outline: 2px dashed red;
}

.maya-debug-layout > * {
  outline: 1px dashed blue;
}

/* Grid debugging overlay */
.maya-debug-grid {
  background-image: 
    repeating-linear-gradient(
      0deg,
      rgba(255, 0, 0, 0.1),
      rgba(255, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 20px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.1),
      rgba(255, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 20px
    );
}
```

## Migration Path from Current Implementation

### Phase 1: CSS Grid Foundation
1. Add CSS Grid classes alongside existing Flexbox
2. Test with feature flags
3. Gradual rollout by viewport size

### Phase 2: Component Refactoring
1. Extract layout logic to dedicated components
2. Implement CSS modules for scoped styles
3. Add layout unit tests

### Phase 3: Performance Optimization
1. Implement container queries
2. Add scroll optimization
3. Measure and optimize paint/layout metrics

## Testing Strategy

### Visual Regression Tests
```js
// cypress/integration/maya-layout.spec.js
describe('Maya Layout', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];
  
  viewports.forEach(({ name, width, height }) => {
    it(`renders correctly on ${name}`, () => {
      cy.viewport(width, height);
      cy.visit('/maya-journey');
      cy.matchImageSnapshot(`maya-layout-${name}`);
    });
  });
});
```

### Layout Stability Tests
```js
// Measure Cumulative Layout Shift (CLS)
const measureCLS = () => {
  return new Promise((resolve) => {
    let cls = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    
    setTimeout(() => {
      observer.disconnect();
      resolve(cls);
    }, 5000);
  });
};
```

## Troubleshooting Guide

### Common Issues

1. **Content Overflow**
   - Add `min-width: 0` to flex children
   - Use `overflow: hidden` on containers
   - Check for fixed widths in child elements

2. **Mobile Panel Not Sliding**
   - Verify z-index hierarchy
   - Check transform transitions
   - Ensure touch events are not blocked

3. **Unequal Column Widths**
   - Remove conflicting flex properties
   - Check for padding/margin asymmetry
   - Verify grid gap calculations

4. **Performance Issues**
   - Reduce paint areas with `contain`
   - Use `will-change` sparingly
   - Implement virtual scrolling for long lists

## Code Examples

### Complete Layout Component
```jsx
const MayaCompleteLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useMediaQuery('(max-width: 1023px)');
  
  return (
    <div className="grid grid-cols-[320px_1fr] h-screen overflow-hidden lg:grid-cols-1">
      {/* Sidebar */}
      <aside className={cn(
        "overflow-y-auto border-r-2 border-purple-200",
        "lg:fixed lg:left-0 lg:top-0 lg:w-72 lg:h-screen lg:transform lg:-translate-x-full lg:transition-transform lg:z-50",
        showSidebar && "lg:translate-x-0"
      )}>
        {/* Sidebar content */}
      </aside>
      
      {/* Main */}
      <main className="flex flex-col min-w-0">
        {/* Header */}
        <header className="p-4 border-b">
          {/* Header content */}
        </header>
        
        {/* Content */}
        <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden lg:grid-cols-1 lg:grid-rows-2">
          {/* Narrative panel */}
          <section className="overflow-y-auto">
            {/* Chat content */}
          </section>
          
          {/* Interactive panel */}
          <section className="overflow-y-auto">
            {/* Interactive content */}
          </section>
        </div>
        
        {/* Progress */}
        <div className="h-3 bg-gray-200">
          {/* Progress bar */}
        </div>
      </main>
    </div>
  );
};
```

This implementation guide provides practical, actionable steps for implementing the layout architecture with modern CSS Grid and Flexbox techniques.