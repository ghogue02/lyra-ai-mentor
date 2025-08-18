# Carmen Workshop Accessibility & Touch Interaction Guidelines

## Overview

This document provides comprehensive accessibility and touch interaction guidelines for the Carmen workshop interface, ensuring WCAG 2.1 AA compliance and optimal usability across all devices and user capabilities.

## 1. Accessibility Standards Compliance

### A. WCAG 2.1 AA Requirements

#### Perceivable
```typescript
// Color contrast requirements
const CONTRAST_REQUIREMENTS = {
  normalText: {
    minimum: 4.5, // 4.5:1 ratio
    enhanced: 7,   // 7:1 ratio for AAA
  },
  largeText: {
    minimum: 3,    // 3:1 ratio  
    enhanced: 4.5, // 4.5:1 ratio for AAA
  },
  nonText: {
    minimum: 3,    // 3:1 ratio for UI components
  }
};

// Implementation example
const validateColorContrast = (background: string, foreground: string) => {
  const ratio = calculateContrastRatio(background, foreground);
  return {
    passesAA: ratio >= CONTRAST_REQUIREMENTS.normalText.minimum,
    passesAAA: ratio >= CONTRAST_REQUIREMENTS.normalText.enhanced,
    ratio
  };
};
```

#### Operable
```typescript
// Keyboard navigation requirements
interface KeyboardAccessible {
  focusable: boolean;
  tabIndex: number;
  onKeyDown: (event: KeyboardEvent) => void;
  'aria-label': string;
  'aria-describedby'?: string;
}

// Focus management for dynamic content
const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  
  const moveFocus = useCallback((direction: 'next' | 'previous' | 'first' | 'last') => {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(focusedElement);
    
    let nextIndex: number;
    switch (direction) {
      case 'next':
        nextIndex = (currentIndex + 1) % focusableElements.length;
        break;
      case 'previous':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        break;
      case 'first':
        nextIndex = 0;
        break;
      case 'last':
        nextIndex = focusableElements.length - 1;
        break;
    }
    
    focusableElements[nextIndex]?.focus();
  }, [focusedElement]);
  
  return { moveFocus, focusedElement };
};
```

#### Understandable
```typescript
// Clear labeling and instructions
interface AccessibleForm {
  'aria-labelledby': string;
  'aria-describedby': string;
  'aria-required': boolean;
  'aria-invalid': boolean;
  'aria-errormessage'?: string;
}

// Error handling and feedback
const AccessibleErrorMessage: React.FC<ErrorMessageProps> = ({
  id,
  message,
  severity = 'error'
}) => {
  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      className={cn('error-message', `error-message--${severity}`)}
    >
      <Icon name={severity} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};
```

#### Robust
```typescript
// Semantic HTML structure
const AccessibleWorkshopSection: React.FC<SectionProps> = ({
  title,
  description,
  children,
  isRequired
}) => {
  const sectionId = useId();
  const titleId = `${sectionId}-title`;
  const descId = `${sectionId}-description`;
  
  return (
    <section
      id={sectionId}
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-required={isRequired}
    >
      <h2 id={titleId} className="section-title">
        {title}
        {isRequired && (
          <span aria-label="required" className="required-indicator">
            *
          </span>
        )}
      </h2>
      
      <p id={descId} className="section-description">
        {description}
      </p>
      
      <div role="group" aria-labelledby={titleId}>
        {children}
      </div>
    </section>
  );
};
```

### B. Screen Reader Optimization

#### Live Regions for Dynamic Content
```typescript
const useLiveRegion = (politeness: 'polite' | 'assertive' = 'polite') => {
  const [announcement, setAnnouncement] = useState('');
  
  const announce = useCallback((message: string) => {
    setAnnouncement(''); // Clear first to ensure re-announcement
    setTimeout(() => setAnnouncement(message), 10);
  }, []);
  
  return {
    announce,
    LiveRegion: () => (
      <div
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    )
  };
};

// Usage in Carmen workshop
const CarmenWorkshopAccessible: React.FC = () => {
  const { announce, LiveRegion } = useLiveRegion('polite');
  
  const handleSelectionChange = useCallback((selections: string[]) => {
    announce(`${selections.length} options selected`);
  }, [announce]);
  
  return (
    <>
      <WorkshopContent onSelectionChange={handleSelectionChange} />
      <LiveRegion />
    </>
  );
};
```

#### Progressive Enhancement for Screen Readers
```typescript
const ProgressiveDisclosureAccessible: React.FC<DisclosureProps> = ({
  children,
  title,
  isExpanded,
  onToggle
}) => {
  const contentId = useId();
  const buttonId = useId();
  
  return (
    <div className="disclosure">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={onToggle}
        className="disclosure-trigger"
      >
        <span>{title}</span>
        <span aria-hidden="true">
          {isExpanded ? '−' : '+'}
        </span>
        <span className="sr-only">
          {isExpanded ? 'Collapse' : 'Expand'} {title} section
        </span>
      </button>
      
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isExpanded}
        className="disclosure-content"
      >
        {children}
      </div>
    </div>
  );
};
```

