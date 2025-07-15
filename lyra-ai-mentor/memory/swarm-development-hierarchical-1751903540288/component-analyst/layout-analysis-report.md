# LyraNarratedMayaSideBySideComplete Layout Analysis Report

## Component Overview
- **File**: `/src/components/lesson/chat/lyra/LyraNarratedMayaSideBySideComplete.tsx`
- **Purpose**: Maya's Complete Communication Mastery Journey with side-by-side layout
- **Current Issue**: Summary panel overlays chat content on desktop view

## Current Layout Implementation

### Desktop Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Header (fixed height)                                   │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────────────────────────┐ │
│ │   Summary   │ │     Main Content Area               │ │
│ │   Panel     │ │ ┌─────────────┬─────────────┐      │ │
│ │ (absolute)  │ │ │ Lyra Chat   │ Interactive │      │ │
│ │  w-80       │ │ │   Panel     │    Panel    │      │ │
│ │  z-10       │ │ │    50%      │     50%     │      │ │
│ │             │ │ └─────────────┴─────────────┘      │ │
│ └─────────────┘ └─────────────────────────────────────┘ │
│                   ↑ ml-80 when panel shown              │
└─────────────────────────────────────────────────────────┘
```

### Key Problem Areas

1. **Absolute Positioning Issue** (Line 1554)
   ```tsx
   <div className="absolute left-0 top-0 w-80 h-full overflow-hidden z-10">
   ```
   - Summary panel uses `absolute` positioning
   - Has `z-10` which puts it above other content
   - Can overlay the main content area

2. **Main Content Margin** (Line 1586)
   ```tsx
   className={cn(
     "h-screen flex flex-col bg-white overflow-hidden",
     !isMobile && showSummaryPanel && "ml-80"
   )}
   ```
   - Uses `ml-80` (margin-left: 20rem) to make space
   - This approach can fail when:
     - Content overflows
     - Browser zoom is used
     - Certain screen sizes cause layout shifts

3. **Split Panel Widths** (Lines 1672, 1727)
   ```tsx
   className={cn(
     "flex flex-col bg-white overflow-hidden",
     isMobile ? "w-full border-b flex-1" : "w-[calc(50%-0.25rem)] border-r flex-shrink-0"
   )}
   ```
   - Uses `calc()` for precise 50% splits
   - Gap of 0.5rem between panels
   - Can cause rounding issues on certain screen widths

## CSS Analysis

### Current CSS Usage
- **Primary**: Tailwind CSS utility classes
- **Layout Method**: Flexbox (`flex`, `flex-col`, `flex-row`)
- **No CSS Grid**: Currently not using CSS Grid
- **Custom CSS**: `maya-journey-layout.css` defines classes but they're not used in the component

### Z-Index Stack
1. `z-50` - Mobile panel overlay (highest)
2. `z-40` - Mobile backdrop
3. `z-10` - Desktop summary panel (PROBLEM LAYER)
4. No z-index - Main content (default stacking)

## Specific Overlay Scenarios

1. **When Panel Opens**
   - Summary panel renders with `absolute` positioning
   - Main content gets `ml-80` but panel still overlays due to z-index

2. **Content Overflow**
   - Long text in chat or interactive panels
   - Panel's z-10 causes it to appear above overflowing content

3. **Browser Zoom**
   - Margin-based spacing breaks down
   - Absolute panel doesn't respect zoom properly

## Recommended Solution

### Immediate Fix: CSS Grid Layout
```css
/* Replace absolute positioning with Grid */
.maya-journey-container {
  display: grid;
  grid-template-columns: 20rem 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "sidebar footer";
}

.summary-panel {
  grid-area: sidebar;
  /* Remove absolute, z-index */
}

.main-content {
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  /* Remove ml-80 */
}
```

### Benefits of Grid Approach
1. No overlay issues - proper space allocation
2. No z-index conflicts
3. Better responsive behavior
4. Cleaner, more maintainable code

## Implementation Priority
1. **High Priority**: Fix absolute positioning of summary panel
2. **Medium Priority**: Convert main layout to CSS Grid
3. **Low Priority**: Optimize mobile layout transitions

## Files to Modify
1. `LyraNarratedMayaSideBySideComplete.tsx` - Update layout classes
2. `maya-journey-layout.css` - Add grid layout rules
3. Consider creating a dedicated layout component for reusability