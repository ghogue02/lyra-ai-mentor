import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sandwich, Layers, Target, Sparkles, CheckCircle } from 'lucide-react';

interface PromptBuilderRendererProps {
  element: {
    id: number;
    title: string;
    content: string;
    configuration: any;
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const PromptBuilderRenderer: React.FC<PromptBuilderRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedContext, setSelectedContext] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const config = element.configuration || {};
  const character = config.character || 'Maya Rodriguez';
  const timeSavings = config.timeSavings || {};

  const toneOptions = [
    { value: 'professional', label: 'Professional & Formal', description: 'Board members, grant funders' },
    { value: 'warm', label: 'Warm & Empathetic', description: 'Parents, families, volunteers' },
    { value: 'collaborative', label: 'Collaborative & Inspiring', description: 'Staff, partners, community' },
    { value: 'urgent', label: 'Urgent but Respectful', description: 'Time-sensitive requests' }
  ];

  const contextOptions = [
    { value: 'parent_concern', label: 'Parent Concern', description: 'Addressing family questions/issues' },
    { value: 'board_communication', label: 'Board Communication', description: 'Formal organizational updates' },
    { value: 'donor_stewardship', label: 'Donor Stewardship', description: 'Gratitude and impact sharing' },
    { value: 'volunteer_coordination', label: 'Volunteer Coordination', description: 'Organizing community helpers' },
    { value: 'program_updates', label: 'Program Updates', description: 'Sharing news and changes' }
  ];

  const templateOptions = [
    { value: 'problem_solution', label: 'Problem → Solution', description: 'Acknowledge issue, offer fixes' },
    { value: 'update_action', label: 'Update → Action', description: 'Share news, request next steps' },
    { value: 'gratitude_impact', label: 'Gratitude → Impact', description: 'Thank and show difference made' },
    { value: 'request_reason', label: 'Request → Reason', description: 'Ask for help with clear why' },
    { value: 'story_invitation', label: 'Story → Invitation', description: 'Share success, invite participation' }
  ];

  const handleGeneratePrompt = async () => {
    if (!selectedTone || !selectedContext || !selectedTemplate) return;

    setIsGenerating(true);
    
    // Simulate AI prompt generation
    setTimeout(() => {
      const toneData = toneOptions.find(t => t.value === selectedTone);
      const contextData = contextOptions.find(c => c.value === selectedContext);
      const templateData = templateOptions.find(t => t.value === selectedTemplate);

      const prompt = `Write a ${toneData?.label.toLowerCase()} email for ${contextData?.description.toLowerCase()} using a ${templateData?.label.toLowerCase()} structure.

TONE: ${toneData?.description}
CONTEXT: ${contextData?.description}  
TEMPLATE: ${templateData?.description}

Keep the email:
- Authentic to Maya's voice as a nonprofit program director
- Professional yet warm
- Action-oriented with clear next steps
- Appropriate for the after-school program context

The email should be approximately 150-200 words and include a specific call to action.`;

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
    }, 1500);
  };

  const handleComplete = async () => {
    await onComplete();
  };

  const isReadyToGenerate = selectedTone && selectedContext && selectedTemplate;

  if (isElementCompleted) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Sandwich className="w-5 h-5" />
            {element.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Mastered!</span>
            <Badge className="bg-green-600 text-white">
              Time Saved: {timeSavings.metric || '84%'}
            </Badge>
          </div>
          <p className="text-sm text-green-600 mt-2">
            You've learned {character}'s prompt sandwich technique for perfect AI emails.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Sandwich className="w-5 h-5" />
          {element.title}
        </CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="outline" className="text-orange-700">
            <Layers className="w-3 h-3 mr-1" />
            {character}'s Technique
          </Badge>
          <Badge variant="outline" className="text-green-700">
            <Target className="w-3 h-3 mr-1" />
            {timeSavings.time_savings || '32 min → 5 min'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className="bg-white/50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            Build Your Perfect AI Prompt Sandwich
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            {element.content}
          </p>
          <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
            💡 Maya's Secret: Layer tone + context + template for emails that sound exactly like you
          </div>
        </div>

        {/* Layer 1: Tone */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 1</span>
            Choose Your Tone
          </Label>
          <Select value={selectedTone} onValueChange={setSelectedTone}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone for your email..." />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  <div>
                    <div className="font-medium">{tone.label}</div>
                    <div className="text-xs text-gray-500">{tone.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Layer 2: Context */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 2</span>
            Select Context
          </Label>
          <Select value={selectedContext} onValueChange={setSelectedContext}>
            <SelectTrigger>
              <SelectValue placeholder="What's the email about?" />
            </SelectTrigger>
            <SelectContent>
              {contextOptions.map((context) => (
                <SelectItem key={context.value} value={context.value}>
                  <div>
                    <div className="font-medium">{context.label}</div>
                    <div className="text-xs text-gray-500">{context.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Layer 3: Template */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">Layer 3</span>
            Pick Template Structure
          </Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="How should it flow?" />
            </SelectTrigger>
            <SelectContent>
              {templateOptions.map((template) => (
                <SelectItem key={template.value} value={template.value}>
                  <div>
                    <div className="font-medium">{template.label}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGeneratePrompt}
          disabled={!isReadyToGenerate || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Building Your Prompt Sandwich...
            </>
          ) : (
            <>
              <Sandwich className="w-4 h-4 mr-2" />
              Generate My Prompt Sandwich
            </>
          )}
        </Button>

        {/* Generated Prompt Display */}
        {generatedPrompt && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Your Perfect AI Prompt:</Label>
            <div className="bg-white border rounded-lg p-4">
              <Textarea
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
                placeholder="Your custom prompt will appear here..."
              />
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              💡 Pro Tip: Copy this prompt and use it in ChatGPT, Claude, or your favorite AI tool!
            </div>
          </div>
        )}

        {/* Complete Button */}
        {generatedPrompt && (
          <Button
            onClick={handleComplete}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Prompt Builder
          </Button>
        )}
      </CardContent>
    </Card>
  );
};