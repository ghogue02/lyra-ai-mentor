
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';

interface AIContentGeneratorRendererProps {
  element: {
    id: number;
    type: string;
    title: string;
    content: string;
    configuration: any;
  };
  isElementCompleted: boolean;
  onComplete: () => void;
}

export const AIContentGeneratorRenderer: React.FC<AIContentGeneratorRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { callAI, loading } = useAITestingAssistant();

  const organizations = element.configuration?.organizations || [];
  const contentTypes = element.configuration?.content_types || [];

  const generateContent = async () => {
    if (!selectedOrg || !selectedType) return;

    try {
      const prompt = `Generate a ${selectedType} for ${selectedOrg}. Make it compelling, professional, and specific to their mission. Keep it concise and actionable.`;
      const result = await callAI('content_generation', prompt);
      setGeneratedContent(result);
      
      if (!isElementCompleted) {
        onComplete();
      }
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const copyContent = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = selectedOrg && selectedType;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">{element.content}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Choose Organization</label>
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select an organization..." />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org: string) => (
                <SelectItem key={org} value={org} className="text-sm">
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Content Type</label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select content type..." />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((type: string) => (
                <SelectItem key={type} value={type} className="text-sm">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={generateContent} 
          disabled={!canGenerate || loading} 
          size="sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </div>

      {generatedContent && (
        <Card className="border border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-purple-100 text-purple-700 text-xs">
                AI Generated Content
              </Badge>
              <Button onClick={copyContent} variant="ghost" size="sm" className="text-xs">
                {copied ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
              {generatedContent}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
