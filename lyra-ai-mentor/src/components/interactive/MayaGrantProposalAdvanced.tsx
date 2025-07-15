import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, FileText, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MayaGrantProposalAdvancedProps {
  onComplete?: () => void;
}

export const MayaGrantProposalAdvanced: React.FC<MayaGrantProposalAdvancedProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'strategy' | 'build' | 'enhance' | 'success'>('context');
  const [proposalStrategy, setProposalStrategy] = useState('');
  const [enhancedStrategy, setEnhancedStrategy] = useState('');

  const handleEnhanceStrategy = async () => {
    setCurrentPhase('enhance');
    
    // Maya's strategic grant proposal enhancement
    const enhancement = `${proposalStrategy}

✨ AI STRATEGIC ENHANCEMENT APPLIED:
• Evidence-based impact metrics that funders seek
• Compelling narrative that connects to funder priorities
• Clear budget justification with measurable outcomes
• Sustainability plan showing long-term program viability
• Community partnership integration for broader impact

This proposal positions Maya's program as a strategic investment in community transformation.`;

    setEnhancedStrategy(enhancement);
    
    toast({
      title: "🎯 Strategy Enhanced!",
      description: "Maya's proposal now speaks the language of strategic philanthropy",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'maya-grant-proposal-advanced',
        lesson_id: 6,
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
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold">Strategic Grant Proposal Builder</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p><strong>Maya's Challenge:</strong> Moving beyond basic proposals to strategic funding requests</p>
                <p><strong>The Stakes:</strong> Large foundation grants require sophisticated strategic thinking</p>
                <p><strong>Your Mission:</strong> Help Maya craft a proposal that positions her program as a strategic investment</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('strategy')}
              className="w-full bg-purple-600 hover:bg-purple-600/90"
            >
              Build Strategic Proposal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">Maya's Strategic Opportunity</h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-gray-700 italic">
                  "The Morrison Foundation is offering $150,000 grants for programs that demonstrate 
                  'transformative community impact with measurable outcomes.' This is our chance to 
                  scale beyond survival mode into true community transformation."
                </p>
                <p className="text-right mt-2 text-sm text-gray-500">- Maya's vision</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('build')}
              className="w-full bg-purple-600 hover:bg-purple-600/90"
            >
              Develop Strategic Framework
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'build':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Strategic Proposal Framework</h2>
              <p className="text-gray-600">Develop Maya's transformative vision with measurable impact</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Foundation Focus: Transformative Community Impact</h3>
              <p className="text-sm text-gray-700 mb-3">
                Address how your program creates ripple effects beyond individual students to transform the entire community ecosystem.
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Community-wide educational outcomes</p>
                <p>• Family engagement and empowerment</p>
                <p>• Local economic development connections</p>
                <p>• Measurable long-term impact metrics</p>
              </div>
            </div>
            
            <Textarea
              value={proposalStrategy}
              onChange={(e) => setProposalStrategy(e.target.value)}
              placeholder="Describe Maya's transformative community impact strategy..."
              className="min-h-[150px]"
            />
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('strategy')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleEnhanceStrategy}
                disabled={!proposalStrategy}
                className="flex-1 bg-purple-600 hover:bg-purple-600/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Strategic Enhancement
              </Button>
            </div>
          </div>
        );

      case 'enhance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Strategic Proposal Framework</h2>
              <p className="text-gray-600">AI-enhanced with foundation-ready strategic positioning</p>
            </div>
            
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Strategic Proposal</span>
                </div>
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {enhancedStrategy}
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Strategic Proposal Complete
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <Target className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Strategic Vision Achieved!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Maya now thinks like a strategic philanthropist, positioning her program 
                as a catalyst for community transformation.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm italic text-gray-700">
                  "This isn't just about funding our program - it's about becoming a 
                  cornerstone of community transformation that funders want to invest in long-term."
                </p>
                <p className="text-right mt-2 text-xs text-gray-500">- Maya</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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