import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, Copy, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AISuccessVisualizerRendererProps {
  element: {
    id: number;
    configuration: {
      prompt_template: string;
      vision_elements: string[];
    };
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const AISuccessVisualizerRenderer: React.FC<AISuccessVisualizerRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [organization, setOrganization] = useState('');
  const [community, setCommunity] = useState('');
  const [goals, setGoals] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [visionStatement, setVisionStatement] = useState<string>('');
  const [error, setError] = useState<string>('');

  const visionElements = element.configuration?.vision_elements || [];

  const generateVision = useCallback(async () => {
    if (!organization.trim() || !community.trim() || !goals.trim() || !user) {
      setError('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = `Create an inspiring and motivational vision statement for how ${organization} will transform ${community} over the next year using AI tools to enhance ${goals}. Make it specific to their mission, realistic yet ambitious, and paint a vivid picture of the positive impact they will achieve. The vision should be 2-3 paragraphs long and inspire action while acknowledging the power of AI to amplify their work.`;

      const response = await fetch('https://hfkzwjnlxrwynactcmpe.supabase.co/functions/v1/chat-with-lyra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0'}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          userId: user.id,
          useCleanFormatting: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate vision statement');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullResponse += data.content;
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }

      setVisionStatement(fullResponse);

      if (!isElementCompleted) {
        await onComplete();
      }
    } catch (error) {
      console.error('Error generating vision:', error);
      setError('Failed to generate vision statement. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [organization, community, goals, user, session, isElementCompleted, onComplete]);

  const copyVision = useCallback(() => {
    navigator.clipboard.writeText(visionStatement);
    toast({
      title: "Copied!",
      description: "Vision statement copied to clipboard",
    });
  }, [visionStatement, toast]);

  const resetGenerator = useCallback(() => {
    setOrganization('');
    setCommunity('');
    setGoals('');
    setVisionStatement('');
    setError('');
  }, []);

  if (visionStatement) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="premium-card border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl">Your AI-Powered Vision</CardTitle>
            </div>
            <Badge className="bg-primary/10 text-primary">
              {organization}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-primary/5 to-brand-cyan/5 rounded-lg p-6">
              <div className="prose prose-sm max-w-none text-foreground">
                {visionStatement.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 leading-relaxed text-base">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {visionElements.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {visionElements.map((element, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-muted-foreground">{element}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex gap-2 justify-center">
              <Button onClick={copyVision} size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy Vision
              </Button>
              <Button onClick={generateVision} variant="outline" size="sm" disabled={isGenerating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Vision
              </Button>
              <Button onClick={resetGenerator} variant="outline" size="sm">
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="premium-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Visualize Your AI-Powered Future</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create an inspiring vision of your organization's impact with AI
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {visionElements.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Your vision will include:</h4>
              <div className="grid grid-cols-2 gap-2">
                {visionElements.map((element, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {element}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="organization">Your organization name</Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g., Hope Education Center, Green Valley Foundation"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="community">Community/cause you serve</Label>
              <Input
                id="community"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="e.g., underserved students, local environment, homeless families"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="goals">Specific goals you want to achieve</Label>
              <Input
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g., literacy rates, volunteer engagement, fundraising efficiency"
                className="mt-1"
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={generateVision}
            disabled={isGenerating || !organization.trim() || !community.trim() || !goals.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Vision...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Generate My Vision
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};