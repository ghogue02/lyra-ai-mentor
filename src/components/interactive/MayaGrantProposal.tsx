import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, FileText, Target, Heart, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GrantSection {
  id: string;
  label: string;
  placeholder: string;
  suggestions: string[];
  userInput: string;
  aiEnhanced: string;
}

interface MayaGrantProposalProps {
  onComplete?: () => void;
}

export const MayaGrantProposal: React.FC<MayaGrantProposalProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'build' | 'enhance' | 'preview' | 'success'>('context');
  const [sections, setSections] = useState<GrantSection[]>([
    {
      id: 'problem',
      label: 'Define the Problem',
      placeholder: 'What challenge does your program address?',
      suggestions: [
        "100 at-risk teens in our community lack mentorship and after-school support...",
        "Youth aged 14-18 face limited opportunities for skill development and career guidance...",
        "Local teens report feeling disconnected and without positive role models..."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'solution',
      label: 'Present Your Solution',
      placeholder: 'How does your program solve this problem?',
      suggestions: [
        "Our mentorship program pairs teens with trained volunteers for weekly sessions...",
        "We provide structured after-school activities including homework help, life skills...",
        "Through one-on-one mentoring and group workshops, teens develop confidence..."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'impact',
      label: 'Show Your Impact',
      placeholder: 'What outcomes will the funding achieve?',
      suggestions: [
        "With $75,000, we'll serve 100 teens over 2 years, providing 2,400 mentoring hours...",
        "Expected outcomes: 85% improve grades, 90% report increased confidence...",
        "Each dollar invested returns $4 in community benefits through reduced dropout rates..."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'budget',
      label: 'Budget Justification',
      placeholder: 'How will you use the funds?',
      suggestions: [
        "Program Coordinator (0.5 FTE): $35,000, Supplies & Materials: $10,000...",
        "Staffing (60%): $45,000, Direct Services (30%): $22,500, Admin (10%): $7,500",
        "Year 1: Launch with 50 teens ($40,000), Year 2: Expand to 100 teens ($35,000)"
      ],
      userInput: '',
      aiEnhanced: ''
    }
  ]);

  const handleInputChange = (sectionId: string, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, userInput: value } : section
    ));
  };

  const enhanceWithAI = async () => {
    setCurrentPhase('enhance');
    
    // Simulate AI enhancement
    const enhancedSections = sections.map(section => {
      if (section.userInput) {
        // Add professional language, data, and persuasive elements
        const enhanced = `${section.userInput} Research shows that programs like ours increase youth engagement by 73% and reduce juvenile justice involvement by 45%. Our evidence-based approach has been recognized by the National Mentoring Partnership as a model program.`;
        return { ...section, aiEnhanced: enhanced };
      }
      return section;
    });
    
    setSections(enhancedSections);
    toast({
      title: "✨ AI Enhancement Complete!",
      description: "Your proposal has been enhanced with data and impact language",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    // Track completion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'maya-grant-proposal',
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
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold">Maya's Grant Proposal Challenge</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p>The Morrison Foundation grant could fund Maya's youth mentorship program for two years. $75,000 would change 100 teens' lives.</p>
                <p className="font-semibold text-purple-700">But the blank page is paralyzing. Last year's rejection still stings.</p>
                <p>Let's help Maya transform her passion into a winning proposal using AI-powered templates that speak funder language.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll create:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>Clear problem statement that resonates with funders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span>Compelling solution with human impact stories</span>
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <span>Data-driven budget that shows ROI</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('build')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Start Building Maya's Proposal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'build':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Build Your Grant Proposal</h2>
              <p className="text-gray-600">Click suggestions or write your own. Each section builds on the last.</p>
            </div>
            
            {sections.map((section, index) => (
              <Card key={section.id} className="border-2 border-gray-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-purple-700">{section.label}</h3>
                    <span className="text-sm text-gray-500">Section {index + 1} of {sections.length}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Choose a starter or write your own:</p>
                    <div className="space-y-2">
                      {section.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleInputChange(section.id, suggestion)}
                          className="w-full text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-lg text-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Textarea
                    value={section.userInput}
                    onChange={(e) => handleInputChange(section.id, e.target.value)}
                    placeholder={section.placeholder}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            ))}
            
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
                disabled={!sections.every(s => s.userInput)}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance with AI
              </Button>
            </div>
          </div>
        );

      case 'enhance':
      case 'preview':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Your AI-Enhanced Proposal</h2>
              <p className="text-gray-600">AI added data, impact metrics, and funder-friendly language</p>
            </div>
            
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6 space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className="font-bold text-purple-700">{section.label}</h3>
                    <p className="text-gray-800 leading-relaxed">
                      {section.aiEnhanced || section.userInput}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">✨ AI Magic Applied:</span> Added impact statistics, 
                aligned with funder priorities, strengthened with evidence-based language, 
                and structured for maximum clarity.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('build')}
                className="flex-1"
              >
                Edit Sections
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Complete & Save
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <FileText className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Grant Proposal Complete!</h2>
              <div className="max-w-md mx-auto space-y-3 text-gray-600">
                <p className="text-lg">Maya just created a compelling $75,000 grant proposal in 10 minutes!</p>
                <p>What used to take weeks now takes minutes. The Morrison Foundation is about to meet 100 teens whose lives will change.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Your New Superpowers:</h3>
              <ul className="space-y-2 text-left">
                <li>✅ Transform ideas into fundable proposals</li>
                <li>✅ Speak funder language fluently</li>
                <li>✅ Weave data with human stories</li>
                <li>✅ Create proposals 10x faster</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500">
              Next: Maya tackles meeting preparation with AI...
            </p>
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