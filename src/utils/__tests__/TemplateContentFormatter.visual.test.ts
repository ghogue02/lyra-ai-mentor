import { describe, it, expect } from 'vitest';
import TemplateContentFormatter from '../TemplateContentFormatter';

/**
 * Visual formatting tests - these tests verify the visual appearance
 * and formatting of template content
 */
describe('TemplateContentFormatter Visual Tests', () => {
  describe('Before/After Formatting Comparison', () => {
    it('should dramatically improve donor thank you template appearance', () => {
      const rawContent = `Dear [DONOR_NAME],

Thank you for your donation of [AMOUNT]. Your support means the world to us.

# Impact Report
Your contribution has helped:
- Feed [MEALS_PROVIDED] families
- Shelter [PEOPLE_HOUSED] individuals  
- Provide [SERVICES_COUNT] critical services

**We are grateful** for your *continued* support.

Best regards,
Maya Rodriguez
Executive Director`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent);

      // Before: Plain text with basic markdown
      expect(rawContent).not.toContain('<h1');
      expect(rawContent).not.toContain('class=');
      expect(rawContent).not.toContain('aria-label');

      // After: Rich HTML with proper styling and accessibility
      expect(formatted.content).toContain('<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Impact Report</h1>');
      expect(formatted.content).toContain('<strong class="font-semibold text-gray-900">We are grateful</strong>');
      expect(formatted.content).toContain('<em class="italic text-gray-700">continued</em>');
      expect(formatted.content).toContain('bg-purple-100 text-purple-800'); // Merge field styling
      expect(formatted.content).toContain('role="article"');
    });

    it('should enhance volunteer recruitment template typography', () => {
      const rawContent = `# Join Our Mission [VOLUNTEER_NAME]!

## We Need Your Help

**Volunteer Opportunity:** [OPPORTUNITY_TYPE]
**Time Commitment:** [HOURS_NEEDED] hours
**Location:** [VENUE_ADDRESS]

### Why Volunteer?
Make a difference in [BENEFICIARY_COUNT] lives.

*Sign up today!*`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent);

      // Verify hierarchical heading structure
      expect(formatted.content).toContain('<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-8">');
      expect(formatted.content).toContain('<h2 class="text-xl font-bold text-gray-900 mb-3 mt-6">');
      expect(formatted.content).toContain('<h3 class="text-lg font-semibold text-gray-900 mb-2 mt-4">');

      // Verify proper paragraph structure
      expect(formatted.content).toContain('<p class="mb-4">');
      
      // Verify enhanced merge fields
      expect(formatted.content).toMatch(/\[VOLUNTEER_NAME\].*purple-100.*purple-800/);
    });

    it('should improve crisis communication template readability', () => {
      const rawContent = `# URGENT: Service Disruption Notice

Dear [STAKEHOLDER_NAME],

We are writing to inform you of a **critical situation** affecting our [SERVICE_TYPE] services.

## What Happened
[INCIDENT_DESCRIPTION]

## Impact
- Services affected: [AFFECTED_SERVICES]
- Expected duration: [DURATION_ESTIMATE]
- Alternative options: [ALTERNATIVES]

### Next Steps
We will provide updates every [UPDATE_FREQUENCY].

*We apologize for any inconvenience.*

Emergency Contact: [EMERGENCY_CONTACT]`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent);

      // Verify crisis communication maintains urgency while improving readability
      expect(formatted.content).toContain('URGENT'); // Preserves important keywords
      expect(formatted.content).toContain('<strong class="font-semibold text-gray-900">critical situation</strong>');
      expect(formatted.content).toContain('<em class="italic text-gray-700">We apologize');
      
      // Verify all merge fields are properly highlighted
      const mergeFieldMatches = formatted.content.match(/\[[\w_]+\]/g) || [];
      const highlightedFields = formatted.content.match(/bg-purple-100/g) || [];
      expect(highlightedFields.length).toBe(formatted.mergeFields.length);
    });
  });

  describe('Mobile Responsiveness Visual Tests', () => {
    it('should create mobile-friendly donor acknowledgment', () => {
      const rawContent = `# Thank You [DONOR_NAME]!

## Your Generous Gift of [AMOUNT]

### Impact Statement
Your donation will help us serve [BENEFICIARY_COUNT] community members.`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent, {
        mobileOptimized: true,
        addAccessibilityTags: false
      });

      // Verify responsive text scaling
      expect(formatted.content).toContain('text-xl sm:text-2xl'); // H1: smaller on mobile
      expect(formatted.content).toContain('text-lg sm:text-xl');  // H2: smaller on mobile  
      expect(formatted.content).toContain('text-base sm:text-lg'); // H3: smaller on mobile

      // Verify responsive spacing
      expect(formatted.content).toContain('mb-3 sm:mb-4'); // Tighter margins on mobile
      expect(formatted.content).toContain('mt-4 sm:mt-6'); // Reduced top margins
    });

    it('should optimize program update layout for mobile', () => {
      const rawContent = `# Program Update [MONTH] [YEAR]

## Achievements This Month

**Total Impact:**
- Meals served: [MEALS_COUNT]
- Families helped: [FAMILIES_COUNT]
- Volunteers engaged: [VOLUNTEERS_COUNT]

### Looking Ahead
Next month we plan to [FUTURE_PLANS].

Thank you [SUPPORTER_NAME] for making this possible.`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent, {
        mobileOptimized: true,
        addAccessibilityTags: false
      });

      // Mobile optimization should apply to all heading levels
      const h1Matches = formatted.content.match(/text-xl sm:text-2xl/g) || [];
      const h2Matches = formatted.content.match(/text-lg sm:text-xl/g) || [];
      const h3Matches = formatted.content.match(/text-base sm:text-lg/g) || [];

      expect(h1Matches.length).toBe(1); // One H1
      expect(h2Matches.length).toBe(1); // One H2
      expect(h3Matches.length).toBe(1); // One H3
    });
  });

  describe('Accessibility Visual Enhancements', () => {
    it('should add comprehensive accessibility markup to templates', () => {
      const rawContent = `# Welcome New Volunteers!

## Training Schedule for [TRAINING_DATE]

### Session 1: Orientation
Learn about our mission and values.

### Session 2: Safety Protocols  
Review **important** safety guidelines.

Questions? Contact [COORDINATOR_NAME] at [COORDINATOR_EMAIL].`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent, {
        addAccessibilityTags: true
      });

      // Verify document structure
      expect(formatted.content).toContain('role="article"');
      expect(formatted.content).toContain('aria-label="Email template content"');
      
      // Verify skip link for screen readers
      expect(formatted.content).toContain('Skip to template content');
      expect(formatted.content).toContain('class="sr-only focus:not-sr-only"');
      expect(formatted.content).toContain('id="template-content"');

      // Verify merge fields have proper ARIA labels
      expect(formatted.content).toContain('aria-label="Merge field: TRAINING_DATE"');
      expect(formatted.content).toContain('aria-label="Merge field: COORDINATOR_NAME"');
      expect(formatted.content).toContain('role="button"');
      expect(formatted.content).toContain('tabindex="0"');
    });

    it('should generate proper heading structure for screen readers', () => {
      const rawContent = `# Main Newsletter [MONTH]

## Feature Story
### Community Garden Success

## Upcoming Events  
### Volunteer Fair [DATE]
### Fundraising Gala [GALA_DATE]

## Thank You [SUPPORTER_GROUP]`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent);

      expect(formatted.accessibility.headingStructure).toEqual([
        'H1: Main Newsletter [MONTH]',
        'H2: Feature Story',
        'H3: Community Garden Success', 
        'H2: Upcoming Events',
        'H3: Volunteer Fair [DATE]',
        'H3: Fundraising Gala [GALA_DATE]',
        'H2: Thank You [SUPPORTER_GROUP]'
      ]);
    });
  });

  describe('Typography Enhancement Visual Tests', () => {
    it('should create professional donor stewardship letter appearance', () => {
      const rawContent = `# Stewardship Report for [DONOR_NAME]

Dear [DONOR_TITLE] [DONOR_LAST_NAME],

Thank you for your **leadership gift** of [GIFT_AMOUNT] to support our [PROGRAM_NAME] initiative.

## Your Impact in Numbers

### Direct Services
- **Beneficiaries served:** [BENEFICIARIES_COUNT]
- **Programs funded:** [PROGRAMS_COUNT] 
- **Success rate:** [SUCCESS_PERCENTAGE]%

### Community Reach
Your investment enabled us to:
1. Expand services to [NEW_LOCATIONS]
2. Train [STAFF_COUNT] additional staff members
3. Serve [ADDITIONAL_FAMILIES] more families

*We are deeply grateful* for your continued partnership.

Sincerely,
[EXECUTIVE_NAME]
[TITLE]`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent);

      // Verify professional typography
      expect(formatted.content).toContain('<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-8">');
      expect(formatted.content).toContain('<h2 class="text-xl font-bold text-gray-900 mb-3 mt-6">');
      expect(formatted.content).toContain('<h3 class="text-lg font-semibold text-gray-900 mb-2 mt-4">');
      
      // Verify emphasis styling
      expect(formatted.content).toContain('<strong class="font-semibold text-gray-900">leadership gift</strong>');
      expect(formatted.content).toContain('<strong class="font-semibold text-gray-900">Beneficiaries served:</strong>');
      expect(formatted.content).toContain('<em class="italic text-gray-700">We are deeply grateful</em>');

      // Verify paragraph structure
      expect(formatted.content).toContain('<p class="mb-4">');
    });

    it('should maintain visual hierarchy in complex templates', () => {
      const rawContent = `# Annual Report [YEAR]: [ORGANIZATION_NAME]

## Executive Summary

**Mission Accomplished:** We served [TOTAL_BENEFICIARIES] individuals this year.

### Key Achievements
1. **Program Expansion:** Added [NEW_PROGRAMS] new programs
2. **Financial Growth:** Increased funding by [GROWTH_PERCENTAGE]%
3. **Community Impact:** Reached [COMMUNITIES_COUNT] communities

## Program Highlights

### Health Services
- Patients treated: [PATIENTS_COUNT]
- Preventive care visits: [PREVENTIVE_VISITS]
- *Satisfaction rate:* [SATISFACTION_RATE]%

### Education Programs  
- Students enrolled: [STUDENTS_COUNT]
- Graduation rate: [GRADUATION_RATE]%
- **Scholarship recipients:** [SCHOLARSHIP_COUNT]

## Financial Overview

**Total Revenue:** [TOTAL_REVENUE]
**Program Expenses:** [PROGRAM_EXPENSES] ([PROGRAM_PERCENTAGE]% of budget)
**Administrative Costs:** [ADMIN_COSTS] ([ADMIN_PERCENTAGE]% of budget)

### Donor Recognition

*Thank you* to our [DONOR_TIER] donors:
- [MAJOR_DONOR_1]
- [MAJOR_DONOR_2] 
- [MAJOR_DONOR_3]

## Looking Forward to [NEXT_YEAR]

**Goals:**
1. Serve [TARGET_BENEFICIARIES] beneficiaries
2. Launch [NEW_INITIATIVE]
3. Achieve [FINANCIAL_TARGET] in funding

*Together, we will continue making a difference.*`;

      const formatted = TemplateContentFormatter.formatTemplateContent(rawContent);

      // Verify complex heading hierarchy is preserved
      const h1Count = (formatted.content.match(/<h1/g) || []).length;
      const h2Count = (formatted.content.match(/<h2/g) || []).length;
      const h3Count = (formatted.content.match(/<h3/g) || []).length;

      expect(h1Count).toBe(1);  // One main title
      expect(h2Count).toBe(4);  // Four major sections
      expect(h3Count).toBeGreaterThan(0); // Multiple subsections

      // Verify all merge fields are captured
      expect(formatted.mergeFields.length).toBeGreaterThan(15);
      
      // Verify emphasis elements are styled
      const strongCount = (formatted.content.match(/<strong/g) || []).length;
      const emCount = (formatted.content.match(/<em/g) || []).length;
      
      expect(strongCount).toBeGreaterThan(5);
      expect(emCount).toBeGreaterThan(2);
    });
  });

  describe('Content Length and Readability Tests', () => {
    it('should handle short templates effectively', () => {
      const shortContent = `Thanks [NAME]! Your [AMOUNT] donation helps.`;
      const formatted = TemplateContentFormatter.formatTemplateContent(shortContent);

      expect(formatted.estimatedReadTime).toBe(1); // Minimum read time
      expect(formatted.mergeFields).toEqual(['NAME', 'AMOUNT']);
      expect(formatted.content).toContain('bg-purple-100'); // Merge fields highlighted
    });

    it('should handle medium-length templates with good structure', () => {
      const mediumContent = `# Thank You [DONOR_NAME]

Dear [DONOR_TITLE] [DONOR_LAST_NAME],

Your generous contribution of [AMOUNT] to our [CAMPAIGN_NAME] campaign has made a significant impact on our community.

## How Your Gift Helps

Your donation allows us to:
- Provide [SERVICE_1] to [BENEFICIARY_COUNT_1] families
- Offer [SERVICE_2] to [BENEFICIARY_COUNT_2] individuals  
- Support [SERVICE_3] for [BENEFICIARY_COUNT_3] community members

**Total Impact:** [TOTAL_IMPACT] lives touched.

*Thank you* for your continued support of [ORGANIZATION_NAME].

With gratitude,
[STAFF_NAME]
[STAFF_TITLE]`;

      const formatted = TemplateContentFormatter.formatTemplateContent(mediumContent);

      expect(formatted.estimatedReadTime).toBeGreaterThan(1);
      expect(formatted.estimatedReadTime).toBeLessThan(5);
      expect(formatted.mergeFields.length).toBeGreaterThan(10);
      
      // Should have good visual structure
      expect(formatted.content).toContain('<h1');
      expect(formatted.content).toContain('<h2');
      expect(formatted.content).toContain('<p class="mb-4">');
    });

    it('should provide warnings for very long templates', () => {
      const longContent = 'word '.repeat(600).trim() + ' [MERGE_FIELD]';
      const validation = TemplateContentFormatter.validateTemplate(longContent);

      expect(validation.suggestions).toContain('Consider breaking long templates into smaller sections');
    });
  });
});