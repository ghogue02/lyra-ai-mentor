import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { BarChart3, Heart, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataStorytellerRendererProps {
  elementId: number;
  title: string;
  configuration: any;
  onComplete?: () => void;
}

export const DataStorytellerRenderer: React.FC<DataStorytellerRendererProps> = ({
  elementId,
  title,
  configuration,
  onComplete
}) => {
  const [phase, setPhase] = useState<'input' | 'generating' | 'result'>('input');
  const [rawData, setRawData] = useState('');
  const [story, setStory] = useState('');
  const [audience, setAudience] = useState('');
  const { callAI, loading } = useAITestingAssistant();
  const { toast } = useToast();

  const handleGenerateStory = async () => {
    if (!rawData.trim() || !audience.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both your data and target audience.",
        variant: "destructive"
      });
      return;
    }

    setPhase('generating');

    const context = `Character: ${configuration.character || 'Sofia Martinez'}
Scenario: ${configuration.scenario || 'story transformation'}
Framework: ${configuration.framework || 'problem-intervention-resolution-impact'}`;

    const prompt = `Help me transform this raw data into a compelling narrative story for ${audience}.

Raw Data/Information:
${rawData}

Target Audience: ${audience}

Please create a story that:
1. Starts with a relatable problem or character
2. Shows the intervention or solution
3. Demonstrates clear resolution and transformation  
4. Highlights measurable impact

Make it emotionally engaging while staying accurate to the data. Focus on human connection and authentic storytelling.`;

    try {
      const result = await callAI('ai_content_generator', prompt, context);
      setStory(result);
      setPhase('result');
      
      toast({
        title: "Story Generated!",
        description: "Your data has been transformed into a compelling narrative."
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again with different data or audience.",
        variant: "destructive"
      });
      setPhase('input');
    }
  };

  const handleStartOver = () => {
    setPhase('input');
    setRawData('');
    setStory('');
    setAudience('');
  };

  if (phase === 'input') {
    return (
      <Card className="p-6 bg-background border-border">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Your Raw Data or Information
              </label>
              <Textarea
                placeholder="Paste your statistics, survey results, program metrics, or any data you want to transform into a story..."
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Target Audience
              </label>
              <Textarea
                placeholder="Who is this story for? (e.g., potential donors, board members, community partners, grant reviewers...)"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateStory}
              disabled={loading || !rawData.trim() || !audience.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Crafting Your Story...
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Transform Data into Story
                </>
              )}
            </Button>
          </div>

          {configuration.timeSavings && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-accent" />
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

  if (phase === 'generating') {
    return (
      <Card className="p-6 bg-background border-border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Crafting Your Story</h3>
          <p className="text-muted-foreground">
            Transforming your data into an emotionally compelling narrative...
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
            <Heart className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Your Data Story</h3>
          </div>
          <Badge variant="secondary">Generated</Badge>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {story}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleStartOver} variant="outline" className="flex-1">
            Create Another Story
          </Button>
          <Button onClick={onComplete} className="flex-1">
            Continue Learning
          </Button>
        </div>

        {configuration.timeSavings && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <span className="font-medium text-accent">Time Saved</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You just saved <strong>{configuration.timeSavings.metric}</strong> by using AI to transform raw data into compelling storytelling.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};