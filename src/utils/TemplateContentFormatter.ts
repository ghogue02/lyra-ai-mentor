/**
 * TemplateContentFormatter - Utility for formatting and improving template content display
 * Handles typography, spacing, merge fields, and accessibility for template components
 */

export interface FormattedContent {
  content: string;
  mergeFields: string[];
  estimatedReadTime: number;
  accessibility: {
    ariaLabel: string;
    headingStructure: string[];
  };
}

export interface FormattingOptions {
  enhanceTypography?: boolean;
  highlightMergeFields?: boolean;
  improveSpacing?: boolean;
  addAccessibilityTags?: boolean;
  mobileOptimized?: boolean;
}

export class TemplateContentFormatter {
  private static readonly MERGE_FIELD_REGEX = /\[([A-Z_]+)\]/g;
  private static readonly WORDS_PER_MINUTE = 200;

  /**
   * Formats template content with enhanced typography and accessibility
   */
  static formatTemplateContent(
    rawContent: string, 
    options: FormattingOptions = {}
  ): FormattedContent {
    const {
      enhanceTypography = true,
      highlightMergeFields = true,
      improveSpacing = true,
      addAccessibilityTags = true,
      mobileOptimized = true
    } = options;

    // Return early for empty content with minimal formatting
    if (!rawContent.trim()) {
      return {
        content: rawContent,
        mergeFields: [],
        estimatedReadTime: 0,
        accessibility: {
          ariaLabel: 'Empty template',
          headingStructure: []
        }
      };
    }

    let formattedContent = rawContent;
    const mergeFields = this.extractMergeFields(rawContent);

    // Apply formatting options in correct order
    if (improveSpacing) {
      formattedContent = this.improveSpacing(formattedContent);
    }

    if (enhanceTypography) {
      formattedContent = this.enhanceTypography(formattedContent);
    }

    if (highlightMergeFields) {
      formattedContent = this.highlightMergeFields(formattedContent);
    }

    if (mobileOptimized) {
      formattedContent = this.optimizeForMobile(formattedContent);
    }

    if (addAccessibilityTags) {
      formattedContent = this.addAccessibilityTags(formattedContent);
    }

    return {
      content: formattedContent,
      mergeFields,
      estimatedReadTime: this.calculateReadTime(rawContent),
      accessibility: {
        ariaLabel: this.generateAriaLabel(rawContent),
        headingStructure: this.extractHeadingStructure(formattedContent)
      }
    };
  }

  /**
   * Extract merge fields from template content
   */
  private static extractMergeFields(content: string): string[] {
    const matches = content.match(this.MERGE_FIELD_REGEX) || [];
    return [...new Set(matches.map(match => match.slice(1, -1)))];
  }

  /**
   * Enhance typography with proper formatting
   */
  private static enhanceTypography(content: string): string {
    let formatted = content;
    
    // First, convert headers (before paragraph processing)
    formatted = formatted
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-gray-900 mb-3 mt-6">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-8">$1</h1>');

    // Then enhance emphasis
    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');

    // Finally, handle paragraphs and line breaks
    // Split by double line breaks for paragraphs
    const paragraphs = formatted.split(/\n\n+/);
    
    return paragraphs
      .map(paragraph => {
        // Skip if already a heading
        if (paragraph.startsWith('<h')) {
          return paragraph;
        }
        // Convert single line breaks to <br /> within paragraphs
        const withBreaks = paragraph.replace(/\n/g, '<br />');
        return `<p class="mb-4">${withBreaks}</p>`;
      })
      .join('');
  }

  /**
   * Highlight merge fields for better visibility
   */
  private static highlightMergeFields(content: string): string {
    return content.replace(
      this.MERGE_FIELD_REGEX,
      '<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200" role="button" tabindex="0" aria-label="Merge field: $1">[$1]</span>'
    );
  }

  /**
   * Improve spacing between content elements
   */
  private static improveSpacing(content: string): string {
    return content
      // Add proper spacing after punctuation
      .replace(/([.!?])([A-Z])/g, '$1 $2')
      // Ensure proper spacing around merge fields
      .replace(/(\S)(\[[\w_]+\])/g, '$1 $2')
      .replace(/(\[[\w_]+\])(\S)/g, '$1 $2')
      // Remove excessive whitespace but preserve single spaces
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  /**
   * Add accessibility tags and ARIA labels
   */
  private static addAccessibilityTags(content: string): string {
    return content
      // Add role and aria-label to main content
      .replace(/^/, '<div role="article" aria-label="Email template content">')
      .replace(/$/, '</div>')
      // Add skip links for screen readers
      .replace(/^(<div[^>]*>)/, '$1<a href="#template-content" class="sr-only focus:not-sr-only">Skip to template content</a>')
      // Add ID for skip link target
      .replace(/(<p[^>]*class="[^"]*mb-4[^"]*"[^>]*>)/, '$1<span id="template-content"></span>');
  }

  /**
   * Optimize content for mobile devices
   */
  private static optimizeForMobile(content: string): string {
    return content
      // Add responsive text sizing
      .replace(/class="([^"]*text-2xl[^"]*)"/, 'class="$1 text-xl sm:text-2xl"')
      .replace(/class="([^"]*text-xl[^"]*)"/, 'class="$1 text-lg sm:text-xl"')
      .replace(/class="([^"]*text-lg[^"]*)"/, 'class="$1 text-base sm:text-lg"')
      // Add mobile-friendly spacing
      .replace(/class="([^"]*mb-4[^"]*)"/, 'class="$1 mb-3 sm:mb-4"')
      .replace(/class="([^"]*mt-6[^"]*)"/, 'class="$1 mt-4 sm:mt-6"')
      .replace(/class="([^"]*mt-8[^"]*)"/, 'class="$1 mt-6 sm:mt-8"');
  }

  /**
   * Calculate estimated reading time
   */
  private static calculateReadTime(content: string): number {
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / this.WORDS_PER_MINUTE);
  }

  /**
   * Generate accessible aria-label
   */
  private static generateAriaLabel(content: string): string {
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = this.calculateReadTime(content);
    return `Email template with ${wordCount} words, estimated reading time ${readTime} minute${readTime !== 1 ? 's' : ''}`;
  }

  /**
   * Extract heading structure for screen readers
   */
  private static extractHeadingStructure(content: string): string[] {
    const headingMatches = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g) || [];
    return headingMatches.map(match => {
      const level = match.match(/<h([1-6])/)?.[1] || '1';
      const text = match.replace(/<[^>]*>/g, '').trim();
      return `H${level}: ${text}`;
    });
  }

  /**
   * Validate template content for common issues
   */
  static validateTemplate(content: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for empty content
    if (!content.trim()) {
      issues.push('Template content is empty');
      suggestions.push('Add meaningful content to the template');
    }

    // Check for orphaned merge fields
    const mergeFields = this.extractMergeFields(content);
    if (mergeFields.length === 0) {
      suggestions.push('Consider adding merge fields for personalization');
    }

    // Check for excessive length
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount > 500) {
      suggestions.push('Consider breaking long templates into smaller sections');
    }

    // Check for accessibility issues
    if (!content.includes('</h')) {
      suggestions.push('Add headings to improve content structure');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Convert template to plain text (for copy functionality)
   */
  static toPlainText(formattedContent: string): string {
    return formattedContent
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Convert HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Get performance metrics for the formatter
   */
  static getPerformanceMetrics(content: string): {
    processingTime: number;
    contentSize: number;
    compressionRatio: number;
  } {
    const startTime = performance.now();
    const formatted = this.formatTemplateContent(content);
    const endTime = performance.now();

    return {
      processingTime: endTime - startTime,
      contentSize: formatted.content.length,
      compressionRatio: content.length / formatted.content.length
    };
  }
}

export default TemplateContentFormatter;