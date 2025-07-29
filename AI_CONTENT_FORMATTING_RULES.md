# AI Content Formatting Rules - Established Standards

## 🎯 Overview

These rules define the **mandatory formatting standards** for all AI-generated content across the Lyra AI Mentor platform. Based on the successful Template Library implementation, these patterns ensure consistent, professional, and user-friendly display of AI outputs.

## 📋 **MANDATORY FORMATTING RULES**

### Rule 1: Never Display Raw AI Content
```typescript
// ❌ NEVER DO THIS
<div>{aiGeneratedContent}</div>

// ✅ ALWAYS DO THIS
<TemplateContentFormatter 
  content={aiGeneratedContent}
  contentType="lesson" // or appropriate type
  variant="default"
  className="formatted-ai-content"
/>
```

### Rule 2: Transform All Markdown Elements
**Bold Text**: `**text**` → `<strong>text</strong>`
**Italic Text**: `*text*` → `<em>text</em>`
**Bullet Points**: `• item` → `<ul><li>item</li></ul>`
**Headers**: `# Header` → `<h1>Header</h1>` (with proper hierarchy)

### Rule 3: Convert Merge Fields to User-Friendly Display
```typescript
// AI generates technical merge fields
{{FirstName}} → [First Name]
{{ProgramName}} → [Program Name] 
{{OrganizationName}} → [Organization Name]
{{EventDate}} → [Event Date]

// Visual treatment: Blue background, rounded corners, icon indicators
```

### Rule 4: Apply Professional Typography
- **Font Size**: 16px minimum for body text (accessibility requirement)
- **Line Spacing**: 1.5-1.6x for optimal readability
- **Contrast**: 4.5:1 ratio minimum (WCAG 2.1 AA compliance)
- **Heading Hierarchy**: Proper h1 → h2 → h3 structure

### Rule 5: Implement Content-Specific Visual Structure

**Email Templates**:
```
📧 Subject Line (prominent heading)
💌 Preheader Text (if present)
👋 Greeting Section
📝 Main Content (well-spaced paragraphs)
🔗 Call-to-Action (emphasized)
✍️ Professional Signature
```

**Lesson Content**:
```
🎯 Learning Objectives (bullet points)
📚 Core Content (structured sections)
💡 Examples (highlighted boxes)
✅ Key Takeaways (summary points)
```

**Articles & Resources**:
```
📖 Introduction (problem/overview)
🔍 Main Content (logical sections)
📊 Supporting Data (visual emphasis)
🎯 Conclusion (action items)
```

### Rule 6: Ensure Mobile Responsiveness
- Responsive font scaling
- Touch-friendly interactive elements
- Proper spacing on small screens
- Horizontal scroll elimination

### Rule 7: Maintain Accessibility Standards
- ARIA labels for merge fields and formatted sections
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode compatibility

## 🔧 **IMPLEMENTATION PATTERN**

### Standard Integration Code
```typescript
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

// Replace any raw AI content display with:
<TemplateContentFormatter 
  content={generatedContent}
  contentType="lesson" // email, article, lesson, etc.
  variant="default" // default, preview, compact
  showMergeFieldTypes={true}
  className="your-custom-classes"
/>
```

### Component Props Reference
```typescript
interface TemplateContentFormatterProps {
  content: string;              // AI-generated content (required)
  contentType?: ContentType;    // Type for specific formatting
  variant?: 'default' | 'preview' | 'compact';
  showMergeFieldTypes?: boolean; // Show merge field icons
  className?: string;           // Additional styling
}
```

## 📊 **CONTENT TYPE SPECIFIC RULES**

### Email Templates (`contentType: "email"`)
- Subject lines get email icon (📧) and prominent styling
- Merge fields use person/organization icons
- Professional signature formatting
- Call-to-action button styling

### Lesson Content (`contentType: "lesson"`)
- Learning objectives with target icon (🎯)
- Sectioned content with proper headings
- Key takeaways with checkmark styling (✅)
- Example boxes with lightbulb icons (💡)

### Articles (`contentType: "article"`)
- Introduction with book icon (📖)
- Data sections with chart icons (📊)
- Conclusion with target icon (🎯)
- Quote blocks with special styling

### Social Posts (`contentType: "social_post"`)
- Compact formatting for social media
- Hashtag styling and emphasis
- Platform-appropriate character limits
- Visual emoji integration

## 🎨 **VISUAL STYLING STANDARDS**

### Color Scheme
```css
/* Merge Fields */
.merge-field {
  background: rgb(239 246 255); /* bg-blue-50 */
  color: rgb(59 130 246);        /* text-blue-600 */
  border: 1px solid rgb(191 219 254); /* border-blue-200 */
  border-radius: 0.375rem;       /* rounded-md */
  padding: 0.125rem 0.375rem;    /* px-1.5 py-0.5 */
}

/* Headers */
.ai-content-h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
.ai-content-h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
.ai-content-h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }

/* Body Text */
.ai-content-body { 
  font-size: 1rem; 
  line-height: 1.6; 
  margin-bottom: 1rem; 
}
```

