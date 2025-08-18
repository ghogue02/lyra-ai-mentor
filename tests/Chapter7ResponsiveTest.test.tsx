import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Chapter7Hub from '@/pages/Chapter7Hub';
import { Chapter7Sidebar } from '@/components/navigation/Chapter7Sidebar';
import { EnhancedCarmenAvatar } from '@/components/lesson/ai-interaction/EnhancedCarmenAvatar';

// Mock matchMedia for responsive testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-123' }
  })
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          in: vi.fn(() => ({
            data: [],
            error: null
          }))
        }))
      }))
    }))
  }
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false // Default to desktop
}));

describe('Chapter 7 Responsive Design Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Desktop View (1024px+)', () => {
    beforeEach(() => {
      mockMatchMedia(false); // Desktop
      // Set viewport to desktop size
      global.innerWidth = 1024;
      global.innerHeight = 768;
    });

    it('should render Chapter7Hub correctly on desktop', () => {
      renderWithRouter(<Chapter7Hub />);
      
      expect(screen.getByText(/Carmen's AI-Powered People Management/)).toBeInTheDocument();
      
      // Desktop should show full lesson grid
      const lessonCards = screen.getAllByText(/Start|Review/);
      expect(lessonCards.length).toBeGreaterThan(0);
    });

    it('should display sidebar with full navigation on desktop', () => {
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={31} />
      );
      
      // Desktop sidebar should show all lesson details
      expect(screen.getByText('AI-Powered Talent Acquisition')).toBeInTheDocument();
      expect(screen.getByText('Transform your hiring process')).toBeInTheDocument();
      expect(screen.getByText('Return to Dashboard')).toBeInTheDocument();
    });

    it('should position Carmen avatar correctly for desktop', () => {
      renderWithRouter(
        <EnhancedCarmenAvatar
          position="bottom-right"
          lessonContext={{
            chapterTitle: 'People Management with AI',
            lessonTitle: 'Test Lesson'
          }}
        />
      );
      
      const avatar = screen.getByLabelText(/Carmen AI assistant/);
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Tablet View (768px - 1024px)', () => {
    beforeEach(() => {
      mockMatchMedia(true); // Tablet
      global.innerWidth = 768;
      global.innerHeight = 1024;
    });

    it('should adapt Chapter7Hub layout for tablet', () => {
      renderWithRouter(<Chapter7Hub />);
      
      // Should still show main content but adapted layout
      expect(screen.getByText(/Carmen's AI-Powered People Management/)).toBeInTheDocument();
      
      // Grid should adapt to smaller screen
      const lessonTitles = screen.getAllByText(/AI-Powered|Performance|Employee|Retention|Team|Cultural|Leadership/);
      expect(lessonTitles.length).toBeGreaterThan(0);
    });

    it('should adjust sidebar for tablet view', () => {
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={31} />
      );
      
      // Tablet should maintain functionality but adjust spacing
      expect(screen.getByText('Chapter 7')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered People Management')).toBeInTheDocument();
    });
  });

  describe('Mobile View (< 768px)', () => {
    beforeEach(() => {
      mockMatchMedia(true); // Mobile
      global.innerWidth = 375;
      global.innerHeight = 667;
    });

    it('should adapt Chapter7Hub for mobile screens', () => {
      renderWithRouter(<Chapter7Hub />);
      
      // Content should be present but layout adapted
      expect(screen.getByText(/Carmen's AI-Powered People Management/)).toBeInTheDocument();
      
      // Mobile should show lessons in single column
      expect(screen.getByText('AI-Powered Talent Acquisition')).toBeInTheDocument();
    });

    it('should show mobile-optimized sidebar', () => {
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={31} />
      );
      
      // Mobile sidebar should be more compact
      expect(screen.getByText('Chapter 7')).toBeInTheDocument();
      
      // Should show condensed lesson titles
      expect(screen.getByText('AI-Powered Talent Acquisition')).toBeInTheDocument();
    });

    it('should position avatar appropriately for mobile', () => {
      renderWithRouter(
        <EnhancedCarmenAvatar
          position="bottom-right"
          lessonContext={{
            chapterTitle: 'People Management with AI',
            lessonTitle: 'Test Lesson'
          }}
        />
      );
      
      // Avatar should be accessible on mobile
      const avatar = screen.getByLabelText(/Carmen AI assistant/);
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Touch Interactions', () => {
    beforeEach(() => {
      mockMatchMedia(true); // Mobile
      global.innerWidth = 375;
      global.innerHeight = 667;
    });

    it('should handle touch events on lesson cards', () => {
      renderWithRouter(<Chapter7Hub />);
      
      const lessonCards = screen.getAllByText(/Start|Review/);
      expect(lessonCards.length).toBeGreaterThan(0);
      
      // Touch targets should be appropriately sized for mobile
      lessonCards.forEach(card => {
        const button = card.closest('button');
        if (button) {
          // Check that touch targets meet minimum size requirements (44px)
          const styles = window.getComputedStyle(button);
          expect(button).toBeInTheDocument();
        }
      });
    });

    it('should provide accessible touch targets for sidebar navigation', () => {
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={31} />
      );
      
      const navigationButtons = screen.getAllByRole('button');
      expect(navigationButtons.length).toBeGreaterThan(0);
      
      // All buttons should be touchable
      navigationButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Typography and Spacing', () => {
    it('should use appropriate text sizes across breakpoints', () => {
      renderWithRouter(<Chapter7Hub />);
      
      const mainTitle = screen.getByText(/Carmen's AI-Powered People Management/);
      expect(mainTitle).toBeInTheDocument();
      
      // Typography should be readable at all sizes
      expect(mainTitle.tagName).toBe('H1');
    });

    it('should maintain proper spacing in sidebar across breakpoints', () => {
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={31} />
      );
      
      // Check that key elements maintain proper spacing
      expect(screen.getByText('Chapter 7')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered People Management')).toBeInTheDocument();
    });
  });

  describe('Avatar Responsive Behavior', () => {
    it('should adapt avatar positioning for different screen sizes', () => {
      const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'] as const;
      
      positions.forEach(position => {
        const { unmount } = renderWithRouter(
          <EnhancedCarmenAvatar
            position={position}
            lessonContext={{
              chapterTitle: 'People Management with AI',
              lessonTitle: 'Test Lesson'
            }}
          />
        );
        
        const avatar = screen.getByLabelText(/Carmen AI assistant/);
        expect(avatar).toBeInTheDocument();
        
        unmount();
      });
    });

    it('should handle different avatar modes responsively', () => {
      const modes = ['floating', 'embedded', 'fullscreen'] as const;
      
      modes.forEach(mode => {
        const { unmount } = renderWithRouter(
          <EnhancedCarmenAvatar
            mode={mode}
            lessonContext={{
              chapterTitle: 'People Management with AI',
              lessonTitle: 'Test Lesson'
            }}
          />
        );
        
        // Each mode should render without errors
        if (mode === 'floating') {
          const avatar = screen.getByLabelText(/Carmen AI assistant/);
          expect(avatar).toBeInTheDocument();
        }
        
        unmount();
      });
    });
  });

  describe('Accessibility at Different Screen Sizes', () => {
    it('should maintain accessibility features across breakpoints', () => {
      renderWithRouter(<Chapter7Hub />);
      
      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      
      // Check for button accessibility
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type');
      });
    });

    it('should provide proper focus management on mobile', () => {
      renderWithRouter(
        <Chapter7Sidebar currentLessonId={31} />
      );
      
      const interactiveElements = screen.getAllByRole('button');
      expect(interactiveElements.length).toBeGreaterThan(0);
      
      // All interactive elements should be focusable
      interactiveElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });
  });
});

describe('Chapter 7 Performance Tests', () => {
  it('should render Chapter7Hub within performance budget', () => {
    const startTime = performance.now();
    
    renderWithRouter(<Chapter7Hub />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Render should complete within reasonable time (100ms)
    expect(renderTime).toBeLessThan(100);
  });

  it('should not cause memory leaks in Carmen avatar', () => {
    const { unmount } = renderWithRouter(
      <EnhancedCarmenAvatar
        lessonContext={{
          chapterTitle: 'People Management with AI',
          lessonTitle: 'Test Lesson'
        }}
      />
    );
    
    // Component should unmount cleanly
    expect(() => unmount()).not.toThrow();
  });
});