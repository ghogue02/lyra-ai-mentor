import React from 'react';
import TemplateContentFormatter from '@/components/ui/TemplateContentFormatter';

const TemplateFormatterDemo: React.FC = () => {
  const sampleTemplate = `
Subject: Thank you for your generous donation, {{FirstName}}!

Preheader: Your support makes all the difference in our community.

Dear {{FirstName}} {{LastName}},

Thank you for your recent donation of {{DonationAmount}} to {{Organization}}. Your generosity helps us continue our mission.

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
  `.trim();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Template Content Formatter Demo
        </h1>
        <p className="text-gray-600">
          A powerful component that transforms email templates with merge fields and markdown support
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Raw Template Content</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-auto max-h-96">
            {sampleTemplate}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Formatted Output (Default)</h2>
          <TemplateContentFormatter 
            content={sampleTemplate}
            variant="default"
            showMergeFieldTypes={true}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Different Variants</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Preview Variant</h3>
            <TemplateContentFormatter 
              content={sampleTemplate}
              variant="preview"
              showMergeFieldTypes={false}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Compact Variant</h3>
            <TemplateContentFormatter 
              content={sampleTemplate}
              variant="compact"
              showMergeFieldTypes={true}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Custom Styled</h3>
            <TemplateContentFormatter 
              content={sampleTemplate}
              variant="default"
              showMergeFieldTypes={true}
              className="border-2 border-purple-200"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Features Demonstrated</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Merge Field Processing</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Transforms {`{{FirstName}} → [First Name]`}</li>
              <li>• Color-coded by field type</li>
              <li>• Automatic categorization</li>
              <li>• Legend showing all fields used</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Email Structure</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Subject line special formatting</li>
              <li>• Preheader styling</li>
              <li>• Proper paragraph spacing</li>
              <li>• Markdown to HTML conversion</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Security & Safety</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• HTML sanitization with DOMPurify</li>
              <li>• XSS prevention</li>
              <li>• Safe rendering of user content</li>
              <li>• Controlled allowed tags</li>
            </ul>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-medium text-orange-900 mb-2">Performance</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Memoized content processing</li>
              <li>• Efficient merge field parsing</li>
              <li>• Responsive design</li>
              <li>• TypeScript support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFormatterDemo;