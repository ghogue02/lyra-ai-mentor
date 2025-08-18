# Carmen Workshop Resizable Panel System Architecture

## Overview

This document outlines the architecture for a sophisticated resizable panel system that enables users to customize their Carmen workshop viewport while maintaining responsive behavior and state persistence.

## 1. Panel System Requirements

### A. Functional Requirements
- **Horizontal Resizing**: Users can adjust panel widths via drag handles
- **Responsive Constraints**: Panels respect minimum/maximum width constraints
- **State Persistence**: Panel sizes persist across sessions using localStorage
- **Responsive Adaptation**: Panel behavior adapts to different screen sizes
- **Smooth Performance**: 60fps resize operations with optimized rendering
- **Accessibility**: Full keyboard and screen reader support

### B. Technical Requirements
- **Framework Integration**: Seamless React integration with hooks
- **Touch Support**: Mobile-friendly touch interactions for resizing
- **Memory Efficiency**: Minimal re-renders during resize operations
- **Cross-Browser**: Support for all modern browsers
- **TypeScript**: Full type safety for all panel configurations

## 2. Core Architecture

### A. Panel Configuration System
```typescript
interface PanelConfig {
  id: string;
  title: string;
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  isResizable: boolean;
  collapsible: boolean;
  order: number;
  breakpoints: {
    mobile: PanelBehavior;
    tablet: PanelBehavior;
    desktop: PanelBehavior;
  };
}

interface PanelBehavior {
  visible: boolean;
  resizable: boolean;
  width: number | 'auto' | 'flex';
  position: 'fixed' | 'relative' | 'sticky';
}

// Carmen Workshop Panel Configuration
const CARMEN_PANEL_CONFIG: PanelConfig[] = [
  {
    id: 'configuration',
    title: 'Configuration Panel',
    minWidth: 300,
    maxWidth: 600,
    defaultWidth: 380,
    isResizable: true,
    collapsible: true,
    order: 1,
    breakpoints: {
      mobile: {
        visible: true,
        resizable: false,
        width: 'auto',
        position: 'relative'
      },
      tablet: {
        visible: true,
        resizable: true,
        width: 360,
        position: 'relative'
      },
      desktop: {
        visible: true,
        resizable: true,
        width: 380,
        position: 'relative'
      }
    }
  },
  {
    id: 'prompt-builder',
    title: 'Prompt Builder',
    minWidth: 280,
    maxWidth: 400,
    defaultWidth: 320,
    isResizable: true,
    collapsible: false,
    order: 2,
    breakpoints: {
      mobile: {
        visible: true,
        resizable: false,
        width: 'auto',
        position: 'sticky'
      },
      tablet: {
        visible: true,
        resizable: false,
        width: 300,
        position: 'sticky'
      },
      desktop: {
        visible: true,
        resizable: true,
        width: 320,
        position: 'sticky'
      }
    }
  },
  {
    id: 'results',
    title: 'Results Panel',
    minWidth: 300,
    maxWidth: Infinity,
    defaultWidth: 400,
    isResizable: true,
    collapsible: true,
    order: 3,
    breakpoints: {
      mobile: {
        visible: true,
        resizable: false,
        width: 'auto',
        position: 'relative'
      },
      tablet: {
        visible: true,
        resizable: false,
        width: 'flex',
        position: 'relative'
      },
      desktop: {
        visible: true,
        resizable: true,
        width: 'flex',
        position: 'relative'
      }
    }
  }
];
```

