# CSS Grid/Flexbox Layout Architecture for LyraNarratedMayaSideBySideComplete

## Architecture Overview

This document provides comprehensive layout specifications for a two-column responsive design that combines CSS Grid for the overall structure and Flexbox for internal component layouts.

## Core Layout Strategy

### 1. Container Grid System

```css
/* Primary Grid Container */
.maya-layout-container {
  display: grid;
  grid-template-columns: 320px 1fr; /* Fixed left sidebar + flexible main */
  grid-template-rows: 1fr;
  height: 100vh;
  gap: 0; /* No gap to maintain clean borders */
  overflow: hidden;
  position: relative;
}

/* Alternative Flexbox Approach (Current Implementation) */
.maya-layout-flex-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
```

### 2. Left Column - Summary Panel

#### Fixed Width Specifications
- **Desktop Width**: 320px (20rem / w-80 in Tailwind)
- **Mobile Width**: 288px (18rem / w-72 in Tailwind)
- **Behavior**: Fixed width, does not resize with viewport

```css
.maya-summary-panel {
  /* Grid Implementation */
  grid-column: 1;
  width: 320px;
  
  /* Flexbox Implementation */
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 320px;
  
  /* Common Properties */
  overflow-y: auto;
  overflow-x: hidden;
  background: white;
  border-right: 2px solid rgb(233 213 255); /* border-purple-200 */
  z-index: 10;
  position: relative;
}
```

#### Content Layout
```css
.maya-summary-content {
  display: flex;
  flex-direction: column;
  padding: 1.5rem; /* 24px */
  gap: 1.5rem;
  min-height: 100%;
}

.maya-skill-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px */
}
```

### 3. Right Column - Main Content Area

#### Flexible Width Specifications
- **Desktop**: Remaining space after left panel (calc(100% - 320px))
- **Mobile**: Full width (100%)

```css
.maya-main-content {
  /* Grid Implementation */
  grid-column: 2;
  
  /* Flexbox Implementation */
  flex: 1;
  min-width: 0; /* Prevent flex overflow */
  
  /* Common Properties */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
}
```

#### Internal Two-Column Split
```css
.maya-content-split {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  gap: 0.5rem; /* 8px */
  height: 100%;
  overflow: hidden;
}

/* Alternative Flexbox for split */
.maya-content-split-flex {
  display: flex;
  flex: 1;
  gap: 0.5rem;
  overflow: hidden;
}

.maya-narrative-panel,
.maya-interactive-panel {
  /* Grid child */
  min-width: 0;
  overflow: hidden;
  
  /* Flexbox child */
  flex: 1;
  flex-basis: 0;
  min-width: 0;
  
  /* Common */
  display: flex;
  flex-direction: column;
}
```

### 4. Responsive Breakpoints

#### Desktop (≥1024px)
```css
@media (min-width: 1024px) {
  .maya-layout-container {
    grid-template-columns: 320px 1fr;
  }
  
  .maya-summary-panel {
    display: block;
    position: relative;
  }
  
  .maya-content-split {
    grid-template-columns: 1fr 1fr;
  }
}
```

#### Tablet (768px - 1023px)
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .maya-layout-container {
    grid-template-columns: 240px 1fr; /* Narrower sidebar */
  }
  
  .maya-summary-panel {
    width: 240px;
    flex-basis: 240px;
  }
  
  .maya-content-split {
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;
  }
}
```

#### Mobile (<768px)
```css
@media (max-width: 767px) {
  .maya-layout-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  
  /* Summary panel becomes overlay */
  .maya-summary-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 288px; /* w-72 */
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 50;
  }
  
  .maya-summary-panel.is-open {
    transform: translateX(0);
  }
  
  /* Stack content vertically */
  .maya-content-split {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
```

### 5. Layout Components Specification

#### Header Layout
```css
.maya-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgb(229 231 235); /* border-gray-200 */
  background: white;
  min-height: 64px;
}

.maya-header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
```

#### Progress Bar Layout
```css
.maya-progress-container {
  position: relative;
  height: 12px;
  background: rgb(229 231 235); /* bg-gray-200 */
  overflow: hidden;
}

.maya-progress-bar {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}
```

### 6. Overflow and Scrolling Strategy

```css
/* Vertical scrolling containers */
.maya-scroll-vertical {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  -webkit-overflow-scrolling: touch;
}

/* Custom scrollbar styling */
.maya-scroll-vertical::-webkit-scrollbar {
  width: 8px;
}

