import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { usePerformance, getCachedAssetUrl } from './PerformanceOptimizer';

interface AccessibilityConfig {
  enableScreenReader: boolean;
  enableKeyboardNavigation: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorBlindnessSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

class AccessibilityManager {
  private static instance: AccessibilityManager;
  private config: AccessibilityConfig;
  private listeners: Map<string, () => void> = new Map();

  private constructor() {
    this.config = {
      enableScreenReader: this.detectScreenReader(),
      enableKeyboardNavigation: true,
      enableHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      enableReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      fontSize: this.detectPreferredFontSize(),
      colorBlindnessSupport: 'none'
    };

    this.setupEventListeners();
  }

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  private detectScreenReader(): boolean {
    // Check for screen reader indicators
    return !!(
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.speechSynthesis ||
      document.querySelector('[aria-live]')
    );
  }

  private detectPreferredFontSize(): AccessibilityConfig['fontSize'] {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (rootFontSize >= 20) return 'extra-large';
    if (rootFontSize >= 18) return 'large';
    if (rootFontSize >= 16) return 'medium';
    return 'small';
  }

  private setupEventListeners(): void {
    // Listen for system preference changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.config.enableHighContrast = e.matches;
      this.notifyListeners();
    });

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.config.enableReducedMotion = e.matches;
      this.notifyListeners();
    });

    // Keyboard navigation detection
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.config.enableKeyboardNavigation = true;
        this.notifyListeners();
      }
    });
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...updates };
    this.notifyListeners();
  }

  subscribe(id: string, callback: () => void): () => void {
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  generateAriaLabel(context: string, description?: string, state?: string): string {
    let label = context;
    if (description) label += `, ${description}`;
    if (state) label += `, ${state}`;
    return label;
  }

  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Custom hooks for accessibility
export const useAccessibility = () => {
  const [config, setConfig] = React.useState(() => 
    AccessibilityManager.getInstance().getConfig()
  );

  React.useEffect(() => {
    const manager = AccessibilityManager.getInstance();
    const unsubscribe = manager.subscribe('hook', () => {
      setConfig(manager.getConfig());
    });

    return unsubscribe;
  }, []);

  const updateConfig = React.useCallback((updates: Partial<AccessibilityConfig>) => {
    AccessibilityManager.getInstance().updateConfig(updates);
  }, []);

  const announce = React.useCallback((message: string, priority?: 'polite' | 'assertive') => {
    AccessibilityManager.getInstance().announceToScreenReader(message, priority);
  }, []);

  const generateLabel = React.useCallback((context: string, description?: string, state?: string) => {
    return AccessibilityManager.getInstance().generateAriaLabel(context, description, state);
  }, []);

  return { config, updateConfig, announce, generateLabel };
};

// Enhanced Focus Management
export const useFocusManagement = () => {
  const focusableElements = React.useRef<HTMLElement[]>([]);
  const previousFocus = React.useRef<HTMLElement | null>(null);

  const trapFocus = React.useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    focusableElements.current = Array.from(
      container.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = focusableElements.current.indexOf(e.target as HTMLElement);
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + focusableElements.current.length) % focusableElements.current.length
          : (currentIndex + 1) % focusableElements.current.length;
        
        focusableElements.current[nextIndex]?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, []);

  const saveFocus = React.useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = React.useCallback(() => {
    previousFocus.current?.focus();
    previousFocus.current = null;
  }, []);

  return { trapFocus, saveFocus, restoreFocus };
};

// Accessible Animation Component
interface AccessibleAnimationProps {
  children: React.ReactNode;
  className?: string;
  reduceMotion?: boolean;
  ariaLabel?: string;
  role?: string;
}

export const AccessibleAnimation: React.FC<AccessibleAnimationProps> = memo(({
  children,
  className,
  reduceMotion,
  ariaLabel,
  role = 'img'
}) => {
  const { config } = useAccessibility();
  const shouldReduceMotion = reduceMotion ?? config.enableReducedMotion;

  const animationProps = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 }
      };
    }
    
    return {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3, ease: "easeOut" as const }
    };
  }, [shouldReduceMotion]);

  return (
    <motion.div
      {...animationProps}
      className={className}
      role={config.enableScreenReader ? role : undefined}
      aria-label={config.enableScreenReader ? ariaLabel : undefined}
      aria-hidden={!config.enableScreenReader}
    >
      {children}
    </motion.div>
  );
});

AccessibleAnimation.displayName = 'AccessibleAnimation';

// High Contrast Support Component
interface HighContrastWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const HighContrastWrapper: React.FC<HighContrastWrapperProps> = memo(({
  children,
  className
}) => {
  const { config } = useAccessibility();

  const highContrastStyles = useMemo(() => {
    if (!config.enableHighContrast) return '';
    
    return cn(
      'high-contrast',
      'border-2 border-current',
      'bg-background',
      'text-foreground'
    );
  }, [config.enableHighContrast]);

  return (
    <div className={cn(className, highContrastStyles)}>
      {children}
    </div>
  );
});

HighContrastWrapper.displayName = 'HighContrastWrapper';

// Skip Link Component
export const SkipLink: React.FC<{ targetId: string; text?: string }> = memo(({
  targetId,
  text = "Skip to main content"
}) => {
  const { config } = useAccessibility();

  if (!config.enableKeyboardNavigation) return null;

  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 font-medium"
      onFocus={() => AccessibilityManager.getInstance().announceToScreenReader('Skip link focused')}
    >
      {text}
    </a>
  );
});

SkipLink.displayName = 'SkipLink';

// Live Region for Dynamic Content
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
}> = memo(({ children, priority = 'polite', atomic = true }) => {
  const { config } = useAccessibility();

  if (!config.enableScreenReader) return <>{children}</>;

  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
});

LiveRegion.displayName = 'LiveRegion';

export { AccessibilityManager };