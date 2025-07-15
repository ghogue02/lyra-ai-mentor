# Critical CSS Findings Summary: Desktop Summary Panel Overlap

## Issue Location
**File**: `/src/components/lesson/chat/lyra/LyraNarratedMayaSideBySideComplete.tsx`
**Lines**: 1553-1565 (Summary Panel), 1582-1592 (Main Content)

## Current CSS Structure Causing Overlap

### 1. Summary Panel Container (Line 1554)
```tsx
<div className="w-80 flex-shrink-0 h-full overflow-hidden">
```
**Issues**:
- No `position: relative`
- No `z-index` specified
- No isolation/containment

### 2. Main Content Area (Line 1582)
```tsx
<main className={cn(
  "flex-1 h-screen flex flex-col bg-white overflow-hidden",
  isMobile && "pt-16"
)}>
```
**Issues**:
- No positioning context
- No z-index management
- Can overlap with adjacent elements

### 3. Two-Column Layout Container (Line 1548)
```tsx
<div className={cn(
  "h-screen flex overflow-hidden",
  isMobile ? "flex-col" : "flex-row"
)}>
```
**Issues**:
- No stacking context isolation
- Basic flexbox without z-index management

## Z-Index Values Found

### Desktop (Missing!)
- Summary Panel: **NOT SPECIFIED** ❌
- Main Content: **NOT SPECIFIED** ❌
- Chat Panels: **NOT SPECIFIED** ❌

### Mobile (Properly Set)
- Menu Button: `z-50` ✓
- Overlay: `z-40` ✓
- Panel: `z-50` ✓

## CSS Classes Analysis

### From maya-sidebyside-layout.css
- `.mayo-container`: Has `position: relative` but used for different component
- `.mayo-chat-panel`: Has proper structure but no z-index
- `.mayo-interactive-panel`: Same issue - no z-index

### From maya-journey-layout.css  
- `.maya-journey-sidebar`: Has width constraints but no z-index
- `.maya-journey-layer`: Has `isolation: isolate` (good practice)

## Immediate Fix Required

Add these Tailwind classes to fix the overlap:

```tsx
// Line 1554 - Summary Panel
<div className="w-80 flex-shrink-0 h-full overflow-hidden relative z-10">

// Line 1582 - Main Content
<main className={cn(
  "flex-1 h-screen flex flex-col bg-white overflow-hidden relative z-0",
  isMobile && "pt-16"
)}>

// Line 1548 - Container (optional but recommended)
<div className={cn(
  "h-screen flex overflow-hidden relative isolate",
  isMobile ? "flex-col" : "flex-row"
)}>
```

## Why This Fixes the Issue

1. **`relative`**: Creates positioning context for z-index to work
2. **`z-10`** on summary: Ensures it stays above main content
3. **`z-0`** on main: Establishes base stacking level
4. **`isolate`**: Prevents z-index contamination between components

## Test the Fix
1. Apply the class changes
2. Check that summary panel no longer overlaps chat
3. Verify interactive elements still work
4. Test blur effects don't interfere
5. Confirm mobile layout unaffected