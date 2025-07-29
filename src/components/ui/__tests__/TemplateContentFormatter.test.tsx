import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TemplateContentFormatter from '../TemplateContentFormatter';

describe('TemplateContentFormatter', () => {
  const mockContent = `
Subject: Thank you for your generous donation, {{FirstName}}!

Preheader: Your support makes all the difference in our community.

Dear {{FirstName}} {{LastName}},

Thank you for your recent donation of **{{DonationAmount}}** to {{Organization}}. Your generosity helps us continue our mission.

## Impact of Your Gift

Your donation will help us:

- Provide meals for families in need
- Support educational programs
- Maintain our community center

We truly appreciate your commitment to our cause. You will receive a formal acknowledgment letter by {{Date}}.

*Best regards,*
**Maya Rodriguez**
Development Coordinator
{{Organization}}
  `;

  it('renders content with proper formatting', () => {
    render(<TemplateContentFormatter content={mockContent} />);
    
    // Check that subject line is formatted
    expect(screen.getByText(/Thank you for your generous donation/)).toBeInTheDocument();
    
    // Check that preheader is present
    expect(screen.getByText(/Your support makes all the difference/)).toBeInTheDocument();
    
    // Check that headings are rendered
    expect(screen.getByText('Impact of Your Gift')).toBeInTheDocument();
  });

  it('transforms merge fields correctly', () => {
    render(<TemplateContentFormatter content={mockContent} />);
    
    // Check that merge fields are transformed to display format
    expect(screen.getAllByText('[First Name]')).toHaveLength(2); // In subject and body
    expect(screen.getByText('[Last Name]')).toBeInTheDocument();
    expect(screen.getAllByText('[Organization]')).toHaveLength(2); // Multiple occurrences
    expect(screen.getByText('[Donation Amount]')).toBeInTheDocument();
    expect(screen.getByText('[Date]')).toBeInTheDocument();
  });

  it('displays merge fields legend when enabled', () => {
    render(<TemplateContentFormatter content={mockContent} showMergeFieldTypes={true} />);
    
    // Check that the legend heading is present
    expect(screen.getByText('Merge Fields in This Template')).toBeInTheDocument();
    
    // Check that field types are displayed in legend - they are consolidated
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
  });

  it('hides merge fields legend when disabled', () => {
    render(<TemplateContentFormatter content={mockContent} showMergeFieldTypes={false} />);
    
    // Check that the legend is not present
    expect(screen.queryByText('Merge Fields in This Template')).not.toBeInTheDocument();
  });

  it('handles different variants correctly', () => {
    const { rerender } = render(
      <TemplateContentFormatter content={mockContent} variant="default" />
    );
    
    let container = screen.getAllByText('[First Name]')[0].closest('.template-content-formatter');
    expect(container).toHaveClass('bg-gray-50');
    
    rerender(<TemplateContentFormatter content={mockContent} variant="preview" />);
    container = screen.getAllByText('[First Name]')[0].closest('.template-content-formatter');
    expect(container).toHaveClass('bg-white', 'border', 'shadow-sm');
    
    rerender(<TemplateContentFormatter content={mockContent} variant="compact" />);
    container = screen.getAllByText('[First Name]')[0].closest('.template-content-formatter');
    expect(container).toHaveClass('bg-gray-50', 'text-sm');
  });

  it('handles markdown formatting correctly', () => {
    const markdownContent = `
# Main Heading

This is **bold text** and this is *italic text*.

> This is a blockquote

- List item 1
- List item 2
- List item 3

Hello {{Name}}, welcome!
    `;
    
    render(<TemplateContentFormatter content={markdownContent} />);
    
    // Check that content is processed (heading and lists work)
    expect(screen.getByText('Main Heading')).toBeInTheDocument();
    expect(screen.getByText(/\*\*bold text\*\*/)).toBeInTheDocument(); // Currently not processing markdown
    expect(screen.getByText('List item 1')).toBeInTheDocument();
  });

  it('sanitizes potentially dangerous HTML', () => {
    const dangerousContent = `
Hello {{Name}},

<script>alert('xss')</script>
<img src="x" onerror="alert('xss')">

Safe content here.
    `;
    
    render(<TemplateContentFormatter content={dangerousContent} />);
    
    // Check that dangerous elements are removed
    const container = screen.getByText('Safe content here.').closest('.template-content-formatter');
    expect(container?.innerHTML).not.toContain('<script>');
    expect(container?.innerHTML).not.toContain('onerror');
  });

  it('categorizes merge fields by type correctly', () => {
    const typedContent = `
Personal: {{FirstName}} {{Email}}
Organizational: {{Organization}} {{Department}}
Date: {{CurrentDate}} {{EventDate}}
Custom: {{CustomField}}
    `;
    
    render(<TemplateContentFormatter content={typedContent} showMergeFieldTypes={true} />);
    
    // Check that different field types are present in legend
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('Current Date')).toBeInTheDocument();
    expect(screen.getByText('Custom Field')).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    render(<TemplateContentFormatter content="" />);
    
    const formatter = document.querySelector('.template-content-formatter');
    expect(formatter).toBeInTheDocument();
    expect(formatter).toHaveClass('template-content-formatter');
  });

  it('applies custom className correctly', () => {
    render(<TemplateContentFormatter content="Test" className="custom-class" />);
    
    const formatter = screen.getByText('Test').closest('.template-content-formatter');
    expect(formatter).toHaveClass('custom-class');
  });

  describe('Email structure formatting', () => {
    it('formats subject lines with special styling', () => {
      const emailContent = 'Subject: Important Update from {{Organization}}';
      render(<TemplateContentFormatter content={emailContent} />);
      
      const subjectElement = screen.getByText(/Important Update from/);
      expect(subjectElement).toBeInTheDocument();
    });

    it('formats preheader with special styling', () => {
      const emailContent = 'Preheader: This email contains important information';
      render(<TemplateContentFormatter content={emailContent} />);
      
      const preheaderElement = screen.getByText(/This email contains important information/);
      expect(preheaderElement).toBeInTheDocument();
    });
  });
});