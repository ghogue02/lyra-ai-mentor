# CSS Optimization Examples and Best Practices

## Optimized CSS Architecture

### 1. Leverage CSS Custom Properties
```css
/* Define in root or component scope */
:root {
  /* Layout tokens */
  --mayo-panel-width: 320px;
  --mayo-header-height: 64px;
  --mayo-mobile-header: 56px;
  
  /* Spacing scale */
  --mayo-space-xs: 0.25rem;
  --mayo-space-sm: 0.5rem;
  --mayo-space-md: 1rem;
  --mayo-space-lg: 1.5rem;
  
  /* Z-index scale */
  --mayo-z-base: 1;
  --mayo-z-panel: 10;
  --mayo-z-overlay: 40;
  --mayo-z-modal: 50;
  
  /* Animation tokens */
  --mayo-transition-fast: 150ms ease;
  --mayo-transition-normal: 300ms ease;
}
```

### 2. Optimized Grid Layout
```css
/* Replace inline Tailwind with semantic CSS */
.mayo-layout-container {
  display: grid;
  height: 100vh;
  grid-template-columns: var(--mayo-panel-width) 1fr;
  
  /* Performance optimizations */
  contain: layout style paint;
  isolation: isolate;
}

/* Responsive without JavaScript checks */
@media (max-width: 767px) {
  .mayo-layout-container {
    display: flex;
    flex-direction: column;
  }
}

/* When panel is hidden */
.mayo-layout-container.panel-hidden {
  grid-template-columns: 1fr;
}
```

### 3. Reusable Component Classes
```css
/* Common patterns extracted */
.mayo-flex-header {
  display: flex;
  align-items: center;
  gap: var(--mayo-space-sm);
  margin-bottom: var(--mayo-space-md);
}

.mayo-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  contain: layout style;
}

.mayo-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--mayo-space-md);
  
  /* Smooth scrolling with momentum on touch devices */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  
  /* Better scroll performance */
  will-change: scroll-position;
}
```

### 4. Performance-Optimized Animations
```css
/* Use transform for animations instead of position */
.mayo-slide-panel {
  position: fixed;
  inset: 0;
  transform: translateX(-100%);
  transition: transform var(--mayo-transition-normal);
  will-change: transform;
  
  /* Hardware acceleration */
  backface-visibility: hidden;
  perspective: 1000px;
}

.mayo-slide-panel.is-open {
  transform: translateX(0);
}

/* Reduce paint areas during animations */
.mayo-animated-content {
  will-change: opacity, transform;
  transform: translateZ(0); /* Create new layer */
}
```

### 5. Efficient Selectors
```css
/* Avoid deep nesting and complex selectors */

/* ❌ Bad - Complex and slow */
.mayo-container > div > .panel > .content > .header > h2 {
  /* styles */
}

/* ✅ Good - Direct and fast */
.mayo-panel-title {
  /* styles */
}

/* Use attribute selectors efficiently */
[data-state="active"] {
  /* Active state styles */
}
```

### 6. CSS Grid Subgrid for Nested Layouts
```css
/* For the inner two-column layout */
.mayo-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--mayo-space-sm);
  height: 100%;
  
  /* Subgrid for aligned content */
  grid-template-rows: subgrid;
}

/* Each panel inherits parent grid */
.mayo-chat-panel,
.mayo-interactive-panel {
  display: grid;
  grid-template-rows: auto 1fr;
}
```

### 7. Modern CSS Features for Better Performance
```css
/* Container queries for component-based responsiveness */
@container (max-width: 600px) {
  .mayo-panel-content {
    padding: var(--mayo-space-sm);
  }
}

/* CSS Logical Properties for internationalization */
.mayo-panel {
  padding-inline: var(--mayo-space-md);
  margin-block-end: var(--mayo-space-lg);
  border-inline-end: 1px solid var(--color-border);
}

/* Aspect ratio for consistent dimensions */
.mayo-avatar {
  aspect-ratio: 1;
  width: 2.5rem;
}
```

### 8. Optimized Mobile Styles
```css
/* Single media query with all mobile styles */
@media (max-width: 767px) {
  /* Use CSS custom properties for consistency */
  .mayo-layout-container {
    --mayo-panel-width: 100%;
    --mayo-header-height: var(--mayo-mobile-header);
  }
  
  /* Stack layout */
  .mayo-content-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  
  /* Touch-optimized targets */
  .mayo-button {
    min-height: 44px; /* iOS touch target */
    min-width: 44px;
  }
  
  /* Safe areas for notched devices */
  .mayo-mobile-header {
    padding-top: env(safe-area-inset-top);
  }
}
```

### 9. Reduce CSS Specificity
```css
/* Use single classes instead of chained selectors */

/* ❌ High specificity */
.mayo-container .panel.active .content .header {
  background: blue;
}

/* ✅ Low specificity, easier to override */
.mayo-panel-header-active {
  background: blue;
}
```

### 10. Critical CSS Extraction
```css
/* Inline critical above-the-fold styles */
.mayo-critical {
  /* Layout structure */
  display: grid;
  height: 100vh;
  grid-template-columns: 320px 1fr;
  
  /* Prevent layout shift */
  contain: layout;
}

/* Load non-critical styles asynchronously */
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

## Implementation Checklist

- [ ] Replace inline Tailwind with semantic CSS classes
- [ ] Implement CSS custom properties for theming
- [ ] Add CSS containment for performance
- [ ] Use modern layout techniques (Grid, Subgrid)
- [ ] Optimize animations with transforms
- [ ] Implement responsive design with container queries
- [ ] Add proper fallbacks for older browsers
- [ ] Extract critical CSS for faster initial paint
- [ ] Use CSS logical properties for i18n support
- [ ] Implement efficient selector strategies

## Performance Metrics to Track

1. **First Contentful Paint (FCP)** - Should be < 1.8s
2. **Layout Shift (CLS)** - Should be < 0.1
3. **CSS File Size** - Aim for < 50KB gzipped
4. **Selector Performance** - Avoid selectors > 3 levels deep
5. **Reflow/Repaint Count** - Minimize during interactions