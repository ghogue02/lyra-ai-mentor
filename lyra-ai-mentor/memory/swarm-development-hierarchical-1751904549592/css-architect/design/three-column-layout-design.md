# Three-Column Layout CSS Design Specification

## Layout Requirements
- **Summary Panel**: 25% width
- **Lyra Chat Panel**: 37.5% width  
- **Interactive Content Panel**: 37.5% width
- **Total**: 100% coverage with no overlaps

## CSS Grid Solution (Recommended)

### Base Grid Implementation
```css
/* Main container using CSS Grid */
.three-column-layout {
  display: grid;
  grid-template-columns: 25% 37.5% 37.5%;
  height: 100vh;
  width: 100%;
  gap: 0;
  overflow: hidden;
}

/* Alternative using fr units for more flexibility */
.three-column-layout-fr {
  display: grid;
  grid-template-columns: 2fr 3fr 3fr; /* 2:3:3 ratio = 25%:37.5%:37.5% */
  height: 100vh;
  width: 100%;
  gap: 0;
  overflow: hidden;
}

/* With minimal gap for visual separation */
.three-column-layout-gap {
  display: grid;
  grid-template-columns: calc(25% - 0.67rem) calc(37.5% - 0.67rem) calc(37.5% - 0.66rem);
  gap: 1rem;
  height: 100vh;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}
```

### Panel Styles
```css
/* Summary Panel */
.summary-panel {
  grid-column: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--panel-bg-primary);
  padding: 1.5rem;
  position: relative;
}

/* Lyra Chat Panel */
.lyra-chat-panel {
  grid-column: 2;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--panel-bg-secondary);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

/* Interactive Content Panel */
.interactive-panel {
  grid-column: 3;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--panel-bg-tertiary);
  padding: 1.5rem;
  position: relative;
}
```

## Flexbox Solution (Alternative)

### Base Flexbox Implementation
```css
/* Main container using Flexbox */
.three-column-flex {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Summary Panel - Fixed 25% */
.flex-summary {
  flex: 0 0 25%;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 250px; /* Minimum width for readability */
}

/* Lyra Chat Panel - Fixed 37.5% */
.flex-lyra-chat {
  flex: 0 0 37.5%;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 300px;
}

/* Interactive Panel - Fixed 37.5% */
.flex-interactive {
  flex: 0 0 37.5%;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 300px;
}
```

## Responsive Design Strategy

### Breakpoint System
```css
/* Desktop First Approach */
/* Extra Large Screens (1920px+) */
@media (min-width: 1920px) {
  .three-column-layout {
    max-width: 1920px;
    margin: 0 auto;
  }
}

/* Large Desktop (1440px - 1919px) */
@media (max-width: 1919px) and (min-width: 1440px) {
  .three-column-layout {
    grid-template-columns: 25% 37.5% 37.5%;
  }
}

/* Medium Desktop (1200px - 1439px) */
@media (max-width: 1439px) and (min-width: 1200px) {
  .three-column-layout {
    grid-template-columns: 22% 39% 39%;
  }
  
  .summary-panel {
    font-size: 0.95rem;
  }
}

/* Small Desktop / Large Tablet (992px - 1199px) */
@media (max-width: 1199px) and (min-width: 992px) {
  .three-column-layout {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .summary-panel {
    grid-column: 1 / -1;
    grid-row: 1;
    max-height: 200px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .lyra-chat-panel {
    grid-column: 1;
    grid-row: 2;
  }
  
  .interactive-panel {
    grid-column: 2;
    grid-row: 2;
  }
}

/* Tablet (768px - 991px) */
@media (max-width: 991px) and (min-width: 768px) {
  .three-column-layout {
    display: block;
    height: auto;
  }
  
  .summary-panel {
    position: sticky;
    top: 0;
    height: 150px;
    width: 100%;
    z-index: 10;
  }
  
  .lyra-chat-panel,
  .interactive-panel {
    height: calc(50vh - 75px);
    width: 100%;
  }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
  .three-column-layout {
    display: block;
    height: auto;
  }
  
  /* Tab-based navigation for mobile */
  .mobile-tab-navigation {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 20;
    background: var(--nav-bg);
    padding: 0.5rem;
  }
  
  .tab-button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  
  .tab-button.active {
    background: var(--active-tab-bg);
    border-radius: 0.5rem;
  }
  
  /* Show one panel at a time on mobile */
  .summary-panel,
  .lyra-chat-panel,
  .interactive-panel {
    display: none;
    height: calc(100vh - 60px);
    width: 100%;
  }
  
  .panel.active {
    display: block;
  }
}
```

