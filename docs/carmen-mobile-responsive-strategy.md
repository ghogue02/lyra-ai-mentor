# Carmen Workshop Mobile-First Responsive Strategy

## Executive Overview

This document outlines a comprehensive mobile-first responsive strategy for the Carmen workshop interface, prioritizing touch interactions, progressive disclosure, and optimal viewport utilization across all device types.

## Mobile-First Design Principles

### 1. Touch-First Interaction Design

#### A. Touch Target Specifications
```css
/* Minimum Touch Target Standards */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  position: relative;
}

/* Enhanced Touch Targets for Mobile */
@media (max-width: 767px) {
  .touch-target {
    min-width: 48px;
    min-height: 48px;
    padding: 0.75rem;
  }
  
  .option-card {
    min-height: 60px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    border-radius: 1rem;
  }
}

/* Thumb-Friendly Zones */
.thumb-zone-primary {
  /* Bottom 1/3 of screen - easiest reach */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.thumb-zone-secondary {
  /* Center screen - medium reach */
  margin: 2rem 1rem;
}

.thumb-zone-tertiary {
  /* Top screen - hardest reach, minimal interaction */
  padding-top: 1rem;
}
```

#### B. Touch Feedback System
```typescript
interface TouchFeedback {
  visual: 'scale' | 'highlight' | 'ripple';
  haptic: 'light' | 'medium' | 'heavy';
  audio?: 'tap' | 'success' | 'error';
}

const useTouchFeedback = () => {
  const provideFeedback = useCallback((type: TouchFeedback) => {
    // Visual feedback
    if (type.visual === 'scale') {
      // Scale animation
    } else if (type.visual === 'ripple') {
      // Material Design ripple effect
    }
    
    // Haptic feedback (iOS/Android)
    if ('vibrate' in navigator && type.haptic) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type.haptic]);
    }
    
    // Audio feedback
    if (type.audio) {
      playSound(type.audio);
    }
  }, []);
  
  return { provideFeedback };
};
```

### 2. Responsive Breakpoint Strategy

#### A. Breakpoint Definition
```typescript
interface ResponsiveBreakpoints {
  mobile: {
    min: 320,
    max: 767,
    columns: 1,
    layout: 'stacked'
  };
  mobileLarge: {
    min: 481,
    max: 767,
    columns: 1,
    layout: 'stacked-compact'
  };
  tablet: {
    min: 768,
    max: 1023,
    columns: 2,
    layout: 'hybrid'
  };
  desktop: {
    min: 1024,
    max: 1439,
    columns: 3,
    layout: 'grid'
  };
  desktopLarge: {
    min: 1440,
    max: Infinity,
    columns: 3,
    layout: 'grid-expanded'
  };
}
```

#### B. CSS Container Queries Implementation
```css
/* Container Query Support */
.carmen-workshop-container {
  container-type: inline-size;
  container-name: workshop;
}

/* Mobile Layout (320px - 480px) */
@container workshop (max-width: 480px) {
  .workshop-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .floating-prompt {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--nm-surface-elevated);
    padding: 1rem;
    border-radius: 0 0 1rem 1rem;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .config-panel {
    margin-top: 120px; /* Space for fixed prompt */
    padding: 1rem;
  }
}

/* Mobile Large Layout (481px - 767px) */
@container workshop (min-width: 481px) and (max-width: 767px) {
  .workshop-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .floating-prompt {
    position: sticky;
    top: 1rem;
    background: var(--nm-surface-elevated);
    padding: 1.25rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
  }
}

/* Tablet Layout (768px - 1023px) */
@container workshop (min-width: 768px) and (max-width: 1023px) {
  .workshop-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "config prompt"
      "results prompt";
    gap: 1.5rem;
    height: 100vh;
  }
  
  .config-panel { grid-area: config; }
  .floating-prompt { 
    grid-area: prompt;
    position: sticky;
    top: 1.5rem;
    height: fit-content;
  }
  .results-panel { grid-area: results; }
}

/* Desktop Layout (1024px+) */
@container workshop (min-width: 1024px) {
  .workshop-grid {
    display: grid;
    grid-template-columns: 1fr 320px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "header header header"
      "config prompt results";
    gap: 2rem;
    height: 100vh;
    max-width: 1600px;
    margin: 0 auto;
  }
}
```

### 3. Progressive Disclosure for Mobile

#### A. Accordion-Style Sections
```typescript
const MobileAccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  isRequired,
  isCompleted,
  isExpanded,
  onToggle,
  children
}) => {
  return (
    <motion.div
      className="mobile-accordion-section"
      initial={false}
      animate={{
        backgroundColor: isExpanded 
          ? 'var(--nm-surface-elevated)' 
          : 'var(--nm-surface)'
      }}
    >
      <button
        onClick={() => onToggle(id)}
        className="accordion-header"
        aria-expanded={isExpanded}
      >
        <div className="section-info">
          <h3 className="section-title">{title}</h3>
          {isRequired && (
            <Badge variant="destructive" size="sm">Required</Badge>
          )}
          {isCompleted && (
            <Badge variant="default" size="sm">✓ Complete</Badge>
          )}
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="accordion-content"
          >
            <div className="content-wrapper">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
```

#### B. Smart Section Management
```typescript
const useMobileProgression = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['teamSize']) // Start with first required section
  );
  
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  );
  
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        // On mobile, only allow one section expanded at a time
        if (window.innerWidth < 768) {
          newSet.clear();
        }
        newSet.add(sectionId);
      }
      
      return newSet;
    });
  }, []);
  
  const completeSection = useCallback((sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    
    // Auto-expand next required section on completion
    const nextSection = getNextRequiredSection(sectionId);
    if (nextSection && window.innerWidth < 768) {
      setExpandedSections(new Set([nextSection]));
    }
  }, []);
  
  return {
    expandedSections,
    completedSections,
    toggleSection,
    completeSection
  };
};
```

### 4. Mobile Navigation Patterns

#### A. Bottom Tab Navigation
```typescript
const MobileBottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('config');
  
  return (
    <div className="mobile-bottom-nav">
      <nav className="nav-container">
        <button
          onClick={() => setActiveTab('config')}
          className={cn('nav-item', activeTab === 'config' && 'active')}
        >
          <Settings className="w-5 h-5" />
          <span>Configure</span>
          {hasIncompleteRequired && <div className="alert-dot" />}
        </button>
        
        <button
          onClick={() => setActiveTab('prompt')}
          className={cn('nav-item', activeTab === 'prompt' && 'active')}
        >
          <Brain className="w-5 h-5" />
          <span>Prompt</span>
          {promptSegments.length > 0 && <div className="update-dot" />}
        </button>
        
        <button
          onClick={() => setActiveTab('results')}
          className={cn('nav-item', activeTab === 'results' && 'active')}
          disabled={!hasResults}
        >
          <FileText className="w-5 h-5" />
          <span>Results</span>
          {hasNewResults && <div className="new-dot" />}
        </button>
      </nav>
    </div>
  );
};
```

#### B. Swipe Navigation
```typescript
const useSwipeNavigation = () => {
  const [touchStart, setTouchStart] = useState<TouchEvent | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchEvent | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e);
  };
  
  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart.touches[0].clientX - touchEnd.touches[0].clientX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      navigateToNextTab();
    } else if (isRightSwipe) {
      navigateToPrevTab();
    }
  };
  
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};
```

### 5. Viewport Optimization Strategies

#### A. Dynamic Viewport Height
```typescript
const useMobileViewport = () => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    const updateHeight = () => {
      // Use the actual viewport height, accounting for mobile browser UI
      const vh = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(vh);
      
      // Update CSS custom property
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    };
    
    updateHeight();
    
    // Listen for viewport changes (keyboard, browser UI)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      return () => window.visualViewport.removeEventListener('resize', updateHeight);
    } else {
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, []);
  
  return viewportHeight;
};
```

