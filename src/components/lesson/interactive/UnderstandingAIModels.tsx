import React from 'react';
import { ModelComparisonTool } from './ModelComparisonTool';
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Sparkles, DollarSign } from 'lucide-react';

export const UnderstandingAIModels: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Understanding AI Models</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Different AI models have unique strengths, costs, and capabilities. 
          Learn how to choose the right AI for your nonprofit's specific needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="nm-card nm-p-xl text-center space-y-3">
          <Brain className="w-8 h-8 text-purple-600 mx-auto" />
          <h3 className="font-semibold nm-text-primary">Claude Sonnet 4</h3>
          <p className="text-sm nm-text-secondary">
            Best for technical accuracy, structured thinking, and complex analysis
          </p>
          <div className="nm-badge nm-badge-accent">
            Higher cost, superior reasoning
          </div>
        </div>

        <div className="nm-card nm-p-xl text-center space-y-3">
          <Zap className="w-8 h-8 text-blue-600 mx-auto" />
          <h3 className="font-semibold nm-text-primary">Gemini 2.5 Flash</h3>
          <p className="text-sm nm-text-secondary">
            Fast, creative responses with massive context windows
          </p>
          <div className="nm-badge nm-badge-cyan">
            Ultra-low cost, 1M+ token context
          </div>
        </div>

        <div className="nm-card nm-p-xl text-center space-y-3">
          <Sparkles className="w-8 h-8 text-green-600 mx-auto" />
          <h3 className="font-semibold nm-text-primary">GPT-4o Mini</h3>
          <p className="text-sm nm-text-secondary">
            Balanced performance and cost for general use cases
          </p>
          <div className="nm-badge">
            Reliable fallback option
          </div>
        </div>
      </div>

      <ModelComparisonTool />

      <div className="nm-card nm-surface-purple nm-p-xl">
        <div className="flex items-start gap-3">
          <DollarSign className="w-6 h-6 text-purple-600 mt-1" />
          <div>
            <h3 className="font-semibold nm-text-accent mb-2">Smart Model Selection for Nonprofits</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm nm-text-primary">
              <div>
                <h4 className="font-medium mb-1">Use Claude Sonnet 4 for:</h4>
                <ul className="space-y-1 nm-text-secondary">
                  <li>• Complex grant writing</li>
                  <li>• Technical documentation</li>
                  <li>• Strategic planning</li>
                  <li>• Data analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Use Gemini 2.5 Flash for:</h4>
                <ul className="space-y-1 nm-text-secondary">
                  <li>• Social media content</li>
                  <li>• Email campaigns</li>
                  <li>• Creative storytelling</li>
                  <li>• Large document processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};