## CSS Custom Properties System

```css
:root {
  /* Layout dimensions */
  --summary-width: 25%;
  --chat-width: 37.5%;
  --interactive-width: 37.5%;
  
  /* Spacing */
  --panel-padding: 1.5rem;
  --panel-gap: 0;
  
  /* Colors */
  --panel-bg-primary: #f8f9fa;
  --panel-bg-secondary: #ffffff;
  --panel-bg-tertiary: #f1f3f5;
  
  /* Borders */
  --panel-border: 1px solid #e9ecef;
  
  /* Responsive minimums */
  --min-summary-width: 250px;
  --min-chat-width: 300px;
  --min-interactive-width: 300px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --panel-bg-primary: #1a1a1a;
    --panel-bg-secondary: #0d0d0d;
    --panel-bg-tertiary: #141414;
    --panel-border: 1px solid #2a2a2a;
  }
}
```

## Utility Classes

```css
/* Panel utilities */
.panel-header {
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 5;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: var(--panel-border);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Scrollbar styling */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: transparent;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* Resizable panels (optional enhancement) */
.panel-resizer {
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  z-index: 10;
}

.panel-resizer:hover {
  background: rgba(0, 100, 200, 0.1);
}
```

## Implementation Guidelines

### 1. CSS Architecture
- Use CSS modules or styled-components for component isolation
- Implement a consistent naming convention (BEM or similar)
- Keep layout CSS separate from component styling
- Use CSS custom properties for theming

### 2. Performance Considerations
- Use `will-change: transform` for panels that might be animated
- Implement virtualization for long content lists
- Use `contain: layout` on panels to improve rendering performance
- Lazy load content in non-visible panels on mobile

### 3. Accessibility
- Ensure keyboard navigation between panels
- Add ARIA labels for panel regions
- Implement focus management for tab switching on mobile
- Maintain readable font sizes at all breakpoints

### 4. Browser Support
- CSS Grid: Supported in all modern browsers
- Flexbox: Excellent support across all browsers
- Use autoprefixer for vendor prefixes
- Provide fallbacks for older browsers if needed

## Example React Implementation

```jsx
import styles from './ThreeColumnLayout.module.css';

const ThreeColumnLayout = ({ summary, chat, interactive }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <div className={styles.threeColumnLayout}>
      {isMobile && (
        <nav className={styles.mobileTabNavigation}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'summary' ? styles.active : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'chat' ? styles.active : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Lyra Chat
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'interactive' ? styles.active : ''}`}
            onClick={() => setActiveTab('interactive')}
          >
            Interactive
          </button>
        </nav>
      )}
      
      <div className={`${styles.summaryPanel} ${isMobile && activeTab !== 'summary' ? styles.hidden : ''}`}>
        <div className={styles.panelHeader}>Summary</div>
        <div className={styles.panelContent}>{summary}</div>
      </div>
      
      <div className={`${styles.lyraChatPanel} ${isMobile && activeTab !== 'chat' ? styles.hidden : ''}`}>
        <div className={styles.panelHeader}>Lyra Chat</div>
        <div className={styles.panelContent}>{chat}</div>
      </div>
      
      <div className={`${styles.interactivePanel} ${isMobile && activeTab !== 'interactive' ? styles.hidden : ''}`}>
        <div className={styles.panelHeader}>Interactive Content</div>
        <div className={styles.panelContent}>{interactive}</div>
      </div>
    </div>
  );
};
```

## Testing Checklist

- [ ] Test on all major browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify responsive behavior at all breakpoints
- [ ] Check panel scroll behavior
- [ ] Ensure no content overflow or clipping
- [ ] Test with dynamic content loading
- [ ] Verify keyboard navigation
- [ ] Test with screen readers
- [ ] Performance testing with large datasets
- [ ] Dark mode compatibility
- [ ] Print stylesheet considerations