import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UseInSuggestions } from '../UseInSuggestions';
import { componentIntegrationService } from '@/services/componentIntegrationService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('sonner');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));
jest.mock('@/services/componentIntegrationService', () => ({
  componentIntegrationService: {
    getSuggestions: jest.fn(),
    shareContent: jest.fn(),
    getSharedContent: jest.fn(),
    hasSharedContent: jest.fn(),
    transformContent: jest.fn(),
    getIntegrationHistory: jest.fn(),
    getMostUsedIntegrations: jest.fn(),
    clearAllSharedContent: jest.fn()
  }
}));

describe('UseInSuggestions Component', () => {
  const mockNavigate = jest.fn();
  const mockToastSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (toast.success as jest.Mock) = mockToastSuccess;
  });

  const defaultProps = {
    content: { message: 'Test email content', subject: 'Test Subject' },
    contentType: 'email' as const,
    fromCharacter: 'Maya',
    componentType: 'maya-email'
  };

  describe('Normal Click Flow', () => {
    it('handles suggestion click correctly', async () => {
      const suggestions = [
        {
          toComponent: 'David Data Visualizer',
          benefit: 'Add data-driven insights to emails',
          fromComponent: 'maya-email',
          description: 'Share with David Data Visualizer'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      render(<UseInSuggestions {...defaultProps} />);

      const button = screen.getByText('David Data Visualizer');
      expect(button).toBeInTheDocument();

      fireEvent.click(button);

      await waitFor(() => {
        expect(componentIntegrationService.shareContent).toHaveBeenCalledWith({
          data: defaultProps.content,
          fromCharacter: 'Maya',
          toComponent: 'David Data Visualizer',
          timestamp: expect.any(String),
          type: 'email'
        });

        expect(mockToastSuccess).toHaveBeenCalledWith(
          'Content ready for David Data Visualizer',
          expect.objectContaining({
            description: 'Add data-driven insights to emails'
          })
        );
      });
    });

    it('displays maximum 3 suggestions', () => {
      const manySuggestions = [
        { toComponent: 'Component 1', benefit: 'Benefit 1', fromComponent: 'maya-email', description: 'Desc 1' },
        { toComponent: 'Component 2', benefit: 'Benefit 2', fromComponent: 'maya-email', description: 'Desc 2' },
        { toComponent: 'Component 3', benefit: 'Benefit 3', fromComponent: 'maya-email', description: 'Desc 3' },
        { toComponent: 'Component 4', benefit: 'Benefit 4', fromComponent: 'maya-email', description: 'Desc 4' },
        { toComponent: 'Component 5', benefit: 'Benefit 5', fromComponent: 'maya-email', description: 'Desc 5' }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(manySuggestions);

      render(<UseInSuggestions {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      expect(screen.getByText('Component 1')).toBeInTheDocument();
      expect(screen.getByText('Component 2')).toBeInTheDocument();
      expect(screen.getByText('Component 3')).toBeInTheDocument();
      expect(screen.queryByText('Component 4')).not.toBeInTheDocument();
    });

    it('handles navigation when route is provided', async () => {
      const suggestionWithRoute = [
        {
          toComponent: 'David Analytics',
          benefit: 'Support proposals with data',
          route: '/analytics/dashboard',
          fromComponent: 'maya-email',
          description: 'Navigate to analytics'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestionWithRoute);

      render(<UseInSuggestions {...defaultProps} />);

      const button = screen.getByText('David Analytics');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith(
          'Content ready for David Analytics',
          expect.objectContaining({
            description: 'Support proposals with data',
            action: {
              label: 'Go there',
              onClick: expect.any(Function)
            }
          })
        );
      });

      // Simulate clicking the toast action
      const toastCall = mockToastSuccess.mock.calls[0];
      const toastOptions = toastCall[1];
      toastOptions.action.onClick();

      expect(mockNavigate).toHaveBeenCalledWith('/analytics/dashboard');
    });
  });

  describe('Edge Cases', () => {
    it('returns null when no suggestions available', () => {
      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue([]);

      const { container } = render(<UseInSuggestions {...defaultProps} />);
      expect(container.firstChild).toBeNull();
    });

    it('handles null content gracefully', async () => {
      const suggestions = [
        {
          toComponent: 'Test Component',
          benefit: 'Test benefit',
          fromComponent: 'maya-email',
          description: 'Test'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      render(<UseInSuggestions {...defaultProps} content={null} />);

      const button = screen.getByText('Test Component');
      fireEvent.click(button);

      await waitFor(() => {
        expect(componentIntegrationService.shareContent).toHaveBeenCalledWith({
          data: null,
          fromCharacter: 'Maya',
          toComponent: 'Test Component',
          timestamp: expect.any(String),
          type: 'email'
        });
      });
    });

    it('handles undefined content', async () => {
      const suggestions = [
        {
          toComponent: 'Test Component',
          benefit: 'Test benefit',
          fromComponent: 'maya-email',
          description: 'Test'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      render(<UseInSuggestions {...defaultProps} content={undefined} />);

      const button = screen.getByText('Test Component');
      fireEvent.click(button);

      await waitFor(() => {
        expect(componentIntegrationService.shareContent).toHaveBeenCalledWith({
          data: undefined,
          fromCharacter: 'Maya',
          toComponent: 'Test Component',
          timestamp: expect.any(String),
          type: 'email'
        });
      });
    });

    it('handles unknown component type', () => {
      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue([]);

      const { container } = render(
        <UseInSuggestions {...defaultProps} componentType="unknown-type" />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('UI Behavior', () => {
    it('displays benefit text correctly', () => {
      const suggestions = [
        {
          toComponent: 'Sofia Story Creator',
          benefit: 'Enhance emails with compelling narratives',
          fromComponent: 'maya-email',
          description: 'Share with Sofia'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      render(<UseInSuggestions {...defaultProps} />);

      expect(screen.getByText('Enhance emails with compelling narratives')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const suggestions = [
        {
          toComponent: 'Test',
          benefit: 'Test',
          fromComponent: 'maya-email',
          description: 'Test'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      const { container } = render(
        <UseInSuggestions {...defaultProps} className="custom-class" />
      );

      const card = container.querySelector('.custom-class');
      expect(card).toBeInTheDocument();
    });

    it('renders icons correctly', () => {
      const suggestions = [
        {
          toComponent: 'Test',
          benefit: 'Test',
          fromComponent: 'maya-email',
          description: 'Test'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      render(<UseInSuggestions {...defaultProps} />);

      // Check for Sparkles icons (one in header, one per button)
      const sparklesIcons = screen.getAllByTestId('sparkles-icon');
      expect(sparklesIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('handles multiple rapid clicks', async () => {
      const suggestions = [
        {
          toComponent: 'Component 1',
          benefit: 'Benefit 1',
          fromComponent: 'maya-email',
          description: 'Desc 1'
        },
        {
          toComponent: 'Component 2',
          benefit: 'Benefit 2',
          fromComponent: 'maya-email',
          description: 'Desc 2'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      render(<UseInSuggestions {...defaultProps} />);

      const button1 = screen.getByText('Component 1');
      const button2 = screen.getByText('Component 2');

      // Rapid clicks
      fireEvent.click(button1);
      fireEvent.click(button2);
      fireEvent.click(button1);

      await waitFor(() => {
        expect(componentIntegrationService.shareContent).toHaveBeenCalledTimes(3);
        expect(mockToastSuccess).toHaveBeenCalledTimes(3);
      });
    });

    it('handles large content objects', async () => {
      const largeContent = {
        data: 'x'.repeat(100000), // 100KB of data
        nested: {
          array: new Array(1000).fill({ item: 'test' })
        }
      };

      const suggestions = [
        {
          toComponent: 'Test Component',
          benefit: 'Test benefit',
          fromComponent: 'maya-email',
          description: 'Test'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      render(<UseInSuggestions {...defaultProps} content={largeContent} />);

      const button = screen.getByText('Test Component');
      fireEvent.click(button);

      await waitFor(() => {
        expect(componentIntegrationService.shareContent).toHaveBeenCalledWith({
          data: largeContent,
          fromCharacter: 'Maya',
          toComponent: 'Test Component',
          timestamp: expect.any(String),
          type: 'email'
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('continues to function when shareContent fails', async () => {
      const suggestions = [
        {
          toComponent: 'Test Component',
          benefit: 'Test benefit',
          fromComponent: 'maya-email',
          description: 'Test'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);
      (componentIntegrationService.shareContent as jest.Mock).mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });

      render(<UseInSuggestions {...defaultProps} />);

      const button = screen.getByText('Test Component');
      
      // Should not throw
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('handles navigation errors gracefully', async () => {
      const suggestionWithRoute = [
        {
          toComponent: 'Test Component',
          benefit: 'Test benefit',
          route: '/test/route',
          fromComponent: 'maya-email',
          description: 'Test'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestionWithRoute);
      mockNavigate.mockImplementation(() => {
        throw new Error('Navigation failed');
      });

      render(<UseInSuggestions {...defaultProps} />);

      const button = screen.getByText('Test Component');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalled();
      });

      const toastCall = mockToastSuccess.mock.calls[0];
      const toastOptions = toastCall[1];
      
      // Should not throw when navigation fails
      expect(() => toastOptions.action.onClick()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('buttons are keyboard accessible', () => {
      const suggestions = [
        {
          toComponent: 'Test Component',
          benefit: 'Test benefit',
          fromComponent: 'maya-email',
          description: 'Test'
        }
      ];

      (componentIntegrationService.getSuggestions as jest.Mock).mockReturnValue(suggestions);

      render(<UseInSuggestions {...defaultProps} />);

      const button = screen.getByText('Test Component');
      
      // Check button is focusable
      button.focus();
      expect(document.activeElement).toBe(button);
      
      // Simulate Enter key press
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      
      waitFor(() => {
        expect(componentIntegrationService.shareContent).toHaveBeenCalled();
      });
    });
  });
});