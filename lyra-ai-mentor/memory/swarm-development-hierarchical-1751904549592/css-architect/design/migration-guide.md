# Three-Column Layout Migration Guide

## Quick Integration Steps

### 1. Add CSS to Your Project

```bash
# Copy the CSS file to your styles directory
cp implementation-ready.css src/styles/three-column-layout.css

# Or import in your main CSS file
@import './styles/three-column-layout.css';
```

### 2. Update Existing Components

#### Option A: Direct CSS Grid Implementation
```jsx
// Before - Overlapping panels
<div className="lesson-container">
  <div className="summary-section" style={{ position: 'absolute', left: 0, width: '25%' }}>
    {/* Summary content */}
  </div>
  <div className="chat-section" style={{ position: 'absolute', left: '25%', width: '37.5%' }}>
    {/* Chat content */}
  </div>
  <div className="interactive-section" style={{ position: 'absolute', right: 0, width: '37.5%' }}>
    {/* Interactive content */}
  </div>
</div>

// After - Clean CSS Grid
<div className="three-column-layout">
  <div className="panel panel--summary">
    <div className="panel__header">Summary</div>
    <div className="panel__content">
      {/* Summary content */}
    </div>
  </div>
  <div className="panel panel--chat">
    <div className="panel__header">Lyra Chat</div>
    <div className="panel__content">
      {/* Chat content */}
    </div>
  </div>
  <div className="panel panel--interactive">
    <div className="panel__header">Interactive Content</div>
    <div className="panel__content">
      {/* Interactive content */}
    </div>
  </div>
</div>
```

#### Option B: React Component Implementation
```jsx
// Import the new component
import { ThreeColumnLayout } from './components/layouts/ThreeColumnLayout';

// Replace existing layout
<ThreeColumnLayout
  summaryContent={<LessonSummary data={summaryData} />}
  chatContent={<LyraChat messages={messages} />}
  interactiveContent={<InteractiveExercise exercise={currentExercise} />}
/>
```

### 3. Update Maya Side-by-Side Components

For components like `MayaSideBySide.tsx`:

```jsx
// Before
const MayaSideBySide = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '25%' }}>{/* Summary */}</div>
      <div style={{ width: '37.5%' }}>{/* Chat */}</div>
      <div style={{ width: '37.5%' }}>{/* Interactive */}</div>
    </div>
  );
};

// After
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout';

const MayaSideBySide = () => {
  return (
    <ThreeColumnLayout
      summaryContent={
        <div className="maya-summary">
          {/* Your summary content */}
        </div>
      }
      chatContent={
        <MayaChatInterface />
      }
      interactiveContent={
        <MayaInteractiveWorkspace />
      }
      className="maya-layout"
    />
  );
};
```

### 4. CSS Module Integration

If using CSS Modules:

```scss
// ThreeColumnLayout.module.scss
@import '../../../styles/three-column-layout.css';

// Add component-specific overrides
.mayaLayout {
  .panel--summary {
    background-color: #f0f4f8;
  }
  
  .panel--chat {
    background-color: #ffffff;
  }
  
  .panel--interactive {
    background-color: #fafbfc;
  }
}
```

### 5. Styled Components Integration

If using styled-components:

```jsx
import styled from 'styled-components';
import { threeColumnStyles } from './three-column-styles';

const StyledThreeColumnLayout = styled.div`
  ${threeColumnStyles}
  
  /* Component-specific overrides */
  .panel--summary {
    background-color: ${props => props.theme.colors.summaryBg};
  }
`;
```

## Common Migration Patterns

### Pattern 1: Absolute Positioning to Grid
```css
/* Before - Absolute positioning */
.container {
  position: relative;
  height: 100vh;
}
.panel-1 { position: absolute; left: 0; width: 25%; }
.panel-2 { position: absolute; left: 25%; width: 37.5%; }
.panel-3 { position: absolute; right: 0; width: 37.5%; }

/* After - CSS Grid */
.container {
  display: grid;
  grid-template-columns: 25% 37.5% 37.5%;
  height: 100vh;
}
```

### Pattern 2: Flexbox to Grid
```css
/* Before - Flexbox with fixed widths */
.container {
  display: flex;
  height: 100vh;
}
.panel-1 { flex: 0 0 25%; }
.panel-2 { flex: 0 0 37.5%; }
.panel-3 { flex: 0 0 37.5%; }

/* After - CSS Grid (cleaner) */
.container {
  display: grid;
  grid-template-columns: 2fr 3fr 3fr; /* 2:3:3 ratio */
  height: 100vh;
}
```

### Pattern 3: Table Layout to Grid
```css
/* Before - Display table */
.container { display: table; width: 100%; }
.panel { display: table-cell; }
.panel-1 { width: 25%; }
.panel-2 { width: 37.5%; }
.panel-3 { width: 37.5%; }

/* After - CSS Grid */
.container {
  display: grid;
  grid-template-columns: 25% 37.5% 37.5%;
}
```

## Testing Checklist

1. **Desktop Testing (1200px+)**
   - [ ] All three columns visible
   - [ ] Correct proportions (25%, 37.5%, 37.5%)
   - [ ] No content overflow
   - [ ] Scrollbars work correctly

2. **Small Desktop (992px - 1199px)**
   - [ ] Summary panel sticky at top
   - [ ] Two-column layout below summary
   - [ ] All content accessible

3. **Tablet (768px - 991px)**
   - [ ] Summary panel collapsible
   - [ ] Stacked layout works
   - [ ] Touch interactions work

4. **Mobile (<768px)**
   - [ ] Tab navigation appears
   - [ ] Only one panel visible at a time
   - [ ] Smooth tab switching
   - [ ] Full height panels

## Performance Optimization

```jsx
// Lazy load panel content
const SummaryPanel = lazy(() => import('./panels/SummaryPanel'));
const ChatPanel = lazy(() => import('./panels/ChatPanel'));
const InteractivePanel = lazy(() => import('./panels/InteractivePanel'));

// Virtualize long lists
import { FixedSizeList } from 'react-window';

const ChatMessages = ({ messages }) => (
  <FixedSizeList
    height={600}
    itemCount={messages.length}
    itemSize={80}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        {messages[index]}
      </div>
    )}
  </FixedSizeList>
);
```

## Troubleshooting

### Issue: Panels Overlapping
```css
/* Ensure no absolute positioning */
.panel {
  position: relative; /* Not absolute */
}
```

### Issue: Horizontal Scrollbar
```css
/* Add box-sizing */
* {
  box-sizing: border-box;
}
```

### Issue: Mobile Layout Broken
```jsx
// Ensure media query hook is working
const isMobile = window.matchMedia('(max-width: 767px)').matches;
```

## Rollback Strategy

If you need to rollback:

1. Keep old CSS in a separate file
2. Use feature flags:
```jsx
const useNewLayout = process.env.REACT_APP_NEW_LAYOUT === 'true';

return useNewLayout ? (
  <ThreeColumnLayout {...props} />
) : (
  <OldLayoutComponent {...props} />
);
```

3. A/B test with users:
```jsx
const LayoutComponent = userInTestGroup ? ThreeColumnLayout : OldLayout;
```