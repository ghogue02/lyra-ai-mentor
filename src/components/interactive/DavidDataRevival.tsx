import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, BarChart3, Database, Eye, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DataInsight {
  id: string;
  label: string;
  rawData: string;
  insight: string;
  impact: string;
  userAnalysis: string;
  aiEnhanced: string;
}

interface DavidDataRevivalProps {
  onComplete?: () => void;
}

export const DavidDataRevival: React.FC<DavidDataRevivalProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'explore' | 'analyze' | 'enhance' | 'success'>('context');
  const [insights, setInsights] = useState<DataInsight[]>([
    {
      id: 'program-effectiveness',
      label: 'Program Effectiveness',
      rawData: '78% completion rate, 45 participants last quarter, 3.2/5 satisfaction score',
      insight: 'High completion but moderate satisfaction suggests program structure issues',
      impact: 'Participants complete but may not recommend to others',
      userAnalysis: '',
      aiEnhanced: ''
    },
    {
      id: 'demographic-trends',
      label: 'Demographic Patterns',
      rawData: '65% women, 35% men, avg age 34, 23% repeat participants',
      insight: 'Strong female engagement, younger adults, good retention',
      impact: 'Program resonates with target demographic but may need male outreach',
      userAnalysis: '',
      aiEnhanced: ''
    },
    {
      id: 'resource-allocation',
      label: 'Resource Efficiency',
      rawData: '$1,200 per participant, 15 hours staff time each, 85% of budget utilized',
      insight: 'Reasonable cost per person, staff intensive, good budget management',
      impact: 'Sustainable model but staff capacity limits growth',
      userAnalysis: '',
      aiEnhanced: ''
    },
    {
      id: 'outcome-tracking',
      label: 'Long-term Outcomes',
      rawData: '60% employed 6 months later, 40% report skill improvement, 25% pursue further education',
      insight: 'Strong employment outcomes, good skill development, moderate education advancement',
      impact: 'Program creates real career pathways for majority of participants',
      userAnalysis: '',
      aiEnhanced: ''
    }
  ]);

  const handleAnalysisChange = (insightId: string, analysis: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, userAnalysis: analysis } : insight
    ));
  };

  const enhanceWithAI = async () => {
    setCurrentPhase('enhance');
    
    // Simulate AI enhancement
    const enhancedInsights = insights.map(insight => {
      if (insight.userAnalysis) {
        const enhanced = `EXECUTIVE SUMMARY: ${insight.userAnalysis}

KEY FINDINGS:
• Raw Data Analysis: ${insight.rawData}
• Strategic Insight: ${insight.insight}
• Impact Assessment: ${insight.impact}

COMPARATIVE BENCHMARKS:
Industry standards show similar programs average 65% completion rates and $1,500 per participant costs. Your program exceeds completion rates while maintaining cost efficiency.

ACTIONABLE RECOMMENDATIONS:
1. Leverage 60% employment success rate in funding proposals
2. Address 3.2/5 satisfaction through participant feedback analysis
3. Develop male outreach strategy to balance demographics
4. Scale successful elements while maintaining quality

PRESENTATION IMPACT:
This data tells a compelling story of efficiency, effectiveness, and real-world impact that resonates with both funders and stakeholders.`;
        
        return { ...insight, aiEnhanced: enhanced };
      }
      return insight;
    });
    
    setInsights(enhancedInsights);
    toast({
      title: "✨ Data Analysis Enhanced!",
      description: "Your insights have been transformed into compelling narratives",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    // Track completion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'david-data-revival',
        lesson_id: 15,
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
              <div className="inline-flex p-4 bg-blue-100 rounded-full">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">David's Data Graveyard Crisis</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p>David Chen sits surrounded by spreadsheets, charts, and reports. He has more data than any nonprofit should dream of—but it's all buried in numbers that no one understands.</p>
                <p className="font-semibold text-blue-700">Last month's board presentation was a disaster. "What do these numbers actually mean?" they asked.</p>
                <p>David knows the data tells an incredible story of impact, but he can't seem to bring it to life. Time to resurrect this data graveyard into compelling insights.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll discover:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Hidden insights buried in your data</span>
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Patterns that reveal program effectiveness</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Stories that data is trying to tell</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('explore')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Revive David's Data
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'explore':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Explore Your Data Landscape</h2>
              <p className="text-gray-600">Let's examine what your data is actually telling you</p>
            </div>
            
            <div className="grid gap-4">
              {insights.map((insight, index) => (
                <Card key={insight.id} className="border-2 border-gray-100">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      {insight.label}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs font-medium text-gray-600 mb-1">Raw Data:</p>
                        <p className="text-sm">{insight.rawData}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs font-medium text-blue-600 mb-1">Initial Insight:</p>
                        <p className="text-sm">{insight.insight}</p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-xs font-medium text-green-600 mb-1">Potential Impact:</p>
                        <p className="text-sm">{insight.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">💡 David's Challenge:</span> These numbers contain powerful stories, 
                but they're hiding in plain sight. Let's help David uncover the narratives that will captivate his audience.
              </p>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('analyze')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Analyze & Interpret
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'analyze':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Extract the Hidden Stories</h2>
              <p className="text-gray-600">What story is each data set trying to tell?</p>
            </div>
            
            {insights.map((insight, index) => (
              <Card key={insight.id} className="border-2 border-gray-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-700">{insight.label}</h3>
                    <span className="text-sm text-gray-500">{index + 1} of {insights.length}</span>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs font-medium text-blue-600 mb-1">Data Summary:</p>
                    <p className="text-sm">{insight.rawData}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">What story does this data tell about your program's impact?</label>
                    <Textarea
                      value={insight.userAnalysis}
                      onChange={(e) => handleAnalysisChange(insight.id, e.target.value)}
                      placeholder="Describe what this data reveals about program effectiveness, participant outcomes, or organizational impact..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('explore')}
                className="flex-1"
              >
                Back to Data
              </Button>
              <Button 
                onClick={enhanceWithAI}
                disabled={!insights.every(i => i.userAnalysis)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Analysis
              </Button>
            </div>
          </div>
        );

      case 'enhance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">David's Data-Driven Insights</h2>
              <p className="text-gray-600">AI-enhanced analysis ready for any audience</p>
            </div>
            
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-blue-700 mb-3">{insight.label}</h3>
                    <div className="whitespace-pre-line text-gray-800 text-sm leading-relaxed">
                      {insight.aiEnhanced}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">✨ AI Analysis Magic:</span> Transformed raw numbers into 
                compelling narratives with industry benchmarks, strategic recommendations, and presentation-ready insights.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('analyze')}
                className="flex-1"
              >
                Edit Analysis
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Complete Revival
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Data Graveyard Resurrected!</h2>
              <div className="max-w-md mx-auto space-y-3 text-gray-600">
                <p className="text-lg">David just transformed lifeless spreadsheets into compelling insights!</p>
                <p>His data now tells clear stories of impact, effectiveness, and opportunity that any audience can understand and act upon.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">David's New Data Superpowers:</h3>
              <ul className="space-y-2 text-left">
                <li>✅ Extract insights from complex data</li>
                <li>✅ Identify patterns that reveal impact</li>
                <li>✅ Transform numbers into narratives</li>
                <li>✅ Present findings with confidence</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500">
              Next: David learns to weave data into compelling stories...
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