.maya-scroll-vertical::-webkit-scrollbar-track {
  background: rgb(243 244 246); /* bg-gray-100 */
}

.maya-scroll-vertical::-webkit-scrollbar-thumb {
  background: rgb(209 213 219); /* bg-gray-300 */
  border-radius: 4px;
}
```

### 7. Z-Index Hierarchy

```css
/* Z-index scale for proper layering */
:root {
  --z-base: 0;
  --z-dropdown: 10;
  --z-summary-panel: 10;
  --z-mobile-menu: 40;
  --z-mobile-overlay: 40;
  --z-mobile-panel: 50;
}
```

### 8. Performance Optimizations

```css
/* Layout stability */
.maya-layout-stable {
  contain: layout style;
  will-change: auto;
}

/* GPU acceleration for animations */
.maya-panel-animated {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Reduce reflows */
.maya-fixed-dimensions {
  width: var(--panel-width, auto);
  height: var(--panel-height, auto);
  flex-shrink: 0;
}
```

### 9. Accessibility Considerations

```css
/* Focus management */
.maya-panel:focus-within {
  outline: 2px solid rgb(147 51 234); /* focus:ring-purple-600 */
  outline-offset: -2px;
}

/* Skip links for keyboard navigation */
.maya-skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
}

.maya-skip-link:focus {
  position: fixed;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .maya-panel {
    border: 2px solid;
  }
}
```

### 10. RTL Support

```css
/* Right-to-left layout adjustments */
[dir="rtl"] .maya-layout-container {
  grid-template-columns: 1fr 320px;
}

[dir="rtl"] .maya-summary-panel {
  border-right: none;
  border-left: 2px solid rgb(233 213 255);
}

[dir="rtl"] .maya-content-split {
  direction: rtl;
}
```

## Implementation Guidelines

### 1. Component Structure
```jsx
<div className="maya-layout-container">
  {/* Left Sidebar */}
  <aside className="maya-summary-panel maya-scroll-vertical">
    <div className="maya-summary-content">
      {/* Panel content */}
    </div>
  </aside>
  
  {/* Main Content */}
  <main className="maya-main-content">
    {/* Header */}
    <header className="maya-header">
      {/* Header content */}
    </header>
    
    {/* Two-column content */}
    <div className="maya-content-split">
      {/* Narrative Panel */}
      <section className="maya-narrative-panel">
        {/* Chat content */}
      </section>
      
      {/* Interactive Panel */}
      <section className="maya-interactive-panel">
        {/* Interactive content */}
      </section>
    </div>
    
    {/* Progress Bar */}
    <div className="maya-progress-container">
      {/* Progress indicators */}
    </div>
  </main>
</div>
```

### 2. Tailwind CSS Classes Mapping
- Grid container: `grid grid-cols-[320px_1fr]`
- Flex container: `flex h-screen overflow-hidden`
- Summary panel: `w-80 flex-shrink-0 border-r-2`
- Main content: `flex-1 flex flex-col min-w-0`
- Content split: `grid grid-cols-2 gap-2` or `flex flex-1 gap-2`
- Mobile overlay: `fixed inset-0 z-50 w-72`

### 3. CSS Variables for Customization
```css
:root {
  --maya-sidebar-width: 320px;
  --maya-sidebar-width-tablet: 240px;
  --maya-sidebar-width-mobile: 288px;
  --maya-header-height: 64px;
  --maya-progress-height: 12px;
  --maya-content-gap: 8px;
  --maya-panel-padding: 24px;
}
```

## Testing Checklist

1. **Desktop (1920x1080)**
   - [ ] Left panel maintains 320px width
   - [ ] Content columns are equal width
   - [ ] No horizontal scrolling
   - [ ] Smooth panel animations

2. **Tablet (768x1024)**
   - [ ] Left panel adjusts to 240px
   - [ ] Content remains readable
   - [ ] Touch interactions work

3. **Mobile (375x667)**
   - [ ] Summary panel slides in/out
   - [ ] Content stacks vertically
   - [ ] No overflow issues
   - [ ] Menu button accessible

4. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] Focus indicators visible
   - [ ] Screen reader announces panels
   - [ ] High contrast mode supported

5. **Performance**
   - [ ] No layout shift on load
   - [ ] Smooth animations (60fps)
   - [ ] Fast panel transitions
   - [ ] Efficient scrolling

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+
- Chrome Android 90+

## Known Limitations

1. IE11 not supported (Grid/Flexbox features)
2. Opera Mini partial support (no animations)
3. Older Android browsers may need prefixes