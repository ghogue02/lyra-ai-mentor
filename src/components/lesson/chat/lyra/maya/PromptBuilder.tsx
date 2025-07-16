import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptBuilderProps {
  purpose: string;
  audience: string;
  selectedConsiderations: string[];
  onEmailGenerated: (email: string, promptType: 'basic' | 'comprehensive') => void;
}

const PromptBuilder: React.FC<PromptBuilderProps> = ({
  purpose,
  audience,
  selectedConsiderations,
  onEmailGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [usedPrompt, setUsedPrompt] = useState('');
  const [promptType, setPromptType] = useState<'basic' | 'comprehensive'>('basic');

  const generateEmail = async (type: 'basic' | 'comprehensive') => {
    setIsGenerating(true);
    setPromptType(type);
    
    try {
      const response = await fetch('/api/maya-prompt-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purpose,
          audience,
          selectedConsiderations,
          promptType: type
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setGeneratedEmail(data.email);
      setUsedPrompt(data.promptUsed);
      onEmailGenerated(data.email, type);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const PACE_COMPONENTS = {
    P: { label: 'Purpose', value: purpose, color: 'bg-blue-100 text-blue-800' },
    A: { label: 'Audience', value: audience, color: 'bg-green-100 text-green-800' },
    C: { label: 'Connection', value: selectedConsiderations.join(', '), color: 'bg-purple-100 text-purple-800' },
    E: { label: 'Engagement', value: 'Compelling story + clear action', color: 'bg-orange-100 text-orange-800' }
  };

  return (
    <div className="space-y-6">
      {/* PACE Framework Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your PACE Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(PACE_COMPONENTS).map(([key, component]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={component.color}>{key}</Badge>
                  <span className="font-medium">{component.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{component.value}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prompt Generation Options */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Maya's First Attempt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              "I'll just ask it to write a board email about our summer program"
            </p>
            <Button 
              onClick={() => generateEmail('basic')}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              {isGenerating && promptType === 'basic' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Try Maya\'s Basic Prompt'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600">Elena's PACE Method</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              "Include context, audience insights, and specific details"
            </p>
            <Button 
              onClick={() => generateEmail('comprehensive')}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating && promptType === 'comprehensive' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Try Elena\'s PACE Prompt'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Prompt Visibility Toggle */}
      {usedPrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Prompt Used</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt(!showPrompt)}
              >
                {showPrompt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPrompt ? 'Hide' : 'Show'} Prompt
              </Button>
            </CardTitle>
          </CardHeader>
          {showPrompt && (
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                {usedPrompt}
              </pre>
            </CardContent>
          )}
        </Card>
      )}

      {/* Generated Email Preview */}
      {generatedEmail && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Generated Email
              <Badge variant={promptType === 'basic' ? 'destructive' : 'default'}>
                {promptType === 'basic' ? 'Basic Prompt' : 'PACE Method'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{generatedEmail}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptBuilder;