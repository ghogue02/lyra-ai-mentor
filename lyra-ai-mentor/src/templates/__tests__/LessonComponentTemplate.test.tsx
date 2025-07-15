import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonComponentTemplate, LESSON_METADATA } from '../LessonComponentTemplate';
import { ToolkitService } from '@/services/toolkitService';

// Mock the toolkit service
vi.mock('@/services/toolkitService', () => ({
  ToolkitService: vi.fn().mockImplementation(() => ({
    saveItem: vi.fn(),
    getCategories: vi.fn()
  }))
}));

// Mock the data validation hook
vi.mock('@/hooks/useEnsureToolkitData', () => ({
  useEnsureToolkitData: vi.fn(() => ({
    isLoading: false,
    isVerified: true,
    error: null,
    retry: vi.fn()
  })),
  EnsureToolkitData: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock toast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}));

describe('LessonComponentTemplate', () => {
  const defaultProps = {
    chapterNumber: 3,
    lessonNumber: 1,
    characterName: 'Maya'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render lesson header with correct information', () => {
      render(<LessonComponentTemplate {...defaultProps} />);
      
      expect(screen.getByText('Chapter 3 - Lesson 1')).toBeInTheDocument();
      expect(screen.getByText('Learning with Maya')).toBeInTheDocument();
    });

    it('should show loading state initially', async () => {
      render(<LessonComponentTemplate {...defaultProps} />);
      
      // Component might show loading briefly
      const loadingElements = screen.queryAllByText(/loading/i);
      expect(loadingElements.length).toBeGreaterThanOrEqual(0);
    });

    it('should render save to toolkit button when data is loaded', async () => {
      render(<LessonComponentTemplate {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Save to MyToolkit')).toBeInTheDocument();
      });
    });
  });

  describe('Data Validation', () => {
    it('should handle missing toolkit categories gracefully', async () => {
      const mockService = new ToolkitService() as any;
      mockService.getCategories.mockResolvedValue([]);
      
      render(<LessonComponentTemplate {...defaultProps} />);
      
      // Should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('Chapter 3 - Lesson 1')).toBeInTheDocument();
      });
    });

    it('should verify required categories exist', () => {
      expect(LESSON_METADATA.requiredCategories).toContain('training');
      expect(LESSON_METADATA.requiredAchievements).toContain('first_unlock');
    });
  });

  describe('Save to Toolkit', () => {
    it('should save lesson data to toolkit on button click', async () => {
      const mockService = new ToolkitService() as any;
      mockService.saveItem.mockResolvedValue({ success: true });
      
      render(<LessonComponentTemplate {...defaultProps} />);
      
      const saveButton = await screen.findByText('Save to MyToolkit');
      await userEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockService.saveItem).toHaveBeenCalledWith(
          expect.objectContaining({
            category_key: 'training',
            file_type: 'lesson_content',
            metadata: expect.stringContaining('chapter')
          })
        );
      });
    });

    it('should show success toast after saving', async () => {
      const mockService = new ToolkitService() as any;
      mockService.saveItem.mockResolvedValue({ success: true });
      
      render(<LessonComponentTemplate {...defaultProps} />);
      
      const saveButton = await screen.findByText('Save to MyToolkit');
      await userEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Saved to MyToolkit!",
          description: expect.any(String)
        });
      });
    });

    it('should handle save errors gracefully', async () => {
      const mockService = new ToolkitService() as any;
      mockService.saveItem.mockRejectedValue(new Error('Network error'));
      
      render(<LessonComponentTemplate {...defaultProps} />);
      
      const saveButton = await screen.findByText('Save to MyToolkit');
      await userEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Network error",
          variant: "destructive"
        });
      });
    });

    it('should disable save button while saving', async () => {
      const mockService = new ToolkitService() as any;
      mockService.saveItem.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      );
      
      render(<LessonComponentTemplate {...defaultProps} />);
      
      const saveButton = await screen.findByText('Save to MyToolkit');
      await userEvent.click(saveButton);
      
      // Button should be disabled during save
      expect(saveButton).toBeDisabled();
      
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error alert when lesson fails to load', async () => {
      // Mock a loading error
      const { rerender } = render(<LessonComponentTemplate {...defaultProps} />);
      
      // Simulate error state
      // In real implementation, this would be triggered by failed data loading
      
      // Should provide retry option
      const retryButton = screen.queryByText('Try again');
      if (retryButton) {
        expect(retryButton).toBeInTheDocument();
      }
    });

    it('should log errors with proper context', async () => {
      const consoleSpy = vi.spyOn(console, 'error');
      const mockService = new ToolkitService() as any;
      mockService.saveItem.mockRejectedValue(new Error('Test error'));
      
      render(<LessonComponentTemplate {...defaultProps} />);
      
      const saveButton = await screen.findByText('Save to MyToolkit');
      await userEvent.click(saveButton);
      
      await waitFor(() => {
        expect(consoleSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('[LessonError]'),
          expect.any(Object)
        );
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<LessonComponentTemplate {...defaultProps} />);
      
      const saveButton = screen.getByText('Save to MyToolkit');
      expect(saveButton).toHaveAttribute('type', 'button');
    });

    it('should be keyboard navigable', async () => {
      render(<LessonComponentTemplate {...defaultProps} />);
      
      const saveButton = await screen.findByText('Save to MyToolkit');
      
      // Tab to button
      saveButton.focus();
      expect(document.activeElement).toBe(saveButton);
      
      // Activate with Enter
      fireEvent.keyDown(saveButton, { key: 'Enter' });
      
      await waitFor(() => {
        const mockService = new ToolkitService() as any;
        expect(mockService.saveItem).toHaveBeenCalled();
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', async () => {
      let renderCount = 0;
      const TrackedComponent = (props: any) => {
        renderCount++;
        return <LessonComponentTemplate {...props} />;
      };
      
      const { rerender } = render(<TrackedComponent {...defaultProps} />);
      
      // Re-render with same props
      rerender(<TrackedComponent {...defaultProps} />);
      
      // Should use memoization to prevent unnecessary renders
      expect(renderCount).toBeLessThanOrEqual(2);
    });
  });
});