### B. State Management Hook
```typescript
interface PanelState {
  width: number;
  isCollapsed: boolean;
  isResizing: boolean;
  lastWidth: number;
}

interface PanelLayout {
  [panelId: string]: PanelState;
}

const usePanelLayout = (configs: PanelConfig[]) => {
  const [layout, setLayout] = useState<PanelLayout>(() => 
    initializeLayout(configs)
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  
  // Load persisted layout from localStorage
  useEffect(() => {
    const persistedLayout = loadPersistedLayout();
    if (persistedLayout) {
      setLayout(validateAndMergeLayout(persistedLayout, configs));
    }
  }, [configs]);
  
  // Save layout changes to localStorage
  useEffect(() => {
    persistLayout(layout);
  }, [layout]);
  
  // Update layout based on container width changes
  useEffect(() => {
    const newBreakpoint = calculateBreakpoint(containerWidth);
    if (newBreakpoint !== breakpoint) {
      setBreakpoint(newBreakpoint);
      adaptLayoutToBreakpoint(newBreakpoint, configs);
    }
  }, [containerWidth, breakpoint, configs]);
  
  const updatePanelWidth = useCallback((panelId: string, width: number) => {
    setLayout(prev => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        width: Math.max(
          configs.find(c => c.id === panelId)?.minWidth || 0,
          Math.min(
            configs.find(c => c.id === panelId)?.maxWidth || Infinity,
            width
          )
        )
      }
    }));
  }, [configs]);
  
  const togglePanelCollapse = useCallback((panelId: string) => {
    setLayout(prev => {
      const panel = prev[panelId];
      return {
        ...prev,
        [panelId]: {
          ...panel,
          isCollapsed: !panel.isCollapsed,
          lastWidth: panel.isCollapsed ? panel.lastWidth : panel.width,
          width: panel.isCollapsed ? panel.lastWidth : 0
        }
      };
    });
  }, []);
  
  const setResizing = useCallback((panelId: string, isResizing: boolean) => {
    setLayout(prev => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        isResizing
      }
    }));
  }, []);
  
  return {
    layout,
    containerWidth,
    setContainerWidth,
    breakpoint,
    updatePanelWidth,
    togglePanelCollapse,
    setResizing
  };
};
```

### C. Resize Handle Component
```typescript
interface ResizeHandleProps {
  panelId: string;
  onResize: (panelId: string, width: number) => void;
  onResizeStart: (panelId: string) => void;
  onResizeEnd: (panelId: string) => void;
  className?: string;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  panelId,
  onResize,
  onResizeStart,
  onResizeEnd,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  
  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(getPanelWidth(panelId));
    onResizeStart(panelId);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [panelId, onResizeStart]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const newWidth = startWidth + deltaX;
    
    onResize(panelId, newWidth);
  }, [isDragging, startX, startWidth, panelId, onResize]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    onResizeEnd(panelId);
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [panelId, onResizeEnd, handleMouseMove]);
  
  // Touch support for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartX(touch.clientX);
    setStartWidth(getPanelWidth(panelId));
    onResizeStart(panelId);
  }, [panelId, onResizeStart]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const newWidth = startWidth + deltaX;
    
    onResize(panelId, newWidth);
  }, [isDragging, startX, startWidth, panelId, onResize]);
  
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    onResizeEnd(panelId);
  }, [panelId, onResizeEnd]);
  
  return (
    <div
      className={cn(
        'resize-handle',
        isDragging && 'resize-handle--dragging',
        className
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${panelId} panel`}
      tabIndex={0}
    >
      <div className="resize-handle__indicator" />
    </div>
  );
};
```

## 3. Resizable Panel Container

### A. Main Container Component
```typescript
interface ResizablePanelContainerProps {
  configs: PanelConfig[];
  children: React.ReactNode[];
  className?: string;
}

