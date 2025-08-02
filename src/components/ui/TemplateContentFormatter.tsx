import React from 'react';
import { sanitize } from 'dompurify';
import { marked } from 'marked';
import { cn } from '@/lib/utils';

interface TemplateContentFormatterProps {
  content: string;
  contentType?: 'lesson' | 'email' | 'article' | 'general';
  templateVariables?: Record<string, any>;
  enableDynamicFields?: boolean;
  customRenderer?: any;
  className?: string;
  variant?: string; // Backward compatibility
  showMergeFieldTypes?: boolean; // Backward compatibility
}

interface FieldExtraction {
  original: string;
  placeholder: string;
  fieldType: string;
  fieldData?: any;
}

export const TemplateContentFormatter: React.FC<TemplateContentFormatterProps> = ({
  content,
  contentType = 'lesson',
  templateVariables = {},
  enableDynamicFields = false,
  customRenderer,
  className,
  variant, // Ignore for now
  showMergeFieldTypes // Ignore for now
}) => {
  const processedContent = React.useMemo(() => {
    if (!content) return '';

    // Parse markdown with custom renderer
    const renderer = new marked.Renderer();

    // Enhanced paragraph rendering based on content type
    if (contentType === 'email') {
      renderer.paragraph = ({ tokens }: { tokens: any[] }) => {
        const text = tokens.map(t => t.text || '').join('');
        if (typeof text === 'object' && text && 'text' in text) {
          const textString = (text as any).text || '';
          return `<p class="email-paragraph">${textString}</p>`;
        }
        const textString = String(text);
        
        // Handle field extraction patterns
        if (enableDynamicFields && textString.includes('{{')) {
          const fieldPattern = /\{\{([^}]+)\}\}/g;
          const extractedFields: FieldExtraction[] = [];
          let processedText = textString;
          
          processedText = processedText.replace(fieldPattern, (match, fieldContent) => {
            const parts = fieldContent.split('|');
            const fieldType = parts[0]?.trim() || 'text';
            const placeholder = parts[1]?.trim() || `Enter ${fieldType}`;
            
            const extraction: FieldExtraction = {
              original: match,
              placeholder,
              fieldType,
              fieldData: templateVariables[fieldType]
            };
            
            extractedFields.push(extraction);
            
            return `<span class="dynamic-field" data-field-type="${fieldType}" data-original="${match}">${templateVariables[fieldType] || placeholder}</span>`;
          });
          
          return `<p class="email-paragraph" data-has-fields="true">${processedText}</p>`;
        }
        return `<p class="email-paragraph">${textString}</p>`;
      };
    };

    // Enhanced heading rendering based on content type
    renderer.heading = ({ tokens, depth }: { tokens: any[]; depth: number }) => {
      const text = tokens.map(t => t.text || '').join('');
      const level = depth;
      const textString = typeof text === 'string' ? text : String(text);
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

    // Apply custom renderer if provided
    if (customRenderer) {
      marked.use({ renderer: customRenderer });
    }

    // Process template variables
    let processedText = content;
    
    // Replace template variables like {{name}}, {{company}}, etc.
    Object.entries(templateVariables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      processedText = processedText.replace(regex, String(value || ''));
    });

    // Apply markdown processing
    const htmlContent = marked(processedText);
    
    // Sanitize the HTML for security
    const sanitizedContent = sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'em', 'u', 'br', 'ul', 'ol', 'li', 'blockquote',
        'a', 'pre', 'code'
      ],
      ALLOWED_ATTR: ['class', 'data-field-type', 'data-original', 'href', 'target'],
      ADD_ATTR: ['data-*']
    });

    return sanitizedContent;
  }, [content, contentType, templateVariables, enableDynamicFields, customRenderer]);

  // Handle dynamic field interactions
  const handleFieldClick = React.useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('dynamic-field')) {
      const fieldType = target.getAttribute('data-field-type');
      const original = target.getAttribute('data-original');
      
      // Could trigger editing modal or inline editing
      console.log('Field clicked:', { fieldType, original });
    }
  }, []);

  // Enhanced content based on type
  const getContentClasses = () => {
    const baseClasses = 'template-content-formatter';
    const typeClasses = {
      lesson: 'lesson-content prose prose-lg max-w-none',
      email: 'email-content',
      article: 'article-content prose max-w-none',
      general: 'general-content prose max-w-none'
    };
    
    return cn(baseClasses, typeClasses[contentType], className);
  };

  return (
    <div 
      className={getContentClasses()}
      onClick={enableDynamicFields ? handleFieldClick : undefined}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

// Helper function to extract template variables from content
export const extractTemplateVariables = (content: string): string[] => {
  const variablePattern = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variablePattern.exec(content)) !== null) {
    const variable = match[1].trim();
    if (!variables.includes(variable)) {
      variables.push(variable);
    }
  }
  
  return variables;
};

// Helper function to validate template content
export const validateTemplateContent = (content: string, requiredVariables: string[]): {
  isValid: boolean;
  missingVariables: string[];
  extraVariables: string[];
} => {
  const foundVariables = extractTemplateVariables(content);
  const missingVariables = requiredVariables.filter(req => !foundVariables.includes(req));
  const extraVariables = foundVariables.filter(found => !requiredVariables.includes(found));
  
  return {
    isValid: missingVariables.length === 0,
    missingVariables,
    extraVariables
  };
};

// Preview component for template editing
export const TemplatePreview: React.FC<{
  content: string;
  variables: Record<string, any>;
  contentType?: 'lesson' | 'email' | 'article';
}> = ({ content, variables, contentType = 'lesson' }) => {
  return (
    <div className="template-preview border rounded-lg p-4 bg-gray-50">
      <div className="mb-2 text-sm text-gray-600">Preview:</div>
      <TemplateContentFormatter
        content={content}
        contentType={contentType}
        templateVariables={variables}
        enableDynamicFields={false}
      />
    </div>
  );
};

// Enhanced field editor component
interface FieldEditorProps {
  fieldType: string;
  placeholder: string;
  value: any;
  onChange: (value: any) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  fieldType,
  placeholder,
  value,
  onChange
}) => {
  const getFieldInput = () => {
    switch (fieldType) {
      case 'text':
      case 'name':
      case 'company':
        return (
          <input
            type="text"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      case 'email':
        return (
          <input
            type="email"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      case 'textarea':
      case 'description':
        return (
          <textarea
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      default:
        return (
          <input
            type="text"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="field-editor">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}
      </label>
      {getFieldInput()}
    </div>
  );
};

// Template manager component for organizing multiple templates
interface Template {
  id: string;
  name: string;
  content: string;
  type: 'lesson' | 'email' | 'article';
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const TemplateManager: React.FC<{
  templates: Template[];
  onSelect: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onCreate: () => void;
}> = ({ templates, onSelect, onEdit, onDelete, onCreate }) => {
  return (
    <div className="template-manager">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Template Library</h3>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          New Template
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect(template)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                {template.type}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {template.content.substring(0, 100)}...
            </p>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {template.variables.length} variables
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(template);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(template.id);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};