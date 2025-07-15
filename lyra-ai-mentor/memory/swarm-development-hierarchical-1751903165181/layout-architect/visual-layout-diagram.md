# Desktop Layout Structure Analysis

## Current Layout Architecture

### MayaSideBySide Component (Simple Layout)
```
┌──────────────────── max-w-7xl mx-auto ────────────────────┐
│ ┌─────────────────── Header ──────────────────────────┐  │
│ │  Logo | Title                          Step Counter  │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ ┌─────────────────── flex-1 flex ─────────────────────┐  │
│ │ ┌────── w-1/2 ──────┐ ┌────── w-1/2 ──────────────┐ │  │
│ │ │                   │ │                            │ │  │
│ │ │   Chat Panel      │ │   Interactive Panel       │ │  │
│ │ │   (Maya's         │ │   (User Interface)        │ │  │
│ │ │    Guidance)      │ │                            │ │  │
│ │ │                   │ │                            │ │  │
│ │ │   bg-white        │ │   bg-gradient-to-br       │ │  │
│ │ │   border-r        │ │   from-purple-50/50       │ │  │
│ │ │                   │ │   to-pink-50/50           │ │  │
│ │ └───────────────────┘ └────────────────────────────┘ │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌─────────────────── Progress Bar ────────────────────┐  │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### LyraNarratedMayaSideBySideComplete (Complex Layout)
```
┌────────────────────── h-screen flex ──────────────────────┐
│ ┌─── w-80 ────┐ ┌──────── flex-1 ────────────────────────┐│
│ │             │ │ ┌────────── Header ─────────────────┐  ││
│ │   Summary   │ │ │ Lyra | Title         Controls    │  ││
│ │   Panel     │ │ └──────────────────────────────────┘  ││
│ │             │ │                                         ││
│ │  (Journey   │ │ ┌─────── flex-1 flex ──────────────┐  ││
│ │   Progress) │ │ │ ┌─ w-[calc(50%-0.25rem)] ─┐     │  ││
│ │             │ │ │ │                          │     │  ││
│ │  320px      │ │ │ │   Lyra's Narrative      │     │  ││
│ │  fixed      │ │ │ │   Panel                 │     │  ││
│ │             │ │ │ │                          │     │  ││
│ │             │ │ │ │   (Chat with typing     │     │  ││
│ │             │ │ │ │    animation)            │     │  ││
│ │             │ │ │ └──────────────────────────┘     │  ││
│ │             │ │ │                                   │  ││
│ │             │ │ │ ┌─ w-[calc(50%-0.25rem)] ─┐     │  ││
│ │             │ │ │ │                          │     │  ││
│ │             │ │ │ │   Interactive Panel      │     │  ││
│ │             │ │ │ │                          │     │  ││
│ │             │ │ │ │   (With blur effects)    │     │  ││
│ │             │ │ │ │                          │     │  ││
│ │             │ │ │ └──────────────────────────┘     │  ││
│ │             │ │ └───────────────────────────────────┘  ││
│ │             │ │ ┌────────── Progress Bar ──────────┐  ││
│ │             │ │ └──────────────────────────────────┘  ││
│ └─────────────┘ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Key Layout Principles

### 1. Container Hierarchy
- **Root Container**: `h-screen flex` (full viewport height)
- **Primary Split**: Fixed sidebar (320px) + Flexible main area (flex-1)
- **Secondary Split**: Main area splits 50/50 for chat and interactive panels

### 2. Width Management
- **Sidebar**: `w-80` (20rem = 320px) with `flex-shrink-0`
- **Main Area**: `flex-1` (takes remaining space)
- **Inner Panels**: `w-[calc(50%-0.25rem)]` (50% minus gap)

### 3. Overflow Control
- All containers use `overflow-hidden` at container level
- Individual panels use `overflow-y-auto` for scrolling
- Prevents content from breaking layout boundaries

### 4. Responsive Behavior
- **Desktop (≥1024px)**: Side-by-side layout
- **Mobile (<1024px)**: Stacked layout with overlay sidebar
- Conditional rendering based on `isMobile` state

## Recommended Absolute Positioning Strategy

### Problem to Solve
Prevent left/right column content overlap and ensure strict separation.

### Solution Architecture
```css
/* Main container stays flexbox */
.desktop-layout-container {
  display: flex;
  height: 100vh;
  position: relative;
}

/* Sidebar remains flex-based */
.sidebar {
  width: 320px;
  flex-shrink: 0;
}

/* Main content area with absolute children */
.main-content {
  flex: 1;
  position: relative; /* Establish positioning context */
  display: flex;
}

/* Absolute positioned panels */
.chat-panel {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: calc(50% - 0.125rem);
  overflow-y: auto;
}

.interactive-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: calc(50% - 0.125rem);
  overflow-y: auto;
}
```

### Benefits
1. **Guaranteed Separation**: Panels can never overlap
2. **Content Isolation**: Each panel's content flow is independent
3. **Predictable Layout**: No reflow issues between panels
4. **Performance**: Better rendering isolation

### Implementation Steps
1. Keep outer flexbox structure
2. Make inner panel container `position: relative`
3. Position chat and interactive panels absolutely
4. Ensure proper z-index management
5. Test with various content lengths