const ResizablePanelContainer: React.FC<ResizablePanelContainerProps> = ({
  configs,
  children,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    layout,
    containerWidth,
    setContainerWidth,
    breakpoint,
    updatePanelWidth,
    togglePanelCollapse,
    setResizing
  } = usePanelLayout(configs);
  
  // Monitor container width changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      setContainerWidth(entry.contentRect.width);
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [setContainerWidth]);
  
  // Generate CSS Grid template
  const gridTemplate = useMemo(() => {
    const visiblePanels = configs.filter(config => 
      config.breakpoints[breakpoint].visible
    );
    
    return visiblePanels.map(config => {
      const panelState = layout[config.id];
      const behavior = config.breakpoints[breakpoint];
      
      if (panelState?.isCollapsed) return '0fr';
      if (behavior.width === 'auto') return 'auto';
      if (behavior.width === 'flex') return '1fr';
      
      return `${panelState?.width || behavior.width}px`;
    }).join(' ');
  }, [configs, layout, breakpoint]);
  
  return (
    <div
      ref={containerRef}
      className={cn('resizable-panel-container', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        gap: '1rem',
        height: '100%'
      }}
    >
      {configs.map((config, index) => {
        const isVisible = config.breakpoints[breakpoint].visible;
        const isResizable = config.breakpoints[breakpoint].resizable && 
                           config.isResizable;
        const showHandle = isResizable && index < configs.length - 1;
        
        if (!isVisible) return null;
        
        return (
          <React.Fragment key={config.id}>
            <ResizablePanel
              config={config}
              state={layout[config.id]}
              onToggleCollapse={() => togglePanelCollapse(config.id)}
            >
              {children[index]}
            </ResizablePanel>
            
            {showHandle && (
              <ResizeHandle
                panelId={config.id}
                onResize={updatePanelWidth}
                onResizeStart={(id) => setResizing(id, true)}
                onResizeEnd={(id) => setResizing(id, false)}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
```

### B. Individual Panel Component
```typescript
interface ResizablePanelProps {
  config: PanelConfig;
  state: PanelState;
  onToggleCollapse: () => void;
  children: React.ReactNode;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  config,
  state,
  onToggleCollapse,
  children
}) => {
  return (
    <div
      className={cn(
        'resizable-panel',
        state.isResizing && 'resizable-panel--resizing',
        state.isCollapsed && 'resizable-panel--collapsed'
      )}
      style={{
        minWidth: config.minWidth,
        maxWidth: config.maxWidth
      }}
    >
      {config.collapsible && (
        <div className="panel-header">
          <h3 className="panel-title">{config.title}</h3>
          <button
            onClick={onToggleCollapse}
            className="collapse-button"
            aria-label={
              state.isCollapsed 
                ? `Expand ${config.title}` 
                : `Collapse ${config.title}`
            }
          >
            <ChevronRight 
              className={cn(
                'collapse-icon',
                !state.isCollapsed && 'collapse-icon--expanded'
              )}
            />
          </button>
        </div>
      )}
      
      <div 
        className="panel-content"
        hidden={state.isCollapsed}
      >
        {children}
      </div>
    </div>
  );
};
```

## 4. Styling System

### A. CSS Grid Layout
```css
.resizable-panel-container {
  display: grid;
  height: 100vh;
  overflow: hidden;
  gap: 1rem;
  padding: 1rem;
  transition: grid-template-columns 0.3s ease;
}

/* Panel styles */
.resizable-panel {
  display: flex;
  flex-direction: column;
  background: var(--nm-surface);
  border-radius: var(--nm-radius-lg);
  box-shadow: var(--nm-shadow-raised);
  overflow: hidden;
  transition: all 0.3s ease;
}

.resizable-panel--resizing {
  transition: none;
  user-select: none;
}

.resizable-panel--collapsed {
  min-width: 0;
  opacity: 0.5;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--nm-border);
  background: var(--nm-surface-elevated);
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--nm-text-primary);
  margin: 0;
}

.collapse-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--nm-radius-sm);
  transition: all 0.2s ease;
}

.collapse-button:hover {
  background: var(--nm-surface-sunken);
}

.collapse-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
}

.collapse-icon--expanded {
  transform: rotate(90deg);
}

.panel-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}
```

### B. Resize Handle Styling
```css
.resize-handle {
  width: 4px;
  background: transparent;
  cursor: col-resize;
  position: relative;
  user-select: none;
  transition: all 0.2s ease;
}

