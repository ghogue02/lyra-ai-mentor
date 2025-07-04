import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Presentation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DavidPresentationMasterProps {
  onComplete?: () => void;
}

export const DavidPresentationMaster: React.FC<DavidPresentationMasterProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'structure' | 'build' | 'rehearse' | 'success'>('context');
  const [userInput, setUserInput] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');

  const enhanceWithAI = async () => {
    setCurrentPhase('rehearse');
    
    const enhancement = `${userInput}

AI ENHANCEMENT APPLIED:
✨ AI presentation tools that transform data into compelling stories
✨ Professional polish and structure optimization
✨ Stakeholder alignment and communication strategies
✨ Implementation roadmap with clear next steps

This approach demonstrates confident delivery that moves audience to action through systematic application of proven methodologies.`;

    setEnhancedOutput(enhancement);
    
    toast({
      title: "✨ Enhancement Complete!",
      description: "Confident delivery that moves audience to action",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'david-presentation-master',
        lesson_id: 17,
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
              <div className="inline-flex p-4 bg-indigo-100 rounded-full">
                <Presentation className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold">Million-Dollar Presentation Master</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p><strong>Challenge:</strong> High-stakes board presentation that could unlock major funding</p>
                <p><strong>Discovery:</strong> AI presentation tools that transform data into compelling stories</p>
                <p><strong>Practice:</strong> Building persuasive presentation with data visualization and narrative flow</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('structure')}
              className="w-full bg-indigo-600 hover:bg-indigo-600/90"
            >
              Begin Challenge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'rehearse':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Enhanced Solution</h2>
              <p className="text-gray-600">AI-optimized approach ready for implementation</p>
            </div>
            
            <Card className="border-2 border-indigo-200 bg-indigo-100">
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
              <Presentation className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Challenge Complete!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Confident delivery that moves audience to action
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
                className="flex-1 bg-indigo-600 hover:bg-indigo-600/90"
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