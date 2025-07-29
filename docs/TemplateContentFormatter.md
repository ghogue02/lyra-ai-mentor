# TemplateContentFormatter Component

A sophisticated React component for rendering email template content with advanced merge field processing, markdown support, and security features.

## Features

### 🔄 Merge Field Processing
- Transforms `{{FirstName}}` → `[First Name]` with visual styling
- Automatic field type categorization (personal, organizational, date, custom)
- Color-coded display with icons
- Comprehensive field legend

### 📧 Email Structure Support
- Special formatting for Subject lines (`Subject: ...`)
- Preheader styling (`Preheader: ...`) 
- Professional paragraph spacing
- Email-optimized typography

### 🛡️ Security & Safety
- HTML sanitization using DOMPurify
- XSS prevention
- Controlled allowed HTML tags
- Safe rendering of user content

### ⚡ Performance
- Memoized content processing
- Efficient regex-based field parsing
- Responsive design
- TypeScript support with proper interfaces

## Installation

```bash
npm install marked dompurify @types/dompurify
```

## Usage

### Basic Usage

```tsx
import TemplateContentFormatter from '@/components/ui/TemplateContentFormatter';

const MyComponent = () => {
  const template = `
Subject: Welcome, {{FirstName}}!

Dear {{FirstName}} {{LastName}},

Thank you for joining {{Organization}}.
  `;

  return (
    <TemplateContentFormatter 
      content={template}
      variant="default"
      showMergeFieldTypes={true}
    />
  );
};
```

### Advanced Usage

```tsx
<TemplateContentFormatter 
  content={templateContent}
  variant="preview"
  showMergeFieldTypes={false}
  className="custom-styling"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | Required | Template content to format |
| `className` | `string` | - | Additional CSS classes |
| `variant` | `'default' \| 'preview' \| 'compact'` | `'default'` | Display variant |
| `showMergeFieldTypes` | `boolean` | `true` | Show merge fields legend |

## Variants

### Default
- Gray background with padding
- Full feature set
- Ideal for editing interfaces

### Preview
- White background with border
- Clean professional appearance
- Perfect for template previews

### Compact
- Smaller text and padding
- Space-efficient display
- Great for lists and summaries

## Merge Field Types

The component automatically categorizes merge fields:

| Type | Examples | Color | Icon |
|------|----------|-------|------|
| **Personal** | FirstName, LastName, Email | Blue | User |
| **Organizational** | Organization, Department | Purple | Building |
| **Date** | Date, EventDate, CurrentDate | Green | Calendar |
| **Custom** | Any other field | Orange | Heart |

## Email Structure Features

### Subject Lines
```
Subject: Your donation receipt, {{FirstName}}!
```
Renders with enhanced typography and bottom border.

### Preheaders
```
Preheader: This email contains important information
```
Styled with italic text and left border accent.

### Markdown Support
- Headers (H1-H6)
- Bold and italic text
- Lists (ordered and unordered)
- Blockquotes
- Paragraphs with proper spacing

## Security Features

- **HTML Sanitization**: Uses DOMPurify to remove dangerous content
- **Allowed Tags**: Restricts to safe HTML elements
- **XSS Prevention**: Blocks script injection attempts
- **Data Attributes**: Safely handles custom data attributes

## Integration Example

The component integrates seamlessly with existing template systems:

```tsx
// In MayaTemplateLibraryBuilder.tsx
<div className="max-h-48 overflow-y-auto">
  <TemplateContentFormatter 
    content={template.content}
    variant="compact"
    showMergeFieldTypes={true}
    className="text-sm"
  />
</div>
```

## Testing

The component includes comprehensive tests covering:
- Merge field transformation
- Variant styling
- Security sanitization
- Markdown processing
- Error handling
- Accessibility

Run tests with:
```bash
npm run test:components -- --run src/components/ui/__tests__/TemplateContentFormatter.test.tsx
```

## Performance Considerations

- Uses `useMemo` for expensive processing
- Efficient regex patterns for field parsing
- Minimal DOM updates through memoization
- Responsive design with CSS Grid/Flexbox

## Browser Support

- Modern browsers with ES2018+ support
- Requires React 16.8+ (hooks)
- TypeScript 4.0+ recommended

## Contributing

When extending the component:
1. Add comprehensive tests for new features
2. Update TypeScript interfaces
3. Maintain security best practices
4. Follow existing code patterns
5. Update documentation

## License

Part of the Lyra AI Mentor project.