## 2. Touch Interaction Guidelines

### A. Touch Target Specifications

#### Minimum Touch Target Sizes
```css
/* Base touch targets - WCAG AA minimum */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  position: relative;
}

/* Enhanced for better usability */
.touch-target-enhanced {
  min-width: 48px;
  min-height: 48px;
}

/* Large touch targets for primary actions */
.touch-target-primary {
  min-width: 56px;
  min-height: 56px;
}

/* Spacing between touch targets */
.touch-target + .touch-target {
  margin-left: 8px; /* Minimum 8px spacing */
}

.touch-target-list .touch-target {
  margin-bottom: 8px; /* Vertical spacing */
}
```

#### Touch Target Implementation
```typescript
interface TouchTargetProps {
  size?: 'small' | 'medium' | 'large';
  spacing?: 'compact' | 'comfortable';
  children: React.ReactNode;
  onPress: () => void;
  'aria-label'?: string;
}

const TouchTarget: React.FC<TouchTargetProps> = ({
  size = 'medium',
  spacing = 'comfortable',
  children,
  onPress,
  'aria-label': ariaLabel,
  ...props
}) => {
  const sizeClasses = {
    small: 'min-w-[44px] min-h-[44px]',
    medium: 'min-w-[48px] min-h-[48px]',
    large: 'min-w-[56px] min-h-[56px]'
  };
  
  const spacingClasses = {
    compact: 'p-1',
    comfortable: 'p-2'
  };
  
  return (
    <button
      className={cn(
        'touch-target',
        sizeClasses[size],
        spacingClasses[spacing],
        'flex items-center justify-center',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'active:scale-95'
      )}
      onClick={onPress}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};
```

### B. Gesture Recognition

#### Swipe Gesture Implementation
```typescript
interface SwipeConfig {
  threshold: number;
  velocity: number;
  directional: boolean;
}

const useSwipeGesture = (
  onSwipe: (direction: SwipeDirection) => void,
  config: SwipeConfig = {
    threshold: 50,
    velocity: 0.3,
    directional: true
  }
) => {
  const [touchStart, setTouchStart] = useState<Touch | null>(null);
  const [touchEnd, setTouchEnd] = useState<Touch | null>(null);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]);
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0]);
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const deltaX = touchStart.clientX - touchEnd.clientX;
    const deltaY = touchStart.clientY - touchEnd.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < config.threshold) return;
    
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (config.directional && !isHorizontal) return;
    
    const direction = deltaX > 0 ? 'left' : 'right';
    onSwipe(direction);
  }, [touchStart, touchEnd, onSwipe, config]);
  
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
};
```

#### Pinch-to-Zoom for Resizable Panels
```typescript
const usePinchToResize = (
  onResize: (scale: number) => void,
  minScale: number = 0.5,
  maxScale: number = 2.0
) => {
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  
  const getDistance = (touches: TouchList) => {
    const [touch1, touch2] = Array.from(touches);
    const deltaX = touch1.clientX - touch2.clientX;
    const deltaY = touch1.clientY - touch2.clientY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      setInitialDistance(getDistance(e.touches));
      e.preventDefault();
    }
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && initialDistance) {
      const currentDistance = getDistance(e.touches);
      const newScale = Math.max(
        minScale,
        Math.min(maxScale, currentDistance / initialDistance)
      );
      
      setScale(newScale);
      onResize(newScale);
      e.preventDefault();
    }
  }, [initialDistance, onResize, minScale, maxScale]);
  
  const handleTouchEnd = useCallback(() => {
    setInitialDistance(null);
  }, []);
  
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    scale
  };
};
```

### C. Haptic Feedback

