import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MayaTemplateLibraryBuilder from '../MayaTemplateLibraryBuilder';
import { AuthContext, AuthProvider } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/utils/supabaseIcons', () => ({
  getAnimationUrl: vi.fn((filename) => `mock-animation-${filename}`)
}));

vi.mock('@/components/navigation/MicroLessonNavigator', () => ({
  MicroLessonNavigator: ({ progress }: { progress: number }) => 
    <div data-testid="micro-lesson-navigator" data-progress={progress}>Navigator</div>
}));

vi.mock('@/components/lesson/chat/lyra/maya/NarrativeManager', () => ({
  default: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="narrative-manager">
      <button onClick={onComplete} data-testid="narrative-complete">Complete Narrative</button>
    </div>
  )
}));

vi.mock('@/components/ui/VideoAnimation', () => ({
  default: ({ fallbackIcon, context }: { fallbackIcon: React.ReactNode; context: string }) => (
    <div data-testid="video-animation" data-context={context}>
      {fallbackIcon}
    </div>
  )
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
});

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com'
};

const mockAuthContext = {
  user: mockUser,
  signIn: vi.fn(),
  signOut: vi.fn(),
  loading: false
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('MayaTemplateLibraryBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render intro phase by default', () => {
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      expect(screen.getByText("Maya's Template Library Builder")).toBeInTheDocument();
      expect(screen.getByText("Create reusable email templates for organizational efficiency")).toBeInTheDocument();
      expect(screen.getByText("Begin Maya's Template Journey")).toBeInTheDocument();
    });

    it('should display all three journey steps in intro', () => {
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      expect(screen.getByText("Maya's Template Crisis")).toBeInTheDocument();
      expect(screen.getByText("Discover Template Power")).toBeInTheDocument();
      expect(screen.getByText("Maya's Template Success")).toBeInTheDocument();
    });

    it('should render Maya avatar with correct animation', () => {
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      const avatars = screen.getAllByTestId('video-animation');
      expect(avatars.length).toBeGreaterThan(0);
      expect(avatars[0]).toHaveAttribute('data-context', 'character');
    });
  });

  describe('Phase Navigation', () => {
    it('should navigate to narrative phase when begin button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      const beginButton = screen.getByText("Begin Maya's Template Journey");
      await user.click(beginButton);

      expect(screen.getByTestId('narrative-manager')).toBeInTheDocument();
      expect(screen.getByTestId('micro-lesson-navigator')).toBeInTheDocument();
    });

    it('should navigate to workshop phase after narrative completion', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to narrative phase
      const beginButton = screen.getByText("Begin Maya's Template Journey");
      await user.click(beginButton);

      // Complete narrative
      const completeButton = screen.getByTestId('narrative-complete');
      await user.click(completeButton);

      expect(screen.getByText('Template Builder')).toBeInTheDocument();
      expect(screen.getByText('Your Template Library')).toBeInTheDocument();
    });

    it('should update progress correctly through phases', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to narrative (should be 33% progress)
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      let navigator = screen.getByTestId('micro-lesson-navigator');
      expect(navigator).toHaveAttribute('data-progress', '33');

      // Navigate to workshop (should be 66%+ progress)
      await user.click(screen.getByTestId('narrative-complete'));
      navigator = screen.getByTestId('micro-lesson-navigator');
      const progress = parseInt(navigator.getAttribute('data-progress') || '0');
      expect(progress).toBeGreaterThanOrEqual(66);
    });
  });

  describe('Template Categories', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to workshop phase
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));
    });

    it('should display all template categories', () => {
      expect(screen.getByText('Donor Thank You')).toBeInTheDocument();
      expect(screen.getByText('Volunteer Recruitment')).toBeInTheDocument();
      expect(screen.getByText('Program Updates')).toBeInTheDocument();
      expect(screen.getByText('Crisis Communication')).toBeInTheDocument();
    });

    it('should allow category selection', async () => {
      const user = userEvent.setup();
      
      // Click select dropdown
      const selectTrigger = screen.getByRole('combobox');
      await user.click(selectTrigger);

      // Select a category
      const donorOption = screen.getByText('Donor Thank You');
      await user.click(donorOption);

      // Generate button should be enabled
      const generateButton = screen.getByText(/Generate Template with Maya's AI/);
      expect(generateButton).not.toBeDisabled();
    });
  });

  describe('Template Generation', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to workshop phase
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));

      // Select a category
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Donor Thank You'));
    });

    it('should generate template successfully', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        content: 'Dear [FIRST_NAME],\n\nThank you for your generous donation of [AMOUNT]!'
      };

      (supabase.functions.invoke as any).mockResolvedValue({
        data: mockResponse,
        error: null
      });

      const generateButton = screen.getByText(/Generate Template with Maya's AI/);
      await user.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText('Donor Thank You Template')).toBeInTheDocument();
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-character-content', {
        body: {
          characterType: 'maya',
          contentType: 'email',
          topic: 'Donor Thank You template for nonprofit organization',
          context: expect.stringContaining('Maya Rodriguez'),
          targetAudience: 'nonprofit development professionals'
        }
      });
    });

    it('should show loading state during generation', async () => {
      const user = userEvent.setup();
      
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const controlledPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (supabase.functions.invoke as any).mockReturnValue(controlledPromise);

      const generateButton = screen.getByText(/Generate Template with Maya's AI/);
      await user.click(generateButton);

      // Should show loading state
      expect(screen.getByText('Maya is creating your template...')).toBeInTheDocument();
      expect(generateButton).toBeDisabled();

      // Resolve the promise
      act(() => {
        resolvePromise!({ data: { content: 'Test template' }, error: null });
      });
    });

    it('should handle generation errors gracefully', async () => {
      const user = userEvent.setup();
      const mockToast = vi.fn();
      
      vi.mocked(require('@/hooks/use-toast').useToast).mockReturnValue({
        toast: mockToast
      });

      (supabase.functions.invoke as any).mockRejectedValue(new Error('Generation failed'));

      const generateButton = screen.getByText(/Generate Template with Maya's AI/);
      await user.click(generateButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Generation Failed",
          description: "Unable to generate template. Please try again.",
          variant: "destructive"
        });
      });
    });
  });

  describe('Template Management', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to workshop and generate a template
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Donor Thank You'));

      (supabase.functions.invoke as any).mockResolvedValue({
        data: { content: 'Test template content' },
        error: null
      });

      await user.click(screen.getByText(/Generate Template with Maya's AI/));
      await waitFor(() => {
        expect(screen.getByText('Donor Thank You Template')).toBeInTheDocument();
      });
    });

    it('should display generated templates in library', () => {
      expect(screen.getByText('Donor Thank You Template')).toBeInTheDocument();
      expect(screen.getByText('Test template content')).toBeInTheDocument();
    });

    it('should copy template to clipboard', async () => {
      const user = userEvent.setup();
      const mockToast = vi.fn();
      
      vi.mocked(require('@/hooks/use-toast').useToast).mockReturnValue({
        toast: mockToast
      });

      const copyButton = screen.getByText(/Copy/);
      await user.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test template content');
      expect(mockToast).toHaveBeenCalledWith({
        title: "Template Copied!",
        description: "Template copied to clipboard."
      });
    });

    it('should handle clipboard copy errors', async () => {
      const user = userEvent.setup();
      const mockToast = vi.fn();
      
      vi.mocked(require('@/hooks/use-toast').useToast).mockReturnValue({
        toast: mockToast
      });

      (navigator.clipboard.writeText as any).mockRejectedValue(new Error('Copy failed'));

      const copyButton = screen.getByText(/Copy/);
      await user.click(copyButton);

      expect(mockToast).toHaveBeenCalledWith({
        title: "Copy Failed",
        description: "Unable to copy template.",
        variant: "destructive"
      });
    });

    it('should show completion button after templates are generated', () => {
      expect(screen.getByText('Complete Template Library Workshop')).toBeInTheDocument();
    });
  });

  describe('Custom Template Editor', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to workshop phase
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));
    });

    it('should allow custom template creation', async () => {
      const user = userEvent.setup();
      
      const textarea = screen.getByPlaceholderText(/Write your template here/);
      await user.type(textarea, 'Custom template with [MERGE_FIELD]');

      expect(textarea).toHaveValue('Custom template with [MERGE_FIELD]');
    });

    it('should provide merge field guidance', () => {
      const textarea = screen.getByPlaceholderText(/Write your template here/);
      expect(textarea.getAttribute('placeholder')).toContain('[MERGE_FIELDS]');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      const beginButton = screen.getByRole('button', { name: /Begin Maya's Template Journey/ });
      expect(beginButton).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      const beginButton = screen.getByText("Begin Maya's Template Journey");
      beginButton.focus();
      expect(beginButton).toHaveFocus();

      fireEvent.keyDown(beginButton, { key: 'Enter' });
      expect(screen.getByTestId('narrative-manager')).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent("Maya's Template Library Builder");
    });
  });

  describe('Responsive Design', () => {
    it('should render properly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      expect(screen.getByText("Maya's Template Library Builder")).toBeInTheDocument();
    });

    it('should handle grid layout responsively', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to workshop to see the grid layout
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));

      // Grid should be present
      const templateBuilder = screen.getByText('Template Builder');
      const templateLibrary = screen.getByText('Your Template Library');
      
      expect(templateBuilder).toBeInTheDocument();
      expect(templateLibrary).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render within acceptable time limits', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle multiple template generations efficiently', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to workshop
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));

      (supabase.functions.invoke as any).mockResolvedValue({
        data: { content: 'Template content' },
        error: null
      });

      // Generate multiple templates quickly
      const categories = ['Donor Thank You', 'Volunteer Recruitment', 'Program Updates'];
      
      for (const category of categories) {
        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText(category));
        await user.click(screen.getByText(/Generate Template with Maya's AI/));
        
        await waitFor(() => {
          expect(screen.getByText(`${category} Template`)).toBeInTheDocument();
        });
      }

      // All templates should be visible
      expect(screen.getAllByText(/Template/).length).toBeGreaterThan(3);
    });
  });

  describe('Integration with MayaTemplateLibraryBuilder', () => {
    it('should integrate with NarrativeManager correctly', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      await user.click(screen.getByText("Begin Maya's Template Journey"));
      
      const narrativeManager = screen.getByTestId('narrative-manager');
      expect(narrativeManager).toBeInTheDocument();
    });

    it('should integrate with MicroLessonNavigator correctly', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      await user.click(screen.getByText("Begin Maya's Template Journey"));
      
      const navigator = screen.getByTestId('micro-lesson-navigator');
      expect(navigator).toBeInTheDocument();
      expect(navigator).toHaveAttribute('data-progress', '33');
    });
  });
});