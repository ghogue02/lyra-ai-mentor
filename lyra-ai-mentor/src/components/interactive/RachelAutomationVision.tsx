import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Cog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RachelWorkflowBuilder } from '@/components/magical/RachelWorkflowBuilder';
import { ExportButton } from '@/components/ui/ExportButton';
import { UseInSuggestions } from '@/components/ui/UseInSuggestions';
import { ExportData } from '@/services/exportService';

interface RachelAutomationVisionProps {
  onComplete?: () => void;
}

export const RachelAutomationVision: React.FC<RachelAutomationVisionProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'assess' | 'design' | 'present' | 'success'>('context');
  const [userInput, setUserInput] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');

  const enhanceWithAI = async () => {
    setCurrentPhase('present');
    
    const enhancement = `${userInput}

AI ENHANCEMENT APPLIED:
✨ AI workflow design that enhances rather than replaces human work
✨ Professional polish and structure optimization
✨ Stakeholder alignment and communication strategies
✨ Implementation roadmap with clear next steps

This approach demonstrates vision that excites rather than threatens staff through systematic application of proven methodologies.`;

    setEnhancedOutput(enhancement);
    
    toast({
      title: "✨ Enhancement Complete!",
      description: "Vision that excites rather than threatens staff",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'rachel-automation-vision',
        lesson_id: 19,
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
    
    setTimeout(() => {
      onComplete?.();
    }, 3000);
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'context':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-teal-100 rounded-full">
                <Cog className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold">Human-Centered Automation Vision</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p><strong>Challenge:</strong> Overcoming resistance to automation by showing human benefits</p>
                <p><strong>Discovery:</strong> AI workflow design that enhances rather than replaces human work</p>
                <p><strong>Practice:</strong> Creating automation strategy that preserves human connection</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('assess')}
              className="w-full bg-teal-600 hover:bg-teal-600/90"
            >
              Begin Challenge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'present':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Enhanced Solution</h2>
              <p className="text-gray-600">AI-optimized approach ready for implementation</p>
            </div>
            
            <RachelWorkflowBuilder 
              workflowType="program-evaluation"
              autoPlay={true}
            />
            
            <Card className="border-2 border-teal-200 bg-teal-100">
              <CardContent className="p-6">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {enhancedOutput}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <ExportButton
                data={(): ExportData => ({
                  title: `Automation Vision - ${new Date().toLocaleDateString()}`,
                  content: enhancedOutput || userInput,
                  metadata: {
                    createdAt: new Date().toISOString(),
                    author: 'Rachel Thompson',
                    tags: ['automation', 'workflow', 'vision', 'human-centered'],
                    workflowType: 'program-evaluation'
                  },
                  sections: [
                    {
                      title: 'Original Approach',
                      content: userInput,
                      type: 'text'
                    },
                    {
                      title: 'AI-Enhanced Vision',
                      content: enhancedOutput,
                      type: 'text'
                    }
                  ]
                })}
                formats={['pdf', 'docx', 'txt']}
                variant="outline"
                className="flex-1"
                characterName="Rachel"
                suggestUseIn={['Alex Change Management', 'Team Training', 'Process Documentation']}
              />
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Complete Challenge
              </Button>
            </div>
            
            {/* Use In Suggestions */}
            <UseInSuggestions
              content={{
                vision: enhancedOutput,
                originalApproach: userInput,
                workflowType: 'automation-vision'
              }}
              contentType="workflow"
              fromCharacter="Rachel"
              componentType="rachel-automation"
              className="mt-4"
            />
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <Cog className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Challenge Complete!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Vision that excites rather than threatens staff
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Work in Progress</h2>
              <p className="text-gray-600">Develop your approach to this challenge</p>
            </div>
            
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your approach to this challenge..."
              className="min-h-[150px]"
            />
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('context')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={enhanceWithAI}
                disabled={!userInput}
                className="flex-1 bg-teal-600 hover:bg-teal-600/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {renderPhase()}
      </CardContent>
    </Card>
  );
};