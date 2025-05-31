
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';

export const AIContentGenerator = () => {
  const [organizationType, setOrganizationType] = useState('');
  const [mission, setMission] = useState('');
  const [contentType, setContentType] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const { callAI, loading } = useAITestingAssistant();

  const organizationTypes = [
    'Education/Schools',
    'Healthcare/Medical',
    'Environmental',
    'Animal Welfare',
    'Poverty/Homelessness',
    'Arts/Culture',
    'Youth Development',
    'Senior Services',
    'Food Security',
    'Community Development'
  ];

  const contentTypes = [
    'Fundraising Email',
    'Social Media Post',
    'Grant Proposal Snippet',
    'Newsletter Content',
    'Volunteer Recruitment'
  ];

  const generateContent = async () => {
    if (!organizationType || !mission || !contentType) return;

    try {
      const prompt = `Organization: ${organizationType}
Mission: ${mission}
Content Type: ${contentType}

Create compelling, professional content for this nonprofit. Make it engaging and action-oriented.`;

      const result = await callAI('grant_writing', prompt);
      setGeneratedContent(result);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const copyContent = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = organizationType && mission.trim() && contentType;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Nonprofit Content Generator</h3>
        <p className="text-sm text-gray-600">Generate personalized content for your organization</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Organization Type</label>
          <Select value={organizationType} onValueChange={setOrganizationType}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select your organization type" />
            </SelectTrigger>
            <SelectContent>
              {organizationTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Mission/Focus</label>
          <Textarea
            placeholder="Describe your organization's mission and key activities..."
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="text-sm resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Content Type</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="What type of content do you need?" />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateContent}
          disabled={!canGenerate || loading}
          className="w-full"
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
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-purple-100 text-purple-700 text-xs">
                AI Generated Content
              </Badge>
              <Button
                onClick={copyContent}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
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
