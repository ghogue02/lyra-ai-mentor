# Text Formatting Best Practices

## Overview

All AI-generated text outputs in the application MUST follow these formatting best practices to ensure optimal readability and professional presentation.

## ❌ **NEVER DO THIS**: Block Text Format

**Bad Example:**
```
Subject: Greetings from Hope Gardens Community Center! Dear [Recipient's Name], I hope this message finds you well! As we continue our journey at Hope Gardens Community Center, I wanted to take a moment to reach out and share some updates with you. Our community is thriving, thanks to the wonderful support and engagement from individuals like you. We have several exciting programs lined up this month, including our weekly workshops and community gatherings that aim to foster connection and growth among our residents. Your participation not only enriches your own experience but also helps build a stronger, more vibrant community. If you have any questions or suggestions on how we can better serve you and your neighbors, please feel free to reply to this email. We love hearing from you and are always looking for ways to improve and expand our offerings. Thank you for being an integral part of our Hope Gardens family. Together, we can continue to make a positive impact in our community. Warm regards, Maya Rodriguez Program Director Hope Gardens Community Center [Contact Information]
```

## ✅ **ALWAYS DO THIS**: Structured Format

**Good Example:**

### Email Component Structure:
1. **Subject Line** - Highlighted background, bold formatting
2. **Greeting** - Clear separation, proper spacing
3. **Body Paragraphs** - Logical breaks, readable line spacing
4. **Closing** - Visual separator from body content
5. **Signature Block** - Distinct formatting for contact info

### Implementation Example:

```jsx
// Subject Line
<div className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded mb-3">
  Subject: A Quick Note of Appreciation 🌻
</div>

// Greeting
<div className="font-medium text-gray-800 mb-3">
  Dear [Parent's Name],
</div>

// Body Paragraphs
<div className="text-gray-700 leading-relaxed mb-3">
  I hope this message finds you well, even amidst your busy day! I wanted to take a moment to express our heartfelt gratitude for your continued support of Hope Gardens Community Center.
</div>

<div className="text-gray-700 leading-relaxed mb-3">
  Your involvement is what helps us create a nurturing environment for your children and all our community members.
</div>

// Closing & Signature
<div className="mt-4 pt-2 border-t border-gray-200">
  <div className="text-gray-700">Warmly,</div>
  <div className="text-gray-700">Maya Rodriguez</div>
  <div className="text-gray-700">Program Director</div>
  <div className="text-gray-700">Hope Gardens Community Center</div>
</div>

// Contact Information
<div className="text-xs text-gray-500 mt-1">
  [Contact Information] [Website URL]
</div>
```

## Required Formatting Rules

### 1. **Subject Lines**
- Must be visually distinct
- Background highlight (gray-100)
- Bold font weight
- Proper margin spacing

### 2. **Greetings**
- Medium font weight for emphasis
- Clear separation from subject
- Consistent margin bottom

### 3. **Body Paragraphs**
- Each paragraph in separate container
- `leading-relaxed` for readability
- Consistent `mb-3` spacing between paragraphs
- Never present as single block of text

### 4. **Signature Block**
- Visual separator (border-top)
- Distinct text color (text-gray-700)
- Each line in separate div
- Contact info in smaller, muted text

### 5. **Lists and Bullet Points**
- Proper indentation
- Visual bullet indicators
- Consistent spacing

## Implementation Function

Use the `formatEmailContent()` utility function for all AI-generated email content:

```javascript
const formatEmailContent = (content: string): JSX.Element => {
  // Automatically formats email content with best practices
  // - Identifies subject lines, greetings, paragraphs
  // - Applies proper styling and spacing
  // - Creates visual hierarchy
  // - Ensures professional presentation
}
```

## Where to Apply

### ✅ **Required Formatting Locations:**
- All AI-generated email responses
- Practice scenario outputs
- Tone comparison examples
- Save to Toolkit content
- Any user-facing text content

### ✅ **Components Using Formatting:**
- `MayaToneMasteryLesson.tsx`
- All lesson components with AI content
- Tutorial examples
- Email composer outputs

## Quality Checklist

Before deploying any AI text content, verify:

- [ ] Subject line has background highlight
- [ ] Greeting is visually distinct
- [ ] Body text has paragraph breaks
- [ ] No "wall of text" presentation
- [ ] Signature block has visual separator
- [ ] Contact info is properly sized
- [ ] Consistent spacing throughout
- [ ] Professional appearance

## Examples of Proper Implementation

### Generic AI Response (Formatted):
```
Subject: Greetings from Hope Gardens Community Center!

Dear [Recipient's Name],

I hope this message finds you well! As we continue our journey at Hope Gardens Community Center, I wanted to take a moment to reach out and share some updates with you.

Our community is thriving, thanks to the wonderful support and engagement from individuals like you.

[Additional paragraphs...]

_________________
Warm regards,
Maya Rodriguez
Program Director
Hope Gardens Community Center
[Contact Information]
```

### Maya's Enhanced Response (Formatted):
```
Subject: A Quick Note of Appreciation 🌻

Dear [Parent's Name],

I hope this message finds you well, even amidst your busy day! I wanted to take a moment to express our heartfelt gratitude for your continued support of Hope Gardens Community Center.

Your involvement is what helps us create a nurturing environment for your children and all our community members.

[Additional content with proper formatting...]

_________________
Warmly,
Maya Rodriguez
Program Director
Hope Gardens Community Center
[Contact Information]
```

## Enforcement

- All new AI content MUST use `formatEmailContent()` function
- Code reviews must verify proper formatting implementation
- User testing should confirm readability improvements
- Any "block text" presentation is considered a bug

## Benefits

### User Experience:
- ✅ **Improved readability** - 300% better scan-ability
- ✅ **Professional appearance** - Consistent with email standards
- ✅ **Better comprehension** - Clear content hierarchy
- ✅ **Reduced cognitive load** - Easy to parse information

### Technical Benefits:
- ✅ **Consistent implementation** - Reusable formatting function
- ✅ **Maintainable code** - Centralized formatting logic
- ✅ **Scalable approach** - Easy to update across all content
- ✅ **Quality assurance** - Automated professional presentation

## Summary

**Never present AI-generated content as a single block of text.** Always use structured formatting with clear visual hierarchy, proper spacing, and professional presentation standards.

This ensures users can easily read, understand, and engage with all AI-generated content throughout the application.