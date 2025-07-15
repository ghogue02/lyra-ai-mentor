// Accessibility utilities for performance and UX

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Trap focus within an element (useful for modals)
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
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
  
  element.addEventListener('keydown', handleTabKey);
  firstFocusable?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

// Skip to main content link
export function createSkipLink(targetId: string = 'main-content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md';
  skipLink.textContent = 'Skip to main content';
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  return skipLink;
}

// Ensure color contrast meets WCAG standards
export function checkColorContrast(foreground: string, background: string): boolean {
  // Convert hex to RGB
  const getRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  // Calculate relative luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const { r, g, b } = rgb;
    const sRGB = [r, g, b].map(value => {
      value = value / 255;
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  const fg = getRGB(foreground);
  const bg = getRGB(background);
  
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  
  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  // WCAG AA standard requires 4.5:1 for normal text
  return contrast >= 4.5;
}

// Keyboard navigation helper
export class KeyboardNavigationHelper {
  private items: HTMLElement[];
  private currentIndex: number = 0;
  
  constructor(items: HTMLElement[]) {
    this.items = items;
  }
  
  handleKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        this.focusNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        this.focusPrevious();
        break;
      case 'Home':
        e.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        e.preventDefault();
        this.focusLast();
        break;
    }
  };
  
  private focusNext() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.items[this.currentIndex].focus();
  }
  
  private focusPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.items[this.currentIndex].focus();
  }
  
  private focusFirst() {
    this.currentIndex = 0;
    this.items[0].focus();
  }
  
  private focusLast() {
    this.currentIndex = this.items.length - 1;
    this.items[this.currentIndex].focus();
  }
  
  updateItems(items: HTMLElement[]) {
    this.items = items;
  }
  
  destroy() {
    // Cleanup if needed
  }
}

// Reduced motion preference
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// High contrast mode detection
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// Focus visible polyfill
export function applyFocusVisible() {
  try {
    document.querySelector(':focus-visible');
  } catch {
    // Focus-visible not supported, apply polyfill
    import('focus-visible');
  }
}

// ARIA live region manager
export class AriaLiveRegion {
  private region: HTMLElement;
  
  constructor(priority: 'polite' | 'assertive' = 'polite') {
    this.region = document.createElement('div');
    this.region.setAttribute('aria-live', priority);
    this.region.setAttribute('aria-atomic', 'true');
    this.region.className = 'sr-only';
    document.body.appendChild(this.region);
  }
  
  announce(message: string) {
    this.region.textContent = message;
    // Clear after announcement to allow repeated messages
    setTimeout(() => {
      this.region.textContent = '';
    }, 100);
  }
  
  destroy() {
    document.body.removeChild(this.region);
  }
}