### Icon Usage
- 📧 Email subjects
- 👋 Greetings/personalization
- 🎯 Objectives/goals
- 💡 Examples/tips
- ✅ Takeaways/completion
- 📊 Data/statistics
- 🔗 Links/actions

## 🧪 **TESTING REQUIREMENTS**

### Required Tests for Each Implementation
1. **Content Transformation**: Verify markdown → HTML conversion
2. **Merge Field Display**: Check {{field}} → [Field Name] transformation
3. **Accessibility**: ARIA labels, screen reader compatibility
4. **Performance**: <100ms processing time
5. **Security**: XSS protection with sanitized HTML
6. **Mobile**: Responsive design validation

### Test Pattern
```typescript
describe('AI Content Formatting', () => {
  it('should format content without raw markdown', () => {
    const content = '**Bold** text with {{FirstName}}';
    const result = formatContent(content);
    expect(result).not.toContain('**');
    expect(result).not.toContain('{{');
    expect(result).toContain('[First Name]');
  });
});
```

## 🚫 **ANTI-PATTERNS TO AVOID**

### Never Do These
```typescript
// ❌ Raw content display
<div>{aiContent}</div>

// ❌ Basic string replacement
content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')

// ❌ Unescaped HTML
<div dangerouslySetInnerHTML={{__html: content}} />

// ❌ Inline styling
<div style={{fontSize: '14px'}}>{content}</div>

// ❌ Inconsistent merge field handling
content.replace('{{FirstName}}', 'Your Name')
```

### Always Do These Instead
```typescript
// ✅ Use formatting component
<TemplateContentFormatter content={aiContent} />

// ✅ Proper markdown parsing
marked.parse(content, {sanitize: true})

// ✅ Security-first HTML
DOMPurify.sanitize(htmlContent)

// ✅ Responsive styling
className="text-base md:text-lg leading-relaxed"

// ✅ Systematic merge field transformation
transformMergeFields(content, fieldMappings)
```

## 📋 **IMPLEMENTATION CHECKLIST**

For each AI content component:

### Pre-Implementation
- [ ] Identify all locations where AI content is displayed
- [ ] Document current raw content display patterns
- [ ] Determine appropriate contentType for each use case

### Implementation
- [ ] Replace raw display with TemplateContentFormatter
- [ ] Configure appropriate props (contentType, variant, etc.)
- [ ] Apply consistent styling classes
- [ ] Test with real AI-generated content

### Post-Implementation
- [ ] Verify no raw markdown visible to users
- [ ] Confirm merge fields display as [Field Name]
- [ ] Test accessibility with screen readers
- [ ] Validate mobile responsiveness
- [ ] Performance test (<100ms requirement)
- [ ] Security audit (no XSS vulnerabilities)

### Quality Assurance
- [ ] User acceptance testing
- [ ] Cross-browser compatibility
- [ ] Performance monitoring
- [ ] Error handling validation

## 🎯 **SUCCESS CRITERIA**

### User Experience Goals
- Users never see technical markdown syntax
- Merge fields appear as friendly placeholders
- Content is scannable with clear visual hierarchy
- Professional appearance builds platform credibility
- Accessibility supports all users including screen readers

### Technical Goals
- 100% consistent formatting across platform
- <100ms content processing time
- Zero XSS vulnerabilities
- WCAG 2.1 AA compliance
- Mobile-first responsive design

### Business Goals
- Increased user engagement with formatted content
- Reduced user confusion about technical elements
- Professional presentation attracts enterprise users
- Scalable pattern for future AI features

## 🚀 **ROLLOUT STRATEGY**

### Phase 1: Template Library (✅ Complete)
- MayaTemplateLibraryBuilder.tsx
- Proven pattern established
- 29 passing tests, performance validated

### Phase 2: All Maya Components (Current Phase)
- MayaEmailComposer.tsx
- All interactive Maya lessons
- Consistent Maya character experience

### Phase 3: Character-Specific Components
- Alex leadership lessons
- Rachel ecosystem components  
- Sofia voice development tools
- David impact measurement displays

### Phase 4: Content Lab & Global
- Content Lab AI displays
- Administrative interfaces
- Cross-platform consistency

## 📚 **RESOURCES**

### Dependencies Required
```json
{
  "marked": "^9.1.6",           // Markdown parsing
  "dompurify": "^3.0.8",        // HTML sanitization
  "@types/dompurify": "^3.0.5"  // TypeScript types
}
```

### Key Files
- `/src/components/ui/TemplateContentFormatter.tsx` - Main component
- `/src/utils/TemplateContentFormatter.ts` - Utility functions
- `/docs/TemplateContentFormatter.md` - Component documentation

### Testing Resources
- Unit tests: `/src/utils/__tests__/TemplateContentFormatter.test.ts`
- Component tests: `/src/components/ui/__tests__/TemplateContentFormatter.test.tsx`
- Integration tests: Template Library validation

---

**These rules are MANDATORY for all AI content display.** No exceptions. Every AI-generated content must use the TemplateContentFormatter pattern to ensure consistent, professional, and accessible user experience across the entire Lyra AI Mentor platform.

**Next Step**: Deploy swarm to implement these rules across all remaining AI content components platform-wide.