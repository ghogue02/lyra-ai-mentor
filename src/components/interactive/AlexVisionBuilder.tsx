import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AlexVisionBuilderProps {
  onComplete?: () => void;
}

export const AlexVisionBuilder: React.FC<AlexVisionBuilderProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'envision' | 'craft' | 'communicate' | 'success'>('context');
  const [userInput, setUserInput] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');

  const enhanceWithAI = async () => {
    setCurrentPhase('communicate');
    
    const enhancement = `${userInput}

AI ENHANCEMENT APPLIED:
✨ AI vision development and communication strategies
✨ Professional polish and structure optimization
✨ Stakeholder alignment and communication strategies
✨ Implementation roadmap with clear next steps

This approach demonstrates inspiring vision that drives collective action through systematic application of proven methodologies.`;

    setEnhancedOutput(enhancement);
    
    toast({
      title: "✨ Enhancement Complete!",
      description: "Inspiring vision that drives collective action",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'alex-vision-builder',
        lesson_id: 24,
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
              <div className="inline-flex p-4 bg-purple-100 rounded-full">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold">Unified Vision Builder</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p><strong>Challenge:</strong> Creating shared vision that motivates diverse stakeholders</p>
                <p><strong>Discovery:</strong> AI vision development and communication strategies</p>
                <p><strong>Practice:</strong> Crafting compelling organizational transformation vision</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('envision')}
              className="w-full bg-purple-600 hover:bg-purple-600/90"
            >
              Begin Challenge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'communicate':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Enhanced Solution</h2>
              <p className="text-gray-600">AI-optimized approach ready for implementation</p>
            </div>
            
            <Card className="border-2 border-purple-200 bg-purple-100">
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
              <Eye className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Challenge Complete!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Inspiring vision that drives collective action
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
                className="flex-1 bg-purple-600 hover:bg-purple-600/90"
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