#### Haptic Feedback Implementation
```typescript
interface HapticPattern {
  type: 'selection' | 'success' | 'warning' | 'error';
  pattern: number[];
  duration: number;
}

const HAPTIC_PATTERNS: Record<string, HapticPattern> = {
  selection: {
    type: 'selection',
    pattern: [10],
    duration: 10
  },
  success: {
    type: 'success',
    pattern: [10, 50, 10],
    duration: 70
  },
  warning: {
    type: 'warning',
    pattern: [50, 50, 50],
    duration: 150
  },
  error: {
    type: 'error',
    pattern: [100, 50, 100],
    duration: 250
  }
};

const useHapticFeedback = () => {
  const triggerHaptic = useCallback((patternType: keyof typeof HAPTIC_PATTERNS) => {
    const pattern = HAPTIC_PATTERNS[patternType];
    
    // Check for vibration API support
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern.pattern);
    }
    
    // iOS haptic feedback
    if ('hapticFeedback' in window) {
      const intensity = pattern.type === 'error' ? 'heavy' : 
                      pattern.type === 'warning' ? 'medium' : 'light';
      // @ts-ignore - iOS specific API
      window.hapticFeedback.impactOccurred(intensity);
    }
  }, []);
  
  return { triggerHaptic };
};

// Usage in touch interactions
const TouchableOption: React.FC<TouchableOptionProps> = ({
  option,
  onSelect,
  isSelected
}) => {
  const { triggerHaptic } = useHapticFeedback();
  
  const handlePress = useCallback(() => {
    triggerHaptic('selection');
    onSelect(option.id);
  }, [option.id, onSelect, triggerHaptic]);
  
  return (
    <TouchTarget
      onPress={handlePress}
      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${option.label}`}
    >
      <OptionContent option={option} isSelected={isSelected} />
    </TouchTarget>
  );
};
```

## 3. Keyboard Navigation

### A. Focus Management

#### Focus Trap for Modal Content
```typescript
const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Get focusable elements
    const focusableElements = getFocusableElements(containerRef.current);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    firstElement?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Close modal/dialog
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore previous focus
      previousFocusRef.current?.focus();
    };
  }, [isActive]);
  
  return containerRef;
};
```

#### Roving Tab Index for Option Groups
```typescript
const useRovingTabIndex = (items: string[]) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleKeyDown = useCallback((e: KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => prev > 0 ? prev - 1 : items.length - 1);
        break;
        
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
        
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        // Trigger selection
        break;
    }
  }, [items.length]);
  
  const getTabIndex = useCallback((index: number) => {
    return index === activeIndex ? 0 : -1;
  }, [activeIndex]);
  
  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    getTabIndex
  };
};
```

### B. Keyboard Shortcuts

#### Global Keyboard Shortcuts
```typescript
const KEYBOARD_SHORTCUTS = {
  'ctrl+/' : 'Show help',
  'ctrl+s' : 'Save current state',
  'ctrl+z' : 'Undo last action',
  'ctrl+shift+z' : 'Redo last action',
  'escape' : 'Close modal/cancel action',
  'ctrl+enter' : 'Generate AI content',
  'ctrl+c' : 'Copy prompt to clipboard',
  'f1' : 'Show accessibility options'
} as const;

