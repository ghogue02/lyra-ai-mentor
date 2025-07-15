# Recommended Absolute Positioning Strategy for Desktop Layout

## Problem Statement
The current flexbox-based layout using `w-1/2` classes may allow content overlap between left and right columns in certain edge cases. We need a robust solution that guarantees column separation.

## Current Implementation Issues

### 1. Flexbox Content Overflow
- Content in flex items can overflow their containers
- Long text or large elements might push boundaries
- Flex items can grow beyond their intended width

### 2. Dynamic Content Concerns
- AI-generated content has unpredictable lengths
- Interactive components may expand unexpectedly
- Blur effects and animations can affect layout calculations

## Recommended Solution: Hybrid Flexbox + Absolute Positioning

### Implementation Strategy

```tsx
// Parent container remains flexbox for overall structure
<div className="h-screen flex overflow-hidden">
  {/* Optional sidebar - flexbox */}
  {showSidebar && (
    <div className="w-80 flex-shrink-0">
      {/* Sidebar content */}
    </div>
  )}
  
  {/* Main content area with absolute positioning for panels */}
  <div className="flex-1 relative overflow-hidden">
    {/* Header remains in normal flow */}
    <header className="h-16 border-b">
      {/* Header content */}
    </header>
    
    {/* Content area with absolute positioned panels */}
    <div className="absolute inset-0 top-16">
      {/* Chat Panel - Absolutely positioned left */}
      <div className="absolute left-0 top-0 bottom-0 w-[calc(50%-2px)] overflow-hidden flex flex-col">
        <div className="p-4 border-b">Chat Header</div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Chat content */}
        </div>
      </div>
      
      {/* Interactive Panel - Absolutely positioned right */}
      <div className="absolute right-0 top-0 bottom-0 w-[calc(50%-2px)] overflow-hidden flex flex-col">
        <div className="p-4 border-b">Interactive Header</div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Interactive content */}
        </div>
      </div>
      
      {/* Optional center divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2" />
    </div>
  </div>
</div>
```

### CSS Classes to Add

```css
/* Add to maya-sidebyside-layout.css or create new utility classes */

/* Absolute panel positioning */
.mayo-absolute-panel-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: calc(50% - 2px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mayo-absolute-panel-right {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: calc(50% - 2px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Container for absolute panels */
.mayo-panels-container {
  position: relative;
  flex: 1;
  overflow: hidden;
  isolation: isolate; /* Create stacking context */
}

/* Z-index management */
.mayo-panel-chat {
  z-index: 10;
}

.mayo-panel-interactive {
  z-index: 10;
}

.mayo-panel-divider {
  z-index: 15;
}

/* Blur overlay management */
.mayo-blur-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}
```

## Implementation Steps

### 1. Update MayaSideBySide Component

```tsx
// Replace the current main content section
<div className="flex-1 relative overflow-hidden">
  {/* Header stays the same */}
  
  {/* New panel container */}
  <div className="absolute inset-0 top-[theme(height.header)]">
    {/* Chat Panel */}
    <div className="absolute left-0 top-0 bottom-0 w-[calc(50%-2px)] overflow-hidden flex flex-col bg-white">
      {/* Chat content */}
    </div>
    
    {/* Interactive Panel */}
    <div className="absolute right-0 top-0 bottom-0 w-[calc(50%-2px)] overflow-hidden flex flex-col bg-gradient-to-br from-purple-50/50 to-pink-50/50">
      {/* Interactive content with blur overlay */}
      <div className="relative flex-1">
        {/* Blur overlay */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none"
          // Blur animation props
        />
        {/* Actual content */}
        <div className="relative z-0 h-full overflow-y-auto">
          {currentStage.component}
        </div>
      </div>
    </div>
  </div>
</div>
```

### 2. Benefits of This Approach

1. **Guaranteed Separation**: Panels physically cannot overlap
2. **Content Isolation**: Each panel's content is confined to its boundaries
3. **Performance**: Better paint/layout isolation
4. **Predictability**: Fixed positions prevent reflow issues
5. **Blur Effect Safety**: Overlays won't affect neighboring panels

### 3. Mobile Responsiveness

Keep the existing mobile strategy:
```tsx
{isMobile ? (
  // Stack vertically on mobile
  <div className="flex flex-col h-full">
    {/* Panels stack normally */}
  </div>
) : (
  // Absolute positioning on desktop
  <div className="absolute inset-0">
    {/* Absolute positioned panels */}
  </div>
)}
```

## Testing Checklist

- [ ] Test with extremely long content in both panels
- [ ] Verify blur effects don't bleed across panels
- [ ] Check resize behavior at different viewport sizes
- [ ] Ensure smooth scrolling in both panels
- [ ] Validate keyboard navigation between panels
- [ ] Test with dynamic content updates
- [ ] Verify print layout still works

## Migration Path

1. Create feature branch for testing
2. Implement changes in MayaSideBySideFixed first
3. Test thoroughly with various content scenarios
4. Apply to other side-by-side components
5. Update CSS architecture documentation
6. Deploy with monitoring for layout issues