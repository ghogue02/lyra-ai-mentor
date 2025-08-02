import React, { useMemo } from 'react';
import { marked } from 'marked';
import { sanitize } from 'dompurify';
import { Mail, User, Calendar, Building, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateContentFormatterProps {
  content: string;
  className?: string;
  variant?: 'default' | 'preview' | 'compact';
  showMergeFieldTypes?: boolean;
  contentType?: 'email' | 'lesson' | 'general';
}

interface MergeField {
  original: string;
  display: string;
  type: 'personal' | 'organizational' | 'date' | 'custom';
  icon: React.ComponentType<{ className?: string }>;
}

const TemplateContentFormatter: React.FC<TemplateContentFormatterProps> = ({
  content,
  className,
  variant = 'default',
  showMergeFieldTypes = true,
  contentType = 'general'
}) => {
  // Configure marked options for security and formatting
  const configureMarked = () => {
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false, // We'll use DOMPurify instead for better control
    });

    // Custom renderer for better email-specific formatting
    const renderer = new marked.Renderer();
    
    // Enhanced paragraph rendering based on content type
    renderer.paragraph = (text: string | { text: string }) => {
      const textString = typeof text === 'string' ? text : text.text || '';
      
      if (contentType === 'lesson') {
        // Lesson-specific paragraph handling
        if (textString.toLowerCase().startsWith('objective:') || textString.toLowerCase().startsWith('learning objective:')) {
          return `<div class="lesson-objective">${textString}</div>`;
        }
        if (textString.toLowerCase().startsWith('takeaway:') || textString.toLowerCase().startsWith('key takeaway:')) {
          return `<div class="lesson-takeaway">${textString}</div>`;
        }
        return `<p class="lesson-paragraph">${textString}</p>`;
      } else {
        // Email-specific paragraph handling
        if (textString.toLowerCase().startsWith('subject:')) {
          return `<div class="email-subject">${textString}</div>`;
        }
        if (textString.toLowerCase().startsWith('preheader:')) {
          return `<div class="email-preheader">${textString}</div>`;
        }
        return `<p class="email-paragraph">${textString}</p>`;
      }
    };

    // Enhanced heading rendering based on content type
    renderer.heading = (text: string | { text: string }, level: number) => {
      const textString = typeof text === 'string' ? text : text.text || '';
      const prefix = contentType === 'lesson' ? 'lesson' : 'email';
      const classes = {
        1: `${prefix}-heading-1`,
        2: `${prefix}-heading-2`,
        3: `${prefix}-heading-3`,
        4: `${prefix}-heading-4`,
        5: `${prefix}-heading-5`,
        6: `${prefix}-heading-6`
      };
      return `<h${level} class="${classes[level as keyof typeof classes]}">${textString}</h${level}>`;
    };

    marked.use({ renderer });
  };

  // Parse merge fields and categorize them
  const parseMergeFields = (text: string): { processedText: string; fields: MergeField[] } => {
    const mergeFieldRegex = /\{\{([^}]+)\}\}/g;
    const fields: MergeField[] = [];
    
    const fieldTypeMapping: Record<string, MergeField['type']> = {
      'FirstName': 'personal',
      'LastName': 'personal',
      'Name': 'personal',
      'Email': 'personal',
      'Phone': 'personal',
      'Organization': 'organizational',
      'Company': 'organizational',
      'Title': 'organizational',
      'Department': 'organizational',
      'Date': 'date',
      'CurrentDate': 'date',
      'EventDate': 'date',
      'DueDate': 'date',
    };

    const iconMapping: Record<MergeField['type'], React.ComponentType<{ className?: string }>> = {
      'personal': User,
      'organizational': Building,
      'date': Calendar,
      'custom': Heart
    };

    const processedText = text.replace(mergeFieldRegex, (match, fieldName) => {
      const trimmedField = fieldName.trim();
      const fieldType = fieldTypeMapping[trimmedField] || 'custom';
      const displayName = trimmedField.replace(/([A-Z])/g, ' $1').trim();
      
      const field: MergeField = {
        original: match,
        display: displayName,
        type: fieldType,
        icon: iconMapping[fieldType]
      };
      
      // Avoid duplicates
      if (!fields.some(f => f.original === match)) {
        fields.push(field);
      }

      // Return styled merge field
      const colorClass = {
        'personal': 'bg-blue-100 text-blue-800 border-blue-200',
        'organizational': 'bg-purple-100 text-purple-800 border-purple-200',
        'date': 'bg-green-100 text-green-800 border-green-200',
        'custom': 'bg-orange-100 text-orange-800 border-orange-200'
      }[fieldType];

      return `<span class="merge-field ${colorClass}" data-field-type="${fieldType}" data-original="${match}">[${displayName}]</span>`;
    });

    return { processedText, fields };
  };

  // Process the content
  const processedContent = useMemo(() => {
    configureMarked();
    
    // First, parse merge fields
    const { processedText, fields } = parseMergeFields(content);
    
    // Then convert markdown to HTML
    const htmlContent = marked(processedText);
    
    // Sanitize the HTML for security
    const sanitizedContent = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'em', 'u', 'br', 'ul', 'ol', 'li', 'blockquote',
        'a', 'pre', 'code'
      ],
      ALLOWED_ATTR: ['class', 'data-field-type', 'data-original', 'href', 'target'],
      ALLOW_DATA_ATTR: true
    });

    return { html: sanitizedContent, fields };
  }, [content]);

  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'preview':
        return 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm';
      case 'compact':
        return 'bg-gray-50 rounded p-3 text-sm';
      default:
        return 'bg-gray-50 rounded-md p-4';
    }
  };

  return (
    <div className={cn('template-content-formatter', getVariantStyles(), className)}>
      {/* Content Display */}
      <div 
        className="formatted-content prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent.html }}
        style={{
          // Custom CSS-in-JS for email-specific styling
        }}
      />

      {/* Merge Fields Legend */}
      {showMergeFieldTypes && processedContent.fields.length > 0 && variant !== 'compact' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Merge Fields in This Template
          </h4>
          <div className="flex flex-wrap gap-2">
            {processedContent.fields.map((field, index) => {
              const IconComponent = field.icon;
              const colorClass = {
                'personal': 'bg-blue-50 text-blue-700 border-blue-200',
                'organizational': 'bg-purple-50 text-purple-700 border-purple-200',
                'date': 'bg-green-50 text-green-700 border-green-200',
                'custom': 'bg-orange-50 text-orange-700 border-orange-200'
              }[field.type];

              return (
                <div
                  key={`${field.original}-${index}`}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium',
                    colorClass
                  )}
                >
                  <IconComponent className="w-3 h-3" />
                  {field.display}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .template-content-formatter .merge-field {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid;
            font-size: 0.875rem;
            font-weight: 500;
            margin: 0 1px;
          }

          .template-content-formatter .email-subject {
            font-weight: 600;
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
            color: #1f2937;
          }

          .template-content-formatter .email-preheader {
            font-size: 0.875rem;
            color: #6b7280;
            font-style: italic;
            margin-bottom: 1rem;
            padding: 0.5rem;
            background-color: #f9fafb;
            border-left: 3px solid #d1d5db;
            border-radius: 0 4px 4px 0;
          }

          .template-content-formatter .email-paragraph {
            margin-bottom: 1rem;
            line-height: 1.6;
            color: #374151;
          }

          .template-content-formatter .email-heading-1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 1.5rem 0 1rem 0;
            color: #1f2937;
          }

          .template-content-formatter .email-heading-2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.25rem 0 0.75rem 0;
            color: #1f2937;
          }

          .template-content-formatter .email-heading-3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
            color: #374151;
          }

          .template-content-formatter .email-heading-4,
          .template-content-formatter .email-heading-5,
          .template-content-formatter .email-heading-6 {
            font-size: 1rem;
            font-weight: 600;
            margin: 0.75rem 0 0.5rem 0;
            color: #374151;
          }

          .template-content-formatter .prose {
            color: #374151;
          }

          .template-content-formatter .prose strong {
            color: #1f2937;
          }

          .template-content-formatter .prose blockquote {
            border-left: 4px solid #d1d5db;
            padding-left: 1rem;
            font-style: italic;
            color: #6b7280;
          }

          .template-content-formatter .prose ul,
          .template-content-formatter .prose ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }

          .template-content-formatter .prose li {
            margin: 0.25rem 0;
          }

          /* Lesson-specific styles */
          .template-content-formatter .lesson-objective {
            font-weight: 600;
            font-size: 1.125rem;
            margin-bottom: 0.75rem;
            padding: 0.75rem;
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
            border-radius: 0 6px 6px 0;
            color: #1e40af;
          }

          .template-content-formatter .lesson-takeaway {
            font-weight: 600;
            font-size: 1rem;
            margin: 1rem 0;
            padding: 0.75rem;
            background-color: #dcfce7;
            border-left: 4px solid #16a34a;
            border-radius: 0 6px 6px 0;
            color: #15803d;
          }

          .template-content-formatter .lesson-paragraph {
            margin-bottom: 1rem;
            line-height: 1.7;
            color: #374151;
            font-size: 1rem;
          }

          .template-content-formatter .lesson-heading-1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin: 2rem 0 1.5rem 0;
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 0.5rem;
          }

          .template-content-formatter .lesson-heading-2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.5rem 0 1rem 0;
            color: #1f2937;
            border-left: 4px solid #6366f1;
            padding-left: 1rem;
          }

          .template-content-formatter .lesson-heading-3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.25rem 0 0.75rem 0;
            color: #374151;
          }

          .template-content-formatter .lesson-heading-4,
          .template-content-formatter .lesson-heading-5,
          .template-content-formatter .lesson-heading-6 {
            font-size: 1.125rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
            color: #374151;
          }
        `
      }} />
    </div>
  );
};

export { TemplateContentFormatter };
export default TemplateContentFormatter;