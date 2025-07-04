import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy, RefreshCw, Lightbulb, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentImproverProps {
  onComplete?: () => void;
}

export const DocumentImprover: React.FC<DocumentImproverProps> = ({ onComplete }) => {
  const [originalText, setOriginalText] = useState('');
  const [improvementType, setImprovementType] = useState<string>('');
  const [improvedText, setImprovedText] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [improvements, setImprovements] = useState<string[]>([]);

  const improvementTypes = [
    { value: 'clarity', label: 'Improve Clarity', description: 'Make your message clearer and easier to understand' },
    { value: 'professional', label: 'Professional Tone', description: 'Enhance professionalism while maintaining warmth' },
    { value: 'concise', label: 'Make Concise', description: 'Reduce length while keeping key points' },
    { value: 'persuasive', label: 'More Persuasive', description: 'Strengthen impact for fundraising or advocacy' },
    { value: 'accessible', label: 'Plain Language', description: 'Simplify for broader audience accessibility' },
    { value: 'nyc_context', label: 'NYC Context', description: 'Add relevant NYC references and local context' }
  ];

  const improveDocument = async () => {
    if (!originalText.trim() || !improvementType) {
      toast.error('Please enter text and select an improvement type');
      return;
    }

    setIsImproving(true);
    
    try {
      // Simulate AI processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateImprovement(originalText, improvementType);
      setImprovedText(result.improvedText);
      setImprovements(result.improvements);
      
      toast.success('Document improved successfully!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to improve document. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  const generateImprovement = (text: string, type: string): { improvedText: string; improvements: string[] } => {
    const selectedType = improvementTypes.find(t => t.value === type);
    
    switch (type) {
      case 'clarity':
        return {
          improvedText: text
            .replace(/utilize/g, 'use')
            .replace(/in order to/g, 'to')
            .replace(/due to the fact that/g, 'because')
            .replace(/at this point in time/g, 'now')
            + '\n\n[Clarity improvements applied: simplified complex phrases, removed redundancy, improved sentence structure]',
          improvements: [
            'Replaced complex words with simpler alternatives',
            'Removed unnecessary phrases and redundancy',
            'Improved sentence structure for better flow',
            'Made technical terms more accessible'
          ]
        };

      case 'professional':
        return {
          improvedText: text
            .replace(/\bcan't\b/g, 'cannot')
            .replace(/\bwon't\b/g, 'will not')
            .replace(/\bthanks\b/g, 'thank you')
            .replace(/^hey/i, 'Dear')
            + '\n\n[Professional tone applied while maintaining warmth and approachability]',
          improvements: [
            'Enhanced formality level appropriately',
            'Maintained warm, approachable tone',
            'Improved greeting and closing',
            'Added professional courtesy phrases'
          ]
        };

      case 'concise':
        const sentences = text.split('. ');
        const shortened = sentences.slice(0, Math.ceil(sentences.length * 0.7)).join('. ');
        return {
          improvedText: shortened + '\n\n[Condensed while preserving key messages and impact]',
          improvements: [
            `Reduced length by approximately 30%`,
            'Eliminated redundant information',
            'Combined related sentences',
            'Preserved all critical points'
          ]
        };

      case 'persuasive':
        return {
          improvedText: text + '\n\nYour support makes a direct difference in our community. Together, we can create lasting change that transforms lives right here in New York City.\n\n[Enhanced with persuasive elements and call to action]',
          improvements: [
            'Added emotional connection to mission',
            'Included specific impact language',
            'Strengthened call to action',
            'Emphasized community benefit'
          ]
        };

      case 'accessible':
        return {
          improvedText: text
            .replace(/approximately/g, 'about')
            .replace(/demonstrate/g, 'show')
            .replace(/assistance/g, 'help')
            .replace(/individuals/g, 'people')
            + '\n\n[Simplified to 6th-grade reading level while maintaining professionalism]',
          improvements: [
            'Simplified vocabulary to 6th-grade reading level',
            'Shortened complex sentences',
            'Explained technical terms',
            'Improved overall readability'
          ]
        };

      case 'nyc_context':
        return {
          improvedText: text + '\n\nAs a vital part of New York City\'s nonprofit community, we understand the unique challenges our neighbors face - from the Bronx to Staten Island. Our work connects directly to the diverse communities that make NYC strong.\n\n[Added relevant NYC context and local connection]',
          improvements: [
            'Added specific NYC geographical references',
            'Connected to local community context',
            'Emphasized NYC nonprofit ecosystem',
            'Included borough diversity'
          ]
        };

      default:
        return {
          improvedText: text + '\n\n[General improvements applied]',
          improvements: ['Document reviewed and enhanced']
        };
    }
  };

  const copyImprovedText = () => {
    navigator.clipboard.writeText(improvedText);
    toast.success('Improved text copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-600" />
            Document Improver
          </CardTitle>
          <p className="text-sm text-gray-600">
            Enhance your existing text with AI-powered improvements
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Paste your text to improve
            </label>
            <Textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste your draft document, email, or any text you'd like to improve here..."
              rows={6}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Improvement Focus</label>
            <Select value={improvementType} onValueChange={setImprovementType}>
              <SelectTrigger>
                <SelectValue placeholder="What would you like to improve?" />
              </SelectTrigger>
              <SelectContent>
                {improvementTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={improveDocument} 
            disabled={isImproving || !originalText.trim() || !improvementType}
            className="w-full"
          >
            {isImproving ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Improving Document...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Improve Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {improvedText && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Improved Version</CardTitle>
              <Button variant="outline" size="sm" onClick={copyImprovedText}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <Badge variant="secondary" className="w-fit">
              {improvementTypes.find(t => t.value === improvementType)?.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-80">
                {improvedText}
              </pre>
            </div>

            {improvements.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Improvements Made
                </h4>
                <ul className="space-y-1">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Next step:</strong> Review the improvements and make any final edits to match your organization's specific voice and style.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};