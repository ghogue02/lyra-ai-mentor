import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptPreviewBoxProps {
  prompt: string;
  isGenerating: boolean;
  onGenerate: () => void;
  generateButtonText?: string;
  title?: string;
}

export const PromptPreviewBox: React.FC<PromptPreviewBoxProps> = ({
  prompt,
  isGenerating,
  onGenerate,
  generateButtonText = 'Generate AI Analysis',
  title = 'LLM Prompt Preview'
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied to clipboard', description: 'Prompt copied successfully' });
    } catch (error) {
      toast({ title: 'Copy failed', description: 'Unable to copy to clipboard', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-4 h-4" />
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="text-xs font-medium whitespace-pre-wrap nm-card-subtle p-4 rounded-lg border leading-relaxed">
              {prompt}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-background/80"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={onGenerate} disabled={isGenerating} className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : generateButtonText}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};