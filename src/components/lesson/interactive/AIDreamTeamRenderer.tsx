import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Users, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AIDreamTeamRendererProps {
  element: {
    id: number;
    configuration: {
      prompt_template: string;
      historical_categories: string[];
    };
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const AIDreamTeamRenderer: React.FC<AIDreamTeamRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const { user, session } = useAuth();
  const [cause, setCause] = useState('');
  const [mission, setMission] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dreamTeamStory, setDreamTeamStory] = useState<string>('');
  const [error, setError] = useState<string>('');

  const categories = element.configuration?.historical_categories || [];

  const generateDreamTeam = useCallback(async () => {
    if (!cause.trim() || !mission.trim() || !user) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = `Create a fun and inspiring story about 3 historical figures who would be passionate about ${cause} and how they would help with ${mission}. ${selectedCategory ? `Focus on historical ${selectedCategory.toLowerCase()}.` : ''} Make it entertaining, creative, and motivational! Include specific ways each figure would contribute their unique talents and perspectives. Write it as an engaging narrative that brings these figures to life in a modern nonprofit context.`;

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
        throw new Error('Failed to generate dream team story');
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

      setDreamTeamStory(fullResponse);

      if (!isElementCompleted) {
        await onComplete();
      }
    } catch (error) {
      console.error('Error generating dream team:', error);
      setError('Failed to generate dream team story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [cause, mission, selectedCategory, user, session, isElementCompleted, onComplete]);

  const resetGenerator = useCallback(() => {
    setCause('');
    setMission('');
    setSelectedCategory('');
    setDreamTeamStory('');
    setError('');
  }, []);

  if (dreamTeamStory) {
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
              <CardTitle className="text-xl">Your Historical Dream Team</CardTitle>
            </div>
            {selectedCategory && (
              <Badge className="bg-primary/10 text-primary">
                Featuring {selectedCategory}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-primary/5 to-brand-cyan/5 rounded-lg p-6">
              <div className="prose prose-sm max-w-none text-foreground">
                {dreamTeamStory.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-3 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-2 justify-center">
              <Button onClick={generateDreamTeam} variant="outline" size="sm" disabled={isGenerating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Team
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
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Build Your Historical Dream Team</CardTitle>
              <p className="text-sm text-muted-foreground">
                Discover which historical figures would champion your cause
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="cause">What cause are you passionate about?</Label>
              <Input
                id="cause"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="e.g., Education for all, Environmental protection, Social justice"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="mission">What's your specific mission?</Label>
              <Input
                id="mission"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="e.g., Building literacy in rural communities, Reducing plastic waste"
                className="mt-1"
              />
            </div>

            {categories.length > 0 && (
              <div>
                <Label>Preferred historical category (optional)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  <Button
                    onClick={() => setSelectedCategory('')}
                    variant={selectedCategory === '' ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                  >
                    Any Category
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={generateDreamTeam}
            disabled={isGenerating || !cause.trim() || !mission.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Assembling Your Dream Team...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Build My Dream Team
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};