# Responsive Two-Column Layout Guide

## Quick Start

### Basic HTML Structure
```html
<div class="two-column-container">
  <div class="two-column-layout">
    <div class="column column-left">
      <div class="column-content">
        <!-- Left column content -->
      </div>
    </div>
    <div class="column column-right">
      <div class="column-content">
        <!-- Right column content -->
      </div>
    </div>
  </div>
</div>
```

### React/TSX Implementation
```tsx
import '@/styles/responsive-two-column-layout.css';

const TwoColumnComponent = () => {
  return (
    <div className="two-column-container">
      <div className="two-column-layout">
        <div className="column column-left">
          <div className="column-content">
            {/* Left column content */}
          </div>
        </div>
        <div className="column column-right">
          <div className="column-content">
            {/* Right column content */}
          </div>
        </div>
      </div>
    </div>
  );
};
```

## Breakpoint Reference

| Breakpoint | Range | Layout Behavior |
|------------|-------|-----------------|
| Mobile | 320px - 767px | Stacked vertically (40/60 split) |
| Tablet | 768px - 1023px | Side-by-side (50/50) |
| Desktop | 1024px - 1439px | Side-by-side (45/55) |
| Large Desktop | 1440px+ | Side-by-side with max-widths |

## Layout Variants

### 1. Default Two-Column (45/55 split on desktop)
```html
<div class="two-column-layout">
  <!-- Automatically responsive -->
</div>
```

### 2. Sidebar Layout (Fixed 320px sidebar)
```html
<div class="two-column-layout sidebar-layout">
  <div class="column column-left"><!-- Fixed sidebar --></div>
  <div class="column column-right"><!-- Flexible content --></div>
</div>
```

### 3. Using SCSS Mixins
```scss
@import '@/styles/responsive-two-column-mixins';

.my-custom-layout {
  @include two-column-layout(
    $mobile-stack: vertical,
    $tablet-ratio: 40-60,
    $desktop-ratio: 30-70
  );
}
```

## Visibility Classes

```html
<!-- Show only on mobile -->
<div class="mobile-only">Mobile navigation</div>

<!-- Hide on mobile -->
<div class="mobile-hide">Desktop sidebar</div>

<!-- Show on tablet and up -->
<div class="tablet-up">Extended controls</div>

<!-- Show only on desktop -->
<div class="desktop-only">Advanced features</div>
```

## Responsive Spacing

The layout automatically adjusts spacing based on screen size:

```css
/* Mobile: Compact spacing */
--spacing-sm: 0.5rem (8px)
--spacing-md: 1rem (16px)

/* Tablet: Comfortable spacing */
--spacing-lg: 1.5rem (24px)

/* Desktop: Generous spacing */
--spacing-xl: 2rem (32px)
--spacing-2xl: 3rem (48px)
```

## Advanced Features

### Container Queries
```css
/* Component-level responsiveness */
.responsive-component {
  container-type: inline-size;
}

@container (min-width: 768px) {
  .responsive-component .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### Safe Area Support (Mobile)
The layout automatically handles safe areas for devices with notches:
```css
padding-left: env(safe-area-inset-left);
padding-bottom: env(safe-area-inset-bottom);
```

### Touch-Friendly Targets
All interactive elements meet minimum touch target sizes (44x44px) on touch devices.

### Performance Optimizations
- Uses `contain: layout style` for better rendering performance
- Implements smooth scrolling with `-webkit-overflow-scrolling: touch`
- Optimizes reflows with `will-change` on animated elements

## Common Patterns

### 1. Chat + Interactive Panel
```html
<div class="two-column-layout">
  <div class="column column-left">
    <div class="column-header">Chat</div>
    <div class="column-content mayo-scrollable">
      <!-- Chat messages -->
    </div>
  </div>
  <div class="column column-right">
    <div class="column-header">Practice</div>
    <div class="column-content">
      <!-- Interactive content -->
    </div>
  </div>
</div>
```

### 2. Navigation + Content
```html
<div class="two-column-layout sidebar-layout">
  <nav class="column column-left desktop-only">
    <!-- Navigation menu -->
  </nav>
  <main class="column column-right">
    <!-- Main content -->
  </main>
</div>
```

### 3. Mobile-First Progressive Enhancement
```html
<div class="two-column-layout">
  <!-- Core mobile experience -->
  <div class="column column-left">
    <div class="mobile-only">
      <!-- Simplified mobile UI -->
    </div>
    <div class="tablet-up">
      <!-- Enhanced tablet/desktop UI -->
    </div>
  </div>
</div>
```

## Testing Responsive Layouts

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these viewports:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1440x900)

### Key Testing Points
- ✓ Content stacks properly on mobile
- ✓ Touch targets are 44x44px minimum
- ✓ Text remains readable at all sizes
- ✓ Scrolling works smoothly
- ✓ No horizontal overflow on mobile

## Accessibility Considerations

1. **Keyboard Navigation**: All scrollable areas are keyboard accessible
2. **Screen Readers**: Proper ARIA labels and semantic HTML
3. **Reduced Motion**: Respects `prefers-reduced-motion`
4. **High Contrast**: Enhanced borders in high contrast mode
5. **Focus Indicators**: Visible focus states for keyboard users

## Migration Guide

### From Old Layout to New
```diff
- <div class="flex flex-col lg:flex-row">
-   <div class="w-full lg:w-1/2">
+ <div class="two-column-layout">
+   <div class="column column-left">
+     <div class="column-content">
```

### Adding to Existing Components
```tsx
// 1. Import the CSS
import '@/styles/responsive-two-column-layout.css';

// 2. Apply the classes
<div className={cn(
  "two-column-layout",
  isCompact && "sidebar-layout",
  className
)}>
```

## Performance Tips

1. **Lazy Load Content**: Load right column content after left column
2. **Virtual Scrolling**: For long lists, implement virtual scrolling
3. **Debounce Resize**: Debounce window resize handlers
4. **CSS Containment**: Already implemented for optimal performance

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 89+
- ✅ Safari 14.1+
- ✅ Mobile Safari iOS 14.5+
- ✅ Chrome Android 88+

Features gracefully degrade in older browsers.