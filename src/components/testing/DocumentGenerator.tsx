import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Copy, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentGeneratorProps {
  onComplete?: () => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ onComplete }) => {
  const [documentType, setDocumentType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const documentTypes = [
    { value: 'program_report', label: 'Program Report', description: 'Monthly/quarterly program updates' },
    { value: 'grant_proposal', label: 'Grant Proposal', description: 'Funding request proposals' },
    { value: 'board_memo', label: 'Board Memo', description: 'Executive summaries for board meetings' },
    { value: 'policy_brief', label: 'Policy Brief', description: 'Issue analysis and recommendations' },
    { value: 'newsletter', label: 'Newsletter Article', description: 'Community updates and stories' },
    { value: 'volunteer_guide', label: 'Volunteer Guide', description: 'Training and orientation materials' }
  ];

  const generateDocument = async () => {
    if (!documentType || !prompt.trim()) {
      toast.error('Please select a document type and enter your requirements');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const selectedType = documentTypes.find(type => type.value === documentType);
      const mockContent = generateMockContent(documentType, prompt);
      
      setGeneratedContent(mockContent);
      toast.success(`${selectedType?.label} generated successfully!`);
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContent = (type: string, userPrompt: string): string => {
    switch (type) {
      case 'program_report':
        return `# Monthly Program Report - ${new Date().toLocaleDateString()}

## Executive Summary
Based on your request: "${userPrompt}"

This month, our program achieved significant milestones in community engagement and service delivery. Key highlights include increased participation rates and positive feedback from beneficiaries.

## Program Metrics
- **Participants Served**: 245 individuals
- **Programs Delivered**: 18 sessions
- **Completion Rate**: 87%
- **Satisfaction Score**: 4.6/5

## Key Achievements
1. **Community Outreach**: Expanded reach to underserved neighborhoods in Queens
2. **Partnership Development**: Established collaboration with local schools
3. **Resource Development**: Secured additional supplies through donor network

## Challenges & Solutions
- **Challenge**: Limited transportation for participants
- **Solution**: Partnered with local transit authority for reduced-fare program

## Next Month's Goals
- Increase participant enrollment by 15%
- Launch new workshop series
- Complete staff training on cultural competency

## Budget Summary
Operating within 95% of allocated budget, with savings redirected to emergency assistance fund.

---
*This report was generated with AI assistance to help you communicate program impact effectively.*`;

      case 'board_memo':
        return `# Board Memorandum
**To**: Board of Directors  
**From**: Executive Director  
**Date**: ${new Date().toLocaleDateString()}  
**Re**: ${userPrompt}

## Purpose
This memo addresses the key issues and recommendations outlined in your request.

## Background
Recent developments in our sector require strategic consideration and board input on our organizational direction.

## Key Issues
1. **Financial Sustainability**: Current funding landscape shows increased competition
2. **Program Expansion**: Opportunity to serve additional communities
3. **Technology Upgrade**: Need for improved data management systems

## Recommendations
- **Short-term** (0-3 months): Implement cost-saving measures
- **Medium-term** (3-12 months): Diversify funding sources
- **Long-term** (12+ months): Strategic planning for program expansion

## Resource Requirements
- Budget allocation: $25,000 for technology upgrades
- Staff time: 20 hours/week for grant writing
- Board engagement: Monthly strategy sessions

## Next Steps
1. Board discussion and approval at next meeting
2. Formation of strategic planning committee
3. Timeline development for implementation

Your guidance and approval are requested to move forward with these initiatives.

---
*Generated with AI assistance for clear board communication.*`;

      default:
        return `# ${documentTypes.find(t => t.value === type)?.label || 'Document'}

## Overview
Based on your requirements: "${userPrompt}"

This document has been structured to meet the specific needs of NYC non-profit organizations, incorporating best practices for clear communication and professional presentation.

## Key Sections
- Executive Summary
- Main Content
- Action Items
- Next Steps

## Professional Format
This document follows standard formatting for non-profit communications, ensuring clarity and impact for your intended audience.

---
*Generated with AI assistance to support your organization's communication needs.*`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Document copied to clipboard!');
  };

  const downloadDocument = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${documentType}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Document downloaded!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Document Generator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create professional documents for your non-profit with AI assistance
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
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

          <div>
            <label className="block text-sm font-medium mb-2">
              What do you need this document to cover?
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you need in this document. For example: 'Create a quarterly report for our youth mentorship program showing impact on 50 high school students in Brooklyn...'"
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={generateDocument} 
            disabled={isGenerating || !documentType || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generating Document...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Document</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadDocument}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              {documentTypes.find(t => t.value === documentType)?.label}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-96">
                {generatedContent}
              </pre>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Pro tip:</strong> This is a starting point! Edit and customize this document to match your organization's specific voice and requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};