#### B. Safe Area Handling
```css
/* Safe area support for iOS */
.mobile-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Keyboard avoidance */
.mobile-input-container {
  padding-bottom: calc(env(keyboard-inset-height, 0px) + 1rem);
  transition: padding-bottom 0.3s ease;
}

/* Dynamic viewport height */
.full-height-mobile {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
```

### 6. Performance Optimization for Mobile

#### A. Lazy Loading Strategy
```typescript
const MobileLazySection: React.FC<LazySectionProps> = ({ 
  children, 
  isVisible 
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  useEffect(() => {
    if (inView && isVisible) {
      setHasLoaded(true);
    }
  }, [inView, isVisible]);
  
  return (
    <div ref={ref} className="lazy-section">
      {hasLoaded ? (
        children
      ) : (
        <div className="section-placeholder">
          <Skeleton height={120} />
        </div>
      )}
    </div>
  );
};
```

#### B. Touch Scroll Optimization
```css
/* Smooth scrolling optimization */
.mobile-scroll-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
}

/* Reduce reflow during scroll */
.scroll-item {
  contain: layout style paint;
  will-change: transform;
}

/* Hardware acceleration for animations */
.touch-animation {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### 7. Accessibility on Mobile

#### A. Screen Reader Optimization
```typescript
const MobileAccessibleSection: React.FC<AccessibleSectionProps> = ({
  title,
  description,
  isExpanded,
  onToggle,
  children
}) => {
  const titleId = `section-title-${id}`;
  const contentId = `section-content-${id}`;
  
  return (
    <div 
      role="region"
      aria-labelledby={titleId}
      className="accessible-section"
    >
      <button
        id={titleId}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={onToggle}
        className="section-toggle"
      >
        <h3>{title}</h3>
        <span className="sr-only">
          {isExpanded ? 'Collapse' : 'Expand'} {title} section
        </span>
      </button>
      
      <div
        id={contentId}
        role="region"
        aria-labelledby={titleId}
        hidden={!isExpanded}
        className="section-content"
      >
        {children}
      </div>
    </div>
  );
};
```

#### B. Voice Control Support
```typescript
const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      
      // Process voice commands
      if (command.includes('next section')) {
        navigateToNextSection();
      } else if (command.includes('previous section')) {
        navigateToPrevSection();
      } else if (command.includes('generate')) {
        triggerGeneration();
      }
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    return () => recognition.stop();
  }, []);
  
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      setIsListening(true);
      recognition.start();
    }
  };
  
  return { isListening, startListening };
};
```

### 8. Testing Strategy for Mobile

#### A. Device Testing Matrix
```typescript
interface DeviceTestConfig {
  devices: {
    iPhone13Mini: { width: 375, height: 812, dpr: 3 };
    iPhone14Pro: { width: 393, height: 852, dpr: 3 };
    Galaxy8: { width: 360, height: 740, dpr: 3 };
    iPadMini: { width: 768, height: 1024, dpr: 2 };
    iPadPro: { width: 1024, height: 1366, dpr: 2 };
  };
  orientations: ['portrait', 'landscape'];
  interactions: ['touch', 'keyboard', 'voice'];
}
```

#### B. Performance Benchmarks
```typescript
const mobilePerformanceTargets = {
  firstContentfulPaint: 1500, // ms
  largestContentfulPaint: 2500, // ms
  firstInputDelay: 100, // ms
  cumulativeLayoutShift: 0.1,
  touchResponseTime: 32, // ms
  scrollFrameRate: 60 // fps
};
```

This comprehensive mobile-first strategy ensures the Carmen workshop interface provides an optimal experience across all mobile devices while maintaining the sophisticated functionality required for effective AI-powered engagement building.