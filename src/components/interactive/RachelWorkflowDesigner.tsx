import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, GitBranch } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RachelWorkflowDesignerProps {
  onComplete?: () => void;
}

export const RachelWorkflowDesigner: React.FC<RachelWorkflowDesignerProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'map' | 'optimize' | 'test' | 'success'>('context');
  const [userInput, setUserInput] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');

  const enhanceWithAI = async () => {
    setCurrentPhase('test');
    
    const enhancement = `${userInput}

AI ENHANCEMENT APPLIED:
✨ AI process optimization with human-centered design principles
✨ Professional polish and structure optimization
✨ Stakeholder alignment and communication strategies
✨ Implementation roadmap with clear next steps

This approach demonstrates streamlined processes that empower rather than burden staff through systematic application of proven methodologies.`;

    setEnhancedOutput(enhancement);
    
    toast({
      title: "✨ Enhancement Complete!",
      description: "Streamlined processes that empower rather than burden staff",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'rachel-workflow-designer',
        lesson_id: 20,
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
                <GitBranch className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold">Workflow Design Studio</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p><strong>Challenge:</strong> Designing workflows that improve both efficiency and job satisfaction</p>
                <p><strong>Discovery:</strong> AI process optimization with human-centered design principles</p>
                <p><strong>Practice:</strong> Mapping and optimizing key organizational workflows</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('map')}
              className="w-full bg-teal-600 hover:bg-teal-600/90"
            >
              Begin Challenge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'test':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Enhanced Solution</h2>
              <p className="text-gray-600">AI-optimized approach ready for implementation</p>
            </div>
            
            <Card className="border-2 border-teal-200 bg-teal-100">
              <CardContent className="p-6">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {enhancedOutput}
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Complete Challenge
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <GitBranch className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Challenge Complete!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Streamlined processes that empower rather than burden staff
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