.resize-handle:hover {
  background: var(--nm-border);
}

.resize-handle:focus {
  outline: 2px solid var(--nm-focus-ring);
  outline-offset: 2px;
}

.resize-handle--dragging {
  background: var(--nm-brand-purple);
}

.resize-handle__indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 20px;
  background: var(--nm-text-muted);
  border-radius: 1px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.resize-handle:hover .resize-handle__indicator,
.resize-handle:focus .resize-handle__indicator {
  opacity: 1;
}

/* Touch-friendly resize handle for mobile */
@media (max-width: 1023px) {
  .resize-handle {
    width: 12px;
    touch-action: none;
  }
  
  .resize-handle__indicator {
    width: 4px;
    height: 24px;
    opacity: 0.6;
  }
}
```

## 5. Responsive Adaptations

### A. Breakpoint-Specific Behavior
```typescript
const adaptLayoutToBreakpoint = (
  breakpoint: Breakpoint,
  configs: PanelConfig[]
) => {
  switch (breakpoint) {
    case 'mobile':
      return {
        layout: 'stacked',
        resizable: false,
        collapsible: true,
        handles: false
      };
    
    case 'tablet':
      return {
        layout: 'hybrid',
        resizable: true,
        collapsible: true,
        handles: true
      };
    
    case 'desktop':
      return {
        layout: 'grid',
        resizable: true,
        collapsible: true,
        handles: true
      };
  }
};
```

### B. Container Queries Integration
```css
@container (max-width: 768px) {
  .resizable-panel-container {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto auto 1fr;
    gap: 0.5rem;
  }
  
  .resize-handle {
    display: none;
  }
}

@container (min-width: 769px) and (max-width: 1023px) {
  .resizable-panel-container {
    grid-template-columns: 1fr 300px !important;
    grid-template-rows: auto 1fr;
  }
}
```

## 6. Accessibility Features

### A. Keyboard Navigation
```typescript
const useKeyboardResizing = (
  panelId: string,
  onResize: (id: string, width: number) => void
) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const step = e.shiftKey ? 50 : 10;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        onResize(panelId, getCurrentWidth(panelId) - step);
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        onResize(panelId, getCurrentWidth(panelId) + step);
        break;
      
      case 'Home':
        e.preventDefault();
        onResize(panelId, getMinWidth(panelId));
        break;
      
      case 'End':
        e.preventDefault();
        onResize(panelId, getMaxWidth(panelId));
        break;
    }
  }, [panelId, onResize]);
  
  return { handleKeyDown };
};
```

### B. Screen Reader Support
```typescript
const ResizeHandleAccessible: React.FC<ResizeHandleProps> = (props) => {
  const [announcement, setAnnouncement] = useState('');
  
  const handleResize = useCallback((panelId: string, width: number) => {
    props.onResize(panelId, width);
    setAnnouncement(`Panel width: ${width}px`);
  }, [props.onResize]);
  
  return (
    <>
      <ResizeHandle {...props} onResize={handleResize} />
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </>
  );
};
```

## 7. Performance Optimizations

### A. Throttled Resize Updates
```typescript
const useThrottledResize = (callback: Function, delay: number = 16) => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args: any[]) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};
```

### B. Optimized Rendering
```typescript
const MemoizedResizablePanel = React.memo<ResizablePanelProps>(
  ({ config, state, onToggleCollapse, children }) => {
    return (
      <ResizablePanel
        config={config}
        state={state}
        onToggleCollapse={onToggleCollapse}
      >
        {children}
      </ResizablePanel>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.state.width === nextProps.state.width &&
      prevProps.state.isCollapsed === nextProps.state.isCollapsed &&
      prevProps.state.isResizing === nextProps.state.isResizing
    );
  }
);
```

This resizable panel architecture provides a robust, accessible, and performant solution for the Carmen workshop interface while maintaining responsive behavior across all device types.