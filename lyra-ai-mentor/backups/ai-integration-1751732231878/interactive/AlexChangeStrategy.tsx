import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlexImpactDashboard } from '@/components/magical/AlexImpactDashboard';
import { StreamingTextArea } from '@/components/ui/StreamingTextArea';
import { enhancedAIService } from '@/services/enhancedAIService';

interface AlexChangeStrategyProps {
  onComplete?: () => void;
}

export const AlexChangeStrategy: React.FC<AlexChangeStrategyProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'assess' | 'strategy' | 'align' | 'success'>('context');
  const [userInput, setUserInput] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');

  const enhanceWithAI = async () => {
    setCurrentPhase('align');
    
    try {
      const enhancement = await enhancedAIService.enhanceChangeStrategy(userInput);
      setEnhancedOutput(enhancement);
      
      toast({
        title: "✨ Enhancement Complete!",
        description: "AI-powered change strategy generated",
      });
    } catch (error) {
      console.error('Strategy enhancement failed:', error);
      toast({
        title: "Enhancement Error",
        description: "Using fallback strategy approach",
        variant: "destructive"
      });
      
      // Fallback to basic enhancement
      const fallbackEnhancement = `${userInput}

AI ENHANCEMENT APPLIED:
✨ Strategic framework for systematic change management
✨ Stakeholder engagement and communication plan
✨ Risk mitigation and contingency planning
✨ Implementation timeline with measurable milestones
✨ Success metrics and performance indicators

This comprehensive approach addresses the core challenges of organizational transformation while building consensus and maintaining momentum throughout the change process.`;

      setEnhancedOutput(fallbackEnhancement);
    }
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'alex-change-strategy',
        lesson_id: 23,
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
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold">Change Leadership Strategy</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p><strong>Challenge:</strong> Overcoming organizational resistance to AI transformation</p>
                <p><strong>Discovery:</strong> AI change management and stakeholder alignment tools</p>
                <p><strong>Practice:</strong> Developing comprehensive change strategy with buy-in plan</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('assess')}
              className="w-full bg-purple-600 hover:bg-purple-600/90"
            >
              Begin Challenge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'align':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Enhanced Solution</h2>
              <p className="text-gray-600">AI-optimized approach ready for implementation</p>
            </div>
            
            <AlexImpactDashboard 
              changeInitiative="ai-adoption"
              autoAnimate={true}
            />
            
            <StreamingTextArea
              isStreaming={false}
              content={enhancedOutput}
              title="AI-Enhanced Change Strategy"
              className="border-purple-200"
            />
            
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
              <Users className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Challenge Complete!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                United organization ready for transformation
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