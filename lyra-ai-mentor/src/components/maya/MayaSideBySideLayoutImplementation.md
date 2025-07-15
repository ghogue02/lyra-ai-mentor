# Maya Side-by-Side Layout Implementation Guide

## CSS Architecture Implementation Instructions

### Step 1: Import the New CSS
Add this import to the top of `MayaSideBySideFixed.tsx`:
```typescript
import '@/styles/maya-sidebyside-layout.css';
```

### Step 2: Update the JSX Structure

Replace the current JSX structure with the following class-based approach:

```tsx
return (
  <div className="minimal-ui mayo-container">
    {/* Header */}
    <div className="mayo-header">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-semibold">Email Recipe Method</h1>
          <p className="text-sm text-gray-600">Interactive Learning with Maya</p>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Step {currentStageIndex + 1} of {stages.length}
      </div>
    </div>

    {/* Main Content - Side by Side */}
    <div className="mayo-main-content">
      {/* Chat Panel (Left) */}
      <div className="mayo-chat-panel mayo-panel">
        <div className="mayo-panel-header">
          <h2 className="font-medium text-purple-900">Maya's Guidance</h2>
        </div>
        <div 
          ref={chatRef} 
          className="mayo-panel-content mayo-scrollable"
          aria-label="Chat messages"
          tabIndex={0}
        >
          {/* Chat messages content */}
          {visibleMessages.map((message) => (
            // ... existing message rendering
          ))}
        </div>
      </div>

      {/* Interactive Panel (Right) */}
      <div className="mayo-interactive-panel mayo-panel">
        <div className="mayo-panel-header">
          <h2 className="font-medium">{currentStage.title}</h2>
        </div>
        <div 
          className="mayo-panel-content mayo-scrollable"
          aria-label="Interactive content"
          tabIndex={0}
        >
          {currentStage.component}
        </div>
      </div>
    </div>

    {/* Progress Bar */}
    <div className="mayo-progress-bar">
      <div 
        className="mayo-progress-fill mayo-animated"
        style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
      />
    </div>
  </div>
);
```

### Step 3: Key Changes to Note

1. **Replaced Tailwind Layout Classes**: 
   - `max-w-7xl mx-auto h-screen flex flex-col` → `mayo-container`
   - `flex-1 flex overflow-hidden` → `mayo-main-content`
   - `w-1/2` → Flex-based sizing in CSS

2. **Added Structural Classes**:
   - `mayo-panel` for containment optimization
   - `mayo-scrollable` for custom scrollbar styling
   - `mayo-animated` for performance optimization

3. **Added Accessibility Attributes**:
   - `aria-label` for scrollable regions
   - `tabIndex={0}` for keyboard navigation

### Step 4: Testing Checklist

- [ ] Desktop (1440px): Verify two equal columns with no overlap
- [ ] Large Desktop (1600px+): Check max-width constraints
- [ ] Tablet (768px-1023px): Confirm responsive adjustments
- [ ] Mobile (<768px): Test vertical stacking
- [ ] Long Content: Add very long text to both panels
- [ ] Keyboard Navigation: Tab through panels
- [ ] Browser Testing: Chrome, Firefox, Safari, Edge
- [ ] Zoom Testing: 50% to 200% browser zoom

### Step 5: Optional Enhancements

1. **Add Resize Observer** for dynamic layout adjustments:
```typescript
useEffect(() => {
  const resizeObserver = new ResizeObserver(() => {
    // Handle dynamic content changes
  });
  
  if (chatRef.current) {
    resizeObserver.observe(chatRef.current);
  }
  
  return () => resizeObserver.disconnect();
}, []);
```

2. **Add Focus Management** for better accessibility:
```typescript
const handlePanelFocus = (panel: 'chat' | 'interactive') => {
  // Announce panel focus to screen readers
};
```

### Performance Monitoring

Monitor these metrics after implementation:
- First Contentful Paint (FCP)
- Layout shifts during typing animation
- Scroll performance with long content
- Memory usage with extended sessions