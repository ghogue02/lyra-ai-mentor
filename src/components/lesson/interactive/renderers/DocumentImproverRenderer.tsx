import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { FileText, Sparkles, RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentImproverRendererProps {
  elementId: number;
  title: string;
  configuration: any;
  onComplete?: () => void;
}

export const DocumentImproverRenderer: React.FC<DocumentImproverRendererProps> = ({
  elementId,
  title,
  configuration,
  onComplete
}) => {
  const [phase, setPhase] = useState<'input' | 'improving' | 'comparison'>('input');
  const [originalText, setOriginalText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [improvementFocus, setImprovementFocus] = useState('clarity');
  const { callAI, loading } = useAITestingAssistant();
  const { toast } = useToast();

  const focusOptions = [
    { value: 'clarity', label: 'Clarity & Readability', description: 'Make it easier to understand' },
    { value: 'engagement', label: 'Emotional Engagement', description: 'Add heart and connection' },
    { value: 'professionalism', label: 'Professional Tone', description: 'Maintain credibility while improving' },
    { value: 'storytelling', label: 'Narrative Flow', description: 'Transform into compelling story' }
  ];

  const handleImproveDocument = async () => {
    if (!originalText.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide the document text you want to improve.",
        variant: "destructive"
      });
      return;
    }

    setPhase('improving');

    const context = `Character: ${configuration.character || 'Sofia Martinez'}
Transformation: ${configuration.transformation || 'institutional to storyteller'}
Maintain: ${configuration.maintain?.join(', ') || 'professionalism, accuracy'}`;

    const focusInstruction = focusOptions.find(f => f.value === improvementFocus)?.description || 'improve overall quality';

    const prompt = `Please improve this document by focusing on: ${focusInstruction}

Original Document:
${originalText}

Instructions:
1. Keep all factual information accurate
2. Maintain the original intent and key messages
3. Focus specifically on: ${focusInstruction}
4. Make it more engaging for nonprofit audiences
5. Ensure it feels authentic and human

Please provide the improved version that maintains professionalism while adding emotional connection and clarity.`;

    try {
      // Use character from configuration or default to Sofia (document improvement expert)
      const characterType = configuration.character?.toLowerCase() || 'sofia';
      const result = await callAI('document_improver', prompt, context, characterType);
      setImprovedText(result);
      setPhase('comparison');
      
      toast({
        title: "Document Improved!",
        description: "Your content has been enhanced for better impact."
      });
    } catch (error) {
      console.error('Error improving document:', error);
      toast({
        title: "Improvement Failed",
        description: "Please try again with different content.",
        variant: "destructive"
      });
      setPhase('input');
    }
  };

  const handleStartOver = () => {
    setPhase('input');
    setOriginalText('');
    setImprovedText('');
  };

  if (phase === 'input') {
    return (
      <Card className="p-6 bg-background border-border">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Document to Improve
              </label>
              <Textarea
                placeholder="Paste your email, proposal, newsletter content, or any text that needs improvement..."
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                className="min-h-[160px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Improvement Focus
              </label>
              <div className="grid gap-2">
                {focusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      improvementFocus === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="focus"
                      value={option.value}
                      checked={improvementFocus === option.value}
                      onChange={(e) => setImprovementFocus(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleImproveDocument}
            disabled={loading || !originalText.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Improving Document...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Improve My Document
              </>
            )}
          </Button>

          {configuration.timeSavings && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="font-medium text-accent">Time Savings</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Before:</strong> {configuration.timeSavings.before} | 
                <strong> After:</strong> {configuration.timeSavings.after} | 
                <strong> Savings:</strong> {configuration.timeSavings.metric}
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (phase === 'improving') {
    return (
      <Card className="p-6 bg-background border-border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Improving Your Document</h3>
          <p className="text-muted-foreground">
            Enhancing clarity, engagement, and impact while maintaining your authentic voice...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-background border-border">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Document Comparison</h3>
          </div>
          <Badge variant="secondary">Improved</Badge>
        </div>

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="improved">Improved</TabsTrigger>
            <TabsTrigger value="comparison">Side by Side</TabsTrigger>
          </TabsList>
          
          <TabsContent value="original" className="mt-4">
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {originalText}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="improved" className="mt-4">
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {improvedText}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Original</h4>
                <div className="bg-muted/30 border border-border rounded-lg p-4 h-64 overflow-y-auto">
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {originalText}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Improved</h4>
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 h-64 overflow-y-auto">
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {improvedText}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3">
          <Button onClick={handleStartOver} variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Improve Another Document
          </Button>
          <Button onClick={onComplete} className="flex-1">
            Continue Learning
          </Button>
        </div>

        {configuration.timeSavings && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="font-medium text-accent">Time Saved</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You just saved <strong>{configuration.timeSavings.metric}</strong> by using AI to enhance your document quality and impact.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};