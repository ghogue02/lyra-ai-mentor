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
      <div className="nm-card nm-surface-cyan nm-p-xl">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 nm-text-accent text-lg font-semibold">
            <Sandwich className="w-5 h-5" />
            {element.title}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 nm-text-primary">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Mastered!</span>
            <span className="nm-badge nm-badge-cyan">
              Time Saved: {timeSavings.metric || '84%'}
            </span>
          </div>
          <p className="text-sm nm-text-secondary">
            You've learned {character}'s prompt sandwich technique for perfect AI emails.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="nm-card nm-p-xl">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 nm-text-primary text-lg font-semibold">
          <Sandwich className="w-5 h-5" />
          {element.title}
        </h3>
        <div className="flex items-center gap-4 mt-2">
          <span className="nm-badge nm-badge-accent">
            <Layers className="w-3 h-3 mr-1" />
            {character}'s Technique
          </span>
          <span className="nm-badge nm-badge-cyan">
            <Target className="w-3 h-3 mr-1" />
            {timeSavings.time_savings || '32 min → 5 min'}
          </span>
        </div>
      </div>
      <div className="space-y-6">
        {/* Instructions */}
        <div className="nm-card-sunken nm-p-lg">
          <h4 className="font-semibold nm-text-primary mb-2">
            Build Your Perfect AI Prompt Sandwich
          </h4>
          <p className="text-sm nm-text-secondary mb-3">
            {element.content}
          </p>
          <div className="text-xs nm-text-accent nm-surface-purple nm-p-sm nm-rounded-md">
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
        <button
          onClick={handleGeneratePrompt}
          disabled={!isReadyToGenerate || isGenerating}
          className={`nm-button-primary w-full ${(!isReadyToGenerate || isGenerating) ? 'opacity-60 cursor-not-allowed' : ''}`}
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
        </button>

        {/* Generated Prompt Display */}
        {generatedPrompt && (
          <div className="space-y-3">
            <label className="text-sm font-medium nm-text-primary">Your Perfect AI Prompt:</label>
            <div className="nm-card-sunken nm-p-lg">
              <textarea
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                className="nm-input min-h-[150px] font-mono text-sm resize-none"
                placeholder="Your custom prompt will appear here..."
              />
            </div>
            <div className="text-xs nm-text-muted nm-surface-elevated nm-p-sm nm-rounded-md">
              💡 Pro Tip: Copy this prompt and use it in ChatGPT, Claude, or your favorite AI tool!
            </div>
          </div>
        )}

        {/* Complete Button */}
        {generatedPrompt && (
          <button
            onClick={handleComplete}
            className="nm-button-primary w-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Prompt Builder
          </button>
        )}
      </div>
    </div>
  );
};