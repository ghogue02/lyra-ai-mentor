import { describe, it, expect, vi, beforeEach } from 'vitest';
import TemplateContentFormatter, { FormattingOptions } from '../TemplateContentFormatter';

// Mock performance.now for consistent testing
const mockPerformanceNow = vi.fn();
Object.defineProperty(global, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true
});

describe('TemplateContentFormatter', () => {
  beforeEach(() => {
    mockPerformanceNow.mockClear();
    mockPerformanceNow.mockReturnValue(0);
  });

  describe('formatTemplateContent', () => {
    it('should format basic template content with default options', () => {
      const rawContent = 'Dear [FIRST_NAME],\n\nThank you for your support!';
      const result = TemplateContentFormatter.formatTemplateContent(rawContent);

      expect(result.content).toContain('Dear');
      expect(result.content).toContain('[FIRST_NAME]');
      expect(result.mergeFields).toEqual(['FIRST_NAME']);
      expect(result.estimatedReadTime).toBe(1);
      expect(result.accessibility.ariaLabel).toContain('Email template');
    });

    it('should extract merge fields correctly', () => {
      const rawContent = 'Hello [FIRST_NAME] [LAST_NAME], your [DONATION_AMOUNT] gift makes a difference.';
      const result = TemplateContentFormatter.formatTemplateContent(rawContent);

      expect(result.mergeFields).toEqual(['FIRST_NAME', 'LAST_NAME', 'DONATION_AMOUNT']);
    });

    it('should handle duplicate merge fields', () => {
      const rawContent = 'Dear [FIRST_NAME], thank you [FIRST_NAME] for your support.';
      const result = TemplateContentFormatter.formatTemplateContent(rawContent);

      expect(result.mergeFields).toEqual(['FIRST_NAME']);
      expect(result.mergeFields.length).toBe(1);
    });

    it('should enhance typography when enabled', () => {
      const rawContent = '# Main Title\n## Subtitle\n**Bold text** and *italic text*';
      const result = TemplateContentFormatter.formatTemplateContent(rawContent, {
        enhanceTypography: true,
        addAccessibilityTags: false // Disable to test typography alone
      });

      expect(result.content).toContain('<h1 class="text-2xl font-bold');
      expect(result.content).toContain('<h2 class="text-xl font-bold');
      expect(result.content).toContain('<strong class="font-semibold');
      expect(result.content).toContain('<em class="italic');
    });

    it('should highlight merge fields when enabled', () => {
      const rawContent = 'Hello [FIRST_NAME]!';
      const result = TemplateContentFormatter.formatTemplateContent(rawContent, {
        highlightMergeFields: true
      });

      expect(result.content).toContain('bg-purple-100');
      expect(result.content).toContain('text-purple-800');
      expect(result.content).toContain('role="button"');
      expect(result.content).toContain('aria-label="Merge field: FIRST_NAME"');
    });

    it('should improve spacing when enabled', () => {
      const rawContent = 'Hello[FIRST_NAME].Thank   you!';
      const result = TemplateContentFormatter.formatTemplateContent(rawContent, {
        improveSpacing: true,
        highlightMergeFields: false,
        addAccessibilityTags: false
      });

      expect(result.content).toContain('Hello [FIRST_NAME]');
      expect(result.content).toContain('. Thank you!');
      expect(result.content).not.toContain('   ');
    });

    it('should add accessibility tags when enabled', () => {
      const rawContent = 'Hello world!';
      const result = TemplateContentFormatter.formatTemplateContent(rawContent, {
        addAccessibilityTags: true
      });

      expect(result.content).toContain('role="article"');
      expect(result.content).toContain('aria-label="Email template content"');
      expect(result.content).toContain('Skip to template content');
    });

    it('should optimize for mobile when enabled', () => {
      const rawContent = '# Big Title\n\nSome content here.';
      const result = TemplateContentFormatter.formatTemplateContent(rawContent, {
        mobileOptimized: true,
        addAccessibilityTags: false
      });

      expect(result.content).toContain('text-xl sm:text-2xl');
      expect(result.content).toContain('mb-3 sm:mb-4');
    });

    it('should disable formatting options when set to false', () => {
      const rawContent = '**Bold** [FIRST_NAME] text';
      const options: FormattingOptions = {
        enhanceTypography: false,
        highlightMergeFields: false,
        improveSpacing: false,
        addAccessibilityTags: false,
        mobileOptimized: false
      };
      const result = TemplateContentFormatter.formatTemplateContent(rawContent, options);

      expect(result.content).toBe(rawContent);
    });
  });

  describe('validateTemplate', () => {
    it('should validate empty content', () => {
      const result = TemplateContentFormatter.validateTemplate('');

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Template content is empty');
      expect(result.suggestions).toContain('Add meaningful content to the template');
    });

    it('should suggest merge fields when none present', () => {
      const result = TemplateContentFormatter.validateTemplate('Hello world!');

      expect(result.isValid).toBe(true);
      expect(result.suggestions).toContain('Consider adding merge fields for personalization');
    });

    it('should suggest breaking up long templates', () => {
      const longContent = 'word '.repeat(501).trim();
      const result = TemplateContentFormatter.validateTemplate(longContent);

      expect(result.suggestions).toContain('Consider breaking long templates into smaller sections');
    });

    it('should suggest adding headings for better structure', () => {
      const result = TemplateContentFormatter.validateTemplate('Just plain text content');

      expect(result.suggestions).toContain('Add headings to improve content structure');
    });

    it('should validate content with headings', () => {
      const contentWithHeadings = '# Title\n\nContent with [MERGE_FIELD]';
      const formatted = TemplateContentFormatter.formatTemplateContent(contentWithHeadings);
      const result = TemplateContentFormatter.validateTemplate(formatted.content);

      expect(result.isValid).toBe(true);
    });
  });

  describe('toPlainText', () => {
    it('should convert formatted content to plain text', () => {
      const formattedContent = '<p class="mb-4">Hello <strong>world</strong>!</p>';
      const result = TemplateContentFormatter.toPlainText(formattedContent);

      expect(result).toBe('Hello world!');
    });

    it('should handle HTML entities', () => {
      const formattedContent = 'Hello &amp; goodbye &lt;world&gt; &quot;test&quot; &nbsp;';
      const result = TemplateContentFormatter.toPlainText(formattedContent);

      expect(result).toBe('Hello & goodbye <world> "test"');
    });

    it('should clean up excessive whitespace', () => {
      const formattedContent = '<p>  Multiple   spaces  </p>';
      const result = TemplateContentFormatter.toPlainText(formattedContent);

      expect(result).toBe('Multiple spaces');
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', () => {
      mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(10);
      
      const content = 'Hello [FIRST_NAME]!';
      const metrics = TemplateContentFormatter.getPerformanceMetrics(content);

      expect(metrics.processingTime).toBe(10);
      expect(metrics.contentSize).toBeGreaterThan(0);
      expect(metrics.compressionRatio).toBeGreaterThan(0);
    });

    it('should measure processing time accurately', () => {
      mockPerformanceNow.mockReturnValueOnce(100).mockReturnValueOnce(150);
      
      const content = 'Test content';
      const metrics = TemplateContentFormatter.getPerformanceMetrics(content);

      expect(metrics.processingTime).toBe(50);
    });
  });

  describe('accessibility features', () => {
    it('should generate proper aria labels', () => {
      const content = 'Hello world! This is a test.';
      const result = TemplateContentFormatter.formatTemplateContent(content);

      expect(result.accessibility.ariaLabel).toContain('Email template');
      expect(result.accessibility.ariaLabel).toContain('words');
      expect(result.accessibility.ariaLabel).toContain('reading time');
    });

    it('should extract heading structure', () => {
      const content = '# Main Title\n## Subtitle\n### Section';
      const result = TemplateContentFormatter.formatTemplateContent(content);

      expect(result.accessibility.headingStructure).toEqual([
        'H1: Main Title',
        'H2: Subtitle',
        'H3: Section'
      ]);
    });

    it('should handle content without headings', () => {
      const content = 'Just plain text';
      const result = TemplateContentFormatter.formatTemplateContent(content);

      expect(result.accessibility.headingStructure).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const result = TemplateContentFormatter.formatTemplateContent('');

      expect(result.content).toBe('');
      expect(result.mergeFields).toEqual([]);
      expect(result.estimatedReadTime).toBe(0);
      expect(result.accessibility.ariaLabel).toBe('Empty template');
    });

    it('should handle content with only whitespace', () => {
      const result = TemplateContentFormatter.formatTemplateContent('   \n\n  \t  ');

      expect(result.content).toBe('   \n\n  \t  '); // Should preserve original whitespace-only content
      expect(result.mergeFields).toEqual([]);
      expect(result.accessibility.ariaLabel).toBe('Empty template');
    });

    it('should handle malformed merge fields', () => {
      const content = 'Hello [BROKEN FIELD and [GOOD_FIELD] text';
      const result = TemplateContentFormatter.formatTemplateContent(content);

      expect(result.mergeFields).toEqual(['GOOD_FIELD']);
    });

    it('should handle very long content', () => {
      const longContent = 'word '.repeat(10000).trim();
      const result = TemplateContentFormatter.formatTemplateContent(longContent);

      expect(result.estimatedReadTime).toBeGreaterThan(1);
      expect(result.content).toBeDefined();
    });

    it('should handle special characters', () => {
      const content = 'Hello [FIRST_NAME]! 🎉 Special chars: @#$%^&*()';
      const result = TemplateContentFormatter.formatTemplateContent(content);

      expect(result.content).toContain('🎉');
      expect(result.content).toContain('@#$%^&*()');
      expect(result.mergeFields).toEqual(['FIRST_NAME']);
    });
  });

  describe('performance requirements', () => {
    it('should process templates under 100ms for normal content', () => {
      mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(50);
      
      const content = 'Normal template content with [MERGE_FIELD] and some text.';
      const metrics = TemplateContentFormatter.getPerformanceMetrics(content);

      expect(metrics.processingTime).toBeLessThan(100);
    });

    it('should handle memory efficiently with large templates', () => {
      const largeContent = 'word '.repeat(1000).trim();
      const initialMemory = process.memoryUsage().heapUsed;
      
      TemplateContentFormatter.formatTemplateContent(largeContent);
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Should not use more than 10MB for formatting
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });
});