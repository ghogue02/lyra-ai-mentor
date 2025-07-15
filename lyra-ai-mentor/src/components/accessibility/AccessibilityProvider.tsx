// Accessibility Provider - WCAG 2.1 AA Compliance for Maya AI Platform
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AccessibilitySettings {
  // Visual Accessibility
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  
  // Motor Accessibility
  keyboardOnly: boolean;
  reducedClickTargets: boolean;
  stickyKeys: boolean;
  
  // Cognitive Accessibility
  simpleLanguage: boolean;
  extendedTimeouts: boolean;
  autoplayDisabled: boolean;
  
  // Auditory Accessibility
  soundEnabled: boolean;
  captionsEnabled: boolean;
  audioDescriptions: boolean;
  
  // Reading Assistance
  screenReader: boolean;
  readingSpeed: 'slow' | 'normal' | 'fast';
  skipToContent: boolean;
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  focusManagement: {
    trapFocus: (container: HTMLElement) => () => void;
    skipToMain: () => void;
    returnFocus: (element: HTMLElement) => void;
  };
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  colorBlindMode: 'none',
  keyboardOnly: false,
  reducedClickTargets: false,
  stickyKeys: false,
  simpleLanguage: false,
  extendedTimeouts: false,
  autoplayDisabled: false,
  soundEnabled: true,
  captionsEnabled: false,
  audioDescriptions: false,
  screenReader: false,
  readingSpeed: 'normal',
  skipToContent: true
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage or detect from system preferences
    const saved = localStorage.getItem('maya-accessibility-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }

    // Auto-detect accessibility preferences
    const detected = detectAccessibilityPreferences();
    return { ...defaultSettings, ...detected };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('maya-accessibility-settings', JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  // Screen reader announcements
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Focus management utilities
  const focusManagement = {
    trapFocus: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);
      firstFocusable?.focus();

      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    },

    skipToMain: () => {
      const mainContent = document.getElementById('main-content') || 
                         document.querySelector('main') ||
                         document.querySelector('[role="main"]');
      if (mainContent) {
        (mainContent as HTMLElement).focus();
        announceToScreenReader('Skipped to main content');
      }
    },

    returnFocus: (element: HTMLElement) => {
      if (element && element.focus) {
        element.focus();
      }
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    announceToScreenReader(`${key} setting ${value ? 'enabled' : 'disabled'}`);
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    announceToScreenReader,
    focusManagement
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Utility functions

function detectAccessibilityPreferences(): Partial<AccessibilitySettings> {
  const detected: Partial<AccessibilitySettings> = {};

  // Detect reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    detected.reducedMotion = true;
  }

  // Detect high contrast preference
  if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
    detected.highContrast = true;
  }

  // Detect screen reader (simplified detection)
  if (navigator.userAgent.includes('NVDA') || 
      navigator.userAgent.includes('JAWS') || 
      navigator.userAgent.includes('VoiceOver')) {
    detected.screenReader = true;
    detected.captionsEnabled = true;
  }

  return detected;
}

function applyAccessibilitySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;

  // Apply CSS custom properties for styling
  root.style.setProperty('--accessibility-high-contrast', settings.highContrast ? '1' : '0');
  root.style.setProperty('--accessibility-large-text', settings.largeText ? '1.25' : '1');
  root.style.setProperty('--accessibility-reduced-motion', settings.reducedMotion ? '1' : '0');

  // Apply color blind mode
  root.setAttribute('data-colorblind-mode', settings.colorBlindMode);

  // Apply motion preferences
  if (settings.reducedMotion) {
    root.style.setProperty('--animation-duration', '0ms');
    root.style.setProperty('--transition-duration', '0ms');
  } else {
    root.style.removeProperty('--animation-duration');
    root.style.removeProperty('--transition-duration');
  }

  // Apply text size
  if (settings.largeText) {
    root.classList.add('accessibility-large-text');
  } else {
    root.classList.remove('accessibility-large-text');
  }

  // Apply high contrast
  if (settings.highContrast) {
    root.classList.add('accessibility-high-contrast');
  } else {
    root.classList.remove('accessibility-high-contrast');
  }

  // Apply keyboard-only mode
  if (settings.keyboardOnly) {
    root.classList.add('accessibility-keyboard-only');
  } else {
    root.classList.remove('accessibility-keyboard-only');
  }
}

// Skip link component for keyboard navigation
export const SkipLink: React.FC = () => {
  const { focusManagement } = useAccessibility();

  return (
    <button
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-blue-600 text-white px-4 py-2 rounded-md z-50
                 focus:ring-2 focus:ring-blue-300"
      onClick={focusManagement.skipToMain}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          focusManagement.skipToMain();
        }
      }}
    >
      Skip to main content
    </button>
  );
};

// ARIA live region for announcements
export const LiveRegion: React.FC = () => {
  return (
    <>
      <div 
        id="accessibility-announcements-polite"
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />
      <div 
        id="accessibility-announcements-assertive"
        aria-live="assertive" 
        aria-atomic="true" 
        className="sr-only"
      />
    </>
  );
};

export default AccessibilityProvider;