const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.altKey && 'alt',
        e.metaKey && 'meta',
        e.key.toLowerCase()
      ].filter(Boolean).join('+');
      
      switch (key) {
        case 'ctrl+/':
          e.preventDefault();
          showHelpModal();
          break;
          
        case 'ctrl+s':
          e.preventDefault();
          saveCurrentState();
          break;
          
        case 'ctrl+enter':
          e.preventDefault();
          generateAIContent();
          break;
          
        case 'escape':
          e.preventDefault();
          closeActiveModal();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

## 4. Visual Design Accessibility

### A. Color and Contrast

#### High Contrast Mode Support
```css
/* High contrast mode detection and styles */
@media (prefers-contrast: high) {
  :root {
    --nm-text-primary: #000000;
    --nm-text-secondary: #333333;
    --nm-background: #ffffff;
    --nm-surface: #f8f9fa;
    --nm-border: #000000;
    --nm-shadow-dark: #000000;
    --nm-shadow-light: #ffffff;
  }
  
  .nm-card {
    border: 2px solid var(--nm-border);
    box-shadow: none;
  }
  
  .option-card--selected {
    background: #0066cc;
    color: #ffffff;
    border: 3px solid #000000;
  }
  
  .nm-button {
    border: 2px solid #000000;
    box-shadow: none;
  }
}

/* Forced colors mode (Windows High Contrast) */
@media (forced-colors: active) {
  .nm-card {
    border: 1px solid ButtonText;
    background: ButtonFace;
  }
  
  .option-card--selected {
    background: Highlight;
    color: HighlightText;
    border: 2px solid HighlightText;
  }
  
  .nm-button {
    border: 1px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
  }
  
  .nm-button:hover {
    background: Highlight;
    color: HighlightText;
  }
}
```

#### Dynamic Color Adjustment
```typescript
const useColorAccessibility = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [forcedColors, setForcedColors] = useState(false);
  
  useEffect(() => {
    // Detect high contrast preference
    const highContrastMedia = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(highContrastMedia.matches);
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    
    highContrastMedia.addEventListener('change', handleHighContrastChange);
    
    // Detect forced colors mode
    const forcedColorsMedia = window.matchMedia('(forced-colors: active)');
    setForcedColors(forcedColorsMedia.matches);
    
    const handleForcedColorsChange = (e: MediaQueryListEvent) => {
      setForcedColors(e.matches);
    };
    
    forcedColorsMedia.addEventListener('change', handleForcedColorsChange);
    
    return () => {
      highContrastMedia.removeEventListener('change', handleHighContrastChange);
      forcedColorsMedia.removeEventListener('change', handleForcedColorsChange);
    };
  }, []);
  
  return {
    highContrast,
    forcedColors,
    getAccessibleColors: (baseColors: ColorPalette) => {
      if (forcedColors) {
        return SYSTEM_COLORS;
      }
      if (highContrast) {
        return HIGH_CONTRAST_COLORS;
      }
      return baseColors;
    }
  };
};
```

### B. Motion and Animation Accessibility

#### Reduced Motion Support
```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .progressive-section {
    transition: none;
  }
  
  .floating-prompt-builder {
    transition: none;
  }
  
  .option-card {
    transform: none !important;
  }
}
```

#### Safe Animation Implementation
```typescript
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const getMotionConfig = useCallback((motion: MotionConfig) => {
    if (prefersReducedMotion) {
      return {
        ...motion,
        duration: 0.01,
        type: 'tween',
        ease: 'linear'
      };
    }
    return motion;
  }, [prefersReducedMotion]);
  
  return { prefersReducedMotion, getMotionConfig };
};
```

## 5. Testing and Validation

### A. Automated Accessibility Testing
```typescript
// Jest test example for accessibility
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CarmenWorkshop } from '../CarmenWorkshop';

expect.extend(toHaveNoViolations);

describe('Carmen Workshop Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<CarmenWorkshop />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should support keyboard navigation', () => {
    render(<CarmenWorkshop />);
    
    // Test tab navigation
    userEvent.tab();
    expect(screen.getByRole('button', { name: /team size/i })).toHaveFocus();
    
    // Test arrow key navigation in option groups
    userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: /small team/i })).toHaveFocus();
  });
  
  it('should announce dynamic content changes', async () => {
    render(<CarmenWorkshop />);
    
    // Select an option
    const option = screen.getByRole('button', { name: /small team/i });
    userEvent.click(option);
    
    // Check for live region announcement
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('1 options selected');
    });
  });
});
```

### B. Manual Testing Checklist

#### Screen Reader Testing
- [ ] **NVDA (Windows)**: Navigate entire workshop with NVDA
- [ ] **VoiceOver (macOS/iOS)**: Test on Safari with VoiceOver
- [ ] **TalkBack (Android)**: Test mobile experience with TalkBack
- [ ] **JAWS (Windows)**: Verify compatibility with JAWS

#### Keyboard Testing
- [ ] **Tab Navigation**: All interactive elements reachable via Tab
- [ ] **Focus Indicators**: Clear focus indicators on all elements
- [ ] **Skip Links**: Bypass navigation to main content
- [ ] **Keyboard Shortcuts**: All shortcuts work as documented

#### Motor Accessibility Testing
- [ ] **Large Touch Targets**: All targets minimum 44px
- [ ] **Click/Tap Areas**: No accidental activation
- [ ] **Drag Operations**: Alternative keyboard methods available
- [ ] **Time Limits**: No time-sensitive interactions

#### Visual Accessibility Testing
- [ ] **Color Contrast**: All text meets 4.5:1 ratio minimum
- [ ] **Color Independence**: Information not conveyed by color alone
- [ ] **Zoom Support**: Usable at 200% zoom
- [ ] **High Contrast**: Compatible with high contrast modes

## 6. Implementation Priorities

### Phase 1: Foundation (Week 1)
1. **Semantic HTML Structure**
   - Proper heading hierarchy
   - ARIA landmarks and regions
   - Form labeling and associations

2. **Basic Keyboard Support**
   - Tab navigation
   - Focus management
   - Escape key handling

### Phase 2: Enhanced Interaction (Week 2)
3. **Touch Optimization**
   - Touch target sizing
   - Gesture recognition
   - Haptic feedback

4. **Screen Reader Enhancement**
   - Live regions
   - Dynamic content announcements
   - State change communication

### Phase 3: Advanced Features (Week 3)
5. **Advanced Keyboard Navigation**
   - Roving tab index
   - Keyboard shortcuts
   - Focus trapping

6. **Visual Accessibility**
   - High contrast support
   - Reduced motion compliance
   - Color accessibility

### Phase 4: Testing and Refinement (Week 4)
7. **Comprehensive Testing**
   - Automated accessibility testing
   - Manual testing with assistive technologies
   - User testing with disabled users

8. **Performance Optimization**
   - Ensure accessibility features don't impact performance
   - Optimize for assistive technology compatibility

This comprehensive accessibility framework ensures that the Carmen workshop interface is usable by all users, regardless of their abilities or the technologies they use to access the web.