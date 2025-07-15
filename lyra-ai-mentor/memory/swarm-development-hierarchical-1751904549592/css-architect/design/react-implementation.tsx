// Three-Column Layout React/TypeScript Implementation
// Exact proportions: Summary (25%) | Lyra Chat (37.5%) | Interactive (37.5%)

import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import './implementation-ready.css';

interface ThreeColumnLayoutProps {
  summaryContent: React.ReactNode;
  chatContent: React.ReactNode;
  interactiveContent: React.ReactNode;
  className?: string;
  enableResize?: boolean;
  onPanelResize?: (panelWidths: PanelWidths) => void;
}

interface PanelWidths {
  summary: number;
  chat: number;
  interactive: number;
}

type ActivePanel = 'summary' | 'chat' | 'interactive';

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  summaryContent,
  chatContent,
  interactiveContent,
  className = '',
  enableResize = false,
  onPanelResize
}) => {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 991px)');
  const isSmallDesktop = useMediaQuery('(min-width: 992px) and (max-width: 1199px)');
  
  // Mobile tab state
  const [activePanel, setActivePanel] = useState<ActivePanel>('summary');
  
  // Tablet collapsible summary state
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  
  // Resize functionality (optional)
  const layoutRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [panelWidths, setPanelWidths] = useState<PanelWidths>({
    summary: 25,
    chat: 37.5,
    interactive: 37.5
  });

  // Handle panel resize
  const handleMouseDown = (panel: 'summary' | 'chat') => {
    if (!enableResize) return;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!layoutRef.current) return;
      
      const layoutRect = layoutRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - layoutRect.left) / layoutRect.width * 100;
      
      // Calculate new widths maintaining total of 100%
      // Implement resize logic here based on which panel is being resized
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (onPanelResize) {
        onPanelResize(panelWidths);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, panelWidths, onPanelResize]);

  // Mobile tab navigation
  const MobileTabNavigation = () => (
    <nav className="mobile-tabs" role="tablist" aria-label="Panel navigation">
      <button
        className={`mobile-tabs__button ${activePanel === 'summary' ? 'is-active' : ''}`}
        onClick={() => setActivePanel('summary')}
        role="tab"
        aria-selected={activePanel === 'summary'}
        aria-controls="panel-summary"
      >
        Summary
      </button>
      <button
        className={`mobile-tabs__button ${activePanel === 'chat' ? 'is-active' : ''}`}
        onClick={() => setActivePanel('chat')}
        role="tab"
        aria-selected={activePanel === 'chat'}
        aria-controls="panel-chat"
      >
        Lyra Chat
      </button>
      <button
        className={`mobile-tabs__button ${activePanel === 'interactive' ? 'is-active' : ''}`}
        onClick={() => setActivePanel('interactive')}
        role="tab"
        aria-selected={activePanel === 'interactive'}
        aria-controls="panel-interactive"
      >
        Interactive
      </button>
    </nav>
  );

  // Panel component
  const Panel: React.FC<{
    type: 'summary' | 'chat' | 'interactive';
    title: string;
    children: React.ReactNode;
    isActive?: boolean;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
  }> = ({ type, title, children, isActive = true, isCollapsed = false, onToggleCollapse }) => {
    const panelClass = `panel panel--${type} ${isActive ? 'is-active' : ''} ${isCollapsed ? 'is-collapsed' : ''}`;
    
    return (
      <div 
        className={panelClass}
        id={`panel-${type}`}
        role="tabpanel"
        aria-hidden={!isActive}
      >
        <div className="panel__header">
          <h2 className="panel__title">{title}</h2>
          {isTablet && type === 'summary' && (
            <button
              className="panel__collapse-button"
              onClick={onToggleCollapse}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? 'Expand summary' : 'Collapse summary'}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
        <div className="panel__content">
          {children}
        </div>
        {enableResize && !isMobile && type !== 'interactive' && (
          <div 
            className="panel__resize-handle"
            onMouseDown={() => handleMouseDown(type as 'summary' | 'chat')}
            role="separator"
            aria-orientation="vertical"
            aria-label={`Resize ${type} panel`}
          />
        )}
      </div>
    );
  };

  // Determine grid template based on resize state
  const gridStyle = enableResize && !isMobile && !isTablet && !isSmallDesktop
    ? {
        gridTemplateColumns: `${panelWidths.summary}% ${panelWidths.chat}% ${panelWidths.interactive}%`
      }
    : undefined;

  return (
    <div 
      ref={layoutRef}
      className={`three-column-layout ${className}`}
      style={gridStyle}
    >
      {isMobile && <MobileTabNavigation />}
      
      <Panel
        type="summary"
        title="Summary"
        isActive={!isMobile || activePanel === 'summary'}
        isCollapsed={isTablet && isSummaryCollapsed}
        onToggleCollapse={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
      >
        {summaryContent}
      </Panel>
      
      <Panel
        type="chat"
        title="Lyra Chat"
        isActive={!isMobile || activePanel === 'chat'}
      >
        {chatContent}
      </Panel>
      
      <Panel
        type="interactive"
        title="Interactive Content"
        isActive={!isMobile || activePanel === 'interactive'}
      >
        {interactiveContent}
      </Panel>
    </div>
  );
};

// Example usage with actual components
export const ThreeColumnLayoutExample: React.FC = () => {
  return (
    <ThreeColumnLayout
      summaryContent={
        <div className="summary-content">
          <h3>Lesson Summary</h3>
          <ul>
            <li>Key point 1</li>
            <li>Key point 2</li>
            <li>Key point 3</li>
          </ul>
        </div>
      }
      chatContent={
        <div className="chat-content">
          <div className="chat-messages">
            {/* Chat messages */}
          </div>
          <div className="chat-input">
            {/* Chat input */}
          </div>
        </div>
      }
      interactiveContent={
        <div className="interactive-content">
          {/* Interactive exercises, visualizations, etc. */}
        </div>
      }
      enableResize={false} // Set to true to enable panel resizing
    />
  );
};

// Custom hook for managing panel state across routes
export const useThreeColumnState = () => {
  const [panelWidths, setPanelWidths] = useState<PanelWidths>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('three-column-widths');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to defaults
      }
    }
    return { summary: 25, chat: 37.5, interactive: 37.5 };
  });

  const [activePanel, setActivePanel] = useState<ActivePanel>('summary');

  const savePanelWidths = (widths: PanelWidths) => {
    setPanelWidths(widths);
    localStorage.setItem('three-column-widths', JSON.stringify(widths));
  };

  return {
    panelWidths,
    activePanel,
    setActivePanel,
    savePanelWidths
  };
};