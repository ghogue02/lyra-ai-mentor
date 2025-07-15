# CSS Fix Recommendations for Desktop Summary Panel Overlap

## Issue Summary
The desktop summary panel is overlapping with the Lyra chat content due to missing z-index management and improper stacking contexts.

## Root Cause
1. **No Z-Index Management**: Neither the summary panel nor the main content area have explicit z-index values
2. **Missing Position Properties**: Elements lack proper positioning context
3. **No Stacking Context Isolation**: Components can interfere with each other's rendering

## Immediate Fix (Add to Component)

```tsx
// In LyraNarratedMayaSideBySideComplete.tsx, line ~1554
{!isMobile && showSummaryPanel && (
  <div className="w-80 flex-shrink-0 h-full overflow-hidden relative z-10">
    <CompleteMayaJourneyPanel 
      // ... existing props
    />
  </div>
)}

// In main content area, line ~1582
<main 
  id="main-content"
  className={cn(
    "flex-1 h-screen flex flex-col bg-white overflow-hidden relative z-0",
    isMobile && "pt-16"
  )}
  // ... rest of props
>
```

## CSS File Updates

### 1. Create new file: `src/styles/z-index-system.css`
```css
/* Z-Index System for Proper Layering */
:root {
  --z-base: 0;
  --z-content: 1;
  --z-panel: 10;
  --z-overlay: 20;
  --z-modal: 30;
  --z-dropdown: 40;
  --z-tooltip: 50;
  --z-notification: 60;
}

/* Desktop Layout Stacking Context */
.desktop-layout-container {
  position: relative;
  isolation: isolate;
}

.desktop-summary-panel {
  position: relative;
  z-index: var(--z-panel);
  contain: layout style;
}

.desktop-main-content {
  position: relative;
  z-index: var(--z-content);
  contain: layout style;
}
```

### 2. Update `maya-sidebyside-layout.css`
```css
/* Add to .mayo-container */
.mayo-container {
  /* existing styles... */
  position: relative;
  isolation: isolate;
}

/* Add to panel classes */
.mayo-chat-panel {
  /* existing styles... */
  position: relative;
  z-index: 1;
}

.mayo-interactive-panel {
  /* existing styles... */
  position: relative;
  z-index: 1;
}
```

## Tailwind Classes Solution
If using Tailwind exclusively, add these utility classes:

```tsx
// Summary Panel Container
<div className="w-80 flex-shrink-0 h-full overflow-hidden relative z-10 isolate">

// Main Content Area  
<main className="flex-1 h-screen flex flex-col bg-white overflow-hidden relative z-0">

// Chat Panels
<div className="flex flex-col bg-white overflow-hidden relative z-[1]">
```

## Testing Checklist
- [ ] Summary panel stays on left without overlapping chat
- [ ] Chat content scrolls independently
- [ ] Interactive panel content is not obscured
- [ ] Mobile layout still works correctly
- [ ] Blur effects don't interfere with z-index
- [ ] Dropdowns and modals appear above panels

## Long-term Recommendation
Consider refactoring to CSS Grid for more predictable layouts:

```css
.desktop-layout-grid {
  display: grid;
  grid-template-columns: 20rem 1fr;
  height: 100vh;
  gap: 0;
}

.summary-panel-area {
  grid-column: 1;
  overflow-y: auto;
}

.main-content-area {
  grid-column: 2;
  overflow: hidden;
}
```