import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Search, FileStack, Lightbulb, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResearchSource {
  id: string;
  title: string;
  type: 'report' | 'article' | 'data' | 'case_study';
  keyPoints: string[];
  userNotes: string;
}

interface InsightCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  insights: string[];
  userInsight: string;
  aiSynthesis: string;
}

interface MayaResearchSynthesisProps {
  onComplete?: () => void;
}

export const MayaResearchSynthesis: React.FC<MayaResearchSynthesisProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'gather' | 'organize' | 'synthesize' | 'plan' | 'success'>('context');
  const [sources] = useState<ResearchSource[]>([
    {
      id: 'mentoring-report',
      title: 'National Mentoring Impact Study 2023',
      type: 'report',
      keyPoints: [
        '87% of mentored youth show improved academic performance',
        'Weekly mentoring most effective (vs. monthly)',
        'Group + individual mentoring hybrid shows best outcomes'
      ],
      userNotes: ''
    },
    {
      id: 'local-data',
      title: 'County Youth Services Needs Assessment',
      type: 'data',
      keyPoints: [
        '1,200 at-risk youth in service area',
        'Top needs: homework help, career guidance, emotional support',
        'Current programs serve only 30% of need'
      ],
      userNotes: ''
    },
    {
      id: 'competitor-analysis',
      title: 'Similar Programs Analysis',
      type: 'case_study',
      keyPoints: [
        'Big Brothers Big Sisters: $850 per youth/year',
        'Boys & Girls Club: Group model, $400 per youth/year',
        'Successful programs combine both approaches'
      ],
      userNotes: ''
    }
  ]);

  const [insights, setInsights] = useState<InsightCategory[]>([
    {
      id: 'program-design',
      label: 'Program Design Insights',
      icon: <Lightbulb className="w-5 h-5" />,
      insights: [],
      userInsight: '',
      aiSynthesis: ''
    },
    {
      id: 'funding-strategy',
      label: 'Funding Strategy',
      icon: <TrendingUp className="w-5 h-5" />,
      insights: [],
      userInsight: '',
      aiSynthesis: ''
    },
    {
      id: 'implementation',
      label: 'Implementation Plan',
      icon: <FileStack className="w-5 h-5" />,
      insights: [],
      userInsight: '',
      aiSynthesis: ''
    }
  ]);

  const handleSourceNotes = (sourceId: string, notes: string) => {
    // In real app, would update sources state
    console.log('Source notes updated:', sourceId, notes);
  };

  const handleInsightChange = (categoryId: string, insight: string) => {
    setInsights(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, userInsight: insight } : cat
    ));
  };

  const synthesizeWithAI = () => {
    setCurrentPhase('synthesize');
    
    // Simulate AI synthesis
    const synthesized = insights.map(category => {
      let synthesis = '';
      
      switch (category.id) {
        case 'program-design':
          synthesis = `Based on the research synthesis, the optimal program design combines:

• Weekly 90-minute sessions (proven 87% effectiveness)
• Hybrid model: 1-on-1 mentoring + monthly group activities
• Focus areas: Academic support (homework help), Career exploration, Life skills
• Serve 100 youth in Year 1, scale to 200 by Year 2
• Partner with schools for referrals and space

This evidence-based approach addresses the top 3 needs identified in the county assessment while using the proven hybrid model that maximizes impact per dollar invested.`;
          break;
          
        case 'funding-strategy':
          synthesis = `Multi-stream funding approach based on successful programs:

• Morrison Foundation Grant: $75,000 (Years 1-2 launch funding)
• Corporate Sponsorships: Target 5 local businesses at $10,000 each
• Individual Giving Campaign: 100 donors at $500 average = $50,000
• Annual Gala: Net $30,000 (based on similar org benchmarks)
• Total Year 1 Budget: $155,000 ($775 per youth served)

Cost-per-youth aligns with successful programs while providing comprehensive services. ROI story: Every $1 invested returns $4 in community benefits.`;
          break;
          
        case 'implementation':
          synthesis = `Phased implementation plan based on best practices:

Phase 1 (Months 1-3): Foundation Setting
• Hire Program Coordinator
• Recruit and train 25 volunteer mentors
• Develop curriculum based on evidence-based practices
• Establish school partnerships

Phase 2 (Months 4-6): Pilot Launch
• Launch with 25 youth (controlled start)
• Weekly feedback loops
• Adjust based on early results

Phase 3 (Months 7-12): Scale & Optimize
• Expand to 100 youth
• Launch group activities component
• Implement outcome tracking system
• Prepare Year 2 expansion plan`;
          break;
      }
      
      return { ...category, aiSynthesis: synthesis };
    });
    
    setInsights(synthesized);
    toast({
      title: "✨ AI Synthesis Complete!",
      description: "Your research has been synthesized into actionable insights",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    // Track completion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'maya-research-synthesis',
        lesson_id: 8,
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
                <Search className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold">Maya's Information Overload</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p>47 browser tabs. 23 PDFs. Sticky notes everywhere. Maya has all the research for her youth mentorship program—but can't synthesize it into a clear plan.</p>
                <p className="font-semibold text-indigo-700">Last week: 6 hours down a research rabbit hole that wasn't even relevant.</p>
                <p>Today: AI research tools will transform information chaos into strategic insights in minutes.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll accomplish:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <span>Synthesize multiple research sources into clear insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>Identify patterns and opportunities Maya would miss</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileStack className="w-4 h-4 text-indigo-600" />
                  <span>Create an actionable implementation plan</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('gather')}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Start Research Synthesis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'gather':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Your Research Sources</h2>
              <p className="text-gray-600">Review key findings and add your notes</p>
            </div>
            
            {sources.map((source) => (
              <Card key={source.id} className="border-2 border-gray-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{source.title}</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {source.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded space-y-2">
                    <p className="text-sm font-medium">Key Findings:</p>
                    <ul className="space-y-1">
                      {source.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Textarea
                    placeholder="Add your notes or questions about this source..."
                    className="min-h-[60px]"
                    onChange={(e) => handleSourceNotes(source.id, e.target.value)}
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
                onClick={() => setCurrentPhase('organize')}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Organize Insights
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'organize':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Connect the Dots</h2>
              <p className="text-gray-600">What patterns do you see? What questions emerge?</p>
            </div>
            
            {insights.map((category) => (
              <Card key={category.id} className="border-2 border-gray-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-indigo-600">{category.icon}</div>
                    <h3 className="font-semibold">{category.label}</h3>
                  </div>
                  
                  <Textarea
                    value={category.userInsight}
                    onChange={(e) => handleInsightChange(category.id, e.target.value)}
                    placeholder={`What insights do you have about ${category.label.toLowerCase()}?`}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            ))}
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">💡 Tip:</span> Don't worry about perfect insights. 
                AI will help synthesize and expand on your initial thoughts.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('gather')}
                className="flex-1"
              >
                Back to Sources
              </Button>
              <Button 
                onClick={synthesizeWithAI}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Synthesis
              </Button>
            </div>
          </div>
        );

      case 'synthesize':
      case 'plan':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Your AI-Powered Action Plan</h2>
              <p className="text-gray-600">Research transformed into strategic roadmap</p>
            </div>
            
            <div className="space-y-4">
              {insights.map((category) => (
                <Card key={category.id} className="border-2 border-indigo-200 bg-indigo-50">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-700">
                      {category.icon}
                      <h3 className="font-bold text-lg">{category.label}</h3>
                    </div>
                    <div className="text-gray-800 whitespace-pre-line text-sm leading-relaxed">
                      {category.aiSynthesis}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-700 mb-2">✨ AI Research Magic Applied:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Connected findings across 3 research sources</li>
                  <li>• Identified optimal program design based on evidence</li>
                  <li>• Created multi-stream funding strategy</li>
                  <li>• Developed phased implementation timeline</li>
                  <li>• Turned 6 hours of research into 10-minute synthesis</li>
                </ul>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Complete Maya's Transformation!
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Maya's Complete Transformation!</h2>
              <div className="max-w-md mx-auto space-y-3 text-gray-600">
                <p className="text-lg font-semibold">From overwhelmed to empowered in 4 lessons!</p>
                <p>Maya started Monday drowning in emails. She ends Friday with a funded youth program plan, board buy-in, and clear implementation roadmap.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-indigo-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Maya's AI Superpowers:</h3>
              <ul className="space-y-2 text-left">
                <li>✅ Email mastery: 3 hours → 30 minutes daily</li>
                <li>✅ Grant proposals: 3 weeks → 3 hours</li>
                <li>✅ Meeting prep: Chaos → Clarity</li>
                <li>✅ Research synthesis: 6 hours → 10 minutes</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-100 rounded-lg max-w-md mx-auto">
              <p className="font-semibold text-purple-700">100 at-risk teens will get mentorship because Maya mastered AI tools.</p>
              <p className="text-sm text-gray-600 mt-2">What transformation will YOU create?</p>
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