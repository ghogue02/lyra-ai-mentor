/**
 * Responsive Implementation Guide for LyraNarratedMayaSideBySideComplete
 * 
 * This file demonstrates how to apply responsive breakpoints:
 * - Mobile: < 768px (vertical stack)
 * - Tablet: 768px - 1023px (two column)
 * - Desktop: >= 1024px (three panel with permanent summary)
 */

import { cn } from '@/lib/utils';

// Responsive Layout Classes
export const responsiveClasses = {
  // Main Container
  container: cn(
    "h-screen overflow-hidden bg-[#FAF9F7]",
    // Mobile: Flex column
    "flex flex-col",
    // Tablet: Grid with 2 columns
    "md:grid md:grid-cols-2 md:gap-0",
    // Desktop: Grid with summary panel
    "lg:grid-cols-[320px_1fr]"
  ),

  // Mobile Menu Button (only visible on mobile)
  mobileMenuButton: cn(
    "fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border",
    "md:hidden" // Hidden on tablet and desktop
  ),

  // Header
  header: cn(
    "flex items-center justify-between border-b bg-white",
    // Mobile
    "p-4 pt-16", // Extra padding top for menu button
    // Tablet
    "md:p-5 md:pt-5 md:col-span-2",
    // Desktop
    "lg:p-6 lg:col-span-1"
  ),

  // Summary Panel
  summaryPanel: {
    // Mobile: Slide-out overlay
    mobile: cn(
      "fixed top-0 left-0 w-72 h-screen bg-white z-50 shadow-2xl",
      "transform transition-transform duration-300",
      "md:hidden" // Only on mobile
    ),
    // Tablet: Slide-out overlay
    tablet: cn(
      "hidden", // Hidden by default
      "md:block md:fixed md:top-0 md:left-0 md:w-80 md:h-screen",
      "md:bg-white md:z-50 md:shadow-2xl md:border-r-2",
      "md:transform md:transition-transform md:duration-300",
      "lg:hidden" // Not on desktop
    ),
    // Desktop: Always visible
    desktop: cn(
      "hidden", // Hidden on mobile/tablet
      "lg:block lg:row-span-full lg:bg-gray-50",
      "lg:border-r-2 lg:border-gray-200 lg:shadow-sm"
    )
  },

  // Content Wrapper
  contentWrapper: cn(
    "flex-1 overflow-hidden",
    // Mobile: Stack vertically
    "flex flex-col",
    // Tablet: Side by side
    "md:grid md:grid-cols-2 md:gap-0",
    // Desktop: Keep side by side
    "lg:grid-cols-2 lg:gap-2 lg:p-2"
  ),

  // Narrative Panel (Lyra's chat)
  narrativePanel: cn(
    "flex flex-col bg-white overflow-hidden",
    // Mobile
    "w-full border-b flex-1 min-h-[40vh]",
    // Tablet
    "md:border-b-0 md:border-r md:min-h-0",
    // Desktop
    "lg:border-r-2 lg:rounded-l-lg lg:shadow-sm"
  ),

  // Interactive Panel
  interactivePanel: cn(
    "flex flex-col overflow-hidden",
    "bg-gradient-to-br from-purple-50/50 to-pink-50/50",
    // Mobile
    "w-full min-h-[40vh] flex-1",
    // Tablet
    "md:min-h-0",
    // Desktop
    "lg:rounded-r-lg lg:shadow-sm"
  ),

  // Progress Bar
  progressBar: cn(
    "h-3 bg-gray-200 relative overflow-hidden",
    // Mobile
    "md:col-span-2", // Span both columns on tablet
    "lg:col-span-1" // Only main content area on desktop
  ),

  // Text and Typography
  typography: {
    title: cn(
      // Mobile
      "text-base font-semibold truncate",
      // Tablet
      "md:text-lg",
      // Desktop
      "lg:text-xl"
    ),
    subtitle: cn(
      // Mobile
      "text-xs text-gray-600 truncate",
      // Tablet
      "md:text-sm",
      // Desktop
      "lg:text-sm"
    ),
    chatMessage: cn(
      // Mobile
      "text-sm leading-relaxed",
      // Tablet
      "md:text-[0.9375rem] md:leading-relaxed",
      // Desktop
      "lg:text-base lg:leading-relaxed"
    )
  },

  // Buttons and Controls
  controls: {
    actionButton: cn(
      // Mobile
      "px-2 py-1 text-xs rounded-full",
      // Tablet
      "md:px-3 md:py-1 md:text-sm",
      // Desktop
      "lg:px-4 lg:py-1.5 lg:text-sm"
    ),
    primaryButton: cn(
      // Mobile
      "w-full px-4 py-3 text-sm",
      // Tablet
      "md:px-5 md:py-3 md:text-[0.9375rem]",
      // Desktop
      "lg:px-6 lg:py-3 lg:text-base"
    )
  }
};

// Responsive Utility Functions
export const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
};

// Responsive Panel Visibility Logic
export const getPanelVisibility = (
  breakpoint: 'mobile' | 'tablet' | 'desktop',
  isPanelOpen: boolean,
  showSummaryPanel: boolean
) => {
  return {
    showMobileMenu: breakpoint === 'mobile',
    showMobilePanel: breakpoint === 'mobile' && isPanelOpen,
    showTabletPanel: breakpoint === 'tablet' && isPanelOpen,
    showDesktopPanel: breakpoint === 'desktop' && showSummaryPanel,
    showOverlay: (breakpoint === 'mobile' || breakpoint === 'tablet') && isPanelOpen
  };
};

// Example Usage in Component
export const ResponsiveLayoutExample = () => {
  const breakpoint = useResponsiveBreakpoint();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [showSummaryPanel, setShowSummaryPanel] = React.useState(true);

  const visibility = getPanelVisibility(breakpoint, isPanelOpen, showSummaryPanel);

  return (
    <div className={responsiveClasses.container}>
      {/* Mobile Menu Button */}
      {visibility.showMobileMenu && (
        <button
          className={responsiveClasses.mobileMenuButton}
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Summary Panel - Different for each breakpoint */}
      {visibility.showDesktopPanel && (
        <aside className={responsiveClasses.summaryPanel.desktop}>
          {/* Desktop summary panel content */}
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={responsiveClasses.header}>
          {/* Header content */}
        </header>

        <div className={responsiveClasses.contentWrapper}>
          {/* Narrative Panel */}
          <div className={responsiveClasses.narrativePanel}>
            {/* Lyra's chat content */}
          </div>

          {/* Interactive Panel */}
          <div className={responsiveClasses.interactivePanel}>
            {/* Interactive content */}
          </div>
        </div>

        <div className={responsiveClasses.progressBar}>
          {/* Progress bar */}
        </div>
      </main>
    </div>
  );
};

// CSS Variables for Dynamic Styling
export const responsiveCSSVariables = `
  :root {
    /* Mobile Variables */
    --mobile-header-height: 4rem;
    --mobile-panel-width: 18rem;
    --mobile-spacing: 0.75rem;

    /* Tablet Variables */
    --tablet-panel-width: 20rem;
    --tablet-spacing: 1rem;

    /* Desktop Variables */
    --desktop-summary-width: 20rem;
    --desktop-spacing: 1.5rem;
    --desktop-content-gap: 0.5rem;
  }

  @media (min-width: 768px) {
    :root {
      --panel-width: var(--tablet-panel-width);
      --spacing: var(--tablet-spacing);
    }
  }

  @media (min-width: 1024px) {
    :root {
      --panel-width: var(--desktop-summary-width);
      --spacing: var(--desktop-spacing);
    }
  }
`;

export default responsiveClasses;