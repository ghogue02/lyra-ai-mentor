import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw, Heart, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AIMottoGeneratorRendererProps {
  element: {
    id: number;
    configuration: {
      prompt_template: string;
      examples: string[];
    };
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const AIMottoGeneratorRenderer: React.FC<AIMottoGeneratorRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [cause, setCause] = useState('');
  const [audience, setAudience] = useState('');
  const [values, setValues] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mottos, setMottos] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const examples = element.configuration?.examples || [];

  const generateMottos = useCallback(async () => {
    if (!cause.trim() || !audience.trim() || !values.trim() || !user) {
      setError('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = `Create 5 inspiring and memorable mottos for a nonprofit focused on ${cause} that serves ${audience} with core values of ${values}. Each motto should be concise, powerful, and capture the organization's mission. Return them as a numbered list.`;

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
        throw new Error('Failed to generate mottos');
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

      // Parse the numbered list from the response
      const mottoMatches = fullResponse.match(/\d+\.\s*(.+)/g);
      if (mottoMatches) {
        const parsedMottos = mottoMatches.map(match => 
          match.replace(/^\d+\.\s*/, '').trim()
        );
        setMottos(parsedMottos);
      } else {
        // Fallback: split by lines and filter
        const lines = fullResponse.split('\n').filter(line => line.trim());
        setMottos(lines.slice(0, 5));
      }

      if (!isElementCompleted) {
        await onComplete();
      }
    } catch (error) {
      console.error('Error generating mottos:', error);
      setError('Failed to generate mottos. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [cause, audience, values, user, session, isElementCompleted, onComplete]);

  const copyMotto = useCallback((motto: string) => {
    navigator.clipboard.writeText(motto);
    toast({
      title: "Copied!",
      description: "Motto copied to clipboard",
    });
  }, [toast]);

  const resetGenerator = useCallback(() => {
    setCause('');
    setAudience('');
    setValues('');
    setMottos([]);
    setError('');
  }, []);

  if (mottos.length > 0) {
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
              <CardTitle className="text-xl">Your Inspiring Mottos</CardTitle>
            </div>
            <Badge className="bg-primary/10 text-primary">
              Generated for {cause}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mottos.map((motto, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-primary/5 to-brand-cyan/5 rounded-lg p-4 group hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground flex-1">{motto}</p>
                    <Button
                      onClick={() => copyMotto(motto)}
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 flex gap-2 justify-center">
              <Button onClick={generateMottos} variant="outline" size="sm" disabled={isGenerating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Mottos
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
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Generate Inspiring Mottos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create powerful mottos that capture your organization's spirit
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {examples.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Examples of great mottos:</h4>
              <div className="space-y-1">
                {examples.map((example, index) => (
                  <p key={index} className="text-sm text-muted-foreground italic">
                    "{example}"
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="cause">What cause does your organization focus on?</Label>
              <Input
                id="cause"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="e.g., Education, Environmental protection, Community health"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="audience">Who do you serve?</Label>
              <Input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Children in underserved communities, Local families"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="values">What are your core values?</Label>
              <Input
                id="values"
                value={values}
                onChange={(e) => setValues(e.target.value)}
                placeholder="e.g., Compassion, empowerment, sustainability"
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
            onClick={generateMottos}
            disabled={isGenerating || !cause.trim() || !audience.trim() || !values.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Mottos...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Generate My Mottos
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};