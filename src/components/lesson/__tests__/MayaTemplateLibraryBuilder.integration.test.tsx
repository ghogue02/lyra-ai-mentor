import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MayaTemplateLibraryBuilder from '../MayaTemplateLibraryBuilder';
import { AuthProvider } from '@/contexts/AuthContext';
import TemplateContentFormatter from '@/utils/TemplateContentFormatter';

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
  default: ({ fallbackIcon }: { fallbackIcon: React.ReactNode }) => (
    <div data-testid="video-animation">{fallbackIcon}</div>
  )
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('MayaTemplateLibraryBuilder Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Template Content Formatting Integration', () => {
    it('should format generated template content correctly', async () => {
      const user = userEvent.setup();
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock AI-generated template content
      const mockTemplateContent = `# Thank You [FIRST_NAME]!

Dear [FIRST_NAME],

Thank you for your generous donation of [DONATION_AMOUNT]. Your support helps us serve the community.

**Your Impact:**
- Meals provided: [MEALS_COUNT]
- Families helped: [FAMILIES_COUNT]

Best regards,
The Hope Gardens Team`;

      (supabase.functions.invoke as any).mockResolvedValue({
        data: { content: mockTemplateContent },
        error: null
      });

      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate to workshop
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));

      // Select category and generate template
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Donor Thank You'));
      await user.click(screen.getByText(/Generate Template with Maya's AI/));

      await waitFor(() => {
        expect(screen.getByText('Donor Thank You Template')).toBeInTheDocument();
      });

      // Verify template content is displayed (unformatted for display)
      expect(screen.getByText(/Thank you for your generous donation/)).toBeInTheDocument();
    });

    it('should integrate TemplateContentFormatter with real content', () => {
      const rawContent = `Dear [DONOR_NAME],

Thank you for your **generous** contribution of [AMOUNT].

# Impact Report
Your donation has helped:
- Feed [MEALS_COUNT] families
- Provide shelter for [NIGHTS_COUNT] nights

*With gratitude,*
Maya Rodriguez`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent);

      // Verify all formatting features work together
      expect(formatted.mergeFields).toEqual(['DONOR_NAME', 'AMOUNT', 'MEALS_COUNT', 'NIGHTS_COUNT']);
      expect(formatted.content).toContain('<h1 class="text-2xl font-bold');
      expect(formatted.content).toContain('<strong class="font-semibold');
      expect(formatted.content).toContain('<em class="italic');
      expect(formatted.content).toContain('bg-purple-100'); // Merge field highlighting
      expect(formatted.estimatedReadTime).toBeGreaterThan(0);
      expect(formatted.accessibility.ariaLabel).toContain('Email template');
    });

    it('should handle all template categories with formatting', () => {
      const categories = [
        'donor-thankyou',
        'volunteer-recruitment', 
        'program-updates',
        'crisis-communication'
      ];

      categories.forEach(category => {
        const sampleContent = `# ${category.replace('-', ' ')} Template

Dear [RECIPIENT_NAME],

This is a **sample** template for ${category}.

Best regards,
Maya`;

        const formatted = TemplateContentFormatter.formatTemplateContent(sampleContent);
        
        expect(formatted.content).toBeDefined();
        expect(formatted.mergeFields).toContain('RECIPIENT_NAME');
        expect(formatted.estimatedReadTime).toBeGreaterThan(0);
      });
    });
  });

  describe('Copy Functionality with Formatting', () => {
    it('should copy formatted content as plain text', async () => {
      const user = userEvent.setup();
      const { supabase } = await import('@/integrations/supabase/client');

      const formattedContent = `<h1 class="text-2xl">Dear <span class="bg-purple-100">[FIRST_NAME]</span></h1>
<p class="mb-4">Thank you for your support!</p>`;

      (supabase.functions.invoke as any).mockResolvedValue({
        data: { content: formattedContent },
        error: null
      });

      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate and generate template
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Donor Thank You'));
      await user.click(screen.getByText(/Generate Template with Maya's AI/));

      await waitFor(() => {
        expect(screen.getByText(/Copy/)).toBeInTheDocument();
      });

      // Click copy button
      await user.click(screen.getByText(/Copy/));

      // Verify clipboard was called with the content
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(formattedContent);
    });

    it('should convert HTML to plain text for clipboard', () => {
      const htmlContent = `<h1>Dear <span class="highlight">[FIRST_NAME]</span></h1>
<p>Thank you &amp; goodbye!</p>`;

      const plainText = TemplateContentFormatter.toPlainText(htmlContent);
      
      expect(plainText).toBe('Dear [FIRST_NAME] Thank you & goodbye!');
    });
  });

  describe('Performance Integration Tests', () => {
    it('should handle large template generation efficiently', async () => {
      const user = userEvent.setup();
      const { supabase } = await import('@/integrations/supabase/client');

      // Create large template content
      const largeContent = `# Large Template for [ORGANIZATION_NAME]

${'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100)}

**Key Points:**
${Array.from({length: 50}, (_, i) => `- Point ${i + 1}: [MERGE_FIELD_${i + 1}]`).join('\n')}

Thank you [DONOR_NAME] for your continued support.`;

      (supabase.functions.invoke as any).mockResolvedValue({
        data: { content: largeContent },
        error: null
      });

      const startTime = performance.now();

      render(
        <TestWrapper>
          <MayaTemplateLibraryBuilder />
        </TestWrapper>
      );

      // Navigate and generate
      await user.click(screen.getByText("Begin Maya's Template Journey"));
      await user.click(screen.getByTestId('narrative-complete'));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Donor Thank You'));
      await user.click(screen.getByText(/Generate Template with Maya's AI/));

      await waitFor(() => {
        expect(screen.getByText('Donor Thank You Template')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete within reasonable time (5 seconds)
      expect(totalTime).toBeLessThan(5000);
    });

    it('should measure formatter performance accurately', () => {
      const content = 'Dear [FIRST_NAME], thank you for your [DONATION_AMOUNT] donation!';
      const metrics = TemplateContentFormatter.getPerformanceMetrics(content);

      expect(metrics.processingTime).toBeGreaterThanOrEqual(0);
      expect(metrics.contentSize).toBeGreaterThan(0);
      expect(metrics.compressionRatio).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Integration', () => {
    it('should provide comprehensive accessibility features', () => {
      const content = `# Welcome [USER_NAME]

## Program Updates

We are excited to share these updates:

- **New Initiative:** [INITIATIVE_NAME]
- **Impact:** [IMPACT_NUMBER] people served

### Next Steps

Thank you for your continued support.`;

      const formatted = TemplateContentFormatter.formatTemplateContent(content);

      // Verify accessibility features
      expect(formatted.content).toContain('role="article"');
      expect(formatted.content).toContain('aria-label="Email template content"');
      expect(formatted.content).toContain('Skip to template content');
      
      // Check heading structure
      expect(formatted.accessibility.headingStructure).toEqual([
        'H1: Welcome [USER_NAME]',
        'H2: Program Updates', 
        'H3: Next Steps'
      ]);

      // Verify merge fields have proper ARIA labels
      expect(formatted.content).toContain('aria-label="Merge field: USER_NAME"');
      expect(formatted.content).toContain('aria-label="Merge field: INITIATIVE_NAME"');
    });

    it('should validate templates for accessibility issues', () => {
      const poorContent = 'just plain text with no structure or [MERGE_FIELD]';
      const validation = TemplateContentFormatter.validateTemplate(poorContent);

      expect(validation.isValid).toBe(true); // Content exists
      expect(validation.suggestions).toContain('Add headings to improve content structure');
    });
  });

  describe('Mobile Responsiveness Integration', () => {
    it('should apply mobile optimizations correctly', () => {
      const content = `# Main Title
## Subtitle
### Section Title

Regular paragraph text.`;

      const formatted = TemplateContentFormatter.formatTemplateContent(content, {
        mobileOptimized: true,
        addAccessibilityTags: false
      });

      // Verify responsive classes are applied
      expect(formatted.content).toContain('text-xl sm:text-2xl'); // H1 responsive
      expect(formatted.content).toContain('text-lg sm:text-xl');  // H2 responsive
      expect(formatted.content).toContain('text-base sm:text-lg'); // H3 responsive
      expect(formatted.content).toContain('mb-3 sm:mb-4');        // Responsive margins
    });

    it('should handle mobile viewport in component', async () => {
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

      // Component should render without issues on mobile
      expect(screen.getByText("Maya's Template Library Builder")).toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle formatter errors gracefully', () => {
      // Test with problematic content
      const problematicContent = '<script>alert("test")</script>[MALFORMED FIELD';
      
      expect(() => {
        TemplateContentFormatter.formatTemplateContent(problematicContent);
      }).not.toThrow();

      const result = TemplateContentFormatter.formatTemplateContent(problematicContent);
      expect(result.content).toBeDefined();
      expect(result.mergeFields).toEqual([]); // Should handle malformed merge fields
    });

    it('should validate problematic templates', () => {
      const emptyTemplate = '';
      const validation = TemplateContentFormatter.validateTemplate(emptyTemplate);

      expect(validation.isValid).toBe(false);
      expect(validation.issues).toContain('Template content is empty');
      expect(validation.suggestions).toContain('Add meaningful content to the template');
    });
  });
});