import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, Brain, Sparkles } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface ModelResponse {
  model: string;
  response: string;
  loading: boolean;
  cost: string;
  icon: React.ReactNode;
  description: string;
}

export const ModelComparisonTool: React.FC = () => {
  const [prompt, setPrompt] = useState('Explain artificial intelligence in simple terms for a nonprofit worker.');
  const [responses, setResponses] = useState<ModelResponse[]>([
    {
      model: 'Claude Sonnet 4',
      response: '',
      loading: false,
      cost: '$0.003 per 1K tokens',
      icon: <Brain className="w-4 h-4 text-purple-600" />,
      description: 'Precise, technical responses with structured thinking'
    },
    {
      model: 'Gemini 2.5 Flash',
      response: '',
      loading: false,
      cost: '$0.0005 per 1K tokens',
      icon: <Zap className="w-4 h-4 text-blue-600" />,
      description: 'Fast, creative responses with large context window'
    },
    {
      model: 'GPT-4o Mini',
      response: '',
      loading: false,
      cost: '$0.0015 per 1K tokens',
      icon: <Sparkles className="w-4 h-4 text-green-600" />,
      description: 'Balanced performance and cost (fallback model)'
    }
  ]);

  const testAllModels = async () => {
    if (!prompt.trim()) return;

    // Set all models to loading
    setResponses(prev => prev.map(r => ({ ...r, loading: true, response: '' })));

    const modelTests = [
      { character: 'lyra', modelName: 'Claude Sonnet 4' },
      { character: 'sofia', modelName: 'Gemini 2.5 Flash' },
      { character: 'default', modelName: 'GPT-4o Mini' }
    ];

    for (const { character, modelName } of modelTests) {
      try {
        const response = await fetch('https://hfkzwjnlxrwynactcmpe.supabase.co/functions/v1/chat-with-lyra', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0`,
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0'
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: `You are ${character}. Respond to this prompt concisely and helpfully.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            userId: 'model-comparison-test',
            lessonContext: { modelComparison: true }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        let fullResponse = '';

        if (reader) {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const parsed = JSON.parse(line.slice(6));
                  if (parsed.content) {
                    fullResponse += parsed.content;
                    setResponses(prev => 
                      prev.map(r => 
                        r.model === modelName 
                          ? { ...r, response: fullResponse }
                          : r
                      )
                    );
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
        }

        setResponses(prev => 
          prev.map(r => 
            r.model === modelName 
              ? { ...r, loading: false, response: fullResponse || 'Response received' }
              : r
          )
        );

      } catch (error) {
        console.error(`Error testing ${modelName}:`, error);
        setResponses(prev => 
          prev.map(r => 
            r.model === modelName 
              ? { ...r, loading: false, response: 'Error: Could not get response' }
              : r
          )
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">AI Model Comparison Tool</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test the same prompt across different AI models to understand their unique strengths, 
          response styles, and cost implications for your nonprofit work.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Your Test Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt to test across different AI models..."
            rows={3}
            className="min-h-[80px]"
          />
          <Button 
            onClick={testAllModels}
            disabled={!prompt.trim() || responses.some(r => r.loading)}
            className="w-full"
          >
            {responses.some(r => r.loading) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Models...
              </>
            ) : (
              'Test All Models'
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {responses.map((response, index) => (
          <Card key={index} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {response.icon}
                  {response.model}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {response.cost}
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {response.description}
              </p>
            </CardHeader>
            <CardContent>
              {response.loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : response.response ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {response.response}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Click "Test All Models" to see this model's response
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">💡 What You're Learning:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Model Personalities:</strong> Each AI has different strengths and response styles</li>
            <li>• <strong>Cost Considerations:</strong> Gemini 2.5 Flash offers 6x cost savings vs Claude Sonnet 4</li>
            <li>• <strong>Use Case Matching:</strong> Choose the right model for your specific nonprofit needs</li>
            <li>• <strong>Quality vs Cost:</strong> Balance response quality with budget constraints</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};