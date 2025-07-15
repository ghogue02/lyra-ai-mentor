# LyraNarratedMayaSideBySideComplete Layout Documentation

**Version:** 1.0.0  
**Last Updated:** 2025-07-07  
**Component:** `src/components/lesson/chat/lyra/LyraNarratedMayaSideBySideComplete.tsx`

## Overview

This documentation details the layout structure, CSS implementation, responsive behavior, and architectural decisions for the LyraNarratedMayaSideBySideComplete component - Maya's complete Chapter 2 communication mastery journey.

## Layout Structure

### Desktop Architecture (≥1024px)

The component uses a sophisticated three-column layout:

#### 1. **Left Sidebar (Summary Panel)**
- **Width:** 20rem (320px) - Fixed
- **CSS Classes:** `w-80 flex-shrink-0`
- **Position:** Absolute positioning when visible
- **Content:** Journey progress, skill checkpoints, navigation
- **Behavior:** Optional visibility toggle, doesn't affect main content flow

#### 2. **Center Column (Lyra's Narrative)**
- **Width:** 50% of remaining space
- **CSS Classes:** `w-[calc(50%-0.25rem)] border-r`
- **Content:** Lyra's storytelling, guidance messages, contextual narrative
- **Features:** Auto-scroll, typewriter effect, dynamic message loading

#### 3. **Right Column (Interactive Panel)**
- **Width:** 50% of remaining space  
- **CSS Classes:** `w-[calc(50%-0.25rem)]`
- **Content:** PACE framework steps, tone mastery, templates, etc.
- **Features:** Dynamic blur states (full/partial/clear), stage-based content

### Mobile Architecture (<1024px)

#### Layout Transformation
- **Container:** Switches from `flex-row` to `flex-col`
- **Panels:** Stack vertically at 100% width
- **Sidebar:** Becomes hamburger menu with overlay panel
- **Touch Optimization:** Larger touch targets, adjusted spacing

## CSS Classes Reference

### Tailwind Utility Classes

#### Layout Classes
```css
/* Container */
.h-screen          /* Full viewport height */
.overflow-hidden   /* Prevents scrollbar on main */
.flex             /* Flexbox container */
.flex-row         /* Horizontal layout (desktop) */
.flex-col         /* Vertical layout (mobile) */
.flex-1           /* Flexible sizing */
.flex-shrink-0    /* Prevents shrinking */

/* Spacing */
.w-80             /* 320px fixed width */
.w-[calc(50%-0.25rem)]  /* Dynamic 50% minus gap */
.w-full           /* 100% width */
.gap-2            /* 0.5rem gap */
.p-4              /* 1rem padding */
.sm:p-6           /* 1.5rem on small+ */
.lg:p-8           /* 2rem on large+ */
```

#### Responsive Classes
```css
.lg:hidden        /* Hidden on large screens */
.sm:grid-cols-2   /* 2 columns on small+ */
.text-xs          /* Mobile text size */
.text-sm          /* Desktop text size */
```

#### Effect Classes
```css
.blur-xl          /* 20px blur */
.blur-sm          /* 4px blur */
.backdrop-blur-xl /* Backdrop filter */
.transition-all   /* Smooth transitions */
.duration-1000    /* 1s duration */
```

### Custom CSS (maya-journey-layout.css)

```css
/* Desktop protection */
.maya-journey-sidebar { width: 20rem; flex-shrink: 0; }
.maya-journey-main { flex: 1; min-width: 0; }
.maya-journey-split-panel { width: 50%; min-width: 0; }

/* Mobile adjustments */
.maya-journey-container { flex-direction: column; }
.maya-journey-panel { width: 100%; }
.maya-journey-mobile-panel { position: fixed; z-index: 50; }

/* Performance */
.maya-journey-blur { 
  will-change: filter;
  transform: translateZ(0);
}
```

## Responsive Behavior

### Breakpoint Details

| Breakpoint | Name | Layout | Key Features |
|------------|------|--------|--------------|
| 1920px | Full HD | 3-column: 320px + 50% + 50% | All features visible |
| 1440px | Laptop | Same structure | Slightly reduced padding |
| 1280px | Small Desktop | 3-column maintained | Container queries adjust |
| 1024px | Desktop/Tablet | Last desktop breakpoint | Full desktop features |
| 768px | Tablet | Mobile layout active | Stacked panels, hamburger menu |
| 414px | Large Mobile | Single column | Optimized touch targets |
| 375px | Small Mobile | Compact single column | Minimal padding, truncated text |

### Mobile Optimizations

1. **Hamburger Menu**
   - Fixed position button (top-left)
   - Z-index: 50 for visibility
   - Toggle animation

2. **Overlay Panel**
   - Full-screen sidebar overlay
   - Backdrop click to close
   - Smooth slide animation

3. **Touch Targets**
   - Minimum 44px height
   - Increased padding on buttons
   - Proper spacing between elements

4. **Text Sizing**
   ```javascript
   isMobile ? "text-base" : "text-lg"  // Titles
   isMobile ? "text-xs" : "text-sm"    // Subtitles
   ```

## State Management

### Blur State System

```javascript
panelBlurLevel: 'full' | 'partial' | 'clear'

// Implementation
'full'    → backdrop-filter: blur(40px)
'partial' → backdrop-filter: blur(4px)  
'clear'   → backdrop-filter: blur(0px)
```

### Panel Visibility States

```javascript
{
  showSummaryPanel: boolean,      // Desktop sidebar toggle
  isMobilePanelOpen: boolean,     // Mobile overlay state
  panelBlurLevel: string,         // Per-stage blur setting
  isMobile: boolean               // Responsive state
}
```

## Breaking Changes

### 1. Layout Refactor
- **Change:** Absolute → Flexbox positioning
- **Impact:** More reliable responsive behavior
- **Migration:** Update custom CSS relying on absolute positioning

### 2. Mobile-First Implementation
- **Change:** True mobile-first responsive design
- **Impact:** Significantly improved mobile UX
- **Migration:** Test all breakpoints thoroughly

### 3. Fixed Sidebar Width
- **Change:** Percentage → Fixed 320px width
- **Impact:** Consistent sidebar across screen sizes
- **Migration:** Adjust content for fixed sidebar

## Performance Optimizations

### Blur Effect Optimization
```css
.maya-journey-blur {
  will-change: filter;              /* Optimize for changes */
  backface-visibility: hidden;      /* Hardware acceleration */
  transform: translateZ(0);         /* Force GPU layer */
}
```

### Scroll Performance
```css
.maya-journey-scroll-container {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;         /* Prevent layout shift */
}
```

### Animation Performance
- Respects `prefers-reduced-motion`
- Framer Motion optimizations
- Debounced resize handlers

## Accessibility Features

### ARIA Landmarks
```html
<main aria-label="Maya's Communication Mastery Journey">
<nav aria-label="Journey progress and navigation">
<header role="banner">
```

### Focus Management
- Skip links for keyboard navigation
- Focus trap in modal panels
- Logical tab order maintained

### Screen Reader Support
- Live regions for progress updates
- Descriptive button labels
- Semantic heading hierarchy

## Implementation Notes

### Key Calculations

1. **Split Panel Width**
   ```css
   width: calc(50% - 0.25rem);  /* Equal panels with gap */
   ```

2. **Mobile Detection**
   ```javascript
   const isMobile = window.innerWidth < 1024;
   ```

3. **Z-Index Hierarchy**
   - Mobile backdrop: `z-40`
   - Mobile panel/button: `z-50`
   - Blur overlay: `z-10`

### Container Structure

```jsx
<div className="h-screen overflow-hidden">
  {/* Desktop: Fixed Sidebar */}
  <div className="absolute left-0 top-0 w-80 h-full">
    <SummaryPanel />
  </div>
  
  {/* Main Content Area */}
  <main className={showSummaryPanel ? "ml-80" : ""}>
    {/* Two Column Layout */}
    <div className="flex flex-row">
      <div className="w-[calc(50%-0.25rem)]">Lyra</div>
      <div className="w-[calc(50%-0.25rem)]">Interactive</div>
    </div>
  </main>
</div>
```

## Testing Guidelines

### Layout Testing Checklist
- [ ] All responsive breakpoints render correctly
- [ ] No horizontal scroll at any viewport size
- [ ] Panels don't overlap or clip content
- [ ] Dynamic content maintains layout integrity
- [ ] Blur transitions perform smoothly

### Browser Testing Matrix
- Chrome/Edge (Chromium-based)
- Firefox (latest)
- Safari (macOS and iOS)
- Mobile browsers (Chrome, Safari)

### Accessibility Testing
- [ ] Keyboard navigation complete journey
- [ ] Screen reader announces all changes
- [ ] Focus visible and managed properly
- [ ] Color contrast meets WCAG AA

## Future Enhancements

### Recommended Improvements

1. **CSS Container Queries**
   - Component-level responsive design
   - Better isolation of responsive logic

2. **View Transitions API**
   - Smoother stage transitions
   - Native browser animations

3. **CSS Logical Properties**
   - Better RTL language support
   - Modern CSS practices

4. **Intersection Observer**
   - Lazy load off-screen content
   - Performance optimization

## Developer Quick Reference

### Common Tasks

**Toggle Summary Panel (Desktop)**
```javascript
setShowSummaryPanel(!showSummaryPanel)
```

**Open Mobile Menu**
```javascript
setIsMobilePanelOpen(true)
```

**Change Blur State**
```javascript
setPanelBlurLevel('clear')  // or 'partial', 'full'
```

**Advance Stage**
```javascript
setCurrentStageIndex(currentStageIndex + 1)
```

### CSS Utility Reference

| Need | Class | Effect |
|------|-------|--------|
| Hide on mobile | `hidden lg:block` | Visible 1024px+ |
| Mobile padding | `p-4 lg:p-8` | Responsive spacing |
| Prevent overflow | `min-w-0` | Flexbox overflow fix |
| GPU acceleration | `transform` | Hardware acceleration |