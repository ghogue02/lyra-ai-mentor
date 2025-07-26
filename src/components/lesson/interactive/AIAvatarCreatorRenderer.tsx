import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Sparkles, User, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AIAvatarCreatorRendererProps {
  element: {
    id: number;
    configuration: {
      prompts: string[];
      style_options: string[];
    };
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const AIAvatarCreatorRenderer: React.FC<AIAvatarCreatorRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const { user, session } = useAuth();
  const [cause, setCause] = useState('');
  const [skill, setSkill] = useState('');
  const [mission, setMission] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const styleOptions = element.configuration?.style_options || ['Comic book style', 'Professional illustration', 'Watercolor art', 'Digital art'];

  const generateAvatar = useCallback(async () => {
    if (!cause.trim() || !skill.trim() || !selectedStyle || !user) {
      setError('Please fill in all fields and select a style');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = `A superhero representing ${cause} with powers of ${skill}, ${selectedStyle.toLowerCase()}, professional quality, inspiring and heroic, vibrant colors`;

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
              content: `Generate an image using gpt-image-1: ${prompt}`
            }
          ],
          userId: user.id,
          isImageGeneration: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate avatar');
      }

      // For now, we'll create a placeholder since we'd need to implement the actual image generation API
      // In the real implementation, this would call OpenAI's gpt-image-1 API
      const placeholderUrl = `https://via.placeholder.com/512x512/6366f1/ffffff?text=Avatar+Generated!`;
      setGeneratedImage(placeholderUrl);

      if (!isElementCompleted) {
        await onComplete();
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      setError('Failed to generate avatar. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [cause, skill, selectedStyle, user, session, isElementCompleted, onComplete]);

  const downloadImage = useCallback(() => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'nonprofit-superhero-avatar.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [generatedImage]);

  const resetCreator = useCallback(() => {
    setCause('');
    setSkill('');
    setMission('');
    setSelectedStyle('');
    setGeneratedImage('');
    setError('');
  }, []);

  if (generatedImage) {
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
              <CardTitle className="text-xl">Your Superhero Avatar</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="relative mx-auto w-64 h-64 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={generatedImage} 
                alt="Generated superhero avatar"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-brand-cyan/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Your superhero represents:</p>
              <p className="font-medium">{cause} with powers of {skill}</p>
              <Badge className="mt-2 bg-primary/10 text-primary">
                {selectedStyle}
              </Badge>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={downloadImage} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={resetCreator} variant="outline" size="sm">
                Create Another
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
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Create Your Superhero Avatar</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate a unique avatar representing your nonprofit mission
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="cause">What cause do you champion?</Label>
              <Input
                id="cause"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                placeholder="e.g., Education, Environment, Health, etc."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="skill">What's your superpower/skill?</Label>
              <Input
                id="skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g., Communication, Organization, Innovation, etc."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Choose your avatar style</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {styleOptions.map((style) => (
                  <Button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    variant={selectedStyle === style ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={generateAvatar}
            disabled={isGenerating || !cause.trim() || !skill.trim() || !selectedStyle}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Avatar...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Avatar
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};