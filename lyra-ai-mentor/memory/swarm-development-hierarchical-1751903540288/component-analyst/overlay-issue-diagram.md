# Summary Panel Overlay Issue - Visual Diagram

## Current Problem Visualization

### Desktop View - Panel Closed
```
┌────────────────────────────────────────────────────────────┐
│                         Header                             │
├────────────────────────────────────────────────────────────┤
│ ┌───────────────────────┬────────────────────────┐        │
│ │     Lyra Chat Panel   │   Interactive Panel    │        │
│ │                       │                        │        │
│ │  ✓ Full width visible │  ✓ Full width visible │        │
│ │                       │                        │        │
│ └───────────────────────┴────────────────────────┘        │
└────────────────────────────────────────────────────────────┘
```

### Desktop View - Panel Open (PROBLEM STATE)
```
┌────────────────────────────────────────────────────────────┐
│                         Header                             │
├────────────────────────────────────────────────────────────┤
│ ┌─────────────┐╔═══════════════════════════════════════╗  │
│ │   Summary   │║        Main Content (ml-80)           ║  │
│ │   Panel     │║ ┌─────────────┬────────────────────┐ ║  │
│ │             │║ │ Lyra Chat   │  Interactive Panel  │ ║  │
│ │  position:  │║ │             │                    │ ║  │
│ │  absolute   │║ │ ⚠️ CONTENT  │                    │ ║  │
│ │  z-10       │║ │ HIDDEN HERE │                    │ ║  │
│ │             │║ └─────────────┴────────────────────┘ ║  │
│ └─────────────┘╚═══════════════════════════════════════╝  │
│      ↑                    ↑                                │
│   OVERLAYS            Has margin but                      │
│   this area           still overlapped                    │
└────────────────────────────────────────────────────────────┘
```

## The Overlay Problem Explained

### What's Happening:
1. **Summary Panel** (w-80 = 320px wide)
   - Position: `absolute left-0 top-0`
   - Z-index: `z-10`
   - Takes up left 320px of screen

2. **Main Content**
   - Has `ml-80` (margin-left: 320px)
   - BUT: Because of absolute positioning + z-index
   - Result: Panel FLOATS ABOVE content

3. **Hidden Content Area**
   ```
   [0px ----------- 320px] [320px -------------- 100%]
   [  Summary Panel (z-10) ][    Main Content       ]
           ↓                         ↓
       OVERLAYS ────────────> GETS HIDDEN
   ```

## Specific Code Locations

### Problem Code (Line 1554-1565):
```tsx
{!isMobile && showSummaryPanel && (
  <div className="absolute left-0 top-0 w-80 h-full overflow-hidden z-10">
    <CompleteMayaJourneyPanel 
      showSummaryPanel={true}
      setShowSummaryPanel={setShowSummaryPanel}
      mayaJourney={mayaJourney}
      currentStageIndex={currentStageIndex}
      totalStages={stages.length}
      isMobile={false}
    />
  </div>
)}
```

### Affected Main Content (Line 1581-1595):
```tsx
<main 
  id="main-content"
  className={cn(
    "h-screen flex flex-col bg-white overflow-hidden",
    !isMobile && showSummaryPanel && "ml-80", // ← This margin doesn't prevent overlay
    isMobile && "pt-16"
  )}
>
```

## Why Current Approach Fails

1. **Absolute + Z-index = Floating Layer**
   - Absolute positioning removes element from normal flow
   - Z-index:10 ensures it's ABOVE other content
   - Margin on main content can't push away a floating layer

2. **Visual Stack Order**:
   ```
   Layer 3: Summary Panel (z-10) ← TOPMOST
   Layer 2: Main Content (no z-index)
   Layer 1: Background
   ```

3. **Result**: Left portion of Lyra Chat gets covered by Summary Panel

## Solution: CSS Grid (No Overlays)
```
┌────────────────────────────────────────────────────────────┐
│                         Header                             │
├─────────────┬──────────────────────────────────────────────┤
│   Summary   │        Main Content Area                     │
│   Panel     │ ┌─────────────────┬────────────────────┐   │
│             │ │   Lyra Chat     │  Interactive Panel  │   │
│  Properly   │ │                 │                    │   │
│  allocated  │ │  ✓ FULLY       │  ✓ FULLY          │   │
│   space     │ │    VISIBLE      │    VISIBLE         │   │
│             │ └─────────────────┴────────────────────┘   │
└─────────────┴──────────────────────────────────────────────┘
     320px              Remaining space (auto)
```

With CSS Grid:
- No absolute positioning needed
- No z-index conflicts
- Proper space allocation
- Content never hidden